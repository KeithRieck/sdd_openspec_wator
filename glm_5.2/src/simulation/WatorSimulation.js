import Fish from './Fish.js';
import Shark from './Shark.js';
import {
    GRID_WIDTH,
    GRID_HEIGHT,
    FISH_DENSITY,
    SHARK_DENSITY,
    HISTORY_WINDOW,
    STATUS
} from '../config.js';

/**
 * The Wa-Tor simulation engine.
 *
 * Holds the toroidal grid, entity registry, chronon counter, population
 * counts, status, and rolling population history. Implements the per-chronon
 * step loop with randomized turn order, newborn skipping, and dead-before-turn
 * skipping. All Wa-Tor rules live here and in the Entity subclasses; this
 * engine has no dependency on Phaser or any rendering layer.
 */
export default class WatorSimulation {
    /**
     * Create a new simulation with default grid dimensions.
     */
    constructor() {
        this.width = GRID_WIDTH;
        this.height = GRID_HEIGHT;
        this.grid = new Array(this.width * this.height).fill(null);
        this.entities = new Map();
        this.chronon = 0;
        this.nextId = 0;
        this.fishCount = 0;
        this.sharkCount = 0;
        this.status = STATUS.RUNNING;
        this.history = [];
        this.running = true;
    }

    /**
     * Initialize (or re-initialize) the grid with a random population.
     *
     * Clears the grid and entity map, then populates each cell independently
     * according to FISH_DENSITY and SHARK_DENSITY using Math.random().
     * Resets chronon, counts, history, and status.
     */
    init() {
        this.grid = new Array(this.width * this.height).fill(null);
        this.entities.clear();
        this.chronon = 0;
        this.nextId = 0;
        this.fishCount = 0;
        this.sharkCount = 0;
        this.history = [];
        this.status = STATUS.RUNNING;
        this.running = true;

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const r = Math.random();
                if (r < FISH_DENSITY) {
                    this.spawnFish(x, y);
                } else if (r < FISH_DENSITY + SHARK_DENSITY) {
                    this.spawnShark(x, y);
                }
                // else: empty water
            }
        }
    }

    /**
     * Return the four orthogonal neighbor coordinates with toroidal wrapping.
     *
     * @param {number} x - Column of the cell.
     * @param {number} y - Row of the cell.
     * @returns {Array<{x: number, y: number}>} Four neighbor coordinates (N, E, S, W).
     */
    neighbors(x, y) {
        const w = this.width;
        const h = this.height;
        return [
            { x: x, y: (y - 1 + h) % h }, // north
            { x: (x + 1) % w, y: y },     // east
            { x: x, y: (y + 1) % h },     // south
            { x: (x - 1 + w) % w, y: y }  // west
        ];
    }

    /**
     * Return the entity at a grid cell, or null if empty.
     *
     * @param {number} x - Column.
     * @param {number} y - Row.
     * @returns {Entity|null}
     */
    entityAt(x, y) {
        return this.grid[y * this.width + x];
    }

    /**
     * Find a random orthogonal neighbor cell that is empty.
     *
     * @param {number} x - Column.
     * @param {number} y - Row.
     * @returns {{x: number, y: number}|null} A random empty neighbor, or null if none.
     */
    randomEmptyNeighbor(x, y) {
        const candidates = this.neighbors(x, y).filter(
            (n) => this.grid[n.y * this.width + n.x] === null
        );
        if (candidates.length === 0) {
            return null;
        }
        return candidates[Math.floor(Math.random() * candidates.length)];
    }

    /**
     * Find a random orthogonal neighbor cell occupied by a fish.
     *
     * @param {number} x - Column.
     * @param {number} y - Row.
     * @returns {{x: number, y: number}|null} A random fish-occupied neighbor, or null if none.
     */
    randomFishNeighbor(x, y) {
        const candidates = this.neighbors(x, y).filter(
            (n) => this.grid[n.y * this.width + n.x] instanceof Fish
        );
        if (candidates.length === 0) {
            return null;
        }
        return candidates[Math.floor(Math.random() * candidates.length)];
    }

    /**
     * Move an entity to a new cell, clearing its old cell.
     *
     * @param {Entity} entity - The entity to move.
     * @param {number} newX - Target column.
     * @param {number} newY - Target row.
     */
    moveEntity(entity, newX, newY) {
        this.grid[entity.y * this.width + entity.x] = null;
        entity.x = newX;
        entity.y = newY;
        this.grid[newY * this.width + newX] = entity;
    }

    /**
     * Spawn a new fish at a given cell with a fresh ID.
     *
     * @param {number} x - Column.
     * @param {number} y - Row.
     */
    spawnFish(x, y) {
        const fish = new Fish(this.nextId++, x, y, this.chronon);
        this.grid[y * this.width + x] = fish;
        this.entities.set(fish.id, fish);
        this.fishCount++;
    }

    /**
     * Spawn a new shark at a given cell with a fresh ID and initial energy.
     *
     * @param {number} x - Column.
     * @param {number} y - Row.
     */
    spawnShark(x, y) {
        const shark = new Shark(this.nextId++, x, y, this.chronon);
        this.grid[y * this.width + x] = shark;
        this.entities.set(shark.id, shark);
        this.sharkCount++;
    }

    /**
     * Remove an entity from the grid and entity map, updating counts.
     *
     * @param {Entity} entity - The entity to remove.
     */
    removeEntity(entity) {
        this.grid[entity.y * this.width + entity.x] = null;
        this.entities.delete(entity.id);
        if (entity instanceof Fish) {
            this.fishCount--;
        } else if (entity instanceof Shark) {
            this.sharkCount--;
        }
    }

    /**
     * Advance the simulation by one chronon.
     *
     * Snapshots all current entity IDs, shuffles them (Fisher-Yates), and
     * lets each surviving, non-newborn entity act once. Then increments the
     * chronon, samples population history, and checks for extinction.
     */
    step() {
        // Requirement 11: snapshot IDs and shuffle.
        const ids = Array.from(this.entities.keys());
        for (let i = ids.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [ids[i], ids[j]] = [ids[j], ids[i]];
        }

        for (const id of ids) {
            // Requirement 13: skip if dead/eaten before its turn.
            const entity = this.entities.get(id);
            if (entity === undefined) {
                continue;
            }
            // Requirement 12: skip newborns born this chronon.
            if (entity.birthChronon === this.chronon) {
                continue;
            }
            entity.act(this.grid, this);
        }

        this.chronon++;
        this.sampleHistory();
        this.checkExtinction();
    }

    /**
     * Record a population sample, trimming to the rolling window.
     */
    sampleHistory() {
        this.history.push({ fish: this.fishCount, sharks: this.sharkCount });
        if (this.history.length > HISTORY_WINDOW) {
            this.history.shift();
        }
    }

    /**
     * Check for extinction and set the terminal status if needed.
     *
     * Requirements 37-40: auto-pause and set status on extinction.
     */
    checkExtinction() {
        if (this.fishCount === 0 && this.sharkCount === 0) {
            this.status = STATUS.ECOSYSTEM_COLLAPSED;
            this.running = false;
        } else if (this.sharkCount === 0) {
            this.status = STATUS.SHARKS_EXTINCT;
            this.running = false;
        } else if (this.fishCount === 0) {
            this.status = STATUS.FISH_EXTINCT;
            this.running = false;
        }
    }

    /**
     * Reset the simulation to a fresh random world.
     *
     * Requirement 36: create new random world, chronon 0, clear status and
     * history, resume running at the selected speed (running flag set true;
     * the scene preserves the selected speed).
     */
    reset() {
        this.init();
    }

    /**
     * Whether the simulation is in a terminal (extinct) state.
     *
     * @returns {boolean}
     */
    isTerminal() {
        return (
            this.status === STATUS.SHARKS_EXTINCT ||
            this.status === STATUS.FISH_EXTINCT ||
            this.status === STATUS.ECOSYSTEM_COLLAPSED
        );
    }
}
