/**
 * Wa-Tor Simulation Engine.
 * Framework-independent cellular automaton simulation for predator-prey dynamics.
 * Manages the grid, entities, and chronon processing according to Wa-Tor rules.
 */
import { Fish } from './Fish.js';
import { Shark } from './Shark.js';
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
    HISTORY_LENGTH
} from '../config.js';

/**
 * Wa-Tor Simulation class.
 * Handles grid management, entity processing, and chronon advancement.
 */
export class WatorSimulation {
    /**
     * Creates a new Wa-Tor simulation.
     * @param {number} width - Width of the grid (defaults to GRID_WIDTH)
     * @param {number} height - Height of the grid (defaults to GRID_HEIGHT)
     */
    constructor(width = GRID_WIDTH, height = GRID_HEIGHT) {
        this.width = width;
        this.height = height;
        this.grid = new Array(width * height).fill(null);
        this.entities = new Map();
        this.chronon = 0;
        this.fishCount = 0;
        this.sharkCount = 0;
        this.history = [];
        this.extinctStatus = null;
        this.nextId = 0;

        this.initialize();
    }

    /**
     * Initializes the simulation with random fish and shark populations.
     */
    initialize() {
        this.clear();
        this.populateGrid();
    }

    /**
     * Clears the grid and entity storage.
     */
    clear() {
        this.grid.fill(null);
        this.entities.clear();
        this.chronon = 0;
        this.fishCount = 0;
        this.sharkCount = 0;
        this.history = [];
        this.extinctStatus = null;
        this.nextId = 0;
    }

