import {
    GRID_W, GRID_H, FISH_DENSITY, SHARK_DENSITY,
    FISH_BREED_TIME, SHARK_BREED_TIME,
    INITIAL_SHARK_ENERGY, SHARK_ENERGY_GAIN, SHARK_ENERGY_COST
} from '../config.js';

/**
 * Framework-agnostic Wa-Tor predator-prey cellular automaton engine.
 *
 * Manages a toroidal grid of fish and sharks with movement, eating,
 * breeding, and energy mechanics. Has zero Phaser dependencies.
 */
export class WatorSimulation {
    /**
     * @param {object} [opts] overrideable simulation parameters
     * @param {number} [opts.width=GRID_W] grid columns
     * @param {number} [opts.height=GRID_H] grid rows
     * @param {number} [opts.fishDensity=FISH_DENSITY] initial fish population fraction
     * @param {number} [opts.sharkDensity=SHARK_DENSITY] initial shark population fraction
     * @param {number} [opts.fishBreedTime=FISH_BREED_TIME] chronons until fish can breed
     * @param {number} [opts.sharkBreedTime=SHARK_BREED_TIME] chronons until shark can breed
     * @param {number} [opts.initialSharkEnergy=INITIAL_SHARK_ENERGY] energy for newborns
     * @param {number} [opts.sharkEnergyGain=SHARK_ENERGY_GAIN] energy from eating a fish
     * @param {number} [opts.sharkEnergyCost=SHARK_ENERGY_COST] energy lost per chronon
     */
    constructor(opts = {}) {
        this.width = opts.width ?? GRID_W;
        this.height = opts.height ?? GRID_H;
        this.fishDensity = opts.fishDensity ?? FISH_DENSITY;
        this.sharkDensity = opts.sharkDensity ?? SHARK_DENSITY;
        this.fishBreedTime = opts.fishBreedTime ?? FISH_BREED_TIME;
        this.sharkBreedTime = opts.sharkBreedTime ?? SHARK_BREED_TIME;
        this.initialSharkEnergy = opts.initialSharkEnergy ?? INITIAL_SHARK_ENERGY;
        this.sharkEnergyGain = opts.sharkEnergyGain ?? SHARK_ENERGY_GAIN;
        this.sharkEnergyCost = opts.sharkEnergyCost ?? SHARK_ENERGY_COST;

        /** @type {Int32Array} flat grid: 0 = empty, positive = entity ID */
        this.grid = null;

        /** @type {Map<number, EntityRecord>} keyed by entity ID */
        this.entities = null;

        /** @type {number} next entity ID to assign */
        this.nextId = 0;

        /** @type {number} current chronon counter */
        this.chronon = 0;

        /** @type {number} live fish count */
        this.fishCount = 0;

        /** @type {number} live shark count */
        this.sharkCount = 0;

        /** @type {Set<number>} entities born during the current tick */
        this.bornThisTick = new Set();

        this.reset();
    }

    /**
     * Reinitializes grid and entity state to a fresh random world.
     */
    reset() {
        this.grid = new Int32Array(this.width * this.height);
        this.entities = new Map();
        this.nextId = 1;
        this.chronon = 0;
        this.fishCount = 0;
        this.sharkCount = 0;
        this.bornThisTick.clear();
        this.populateRandom();
    }

    /**
     * Randomly populates the grid with fish and sharks at configured densities.
     * Fish are placed first to ensure they don't overlap with sharks.
     */
    populateRandom() {
        const totalCells = this.width * this.height;
        const targetFish = Math.floor(totalCells * this.fishDensity);
        const targetSharks = Math.floor(totalCells * this.sharkDensity);

        for (let i = 0; i < targetFish; i++) {
            const idx = this.findEmptyCell();
            if (idx < 0) break;
            this.placeEntity('fish', idx);
        }

        for (let i = 0; i < targetSharks; i++) {
            const idx = this.findEmptyCell();
            if (idx < 0) break;
            this.placeEntity('shark', idx);
        }
    }

