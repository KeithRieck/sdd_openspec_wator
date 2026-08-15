/**
 * Main simulation engine for the Wa-Tor predator-prey cellular automaton.
 * Manages the toroidal grid, entity lifecycle, chronon stepping, and population tracking.
 * Framework-independent - no Phaser dependencies.
 * @module simulation/WatorSimulation
 */
import { Fish } from './Fish.js';
import { Shark } from './Shark.js';
import Config from '../config.js';

/**
 * Simulation status enumeration.
 * @readonly
 * @enum {string}
 */
export const SimulationStatus = {
    RUNNING: 'Running',
    PAUSED: 'Paused',
    SHARKS_EXTINCT: 'Sharks extinct',
    FISH_EXTINCT: 'Fish extinct',
    ECOSYSTEM_COLLAPSED: 'Ecosystem collapsed',
};

/**
 * Population history tracker with rolling window.
 */
class PopulationHistory {
    /**
     * Create a new population history tracker.
     * @param {number} maxSamples - Maximum number of samples to retain
     */
    constructor(maxSamples) {
        /** @type {number[]} */
        this._fishHistory = [];
        /** @type {number[]} */
        this._sharkHistory = [];
        /** @type {number} */
        this._maxSamples = maxSamples;
    }

    /**
     * Record a population sample.
     * @param {number} fishCount - Current fish population
     * @param {number} sharkCount - Current shark population
     */
    record(fishCount, sharkCount) {
        this._fishHistory.push(fishCount);
        this._sharkHistory.push(sharkCount);

        // Maintain rolling window
        if (this._fishHistory.length > this._maxSamples) {
            this._fishHistory.shift();
            this._sharkHistory.shift();
        }
    }

    /**
     * Get the fish population history.
     * @returns {number[]} Array of fish counts (oldest first)
     */
    getFishHistory() {
        return [...this._fishHistory];
    }

    /**
     * Get the shark population history.
     * @returns {number[]} Array of shark counts (oldest first)
     */
    getSharkHistory() {
        return [...this._sharkHistory];
    }

    /**
     * Clear all history.
     */
    clear() {
        this._fishHistory = [];
        this._sharkHistory = [];
    }
}

/**
 * Grid interface for entity actions.
 * Provides toroidal neighbor queries and cell manipulation.
 */
class Grid {
    /**
     * Create a new grid.
     * @param {number} width - Grid width in cells
     * @param {number} height - Grid height in cells
     * @param {Uint16Array} data - Flat array storing entity IDs (0 = empty)
     * @param {Map<number, Entity>} entities - Map of entity ID to entity instance
     * @param {Function} getNextEntityId - Function to get next unique entity ID
     */
    constructor(width, height, data, entities, getNextEntityId) {
        this._width = width;
        this._height = height;
        this._data = data;
        this._entities = entities;
        this._getNextEntityId = getNextEntityId;
    }

    /**
     * Get grid width.
     * @returns {number}
     */
    getWidth() {
        return this._width;
    }

    /**
     * Get grid height.
     * @returns {number}
     */
    getHeight() {
        return this._height;
    }

    /**
     * Get the entity at a cell, or null if empty.
     * @param {number} x - Column
     * @param {number} y - Row
     * @returns {Entity|null}
     */
    getCell(x, y) {
        const id = this._data[y * this._width + x];
        return id === 0 ? null : this._entities.get(id) || null;
    }

    /**
     * Set the entity at a cell.
     * @param {number} x - Column
     * @param {number} y - Row
     * @param {Entity|null} entity - Entity to place, or null to clear
     */
    setCell(x, y, entity) {
        const index = y * this._width + x;
        if (entity === null) {
            this._data[index] = 0;
        } else {
            this._data[index] = entity.getId();
            this._entities.set(entity.getId(), entity);
        }
    }

    /**
     * Get the next unique entity ID.
     * @returns {number}
     */
    getNextEntityId() {
        return this._getNextEntityId();
    }

    /**
     * Get empty orthogonal neighbors of a cell (toroidal).
     * @param {number} x - Column
     * @param {number} y - Row
     * @returns {Array<{x: number, y: number}>}
     */
    getEmptyNeighbors(x, y) {
        const neighbors = [];
        const width = this._width;
        const height = this._height;

        // North
        const ny = (y - 1 + height) % height;
        if (this.getCell(x, ny) === null) neighbors.push({ x, y: ny });

        // East
        const ex = (x + 1) % width;
        if (this.getCell(ex, y) === null) neighbors.push({ x: ex, y });

        // South
        const sy = (y + 1) % height;
        if (this.getCell(x, sy) === null) neighbors.push({ x, y: sy });

        // West
        const wx = (x - 1 + width) % width;
        if (this.getCell(wx, y) === null) neighbors.push({ x: wx, y });

        return neighbors;
    }

