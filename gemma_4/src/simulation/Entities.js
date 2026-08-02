import { CONFIG } from '../config.js';

/**
 * Base class for all entities in the Wa-Tor simulation.
 */
export class Entity {
    /**
     * @param {number} id - Unique identifier for the entity.
     * @param {number} x - Initial x-coordinate on the grid.
     * @param {number} y - Initial y-coordinate on the grid.
     */
    constructor(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.breedAge = 0;
    }

    /**
     * Increments the breeding age of the entity.
     */
    updateAge() {
        this.breedAge++;
    }

    /**
     * Resets the breeding age to zero.
     */
    resetBreedTimer() {
        this.breedAge = 0;
    }

    /**
     * Checks if the entity is ready to reproduce.
     * @returns {boolean} True if the entity has reached its breeding age.
     */
    canBreed() {
        throw new Error('canBreed() must be implemented by subclass');
    }

    /**
     * Performs the entity's action for the current chronon.
     * @param {WatorSimulation} simulation - The simulation instance.
     */
    act(simulation) {
        throw new Error('act() must be implemented by subclass');
    }
}

/**
 * Represents a fish in the Wa-Tor simulation.
 */
export class Fish extends Entity {
    /**
     * @param {number} id 
     * @param {number} x 
     * @param {number} y 
     */
    constructor(id, x, y) {
        super(id, x, y);
    }

    /**
     * @returns {boolean} True if the fish has reached the fishBreedTime.
     */
    canBreed() {
        return this.breedAge >= CONFIG.fishBreedTime;
    }

    /**
     * Fish movement and breeding logic.
     * @param {WatorSimulation} simulation 
     */
    act(simulation) {
        const emptyNeighbors = simulation.getEmptyNeighbors(this.x, this.y);

        if (emptyNeighbors.length > 0) {
            const target = emptyNeighbors[Math.floor(Math.random() * emptyNeighbors.length)];
            const oldX = this.x;
            const oldY = this.y;

            simulation.moveEntity(this, target.x, target.y);

            if (this.canBreed()) {
                simulation.spawnEntity('fish', oldX, oldY);
                this.resetBreedTimer();
            }
        } else {
            // If a fish is breeding-ready and cannot move, reset timer
            if (this.canBreed()) {
                this.resetBreedTimer();
            } else {
                this.updateAge();
            }
        }
    }
}

/**
 * Represents a shark in the Wa-Tor simulation.
 */
export class Shark extends Entity {
    /**
     * @param {number} id 
     * @param {number} x 
     * @param {number} y 
     * @param {number} energy - Initial energy of the shark.
     */
    constructor(id, x, y, energy = CONFIG.initialSharkEnergy) {
        super(id, x, y);
        this.energy = energy;
    }

    /**
     * @returns {boolean} True if the shark has reached the sharkBreedTime.
     */
    canBreed() {
        return this.breedAge >= CONFIG.sharkBreedTime;
    }

    /**
     * Shark energy, hunting, movement, and breeding logic.
     * @param {WatorSimulation} simulation 
     */
    act(simulation) {
        // 1. Energy decrement
        this.energy -= CONFIG.sharkEnergyCostPerChronon;

        // 2. Check for starvation
        if (this.energy <= 0) {
            simulation.removeEntity(this.id);
            return;
        }

        const fishNeighbors = simulation.getFishNeighbors(this.x, this.y);
        let moved = false;
        const oldX = this.x;
        const oldY = this.y;

        if (fishNeighbors.length > 0) {
            // 3. Hunt fish
            const target = fishNeighbors[Math.floor(Math.random() * fishNeighbors.length)];
            const eatenFish = simulation.getEntityAt(target.x, target.y);
            
            if (eatenFish) {
                simulation.removeEntity(eatenFish.id);
                this.energy += CONFIG.sharkEnergyGain;
                simulation.moveEntity(this, target.x, target.y);
                moved = true;
            }
        } else {
            // 4. Move to empty cell
            const emptyNeighbors = simulation.getEmptyNeighbors(this.x, this.y);
            if (emptyNeighbors.length > 0) {
                const target = emptyNeighbors[Math.floor(Math.random() * emptyNeighbors.length)];
                simulation.moveEntity(this, target.x, target.y);
                moved = true;
            }
        }

        // 5. Breeding logic
        if (moved) {
            if (this.canBreed()) {
                simulation.spawnEntity('shark', oldX, oldY);
                this.resetBreedTimer();
            } else {
                this.updateAge();
            }
        } else {
            if (this.canBreed()) {
                this.resetBreedTimer();
            } else {
                this.updateAge();
            }
        }
    }
}
