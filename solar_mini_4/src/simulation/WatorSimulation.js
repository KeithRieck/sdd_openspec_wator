/**
 * WatorSimulation - Orchestrates the Wa-Tor predator-prey simulation.
 * R1: Simulation engine independence
 * R6: Simultaneous chronon updates
 * R7: Single RNG for all random choices
 * R10: Extinction and terminal states
 * R11: Population statistics
 */
import {
    GRID_WIDTH,
    GRID_HEIGHT,
    FISH_DENSITY,
    SHARK_DENSITY,
    FISH_BREED_TIME,
    SHARK_BREED_TIME,
    INITIAL_SHARK_ENERGY,
    SHARK_ENERGY_GAIN,
    SHARK_ENERGY_COST_PER_CHRONON,
    DEFAULT_SPEED,
    STATUS_RUNNING,
    STATUS_PAUSED,
    STATUS_SHARKS_EXTINCT,
    STATUS_FISH_EXTINCT,
    STATUS_ECOSYSTEM_COLLAPSED
} from '../config.js';
import Grid from './Grid.js';
import RandomGenerator from './RandomGenerator.js';
import Fish from './Fish.js';
import Shark from './Shark.js';

export default class WatorSimulation {
    /**
     * Create a WatorSimulation.
     * @param {Object} config - Configuration object
     */
    constructor(config = {}) {
        this.width = config.width || GRID_WIDTH;
        this.height = config.height || GRID_HEIGHT;
        this.fishDensity = config.fishDensity || FISH_DENSITY;
        this.sharkDensity = config.sharkDensity || SHARK_DENSITY;
        this.fishBreedTime = config.fishBreedTime || FISH_BREED_TIME;
        this.sharkBreedTime = config.sharkBreedTime || SHARK_BREED_TIME;
        this.initialSharkEnergy = config.initialSharkEnergy || INITIAL_SHARK_ENERGY;
        this.sharkEnergyGain = config.sharkEnergyGain || SHARK_ENERGY_GAIN;
        this.sharkEnergyCostPerChronon = config.sharkEnergyCostPerChronon || SHARK_ENERGY_COST_PER_CHRONON;
        this.speed = config.speed || DEFAULT_SPEED;

        this.chronon = 0;
        this.entities = [];
        this.historyFish = [];
        this.historySharks = [];
        this.running = false;
        this.paused = false;
        this.terminal = false;
        this.status = STATUS_RUNNING;

        this.grid = new Grid(this.width, this.height);
        this.rng = new RandomGenerator();
    }

    /**
     * Initialize the simulation with a random world.
     */
    initialize() {
        this.chronon = 0;
        this.entities = [];
        this.historyFish = [];
        this.historySharks = [];
        this.terminal = false;
        this.status = STATUS_RUNNING;

        // Clear grid
        this.grid.cells.fill(null);
        this.grid.entities = [];
        this.grid.nextId = 0;

        // Calculate number of fish and sharks
        const totalCells = this.width * this.height;
        const numFish = Math.floor(totalCells * this.fishDensity);
        const numSharks = Math.floor(totalCells * this.sharkDensity);

        // Create fish
        for (let i = 0; i < numFish; i++) {
            this._createRandomFish();
        }

        // Create sharks
        for (let i = 0; i < numSharks; i++) {
            this._createRandomShark();
        }

        // Shuffle entities for turn order
        this.rng.shuffle(this.entities);
    }

    /**
     * Create a random fish.
     * @returns {Fish} New fish
     */
    _createRandomFish() {
        const x = this.rng.nextInt(0, this.width);
        const y = this.rng.nextInt(0, this.height);

        // Check if cell is empty
        if (this.grid.isEmpty(x, y)) {
            const fish = this.grid.createFish(x, y);
            fish.breedTime = this.fishBreedTime;
            fish.setGrid(this.grid);
            this.entities.push(fish);
            return fish;
        }

        // Cell occupied, try again
        return this._createRandomFish();
    }

    /**
     * Create a random shark.
     * @returns {Shark} New shark
     */
    _createRandomShark() {
        const x = this.rng.nextInt(0, this.width);
        const y = this.rng.nextInt(0, this.height);

        // Check if cell is empty
        if (this.grid.isEmpty(x, y)) {
            const shark = this.grid.createShark(x, y);
            shark.breedTime = this.sharkBreedTime;
            shark.setGrid(this.grid);
            this.entities.push(shark);
            return shark;
        }

        // Cell occupied, try again
        return this._createRandomShark();
    }

    /**
     * Advance the simulation by one chronon.
     */
    step() {
        if (this.terminal || this.entities.length === 0) {
            return;
        }

        // Collect current entity IDs
        const entityIds = this.entities.map((e) => e.id);

        // Randomize turn order
        this.rng.shuffle(entityIds);

        // Collection phase: compute actions
        const actions = [];

        for (const id of entityIds) {
            const entity = this.entities.find((e) => e.id === id);

            if (!entity || !entity.isAlive) {
                continue;
            }

            // Check if born this chronon
            if (entity._bornThisChronon) {
                continue;
            }

            // Compute action
            const action = this._computeAction(entity);
            actions.push({ entity, action });
        }

        // Application phase: apply all actions simultaneously
        for (const { entity, action } of actions) {
            if (action === 'move') {
                // Move already applied during computation
            } else if (action === 'eat') {
                // Fish already removed
            } else if (action === 'reproduce') {
                // Newborn already added
            } else if (action === 'die') {
                entity.isAlive = false;
            }
        }

        // Clean up dead entities
        this.entities = this.entities.filter((e) => e.isAlive);

        // Update grid consistency
        this.grid.entities = {};
        this.grid.cells.fill(null);
        for (const entity of this.entities) {
            this.grid.setEntity(entity);
        }

        this.chronon++;
        this.recordHistory();
        this.checkExtinction();
    }