    /**
     * Get fish orthogonal neighbors of a cell (toroidal).
     * @param {number} x - Column
     * @param {number} y - Row
     * @returns {Array<{x: number, y: number}>}
     */
    getFishNeighbors(x, y) {
        const neighbors = [];
        const width = this._width;
        const height = this._height;

        // North
        const ny = (y - 1 + height) % height;
        const north = this.getCell(x, ny);
        if (north !== null && north.getType() === 'fish') neighbors.push({ x, y: ny });

        // East
        const ex = (x + 1) % width;
        const east = this.getCell(ex, y);
        if (east !== null && east.getType() === 'fish') neighbors.push({ x: ex, y });

        // South
        const sy = (y + 1) % height;
        const south = this.getCell(x, sy);
        if (south !== null && south.getType() === 'fish') neighbors.push({ x, y: sy });

        // West
        const wx = (x - 1 + width) % width;
        const west = this.getCell(wx, y);
        if (west !== null && west.getType() === 'fish') neighbors.push({ x: wx, y });

        return neighbors;
    }
}

/**
 * Main Wa-Tor simulation class.
 * Implements the complete simulation logic including grid management, entity lifecycle,
 * chronon stepping, and extinction detection.
 */
export class WatorSimulation {
    /**
     * Create a new Wa-Tor simulation.
     * @param {Object} config - Configuration object (uses defaults from config.js if not provided)
     */
    constructor(config = Config) {
        this._config = config;
        this._width = config.GRID_WIDTH;
        this._height = config.GRID_HEIGHT;

        // Flat grid array: Uint16Array for memory efficiency, stores entity IDs (0 = empty)
        this._gridData = new Uint16Array(this._width * this._height);

        // Map of entity ID -> Entity instance for O(1) lookup
        this._entities = new Map();

        // Next entity ID counter
        this._nextEntityId = 1;

        // Simulation state
        this._chronon = 0;
        this._fishCount = 0;
        this._sharkCount = 0;
        this._status = SimulationStatus.RUNNING;

        // Population history
        this._history = new PopulationHistory(config.HISTORY_WINDOW);

        // Grid interface for entity actions
        this._grid = new Grid(
            this._width,
            this._height,
            this._gridData,
            this._entities,
            () => this._nextEntityId++
        );
    }

    /**
     * Initialize the simulation with a random world.
     * Populates the grid according to configured densities.
     */
    initialize() {
        // Clear existing state
        this._gridData.fill(0);
        this._entities.clear();
        this._nextEntityId = 1;
        this._chronon = 0;
        this._fishCount = 0;
        this._sharkCount = 0;
        this._status = SimulationStatus.RUNNING;
        this._history.clear();

        const totalCells = this._width * this._height;
        const fishTarget = Math.floor(totalCells * this._config.FISH_DENSITY);
        const sharkTarget = Math.floor(totalCells * this._config.SHARK_DENSITY);

        // Create array of all cell indices and shuffle
        const indices = new Array(totalCells);
        for (let i = 0; i < totalCells; i++) {
            indices[i] = i;
        }

        // Fisher-Yates shuffle
        for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
        }

        // Place fish
        let fishPlaced = 0;
        for (const idx of indices) {
            if (fishPlaced >= fishTarget) break;
            const x = idx % this._width;
            const y = Math.floor(idx / this._width);
            if (this._gridData[idx] === 0) {
                const fish = new Fish(this._nextEntityId++, x, y);
                this._gridData[idx] = fish.getId();
                this._entities.set(fish.getId(), fish);
                fishPlaced++;
            }
        }
        this._fishCount = fishPlaced;

        // Place sharks
        let sharksPlaced = 0;
        for (const idx of indices) {
            if (sharksPlaced >= sharkTarget) break;
            if (this._gridData[idx] === 0) {
                const x = idx % this._width;
                const y = Math.floor(idx / this._width);
                const shark = new Shark(this._nextEntityId++, x, y, this._config.INITIAL_SHARK_ENERGY);
                this._gridData[idx] = shark.getId();
                this._entities.set(shark.getId(), shark);
                sharksPlaced++;
            }
        }
        this._sharkCount = sharksPlaced;

