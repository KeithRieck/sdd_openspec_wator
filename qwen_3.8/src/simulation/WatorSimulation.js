import Fish from './Fish.js';
import Shark from './Shark.js';
import {
    GRID_WIDTH,
    GRID_HEIGHT,
    FISH_DENSITY,
    SHARK_DENSITY,
    INITIAL_SHARK_ENERGY,
    HISTORY_WINDOW
} from '../config.js';

/**
 * The framework-independent Wa-Tor simulation engine.
 *
 * Owns a flat grid array plus a Map of living entity records
 * (wator-simulation R8) and advances time in discrete chronons using
 * randomized-sequential stepping (wator-simulation R2, design D3). The engine
 * has no Phaser dependencies so it can be exercised standalone (design D1).
 */
export default class WatorSimulation {
    /**
     * Create and initialize a new simulation world.
     *
     * @param {number} [width=GRID_WIDTH] - Grid width in columns.
     * @param {number} [height=GRID_HEIGHT] - Grid height in rows.
     */
    constructor(width = GRID_WIDTH, height = GRID_HEIGHT) {
        this.width = width;
        this.height = height;
        this.reset();
    }

    /**
     * Reset to a fresh random world: chronon 0, cleared status and history,
     * and a randomly populated grid (wator-simulation R1, R11).
     */
    reset() {
        this.chronon = 0;
        this.status = 'Running';
        this.terminal = false;
        this.history = [];
        this._nextId = 1;
        this.entities = new Map();
        this.grid = new Array(this.width * this.height).fill(null);

        this._populate();
        // Record the initial population as the first history sample
        // (wator-simulation R10.3).
        this._recordHistory();
    }

    /**
     * Randomly populate the grid with fish and sharks on disjoint cells
     * (wator-simulation R1.2).
     *
     * @private
     */
    _populate() {
        const total = this.width * this.height;
        const fishCount = Math.round(total * FISH_DENSITY);
        const sharkCount = Math.round(total * SHARK_DENSITY);

        // Choose distinct cells for fish, then for sharks among the rest.
        const indices = this._shuffledRange(total);
        let cursor = 0;
        for (let i = 0; i < fishCount; i++) {
            this._placeFishAt(indices[cursor++]);
        }
        for (let i = 0; i < sharkCount; i++) {
            this._placeSharkAt(indices[cursor++]);
        }
    }

    /**
     * Place a fish at a flat grid index.
     *
     * @private
     * @param {number} index - Flat grid index.
     */
    _placeFishAt(index) {
        const x = index % this.width;
        const y = Math.floor(index / this.width);
        const fish = new Fish(this._nextId++, x, y);
        this._register(fish);
    }

    /**
     * Place a shark at a flat grid index.
     *
     * @private
     * @param {number} index - Flat grid index.
     */
    _placeSharkAt(index) {
        const x = index % this.width;
        const y = Math.floor(index / this.width);
        const shark = new Shark(this._nextId++, x, y, INITIAL_SHARK_ENERGY);
        this._register(shark);
    }

    /**
     * Register an entity in the grid and the living-entity map.
     *
     * @private
     * @param {import('./Entity.js').default} entity - The entity to register.
     */
    _register(entity) {
        this.grid[entity.y * this.width + entity.x] = entity;
        this.entities.set(entity.id, entity);
    }

    /**
     * Advance the simulation by one chronon (wator-simulation R2).
     *
     * Snapshots the living entity IDs, shuffles them, and lets each surviving
     * entity act at most once, skipping entities that died or were born this
     * chronon. After all entities act, the chronon increments, history is
     * recorded, and extinction is evaluated.
     */
    step() {
        if (this.terminal) {
            return;
        }

        const actors = [...this.entities.values()]
            .filter((e) => e.alive)
            .map((e) => e.id);
        this._shuffle(actors);

        for (const id of actors) {
            const entity = this.entities.get(id);
            if (!entity || !entity.alive) {
                continue; // Eaten or starved before its turn (R2.3).
            }
            if (entity.bornThisChronon) {
                continue; // Newborns wait until the next chronon (R2.2).
            }
            entity.act(this);
        }

        this.chronon += 1;
        this._recordHistory();
        this._checkExtinction();

        // Clear the newborn flag so next chronon's babies can act.
        for (const entity of this.entities.values()) {
            entity.bornThisChronon = false;
        }
    }

    /**
     * Return the orthogonal, toroidal neighbors of a cell that are empty.
     *
     * @param {number} x - Column.
     * @param {number} y - Row.
     * @returns {Array<{x:number,y:number}>} Adjacent empty cells.
     */
    emptyNeighbors(x, y) {
        const result = [];
        for (const [nx, ny] of this._neighbors(x, y)) {
            if (this.grid[ny * this.width + nx] === null) {
                result.push({ x: nx, y: ny });
            }
        }
        return result;
    }

