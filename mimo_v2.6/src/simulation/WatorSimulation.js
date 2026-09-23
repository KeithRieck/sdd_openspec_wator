/**
 * The Wa-Tor simulation engine (spec Req 2.2 - no Phaser dependency).
 *
 * Owns the world state: a flat grid array with one slot per cell holding an
 * entity ID or the {@link EMPTY} marker (spec Req 19.1), plus a map of entity
 * objects keyed by ID. The two structures are mutated only through
 * {@link WatorSimulation#moveEntityTo}, {@link WatorSimulation#spawnAt}, and
 * {@link WatorSimulation#removeEntity}, so grid/entity consistency holds by
 * construction (spec Req 19.3, design D5). All randomness - population,
 * turn-order shuffling, and movement choices - is drawn from the single
 * injected `rng` function (spec Req 7.1, design D7).
 */

import Fish from './Fish.js';
import Shark from './Shark.js';
import {
    GRID_COLS,
    GRID_ROWS,
    FISH_DENSITY,
    SHARK_DENSITY,
    HISTORY_LENGTH,
    STATUS_RUNNING,
    STATUS_PAUSED,
    STATUS_SHARKS_EXTINCT,
    STATUS_FISH_EXTINCT,
    STATUS_COLLAPSED
} from '../config.js';

/** Marker stored in grid slots that no entity occupies (spec Req 19.1). @type {number} */
export const EMPTY = -1;

export default class WatorSimulation {
    /**
     * Create a simulation and populate a fresh random world.
     *
     * @param {Object} [options] - Optional overrides of the config defaults.
     * @param {number} [options.cols] - Grid columns (default `GRID_COLS`).
     * @param {number} [options.rows] - Grid rows (default `GRID_ROWS`).
     * @param {number} [options.fishDensity] - Initial fish density (default `FISH_DENSITY`).
     * @param {number} [options.sharkDensity] - Initial shark density (default `SHARK_DENSITY`).
     * @param {number} [options.historyLength] - Rolling history size (default `HISTORY_LENGTH`).
     * @param {Function} [rng] - The single random-number source for the whole
     *   simulation (spec Req 7.1); defaults to `Math.random`, the only direct
     *   reference to it in the codebase.
     */
    constructor(options = {}, rng = Math.random) {
        this.cols = options.cols ?? GRID_COLS;
        this.rows = options.rows ?? GRID_ROWS;
        this.fishDensity = options.fishDensity ?? FISH_DENSITY;
        this.sharkDensity = options.sharkDensity ?? SHARK_DENSITY;
        this.historyLength = options.historyLength ?? HISTORY_LENGTH;
        this.rng = rng;
        this.grid = [];
        this.entities = new Map();
        this.nextId = 1;
        this.fishCount = 0;
        this.sharkCount = 0;
        this.chronon = 0;
        this.history = [];
        this.terminal = null;
        this.running = true;
        this.reset();
    }

    /**
     * Create a new random world: clear all state, set the chronon to `0`,
     * clear extinction status and population history, and resume running
     * (spec Req 25.1). The world is populated at the configured fish and
     * shark densities (spec Req 6.1).
     */
    reset() {
        this.grid = new Array(this.cols * this.rows).fill(EMPTY);
        this.entities = new Map();
        this.nextId = 1;
        this.fishCount = 0;
        this.sharkCount = 0;
        this.chronon = 0;
        this.history = [];
        this.terminal = null;
        this.running = true;
        this._populate();
    }

    /**
     * Advance the world by exactly one chronon: snapshot all entity IDs,
     * shuffle them with the shared RNG (spec Req 8.1), let each surviving
     * entity act at most once - skipping entities removed earlier in the
     * chronon (spec Req 10.1, 10.2) and entities born this chronon (spec
     * Req 9.1) - then advance the chronon counter, record one history sample
     * (spec Req 27.1), and evaluate extinction (spec Req 26).
     */
    step() {
        const order = this._shuffle([...this.entities.keys()]);
        for (const id of order) {
            const entity = this.entities.get(id);
            if (!entity) continue;
            if (entity.bornChronon === this.chronon) continue;
            entity.act();
        }
        this.chronon += 1;
        this._recordHistory();
        this._checkExtinction();
    }

    /**
     * Current population counts (live O(1) counters).
     *
     * @returns {{fish: number, sharks: number}} Fish and shark counts.
     */
    get counts() {
        return { fish: this.fishCount, sharks: this.sharkCount };
    }

    /**
     * Run-state and status text (spec Req 26.1-26.4): a terminal extinction
     * status when a population hit zero, otherwise `Running` or `Paused`.
     *
     * @returns {{running: boolean, terminal: boolean, text: string}} Status snapshot.
     */
    get status() {
        const text = this.terminal ?? (this.running ? STATUS_RUNNING : STATUS_PAUSED);
        return { running: this.running, terminal: this.terminal !== null, text };
    }

    /**
     * Iterate all live entities (read-only view for rendering).
     *
     * @param {Function} callback - Called with each entity.
     */
    forEachEntity(callback) {
        for (const entity of this.entities.values()) {
            callback(entity);
        }
    }

    /**
     * Flat grid indices of the four orthogonal neighbors of a cell with
     * toroidal wrapping (spec Req 3.2): north, south, west, east.
     *
     * @param {number} pos - Flat grid index of the cell.
     * @returns {number[]} Exactly four wrapped neighbor indices.
     */
    neighborCells(pos) {
        const col = pos % this.cols;
        const row = (pos - col) / this.cols;
        const north = ((row + this.rows - 1) % this.rows) * this.cols + col;
        const south = ((row + 1) % this.rows) * this.cols + col;
        const west = row * this.cols + (col + this.cols - 1) % this.cols;
        const east = row * this.cols + (col + 1) % this.cols;
        return [north, south, west, east];
    }