        // Record initial population
        this._history.record(this._fishCount, this._sharkCount);
    }

    /**
     * Advance the simulation by one chronon.
     * Each surviving entity acts once in randomized order.
     * Newborn entities do not act until the next chronon.
     * Dead/eaten entities are skipped.
     */
    step() {
        if (this._status !== SimulationStatus.RUNNING) {
            return;
        }

        // Collect current entity IDs and randomize order
        const entityIds = Array.from(this._entities.keys());
        // Fisher-Yates shuffle
        for (let i = entityIds.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [entityIds[i], entityIds[j]] = [entityIds[j], entityIds[i]];
        }

        // Track newborns this chronon (they don't act until next chronon)
        const newbornIds = new Set();

        // Process each entity in randomized order
        for (const id of entityIds) {
            const entity = this._entities.get(id);
            if (!entity) continue; // Entity was eaten/died earlier this chronon

            // Skip newborns from this chronon
            if (newbornIds.has(id)) continue;

            const result = entity.act(this._grid, this._config);

            if (entity.getType() === 'fish') {
                if (result.moved) {
                    // Position already updated in entity.act()
                }
                if (result.bred && result.newEntity) {
                    newbornIds.add(result.newEntity.getId());
                    this._fishCount++;
                }
            } else if (entity.getType() === 'shark') {
                if (result.died) {
                    // Shark died - remove from grid and entities
                    this._gridData[entity.getY() * this._width + entity.getX()] = 0;
                    this._entities.delete(id);
                    this._sharkCount--;
                } else {
                    if (result.moved) {
                        // Position already updated in entity.act()
                    }
                    if (result.ate && result.eatenFishId !== null) {
                        // Fish was eaten - remove from entities
                        this._entities.delete(result.eatenFishId);
                        this._fishCount--;
                    }
                    if (result.bred && result.newEntity) {
                        newbornIds.add(result.newEntity.getId());
                        this._sharkCount++;
                    }
                }
            }
        }

        // Increment chronon
        this._chronon++;

        // Record population history
        this._history.record(this._fishCount, this._sharkCount);

        // Check extinction conditions
        this._updateStatus();
    }

    /**
     * Update simulation status based on current populations.
     * @private
     */
    _updateStatus() {
        const fishExtinct = this._fishCount === 0;
        const sharkExtinct = this._sharkCount === 0;

        if (fishExtinct && sharkExtinct) {
            this._status = SimulationStatus.ECOSYSTEM_COLLAPSED;
        } else if (sharkExtinct) {
            this._status = SimulationStatus.SHARKS_EXTINCT;
        } else if (fishExtinct) {
            this._status = SimulationStatus.FISH_EXTINCT;
        }
        // Otherwise status remains RUNNING or PAUSED (set externally)
    }

    /**
     * Reset the simulation to a new random world.
     */
    reset() {
        this.initialize();
    }

    /**
     * Set the simulation running state.
     * @param {boolean} running - True to run, false to pause
     */
    setRunning(running) {
        if (this._status === SimulationStatus.RUNNING || this._status === SimulationStatus.PAUSED) {
            this._status = running ? SimulationStatus.RUNNING : SimulationStatus.PAUSED;
        }
        // Terminal states cannot be changed to running (require reset)
    }

    /**
     * Get the flat grid data array (entity IDs, 0 = empty).
     * @returns {Uint16Array}
     */
    getGridData() {
        return this._gridData;
    }

    /**
     * Get the entities map.
     * @returns {Map<number, Entity>}
     */
    getEntities() {
        return this._entities;
    }

    /**
     * Get grid width.
     * @returns {number}
     */
    getWidth() {
        return this._width;
    }

    /**
     * Get grid height.
     * @returns {number}
     */
    getHeight() {
        return this._height;
    }

    /**
     * Get current chronon number.
     * @returns {number}
     */
    getChronon() {
        return this._chronon;
    }

    /**
     * Get current fish population.
     * @returns {number}
     */
    getFishCount() {
        return this._fishCount;
    }

    /**
     * Get current shark population.
     * @returns {number}
     */
    getSharkCount() {
        return this._sharkCount;
    }

    /**
     * Get current simulation status.
     * @returns {string}
     */
    getStatus() {
        return this._status;
    }

    /**
     * Get population history.
     * @returns {PopulationHistory}
     */
    getHistory() {
        return this._history;
    }

    /**
     * Get the configuration object.
     * @returns {Object}
     */
    getConfig() {
        return this._config;
    }
}