    /**
     * Finds a random empty cell index. Returns -1 if grid is full.
     * Uses rejection sampling — efficient when density is not near 100%.
     * @returns {number} grid index or -1
     */
    findEmptyCell() {
        const total = this.width * this.height;
        for (let attempt = 0; attempt < total * 10; attempt++) {
            const idx = Math.floor(Math.random() * total);
            if (this.grid[idx] === 0) return idx;
        }
        for (let i = 0; i < total; i++) {
            if (this.grid[i] === 0) return i;
        }
        return -1;
    }

    /**
     * Creates a new entity at the given grid index.
     * @param {string} type "fish" or "shark"
     * @param {number} idx grid index
     */
    placeEntity(type, idx) {
        const id = this.nextId++;
        const x = idx % this.width;
        const y = Math.floor(idx / this.width);
        const record = { id, type, x, y, breedAge: 0 };
        if (type === 'shark') {
            record.energy = this.initialSharkEnergy;
            this.sharkCount++;
        } else {
            this.fishCount++;
        }
        this.grid[idx] = id;
        this.entities.set(id, record);
    }

    /**
     * Advances the simulation by one chronon.
     *
     * Entity turn order is randomized. Entities that die or are eaten before their
     * turn are skipped. Entities born during the current chronon do not act.
     *
     * @returns {TickResult} counters for events during this chronon
     */
    tick() {
        const result = { fishBorn: 0, fishDied: 0, sharksBorn: 0, sharksStarved: 0, fishEaten: 0 };

        this.bornThisTick.clear();
        const ids = Array.from(this.entities.keys());
        this.fisherYatesShuffle(ids);

        for (const id of ids) {
            if (this.bornThisTick.has(id)) continue;
            const entity = this.entities.get(id);
            if (!entity) continue;

            if (entity.type === 'fish') {
                this.processFish(entity, result);
            } else if (entity.type === 'shark') {
                this.processShark(entity, result);
            }
        }

        this.chronon++;
        return result;
    }

    /**
     * Processes one fish's action for the current chronon.
     * @param {EntityRecord} entity
     * @param {TickResult} result
     */
    processFish(entity, result) {
        const neighbors = this.getNeighbors(entity.x, entity.y);
        const freeCells = neighbors.filter(n => this.grid[n.idx] === 0);
        const canBreed = entity.breedAge >= this.fishBreedTime;

        if (freeCells.length === 0) {
            if (canBreed) {
                entity.breedAge = 0;
            } else {
                entity.breedAge++;
            }
            return;
        }

        const dest = freeCells[Math.floor(Math.random() * freeCells.length)];
        const oldX = entity.x;
        const oldY = entity.y;

        this.moveEntityTo(entity, dest.x, dest.y);

        if (canBreed) {
            this.spawnEntity('fish', oldX, oldY, result);
            entity.breedAge = 0;
        } else {
            entity.breedAge++;
        }
    }

    /**
     * Processes one shark's action for the current chronon.
     * @param {EntityRecord} entity
     * @param {TickResult} result
     */
    processShark(entity, result) {
        entity.energy -= this.sharkEnergyCost;

        if (entity.energy <= 0) {
            this.removeEntity(entity.id, result, 'starved');
            return;
        }

        const neighbors = this.getNeighbors(entity.x, entity.y);
        const fishCells = neighbors.filter(n => {
            const e = this.entities.get(this.grid[n.idx]);
            return e && e.type === 'fish';
        });
        const canBreed = entity.breedAge >= this.sharkBreedTime;
        const oldX = entity.x;
        const oldY = entity.y;

        if (fishCells.length > 0) {
            const dest = fishCells[Math.floor(Math.random() * fishCells.length)];
            const victimId = this.grid[dest.idx];
            this.removeEntity(victimId, result, 'eaten');
            this.moveEntityTo(entity, dest.x, dest.y);
            entity.energy += this.sharkEnergyGain;
        } else {
            const freeCells = neighbors.filter(n => this.grid[n.idx] === 0);
            if (freeCells.length > 0) {
                const dest = freeCells[Math.floor(Math.random() * freeCells.length)];
                this.moveEntityTo(entity, dest.x, dest.y);
            } else {
                if (canBreed) {
                    entity.breedAge = 0;
                } else {
                    entity.breedAge++;
                }
                return;
            }
        }

        if (canBreed) {
            this.spawnEntity('shark', oldX, oldY, result);
            entity.breedAge = 0;
        } else {
            entity.breedAge++;
        }
    }

