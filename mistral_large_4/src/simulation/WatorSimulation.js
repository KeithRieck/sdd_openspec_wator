/**
 * Core Wa-Tor simulation engine.
 *
 * This class implements the complete Wa-Tor predator-prey cellular automaton
 * on a toroidal grid. It is completely independent of Phaser and any rendering
 * framework, as required by PRD #4.
 *
 * The simulation uses:
 * - A flat grid array with one slot per cell (entity ID or null)
 * - A Map of entity ID to entity objects (Fish and Shark instances)
 * - A single RandomNumberGenerator for all random choices
 * - Discrete time steps called "chronons"
 *
 * @see prd-v001.md requirements #4, #6-27, #45
 */
import { Config } from '../config.js';
import { RandomNumberGenerator } from './RandomNumberGenerator.js';
import { Fish } from './Fish.js';
import { Shark } from './Shark.js';

/**
 * Wa-Tor simulation engine.
 * Manages the toroidal grid, entities, and chronon-based time progression.
 */
export class WatorSimulation {
    /**
     * Create a new Wa-Tor simulation.
     * @param {object} [config] - Optional configuration overrides
     * @param {number} [config.gridWidth] - Grid width (default: Config.GRID_WIDTH)
     * @param {number} [config.gridHeight] - Grid height (default: Config.GRID_HEIGHT)
     * @param {number} [config.fishDensity] - Initial fish density (default: Config.FISH_DENSITY)
     * @param {number} [config.sharkDensity] - Initial shark density (default: Config.SHARK_DENSITY)
     * @param {number} [config.fishBreedTime] - Fish breeding time (default: Config.FISH_BREED_TIME)
     * @param {number} [config.sharkBreedTime] - Shark breeding time (default: Config.SHARK_BREED_TIME)
     * @param {number} [config.initialSharkEnergy] - Initial shark energy (default: Config.INITIAL_SHARK_ENERGY)
     * @param {number} [config.sharkEnergyGain] - Energy gain from eating (default: Config.SHARK_ENERGY_GAIN)
     * @param {number} [config.sharkEnergyCostPerChronon] - Energy cost per chronon (default: Config.SHARK_ENERGY_COST_PER_CHRONON)
     */
    constructor(config = {}) {
        // Grid dimensions (PRD #6)
        /** @type {number} Grid width in cells */
        this.width = config.gridWidth ?? Config.GRID_WIDTH;

        /** @type {number} Grid height in cells */
        this.height = config.gridHeight ?? Config.GRID_HEIGHT;

        // Population densities (PRD #7)
        /** @type {number} Initial fish density */
        this.fishDensity = config.fishDensity ?? Config.FISH_DENSITY;

        /** @type {number} Initial shark density */
        this.sharkDensity = config.sharkDensity ?? Config.SHARK_DENSITY;

        // Breeding times (PRD #15, #23)
        /** @type {number} Fish breeding time in chronons */
        this.fishBreedTime = config.fishBreedTime ?? Config.FISH_BREED_TIME;

        /** @type {number} Shark breeding time in chronons */
        this.sharkBreedTime = config.sharkBreedTime ?? Config.SHARK_BREED_TIME;

        // Shark energy (PRD #18-24)
        /** @type {number} Initial shark energy */
        this.initialSharkEnergy = config.initialSharkEnergy ?? Config.INITIAL_SHARK_ENERGY;

        /** @type {number} Energy gained when eating a fish */
        this.sharkEnergyGain = config.sharkEnergyGain ?? Config.SHARK_ENERGY_GAIN;

        /** @type {number} Energy cost per chronon */
        this.sharkEnergyCostPerChronon = config.sharkEnergyCostPerChronon ?? Config.SHARK_ENERGY_COST_PER_CHRONON;

        // Simulation state
        /** @type {Array<number|null>} Flat grid array - entity ID or null per cell */
        this.grid = new Array(this.width * this.height).fill(null);

        /** @type {Map<number, import('./Entity.js').Entity>} Map of entity ID to entity */
        this.entities = new Map();

        /** @type {RandomNumberGenerator} Single RNG for all random choices (PRD #61) */
        this.rng = new RandomNumberGenerator();

        /** @type {number} Current chronon count */
        this.chronon = 0;

        /** @type {number} Next entity ID to assign */
        this.nextEntityId = 1;

        /** @type {number} Current fish count */
        this.fishCount = 0;

        /** @type {number} Current shark count */
        this.sharkCount = 0;

        /** @type {string} Simulation status: 'Running', 'Paused', or terminal status */
        this.status = 'Running';

        /** @type {boolean} True if simulation has reached a terminal state */
        this.isTerminal = false;

        /** @type {Array<{chronon: number, fish: number, sharks: number}>} Population history */
        this.history = [];

        /** @type {number} Maximum history samples (PRD #45) */
        this.historyWindowSize = Config.HISTORY_WINDOW_SIZE;

        // Initialize the world
        this.initializeWorld();
    }