    /**
     * Populates the grid with fish and sharks based on density constants.
     */
    populateGrid() {
        const totalCells = this.width * this.height;
        const fishCells = Math.floor(totalCells * FISH_DENSITY);
        const sharkCells = Math.floor(totalCells * SHARK_DENSITY);

        // Create array of all possible positions
        const positions = [];
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                positions.push({ x, y });
            }
        }

        // Shuffle positions
        this.shuffleArray(positions);

        // Place fish
        for (let i = 0; i < fishCells && i < positions.length; i++) {
            const { x, y } = positions[i];
            if (this.grid[this.getIndex(x, y)] === null) {
                this.addFish(x, y);
            }
        }

        // Place sharks (skip positions already taken by fish)
        let placedSharks = 0;
        for (let i = 0; i < positions.length && placedSharks < sharkCells; i++) {
            const { x, y } = positions[i];
            if (this.grid[this.getIndex(x, y)] === null) {
                this.addShark(x, y);
                placedSharks++;
            }
        }
    }

    /**
     * Advances the simulation by one chronon.
     * Processes all entities in random order, handling movement, eating, breeding, and death.
     */
    step() {
        // Track entities that die or are born this chronon
        const deadSet = new Set();
        const newbornSet = new Set();

        // Collect all entity IDs and shuffle
        const entityIds = Array.from(this.entities.keys());
        this.shuffleArray(entityIds);

        // Process each entity
        for (const entityId of entityIds) {
            // Skip if already dead or newborn this chronon
            if (deadSet.has(entityId) || newbornSet.has(entityId)) {
                continue;
            }

            const entity = this.entities.get(entityId);
            if (!entity) {
                continue;
            }

            if (entity.type === 'fish') {
                this.processFish(entity, deadSet, newbornSet);
            } else if (entity.type === 'shark') {
                this.processShark(entity, deadSet, newbornSet);
            }
        }

        // Remove dead entities from grid and map
        for (const entityId of deadSet) {
            this.removeEntityCompletely(entityId);
        }

        // Add newborns to grid and map
        for (const entityId of newbornSet) {
            const entity = this.entities.get(entityId);
            if (entity) {
                this.grid[this.getIndex(entity.x, entity.y)] = entityId;
            }
        }

        // Update counts and history
        this.updateCounts();
        this.recordHistory();
        this.checkExtinction();

        this.chronon++;
    }

    /**
     * Processes a fish entity's turn.
     * @param {Fish} fish - The fish entity to process
     * @param {Set} deadSet - Set of entity IDs that have died this chronon
     * @param {Set} newbornSet - Set of entity IDs born this chronon
     */
    processFish(fish, deadSet, newbornSet) {
        const emptyNeighbors = this.getEmptyNeighbors(fish.x, fish.y);

        if (emptyNeighbors.length > 0) {
            // Fish can move - pick random empty neighbor
            const { x, y } = this.chooseRandom(emptyNeighbors);
            const oldIndex = this.getIndex(fish.x, fish.y);

            // Move fish
            fish.x = x;
            fish.y = y;
            this.grid[oldIndex] = null;
            this.grid[this.getIndex(x, y)] = fish.id;

            // Check breeding
            if (fish.isBreedingReady()) {
                // Create newborn in old position
                const newborn = this.createNewborn(fish, fish.x, fish.y);
                newbornSet.add(newborn.id);
                fish.resetBreedAge();
            } else {
                fish.age();
            }
        } else {
            // Fish cannot move
            if (fish.isBreedingReady()) {
                fish.resetBreedAge();
            } else {
                fish.age();
            }
        }
    }

    /**
     * Processes a shark entity's turn.
     * @param {Shark} shark - The shark entity to process
     * @param {Set} deadSet - Set of entity IDs that have died this chronon
     * @param {Set} newbornSet - Set of entity IDs born this chronon
     */
    processShark(shark, deadSet, newbornSet) {
        // Decrement energy first
        const isAlive = shark.decrementEnergy();

        if (!isAlive) {
            // Shark dies
            deadSet.add(shark.id);
            return;
        }

        // Find adjacent fish
        const fishNeighbors = this.getFishNeighbors(shark.x, shark.y);

        if (fishNeighbors.length > 0) {
            // Eat a random fish
            const fishPos = this.chooseRandom(fishNeighbors);
            const fishId = this.grid[this.getIndex(fishPos.x, fishPos.y)];

            // Remove fish immediately
            deadSet.add(fishId);
            this.removeEntityCompletely(fishId);

            // Move shark to fish's position
            const oldIndex = this.getIndex(shark.x, shark.y);
            shark.x = fishPos.x;
            shark.y = fishPos.y;
            this.grid[oldIndex] = null;
            this.grid[this.getIndex(fishPos.x, fishPos.y)] = shark.id;

            // Gain energy from eating
            shark.eatFish();

            // Check breeding
            if (shark.isBreedingReady()) {
                const newborn = this.createNewborn(shark, shark.x, shark.y);
                newbornSet.add(newborn.id);
                shark.resetBreedAge();
            } else {
                shark.age();
            }
        } else {
            // No fish adjacent, try to move to empty cell
            const emptyNeighbors = this.getEmptyNeighbors(shark.x, shark.y);

            if (emptyNeighbors.length > 0) {
                const { x, y } = this.chooseRandom(emptyNeighbors);
                const oldIndex = this.getIndex(shark.x, shark.y);

                shark.x = x;
                shark.y = y;
                this.grid[oldIndex] = null;
                this.grid[this.getIndex(x, y)] = shark.id;

                // Check breeding
                if (shark.isBreedingReady()) {
                    const newborn = this.createNewborn(shark, shark.x, shark.y);
                    newbornSet.add(newborn.id);
                    shark.resetBreedAge();
                } else {
                    shark.age();
                }
            } else {
                // Shark cannot move
                if (shark.isBreedingReady()) {
                    shark.resetBreedAge();
                } else {
                    shark.age();
                }
            }
        }
    }

    /**
     * Creates a newborn entity of the same type as the parent.
     * @param {Entity} parent - The parent entity
     * @param {number} x - X coordinate for the newborn
     * @param {number} y - Y coordinate for the newborn
     * @returns {Entity} The newborn entity
     */
    createNewborn(parent, x, y) {
        const newId = `entity-${this.nextId++}`;
        let newborn;

        if (parent.type === 'fish') {
            newborn = new Fish(newId, x, y);
        } else if (parent.type === 'shark') {
            newborn = new Shark(newId, x, y, INITIAL_SHARK_ENERGY);
        }

        this.entities.set(newId, newborn);
        return newborn;
    }

    /**
     * Adds a fish entity to the simulation.
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {Fish} The created fish
     */
    addFish(x, y) {
        const fish = new Fish(`entity-${this.nextId++}`, x, y);
        this.entities.set(fish.id, fish);
        this.grid[this.getIndex(x, y)] = fish.id;
        this.fishCount++;
        return fish;
    }

    /**
     * Adds a shark entity to the simulation.
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {Shark} The created shark
     */
    addShark(x, y) {
        const shark = new Shark(`entity-${this.nextId++}`, x, y, INITIAL_SHARK_ENERGY);
        this.entities.set(shark.id, shark);
        this.grid[this.getIndex(x, y)] = shark.id;
        this.sharkCount++;
        return shark;
    }

    /**
     * Removes an entity completely from the simulation.
     * @param {string} entityId - The ID of the entity to remove
     */
    removeEntityCompletely(entityId) {
        const entity = this.entities.get(entityId);
        if (!entity) return;

        const index = this.getIndex(entity.x, entity.y);
        if (this.grid[index] === entityId) {
            this.grid[index] = null;
        }

        this.entities.delete(entityId);

        if (entity.type === 'fish') {
            this.fishCount--;
        } else if (entity.type === 'shark') {
            this.sharkCount--;
        }
    }

    /**
     * Gets the flat array index for a grid position.
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {number} Flat array index
     */
    getIndex(x, y) {
        return y * this.width + x;
    }

    /**
     * Wraps a coordinate for toroidal grid.
     * @param {number} coord - The coordinate to wrap
     * @param {number} max - The maximum value (width or height)
     * @returns {number} The wrapped coordinate
     */
    wrap(coord, max) {
        return (coord + max) % max;
    }

    /**
     * Gets all empty neighboring cells for a position.
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {Array<{x: number, y: number}>} Array of empty neighbor positions
     */
    getEmptyNeighbors(x, y) {
        const neighbors = [];
        const directions = [
            { dx: 0, dy: -1 }, // North
            { dx: 1, dy: 0 },  // East
            { dx: 0, dy: 1 },  // South
            { dx: -1, dy: 0 }  // West
        ];

        for (const { dx, dy } of directions) {
            const nx = this.wrap(x + dx, this.width);
            const ny = this.wrap(y + dy, this.height);
            const index = this.getIndex(nx, ny);

            if (this.grid[index] === null) {
                neighbors.push({ x: nx, y: ny });
            }
        }

        return neighbors;
    }

    /**
     * Gets all neighboring cells that contain fish.
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {Array<{x: number, y: number}>} Array of neighbor positions with fish
     */
    getFishNeighbors(x, y) {
        const neighbors = [];
        const directions = [
            { dx: 0, dy: -1 }, // North
            { dx: 1, dy: 0 },  // East
            { dx: 0, dy: 1 },  // South
            { dx: -1, dy: 0 }  // West
        ];

        for (const { dx, dy } of directions) {
            const nx = this.wrap(x + dx, this.width);
            const ny = this.wrap(y + dy, this.height);
            const index = this.getIndex(nx, ny);

            const entityId = this.grid[index];
            if (entityId !== null) {
                const entity = this.entities.get(entityId);
                if (entity && entity.type === 'fish') {
                    neighbors.push({ x: nx, y: ny });
                }
            }
        }

        return neighbors;
    }

    /**
     * Updates the fish and shark counts by scanning the grid.
     */
    updateCounts() {
        let fish = 0;
        let sharks = 0;

        for (const entityId of this.grid) {
            if (entityId !== null) {
                const entity = this.entities.get(entityId);
                if (entity) {
                    if (entity.type === 'fish') fish++;
                    else if (entity.type === 'shark') sharks++;
                }
            }
        }

        this.fishCount = fish;
        this.sharkCount = sharks;
    }

    /**
     * Records the current population counts to history.
     */
    recordHistory() {
        this.history.push({
            chronon: this.chronon,
            fish: this.fishCount,
            sharks: this.sharkCount
        });

        // Keep only the most recent HISTORY_LENGTH entries
        if (this.history.length > HISTORY_LENGTH) {
            this.history.shift();
        }
    }

    /**
     * Checks for extinction conditions and updates status.
     */
    checkExtinction() {
        if (this.fishCount === 0 && this.sharkCount === 0) {
            this.extinctStatus = 'Ecosystem collapsed';
        } else if (this.sharkCount === 0) {
            this.extinctStatus = 'Sharks extinct';
        } else if (this.fishCount === 0) {
            this.extinctStatus = 'Fish extinct';
        } else {
            this.extinctStatus = null;
        }
    }

    /**
     * Gets the current extinction status.
     * @returns {string|null} The extinction status or null if not extinct
     */
    getExtinctStatus() {
        return this.extinctStatus;
    }

    /**
     * Gets the current simulation state.
     * @returns {Object} Simulation state with all relevant data
     */
    getState() {
        return {
            chronon: this.chronon,
            fishCount: this.fishCount,
            sharkCount: this.sharkCount,
            extinctStatus: this.extinctStatus,
            history: this.history
        };
    }

    /**
     * Fisher-Yates shuffle algorithm for arrays.
     * @param {Array} array - The array to shuffle
     */
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    /**
     * Chooses a random element from an array.
     * @param {Array} array - The array to choose from
     * @returns {*} A random element from the array
     */
    chooseRandom(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
}