    /**
     * Flat grid indices of adjacent cells that are currently unoccupied.
     *
     * @param {number} pos - Flat grid index of the cell.
     * @returns {number[]} Indices of adjacent empty cells.
     */
    emptyNeighbors(pos) {
        return this.neighborCells(pos).filter((cell) => this.grid[cell] === EMPTY);
    }

    /**
     * Flat grid indices of adjacent cells occupied by fish (prey detection,
     * spec Req 15.1).
     *
     * @param {number} pos - Flat grid index of the cell.
     * @returns {number[]} Indices of adjacent fish cells.
     */
    fishNeighbors(pos) {
        return this.neighborCells(pos).filter((cell) => {
            const id = this.grid[cell];
            return id !== EMPTY && this.entities.get(id) instanceof Fish;
        });
    }

    /**
     * The entity occupying a cell, if any.
     *
     * @param {number} pos - Flat grid index of the cell.
     * @returns {Entity|null} The occupying entity or null for empty water.
     */
    entityAt(pos) {
        const id = this.grid[pos];
        return id === EMPTY ? null : this.entities.get(id);
    }

    /**
     * Choose one element uniformly at random from a non-empty list using the
     * single random source (spec Req 7.1).
     *
     * @param {Array} list - Non-empty candidate list.
     * @returns {*} The chosen element.
     */
    randomChoice(list) {
        return list[Math.floor(this.rng() * list.length)];
    }

    /**
     * Move an entity to a destination cell, maintaining grid/entity
     * consistency (spec Req 19.3). One of the three seam methods that may
     * mutate the grid and the entity map (design D5).
     *
     * @param {Entity} entity - The entity to move.
     * @param {number} dest - Flat grid index of the destination cell.
     */
    moveEntityTo(entity, dest) {
        this.grid[entity.pos] = EMPTY;
        entity.pos = dest;
        this.grid[dest] = entity.id;
    }

    /**
     * Create a new entity of the given class in a cell, maintaining
     * grid/entity consistency and the live population counters (spec Req
     * 19.3). One of the three seam methods that may mutate the grid and the
     * entity map (design D5).
     *
     * @param {number} pos - Flat grid index of the cell to occupy.
     * @param {Function} EntityCtor - Entity subclass (Fish or Shark) to construct.
     * @param {number} bornChronon - Chronon of birth (spec Req 9.1).
     * @returns {Entity} The newborn entity.
     */
    spawnAt(pos, EntityCtor, bornChronon) {
        const id = this.nextId++;
        const entity = new EntityCtor(this, id, pos, bornChronon);
        this.entities.set(id, entity);
        this.grid[pos] = id;
        if (entity instanceof Shark) {
            this.sharkCount += 1;
        } else if (entity instanceof Fish) {
            this.fishCount += 1;
        }
        return entity;
    }

    /**
     * Remove an entity (eaten or starved) and maintain grid/entity
     * consistency and the live population counters (spec Req 19.3). One of
     * the three seam methods that may mutate the grid and the entity map
     * (design D5).
     *
     * @param {Entity} entity - The entity to remove.
     */
    removeEntity(entity) {
        this.grid[entity.pos] = EMPTY;
        this.entities.delete(entity.id);
        if (entity instanceof Shark) {
            this.sharkCount -= 1;
        } else if (entity instanceof Fish) {
            this.fishCount -= 1;
        }
    }

    /**
     * Randomly populate the grid at the configured densities: each cell
     * independently becomes a shark with probability `sharkDensity`, else a
     * fish with probability `fishDensity` (spec Req 6.1). Initial entities
     * carry `bornChronon = -1` so they may act in chronon `0` (spec Req 9.1).
     *
     * @private
     */
    _populate() {
        for (let cell = 0; cell < this.grid.length; cell++) {
            const roll = this.rng();
            if (roll < this.sharkDensity) {
                this.spawnAt(cell, Shark, -1);
            } else if (roll < this.sharkDensity + this.fishDensity) {
                this.spawnAt(cell, Fish, -1);
            }
        }
    }

    /**
     * Fisher-Yates shuffle an ID list in place using the single random source
     * (spec Req 7.1, 8.1, design D6).
     *
     * @private
     * @param {number[]} list - List to shuffle.
     * @returns {number[]} The shuffled list.
     */
    _shuffle(list) {
        for (let i = list.length - 1; i > 0; i--) {
            const j = Math.floor(this.rng() * (i + 1));
            const tmp = list[i];
            list[i] = list[j];
            list[j] = tmp;
        }
        return list;
    }

    /**
     * Record one population sample per chronon in the rolling window
     * (spec Req 27.1).
     *
     * @private
     */
    _recordHistory() {
        this.history.push({ fish: this.fishCount, sharks: this.sharkCount });
        if (this.history.length > this.historyLength) {
            this.history.shift();
        }
    }

    /**
     * Detect extinction at the end of a chronon and auto-pause with the
     * matching terminal status (spec Req 26.1-26.3).
     *
     * @private
     */
    _checkExtinction() {
        if (this.fishCount === 0 && this.sharkCount === 0) {
            this.terminal = STATUS_COLLAPSED;
        } else if (this.sharkCount === 0) {
            this.terminal = STATUS_SHARKS_EXTINCT;
        } else if (this.fishCount === 0) {
            this.terminal = STATUS_FISH_EXTINCT;
        }
        if (this.terminal !== null) {
            this.running = false;
        }
    }
}