    /**
     * Initialize the world with random fish and shark populations.
     * @private
     */
    initializeWorld() {
        const totalCells = this.width * this.height;
        const targetFish = Math.floor(totalCells * this.fishDensity);
        const targetSharks = Math.floor(totalCells * this.sharkDensity);

        // Create all positions and shuffle them
        const positions = Array.from({ length: totalCells }, (_, i) => i);
        this.rng.shuffle(positions);

        let posIndex = 0;

        // Place fish
        for (let i = 0; i < targetFish; i++) {
            this.createFish(positions[posIndex++]);
        }

        // Place sharks
        for (let i = 0; i < targetSharks; i++) {
            this.createShark(positions[posIndex++]);
        }

        // Record initial population
        this.recordHistory();
    }

    /**
     * Advance the simulation by one chronon.
     *
     * Process (PRD #11-13):
     * 1. Collect all living entity IDs
     * 2. Shuffle them randomly using the single RNG
     * 3. Process each entity in order:
     *    - Skip if dead/eaten
     *    - Skip if born this chronon
     *    - Otherwise, let the entity act
     * 4. Record population history
     * 5. Check for extinction
     */
    step() {
        if (this.isTerminal) {
            return;
        }

        // Clear born flags from previous chronon
        for (const entity of this.entities.values()) {
            entity.clearBornFlag();
        }

        // Collect living entity IDs (PRD #11)
        const livingIds = [];
        for (const [id, entity] of this.entities) {
            if (entity.isAlive) {
                livingIds.push(id);
            }
        }

        // Shuffle turn order (PRD #11)
        this.rng.shuffle(livingIds);

        // Process each entity (PRD #12-13)
        for (const id of livingIds) {
            const entity = this.entities.get(id);

            // Skip if dead/eaten before turn (PRD #13)
            if (!entity || !entity.isAlive) {
                continue;
            }

            // Skip if born this chronon (PRD #12)
            if (entity.bornThisChronon) {
                continue;
            }

            // Let the entity act
            entity.act(this.grid, this.entities, this.rng, this);
        }

        // Increment chronon
        this.chronon++;

        // Record population history (PRD #45)
        this.recordHistory();

        // Check for extinction (PRD #37-40)
        this.checkExtinction();
    }

    /**
     * Reset the simulation to a new random world.
     * (PRD #36)
     */
    reset() {
        // Clear existing state
        this.grid = new Array(this.width * this.height).fill(null);
        this.entities.clear();
        this.chronon = 0;
        this.nextEntityId = 1;
        this.fishCount = 0;
        this.sharkCount = 0;
        this.status = 'Running';
        this.isTerminal = false;
        this.history = [];

        // Initialize new world
        this.initializeWorld();
    }

    /**
     * Get the four orthogonal neighbor positions with toroidal wrapping.
     * (PRD #10)
     * @param {number} position - Flat grid index
     * @returns {number[]} Array of 4 neighbor positions (N, E, S, W)
     */
    getNeighbors(position) {
        const x = position % this.width;
        const y = Math.floor(position / this.width);

        // Calculate wrapped coordinates
        const north = ((y - 1 + this.height) % this.height) * this.width + x;
        const east = y * this.width + ((x + 1) % this.width);
        const south = ((y + 1) % this.height) * this.width + x;
        const west = y * this.width + ((x - 1 + this.width) % this.width);

        return [north, east, south, west];
    }

    /**
     * Get positions of adjacent empty cells.
     * @param {number} position - Flat grid index
     * @returns {number[]} Array of empty neighbor positions
     */
    getEmptyNeighbors(position) {
        return this.getNeighbors(position).filter(pos => this.grid[pos] === null);
    }