    /**
     * Return the orthogonal, toroidal neighbors of a cell occupied by a fish.
     *
     * @param {number} x - Column.
     * @param {number} y - Row.
     * @returns {import('./Entity.js').default[]} Adjacent fish entities.
     */
    fishNeighbors(x, y) {
        const result = [];
        for (const [nx, ny] of this._neighbors(x, y)) {
            const occupant = this.grid[ny * this.width + nx];
            if (occupant && occupant.type === 'fish' && occupant.alive) {
                result.push(occupant);
            }
        }
        return result;
    }

    /**
     * Move an entity to a new cell, updating the grid and its position.
     *
     * @param {import('./Entity.js').default} entity - The entity to move.
     * @param {number} x - Destination column.
     * @param {number} y - Destination row.
     */
    moveEntity(entity, x, y) {
        this.grid[entity.y * this.width + entity.x] = null;
        entity.x = x;
        entity.y = y;
        this.grid[y * this.width + x] = entity;
    }

    /**
     * Spawn a new fish in a cell, marked as born this chronon.
     *
     * @param {number} x - Column.
     * @param {number} y - Row.
     * @returns {Fish} The new fish.
     */
    spawnFish(x, y) {
        const fish = new Fish(this._nextId++, x, y);
        fish.bornThisChronon = true;
        this._register(fish);
        return fish;
    }

    /**
     * Spawn a new shark in a cell with initial energy, marked as born this
     * chronon (wator-simulation R7.2).
     *
     * @param {number} x - Column.
     * @param {number} y - Row.
     * @returns {Shark} The new shark.
     */
    spawnShark(x, y) {
        const shark = new Shark(this._nextId++, x, y, INITIAL_SHARK_ENERGY);
        shark.bornThisChronon = true;
        this._register(shark);
        return shark;
    }

    /**
     * Remove an entity from the grid and mark it dead.
     *
     * @param {import('./Entity.js').default} entity - The entity to remove.
     */
    kill(entity) {
        if (!entity.alive) {
            return;
        }
        entity.alive = false;
        const index = entity.y * this.width + entity.x;
        if (this.grid[index] === entity) {
            this.grid[index] = null;
        }
    }

    /**
     * The number of living fish.
     * @returns {number}
     */
    get fishCount() {
        let count = 0;
        for (const e of this.entities.values()) {
            if (e.alive && e.type === 'fish') {
                count++;
            }
        }
        return count;
    }

    /**
     * The number of living sharks.
     * @returns {number}
     */
    get sharkCount() {
        let count = 0;
        for (const e of this.entities.values()) {
            if (e.alive && e.type === 'shark') {
                count++;
            }
        }
        return count;
    }

    /**
     * All living entities, for rendering.
     * @returns {import('./Entity.js').default[]}
     */
    get livingEntities() {
        return [...this.entities.values()].filter((e) => e.alive);
    }

    /**
     * Record a population sample and trim the rolling window
     * (wator-simulation R10).
     *
     * @private
     */
    _recordHistory() {
        this.history.push({ fish: this.fishCount, sharks: this.sharkCount });
        if (this.history.length > HISTORY_WINDOW) {
            this.history.splice(0, this.history.length - HISTORY_WINDOW);
        }
    }

    /**
     * Evaluate extinction and set the terminal status
     * (wator-simulation R9).
     *
     * @private
     */
    _checkExtinction() {
        const fish = this.fishCount;
        const sharks = this.sharkCount;
        if (fish === 0 && sharks === 0) {
            this.status = 'Ecosystem collapsed';
            this.terminal = true;
        } else if (sharks === 0) {
            this.status = 'Sharks extinct';
            this.terminal = true;
        } else if (fish === 0) {
            this.status = 'Fish extinct';
            this.terminal = true;
        }
    }

    /**
     * The orthogonal, toroidal neighbor coordinates of a cell
     * (wator-simulation R1).
     *
     * @private
     * @param {number} x - Column.
     * @param {number} y - Row.
     * @returns {Array<[number,number]>} [x, y] pairs.
     */
    _neighbors(x, y) {
        return [
            [(x + 1) % this.width, y],
            [(x - 1 + this.width) % this.width, y],
            [x, (y + 1) % this.height],
            [x, (y - 1 + this.height) % this.height]
        ];
    }

    /**
     * Return a shuffled array of integers 0..n-1.
     *
     * @private
     * @param {number} n - Upper bound (exclusive).
     * @returns {number[]}
     */
    _shuffledRange(n) {
        const arr = new Array(n);
        for (let i = 0; i < n; i++) {
            arr[i] = i;
        }
        this._shuffle(arr);
        return arr;
    }

    /**
     * Shuffle an array in place (Fisher-Yates).
     *
     * @private
     * @param {any[]} arr - The array to shuffle.
     */
    _shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
}
