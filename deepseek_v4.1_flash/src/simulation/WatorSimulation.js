/**
 * The Wa-Tor simulation engine.
 *
 * This class owns all simulation state and every Wa-Tor rule that governs
 * *when* things happen: the chronon skeleton, turn ordering, birth and death
 * bookkeeping, population sampling, and extinction detection
 * (`chronon-rules` §1, `population-history`). Individual creatures decide
 * *what* they do during their turn, in {@link import('./Entity.js').default#act}.
 *
 * The module deliberately imports nothing from Phaser. Keeping the rules free
 * of rendering concerns is required by `app-shell/static-hosting` §4.1 and
 * lets the engine run in a plain JavaScript context.
 *
 * State is held in two structures that must agree (`world-model` §3):
 *
 * - a flat grid array holding an entity ID per cell, or `EMPTY_CELL`
 *   (`world-model` §3, §3.1)
 * - a map from entity ID to the entity object (`world-model` §3)
 *
 * Every write to the grid goes through {@link WatorSimulation#_place} or
 * {@link WatorSimulation#_clear}, so the two structures cannot drift apart
 * (`world-model` §3.2, §3.3).
 */

import Entity from './Entity.js';
import Fish from './Fish.js';
import Shark from './Shark.js';
import RandomSource from './RandomSource.js';
import {
    GRID_WIDTH,
    GRID_HEIGHT,
    FISH_DENSITY,
    SHARK_DENSITY,
    EMPTY_CELL,
    FISH,
    SHARK,
    FISH_BREED_TIME,
    SHARK_BREED_TIME,
    INITIAL_SHARK_ENERGY,
    SHARK_ENERGY_GAIN,
    SHARK_ENERGY_COST_PER_CHRONON,
    HISTORY_WINDOW,
    STATUS
} from '../config.js';

export default class WatorSimulation {
    /**
     * Create a simulation and seed its first random world.
     *
     * @param {RandomSource} [rng=new RandomSource()] - The single random source
     *   for the whole simulation (`world-model` §2.3). Injectable so a caller
     *   can supply a deterministic substitute.
     */
    constructor(rng = new RandomSource()) {
        /** @type {RandomSource} */
        this.rng = rng;
        /** @type {number} */
        this.width = GRID_WIDTH;
        /** @type {number} */
        this.height = GRID_HEIGHT;
        /** @type {number} Full cell count; `width * height`. */
        this.cellCount = this.width * this.height;

        /** @type {number} Next never-reused entity identifier (`world-model` §3.4). */
        this.nextId = 1;
        /** @type {Int32Array} One entity ID per cell, or `EMPTY_CELL`. */
        this.grid = new Int32Array(this.cellCount);
        // A typed array zero-fills, so empty cells must be written explicitly:
        // otherwise ID 0 would appear to occupy every unseeded cell.
        this.grid.fill(EMPTY_CELL);
        /** @type {Map<number, Entity>} Live entities keyed by ID. */
        this.entities = new Map();

        /** @type {number} Completed chronon count. */
        this.chronon = 0;
        /** @type {import('./types.js').PopulationSample[]} Rolling sample window. */
        this.history = [];
        /** @type {number} */
        this.fishCount = 0;
        /** @type {number} */
        this.sharkCount = 0;
        /** @type {number} Fish and shark counts recorded when the world was seeded. */
        this.initialFishCount = 0;
        /** @type {number} */
        this.initialSharkCount = 0;
        /** @type {string|null} Terminal outcome text, or `null` while the run continues. */
        this.terminalStatus = null;

        /** @type {import('./types.js').WorldCapabilities} Bound capability object. */
        this._world = this._buildWorld();

        this._seed();
    }

    // -----------------------------------------------------------------------
    // Queries (spec `world-model` §1)
    // -----------------------------------------------------------------------

    /**
     * Return the flat indices of the four orthogonally adjacent cells, wrapping
     * toroidally at every edge.
     *
     * Diagonals are never returned (`world-model` §1.3), and an edge cell wraps
     * to the opposite edge (`world-model` §1.2).
     *
     * @param {number} position - Flat index of the cell to inspect.
     * @returns {number[]} Four indices in the order north, east, south, west.
     */
    neighbors(position) {
        const w = this.width;
        const h = this.height;
        const x = position % w;
        const y = (position - x) / w;
        return [
            ((y - 1 + h) % h) * w + x,
            y * w + ((x + 1) % w),
            ((y + 1) % h) * w + x,
            y * w + ((x - 1 + w) % w)
        ];
    }