    /**
     * Get positions of adjacent cells containing fish.
     * @param {number} position - Flat grid index
     * @returns {number[]} Array of neighbor positions containing fish
     */
    getFishNeighbors(position) {
        return this.getNeighbors(position).filter(pos => {
            const entityId = this.grid[pos];
            if (entityId === null) return false;
            const entity = this.entities.get(entityId);
            return entity && entity.type === 'fish' && entity.isAlive;
        });
    }

    /**
     * Move an entity to a new position, updating grid and entity state.
     * (PRD #27c - grid/entity consistency)
     * @param {import('./Entity.js').Entity} entity - Entity to move
     * @param {number} newPosition - Target flat grid index
     */
    moveEntity(entity, newPosition) {
        // Clear old position
        this.grid[entity.position] = null;

        // Set new position
        entity.position = newPosition;
        this.grid[newPosition] = entity.id;
    }

    /**
     * Create a new fish at the specified position.
     * @param {number} position - Flat grid index
     * @returns {Fish} The created fish
     */
    createFish(position) {
        const id = this.nextEntityId++;
        const fish = new Fish(id, position, this.fishBreedTime);
        fish.markBorn();

        this.entities.set(id, fish);
        this.grid[position] = id;
        this.fishCount++;

        return fish;
    }

    /**
     * Create a new shark at the specified position.
     * (PRD #24 - newborn sharks get initial energy)
     * @param {number} position - Flat grid index
     * @returns {Shark} The created shark
     */
    createShark(position) {
        const id = this.nextEntityId++;
        const shark = new Shark(
            id,
            position,
            this.sharkBreedTime,
            this.initialSharkEnergy,
            this.sharkEnergyGain,
            this.sharkEnergyCostPerChronon
        );
        shark.markBorn();

        this.entities.set(id, shark);
        this.grid[position] = id;
        this.sharkCount++;

        return shark;
    }

    /**
     * Remove an entity from the simulation (death or being eaten).
     * @param {import('./Entity.js').Entity} entity - Entity to remove
     */
    removeEntity(entity) {
        if (!entity || !entity.isAlive) {
            return;
        }

        // Mark as dead
        entity.die();

        // Clear grid cell
        if (this.grid[entity.position] === entity.id) {
            this.grid[entity.position] = null;
        }

        // Update counts
        if (entity.type === 'fish') {
            this.fishCount--;
        } else if (entity.type === 'shark') {
            this.sharkCount--;
        }

        // Remove from entities map
        this.entities.delete(entity.id);
    }

    /**
     * Get current simulation statistics.
     * (PRD #30, #41-43)
     * @returns {{chronon: number, fish: number, sharks: number, status: string, isTerminal: boolean}}
     */
    getStats() {
        return {
            chronon: this.chronon,
            fish: this.fishCount,
            sharks: this.sharkCount,
            status: this.status,
            isTerminal: this.isTerminal
        };
    }

    /**
     * Get the population history for charting.
     * (PRD #44-45)
     * @returns {Array<{chronon: number, fish: number, sharks: number}>}
     */
    getHistory() {
        return this.history;
    }

    /**
     * Record current population in history with rolling window.
     * (PRD #45)
     * @private
     */
    recordHistory() {
        this.history.push({
            chronon: this.chronon,
            fish: this.fishCount,
            sharks: this.sharkCount
        });

        // Maintain rolling window (PRD #45)
        if (this.history.length > this.historyWindowSize) {
            this.history.shift();
        }
    }

    /**
     * Check for extinction conditions and set terminal status.
     * (PRD #37-40)
     * @private
     */
    checkExtinction() {
        if (this.fishCount === 0 && this.sharkCount === 0) {
            // Both extinct (PRD #40)
            this.status = 'Ecosystem collapsed';
            this.isTerminal = true;
        } else if (this.sharkCount === 0) {
            // Sharks extinct (PRD #38)
            this.status = 'Sharks extinct';
            this.isTerminal = true;
        } else if (this.fishCount === 0) {
            // Fish extinct (PRD #39)
            this.status = 'Fish extinct';
            this.isTerminal = true;
        }
    }

    /**
     * Get all living entities for rendering.
     * @returns {Array<import('./Entity.js').Entity>} Array of living entities
     */
    getLivingEntities() {
        return Array.from(this.entities.values()).filter(e => e.isAlive);
    }

    /**
     * Get the grid dimensions.
     * @returns {{width: number, height: number}} Grid dimensions
     */
    getDimensions() {
        return { width: this.width, height: this.height };
    }
}

export default WatorSimulation;