    /**
     * Compute the action for an entity.
     * @param {Entity} entity - Entity to compute action for
     * @returns {string} Action: 'move', 'eat', 'reproduce', 'die', or 'none'
     */
    _computeAction(entity) {
        if (entity instanceof Fish) {
            return this._computeFishAction(entity);
        } else if (entity instanceof Shark) {
            return this._computeSharkAction(entity);
        }
        return 'none';
    }

    /**
     * Compute the action for a fish.
     * @param {Fish} fish - Fish entity
     * @returns {string} Action
     */
    _computeFishAction(fish) {
        const emptyNeighbors = this.grid.getEmptyNeighbors(fish.x, fish.y);

        if (emptyNeighbors.length === 0) {
            // No free squares, continue aging breed timer
            fish.breedTimer++;
            return 'none';
        }

        // Move to a random empty neighbor
        const target = this.grid.getRandomEmptyNeighbor(fish.x, fish.y);

        // Check if breeding ready
        const wasBreedingReady = fish.isBreedingReady();

        // Move entity
        this.grid.moveEntity(fish, target.x, target.y);

        if (wasBreedingReady) {
            // Leave a new fish in old position and reset breed timer
            this.grid.createFish(fish.x, fish.y);
            fish.resetBreedAge();
            return 'reproduce';
        } else {
            fish.breedTimer++;
            return 'move';
        }
    }

    /**
     * Compute the action for a shark.
     * @param {Shark} shark - Shark entity
     * @returns {string} Action
     */
    _computeSharkAction(shark) {
        // Decrement energy first
        shark.energy -= shark.sharkEnergyCostPerChronon;

        if (shark.energy <= 0) {
            // Starvation - remove immediately
            return 'die';
        }

        // Check for adjacent fish
        const fishNeighbors = this.grid.getFishNeighbors(shark.x, shark.y);

        if (fishNeighbors.length > 0) {
            // Move to a random adjacent fish cell and eat
            const target = this.grid.getRandomFishNeighbor(shark.x, shark.y);
            this.grid.moveEntity(shark, target.x, target.y);
            shark.energy += shark.sharkEnergyGain;

            // Eating counts as successful move for breeding
            const wasBreedingReady = shark.isBreedingReady();
            if (wasBreedingReady) {
                shark.resetBreedAge();
                this.grid.createShark(shark.x, shark.y);
                return 'eat';
            }
            return 'eat';
        }

        // No adjacent fish - move to random empty cell
        const emptyNeighbors = this.grid.getEmptyNeighbors(shark.x, shark.y);

        if (emptyNeighbors.length === 0) {
            // No free squares, continue aging breed timer
            shark.breedTimer++;
            return 'none';
        }

        const target = this.grid.getRandomEmptyNeighbor(shark.x, shark.y);
        this.grid.moveEntity(shark, target.x, target.y);

        // Check if breeding ready and successfully moved
        const wasBreedingReady = shark.isBreedingReady();

        if (wasBreedingReady) {
            shark.resetBreedAge();
            return 'reproduce';
        } else {
            shark.breedTimer++;
            return 'move';
        }
    }

    /**
     * Record population history.
     */
    recordHistory() {
        const fishCount = this.entities.filter((e) => e instanceof Fish).length;
        const sharkCount = this.entities.filter((e) => e instanceof Shark).length;

        this.historyFish.push(fishCount);
        this.historySharks.push(sharkCount);

        // Rolling window of 500
        if (this.historyFish.length > 500) {
            this.historyFish.shift();
            this.historySharks.shift();
        }
    }

    /**
     * Check for extinction.
     */
    checkExtinction() {
        const fishCount = this.entities.filter((e) => e instanceof Fish).length;
        const sharkCount = this.entities.filter((e) => e instanceof Shark).length;

        if (fishCount === 0 && sharkCount === 0) {
            this.terminal = true;
            this.status = STATUS_ECOSYSTEM_COLLAPSED;
        } else if (fishCount === 0) {
            this.terminal = true;
            this.status = STATUS_FISH_EXTINCT;
        } else if (sharkCount === 0) {
            this.terminal = true;
            this.status = STATUS_SHARKS_EXTINCT;
        }
    }

    /**
     * Get all alive entities.
     * @returns {Array<Entity>} Alive entities
     */
    getAliveEntities() {
        return this.entities.filter((e) => e.isAlive);
    }

    /**
     * Reset the simulation.
     */
    reset() {
        this.initialize();
        this.running = true;
        this.paused = false;
        this.terminal = false;
        this.status = STATUS_RUNNING;
    }

    /**
     * Get fish count.
     * @returns {number} Number of fish
     */
    getFishCount() {
        return this.entities.filter((e) => e instanceof Fish).length;
    }

    /**
     * Get shark count.
     * @returns {number} Number of sharks
     */
    getSharkCount() {
        return this.entities.filter((e) => e instanceof Shark).length;
    }

    /**
     * Get chronon count.
     * @returns {number} Chronon
     */
    getChronon() {
        return this.chronon;
    }
}