    /**
     * Creates a new entity at the given grid coordinates.
     * @param {string} type "fish" or "shark"
     * @param {number} x column
     * @param {number} y row
     * @param {TickResult} result counters to update
     * @returns {number} new entity ID
     */
    spawnEntity(type, x, y, result) {
        const id = this.nextId++;
        const idx = y * this.width + x;
        const record = { id, type, x, y, breedAge: 0 };
        if (type === 'shark') {
            record.energy = this.initialSharkEnergy;
            this.sharkCount++;
            result.sharksBorn++;
        } else {
            this.fishCount++;
            result.fishBorn++;
        }
        this.grid[idx] = id;
        this.entities.set(id, record);
        this.bornThisTick.add(id);
        return id;
    }

    /**
     * Moves an entity to a new grid position.
     * @param {EntityRecord} entity
     * @param {number} newX column
     * @param {number} newY row
     */
    moveEntityTo(entity, newX, newY) {
        const oldIdx = entity.y * this.width + entity.x;
        const newIdx = newY * this.width + newX;
        this.grid[oldIdx] = 0;
        this.grid[newIdx] = entity.id;
        entity.x = newX;
        entity.y = newY;
    }

    /**
     * Removes an entity from the grid and entity map.
     * @param {number} id entity ID
     * @param {TickResult} result counters to update
     * @param {string} cause "eaten" or "starved"
     */
    removeEntity(id, result, cause) {
        const entity = this.entities.get(id);
        if (!entity) return;
        const idx = entity.y * this.width + entity.x;
        this.grid[idx] = 0;
        this.entities.delete(id);
        if (entity.type === 'fish') {
            this.fishCount--;
            result.fishDied++;
            if (cause === 'eaten') result.fishEaten++;
        } else {
            this.sharkCount--;
            if (cause === 'starved') result.sharksStarved++;
        }
    }

    /**
     * Returns the four orthogonal neighbor coordinates with toroidal wrapping.
     * @param {number} x column
     * @param {number} y row
     * @returns {Array<{x: number, y: number, idx: number}>}
     */
    getNeighbors(x, y) {
        const w = this.width;
        const h = this.height;
        return [
            { x: (x + 1) % w,     y,                 idx: y * w + (x + 1) % w },
            { x: (x - 1 + w) % w, y,                 idx: y * w + (x - 1 + w) % w },
            { x,                   y: (y + 1) % h,    idx: ((y + 1) % h) * w + x },
            { x,                   y: (y - 1 + h) % h, idx: ((y - 1 + h) % h) * w + x },
        ];
    }

    /**
     * Fischer-Yates in-place shuffle.
     * @param {Array} arr
     */
    fisherYatesShuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }

    /**
     * Returns current population statistics.
     * @returns {{ chronon: number, fish: number, sharks: number }}
     */
    getStats() {
        return {
            chronon: this.chronon,
            fish: this.fishCount,
            sharks: this.sharkCount,
        };
    }

    /**
     * Returns the raw grid array for rendering.
     * @returns {Int32Array}
     */
    getGrid() {
        return this.grid;
    }

    /**
     * Returns the entity map for rendering.
     * @returns {Map<number, EntityRecord>}
     */
    getEntities() {
        return this.entities;
    }
}

/**
 * @typedef {object} EntityRecord
 * @property {number} id
 * @property {"fish"|"shark"} type
 * @property {number} x
 * @property {number} y
 * @property {number} breedAge
 * @property {number} [energy]
 */

/**
 * @typedef {object} TickResult
 * @property {number} fishBorn
 * @property {number} fishDied
 * @property {number} sharksBorn
 * @property {number} sharksStarved
 * @property {number} fishEaten
 */