    /**
     * Return the entity occupying a cell.
     *
     * @param {number} position - Flat index of the cell to inspect.
     * @returns {Entity|null} The occupant, or `null` when the cell is empty.
     */
    entityAt(position) {
        const id = this.grid[position];
        return id === EMPTY_CELL ? null : this.entities.get(id) ?? null;
    }

    /**
     * Report whether a cell holds no entity.
     *
     * @param {number} position - Flat index of the cell to inspect.
     * @returns {boolean} True when the cell is empty.
     */
    isEmpty(position) {
        return this.grid[position] === EMPTY_CELL;
    }

    /**
     * Report the current population and chronon count.
     *
     * @returns {{chronon: number, fish: number, sharks: number}} Current counts.
     */
    population() {
        return { chronon: this.chronon, fish: this.fishCount, sharks: this.sharkCount };
    }

    /** @returns {boolean} True once an extinction outcome has been reached. */
    get isTerminal() {
        return this.terminalStatus !== null;
    }

    // -----------------------------------------------------------------------
    // Mutations (spec `world-model` §3.2, §3.3)
    // -----------------------------------------------------------------------

    /**
     * Move an entity to a new cell, keeping both state structures consistent.
     *
     * @param {Entity} entity - The entity to move.
     * @param {number} position - Destination flat grid index.
     * @returns {void}
     */
    move(entity, position) {
        this._clear(entity.position);
        this._place(entity, position);
    }

    /**
     * Remove an entity from the world, freeing the cell it occupied.
     *
     * The entity's `alive` flag is cleared so a turn it has not yet taken in
     * the current chronon is skipped (`chronon-rules` §1.4).
     *
     * @param {Entity} entity - The entity to remove.
     * @returns {void}
     */
    remove(entity) {
        if (!this.entities.has(entity.id)) return;
        this._clear(entity.position);
        this.entities.delete(entity.id);
        entity.alive = false;
        if (entity.kind === SHARK) {
            this.sharkCount -= 1;
        } else {
            this.fishCount -= 1;
        }
    }

    /**
     * Create a newborn entity in a cell with a fresh never-reused identifier.
     *
     * @param {number} position - Flat grid index the newborn occupies.
     * @param {string} kind - Either `FISH` or `SHARK`; see `src/config.js`.
     * @returns {Entity} The newborn entity.
     */
    spawn(position, kind) {
        const id = this.nextId++;
        const entity = kind === SHARK
            ? new Shark({ id, position })
            : new Fish({ id, position });
        this.entities.set(id, entity);
        this._place(entity, position);
        if (kind === SHARK) {
            this.sharkCount += 1;
        } else {
            this.fishCount += 1;
        }
        return entity;
    }

    // -----------------------------------------------------------------------
    // Chronon (spec `chronon-rules` §1)
    // -----------------------------------------------------------------------

    /**
     * Advance the simulation by exactly one chronon.
     *
     * The chronon proceeds in four stages: advance every breed age, snapshot
     * the live entity IDs and shuffle them, let each still-living entity act at
     * most once in that order, then record a sample and test for extinction.
     *
     * Births cannot act in their own chronon because the snapshot is taken
     * before any entity acts, and IDs are never reused (`chronon-rules` §1.1,
     * §1.3). Entities removed mid-chronon are skipped when their turn arrives
     * (`chronon-rules` §1.4).
     *
     * @returns {void}
     */
    step() {
        if (this.isTerminal) return;

        this.chronon += 1;

        // Breed ages advance once per elapsed chronon for every survivor
        // (`chronon-rules` §1.5).
        for (const entity of this.entities.values()) {
            entity.breedAge += 1;
        }

        // Snapshot first, then shuffle: anything born after this point is
        // absent from the snapshot and therefore cannot act this chronon.
        const order = Array.from(this.entities.keys());
        for (let i = order.length - 1; i > 0; i -= 1) {
            const j = Math.floor(this.rng.next() * (i + 1));
            const swap = order[i];
            order[i] = order[j];
            order[j] = swap;
        }

        for (const id of order) {
            const entity = this.entities.get(id);
            if (!entity || !entity.alive) continue;
            entity.act(this._world);
        }

        this._recordSample();
        this._checkExtinction();
    }

    /**
     * Discard the current world and seed a fresh random one.
     *
     * Resets the chronon count, the terminal outcome, and the population
     * history, then resumes from a newly populated grid
     * (`simulation-ui/playback-controls` §4).
     *
     * @returns {void}
     */
    reset() {
        this.nextId = 1;
        this.grid = new Int32Array(this.cellCount);
        this.grid.fill(EMPTY_CELL);
        this.entities = new Map();
        this.chronon = 0;
        this.history = [];
        this.fishCount = 0;
        this.sharkCount = 0;
        this.terminalStatus = null;
        this._seed();
    }

    // -----------------------------------------------------------------------
    // Internals
    // -----------------------------------------------------------------------

    /**
     * Write an entity into a cell, updating both the grid array and the entity.
     *
     * This and {@link WatorSimulation#_clear} are the only methods that write
     * to the grid, which is what keeps the two state structures consistent
     * (`world-model` §3.2).
     *
     * @private
     * @param {Entity} entity - Entity to record.
     * @param {number} index - Flat grid index to place it in.
     * @returns {void}
     */
    _place(entity, index) {
        this.grid[index] = entity.id;
        entity.position = index;
    }

    /**
     * Mark a cell as empty in the grid array.
     *
     * @private
     * @param {number} index - Flat grid index to clear.
     * @returns {void}
     */
    _clear(index) {
        this.grid[index] = EMPTY_CELL;
    }

    /**
     * Build the capability object handed to entities during their turn.
     *
     * Entities receive this duck-typed seam rather than a reference to the
     * simulation class, which avoids the circular import
     * `Fish -> WatorSimulation -> Fish` (design D3).
     *
     * @private
     * @returns {import('./types.js').WorldCapabilities} Bound capabilities.
     */
    _buildWorld() {
        return {
            neighbors: (position) => this.neighbors(position),
            entityAt: (position) => this.entityAt(position),
            isEmpty: (position) => this.isEmpty(position),
            move: (entity, position) => this.move(entity, position),
            remove: (entity) => this.remove(entity),
            spawn: (position, kind) => this.spawn(position, kind),
            rng: this.rng,
            config: {
                fishBreedTime: FISH_BREED_TIME,
                sharkBreedTime: SHARK_BREED_TIME,
                initialSharkEnergy: INITIAL_SHARK_ENERGY,
                sharkEnergyGain: SHARK_ENERGY_GAIN,
                sharkEnergyCostPerChronon: SHARK_ENERGY_COST_PER_CHRONON
            }
        };
    }

    /**
     * Populate the grid randomly using the configured densities.
     *
     * Sharks are placed first so that the intended `5%` shark share is not
     * reduced by cells already taken by fish. All choices come from the single
     * random source (`world-model` §2.1, §2.3).
     *
     * @private
     * @returns {void}
     */
    _seed() {
        const fishTarget = Math.round(this.cellCount * FISH_DENSITY);
        const sharkTarget = Math.round(this.cellCount * SHARK_DENSITY);

        const cells = [];
        for (let i = 0; i < this.cellCount; i += 1) {
            cells.push(i);
        }
        // Fisher-Yates shuffle so each cell is equally likely to be chosen.
        for (let i = cells.length - 1; i > 0; i -= 1) {
            const j = Math.floor(this.rng.next() * (i + 1));
            const swap = cells[i];
            cells[i] = cells[j];
            cells[j] = swap;
        }

        let cursor = 0;
        for (let n = 0; n < sharkTarget; n += 1) {
            this.spawn(cells[cursor++], SHARK);
        }
        for (let n = 0; n < fishTarget; n += 1) {
            this.spawn(cells[cursor++], FISH);
        }

        this.initialFishCount = this.fishCount;
        this.initialSharkCount = this.sharkCount;
    }

    /**
     * Append a population sample, keeping only the rolling window.
     *
     * @private
     * @returns {void}
     */
    _recordSample() {
        this.history.push({
            chronon: this.chronon,
            fish: this.fishCount,
            sharks: this.sharkCount
        });
        if (this.history.length > HISTORY_WINDOW) {
            this.history.splice(0, this.history.length - HISTORY_WINDOW);
        }
    }

    /**
     * Detect a terminal outcome and record its status message.
     *
     * Collapse is tested first so that two simultaneous extinctions report as
     * `Ecosystem collapsed` rather than one of the single-species messages
     * (`population-history` §2.1-§2.3).
     *
     * @private
     * @returns {void}
     */
    _checkExtinction() {
        if (this.fishCount === 0 && this.sharkCount === 0) {
            this.terminalStatus = STATUS.COLLAPSED;
        } else if (this.sharkCount === 0) {
            this.terminalStatus = STATUS.SHARKS_EXTINCT;
        } else if (this.fishCount === 0) {
            this.terminalStatus = STATUS.FISH_EXTINCT;
        }
    }
}
