import { CONFIG } from '../config.js';

/**
 * Base class for all simulation entities.
 */
export class Entity {
    /**
     * @param {number} id - Unique identifier for the entity.
     * @param {number} x - X coordinate on the grid.
     * @param {number} y - Y coordinate on the grid.
     */
    constructor(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.breedAge = 0;
        this.isNewborn = true; // Requirement 12: prevent acting in the same chronon
    }

    /**
     * The core logic for an entity's turn.
     * @param {WatorSimulation} simulation The simulation instance for grid queries and state updates.
     */
    act(simulation) {
        this.breedAge++;
        this.isNewborn = false;
        // To be implemented by subclasses
    }
}

/**
 * Fish entity implementing Wa-Tor fish behavior.
 */
export class Fish extends Entity {
    /**
     * Executes the fish's turn.
     * @param {WatorSimulation} simulation The simulation instance.
     */
    act(simulation) {
        super.act(simulation);

        const emptyNeighbors = simulation.getAdjacentEmptyCells(this.x, this.y);

        if (emptyNeighbors.length > 0) {
            // Requirement 14: Move randomly to an adjacent empty cell
            const target = emptyNeighbors[Math.floor(Math.random() * emptyNeighbors.length)];
            const oldX = this.x;
            const oldY = this.y;

            this.x = target.x;
            this.y = target.y;
            simulation.updateGrid(this, oldX, oldY);

            // Requirement 15: Breeding
            if (this.breedAge >= CONFIG.breeding.fishBreedTime) {
                simulation.spawnEntity('fish', oldX, oldY);
                this.breedAge = 0;
            }
        } else {
            // Requirement 16: Breeding-ready but cannot move
            if (this.breedAge >= CONFIG.breeding.fishBreedTime) {
                this.breedAge = 0;
            }
            // Requirement 17: Not breeding-ready and cannot move (breedAge continues to increment via super.act)
        }
    }
}

/**
 * Shark entity implementing Wa-Tor shark behavior.
 */
export class Shark extends Entity {
    /**
     * @param {number} id - Unique identifier.
     * @param {number} x - X coordinate.
     * @param {number} y - Y coordinate.
     * @param {number} energy - Initial energy.
     */
    constructor(id, x, y, energy) {
        super(id, x, y);
        this.energy = energy;
    }

    /**
     * Executes the shark's turn.
     * @param {WatorSimulation} simulation The simulation instance.
     */
    act(simulation) {
        super.act(simulation);

        // Requirement 18: Decrement energy
        this.energy -= CONFIG.sharkEnergy.costPerChronon;

        // Requirement 19: Starvation
        if (this.energy <= 0) {
            simulation.removeEntity(this);
            return;
        }

        const fishNeighbors = simulation.getAdjacentFishCells(this.x, this.y);
        let moved = false;
        let oldX = this.x;
        let oldY = this.y;

        if (fishNeighbors.length > 0) {
            // Requirement 20: Hunt fish
            const target = fishNeighbors[Math.floor(Math.random() * fishNeighbors.length)];
            const fish = simulation.getEntityAt(target.x, target.y);
            
            this.x = target.x;
            this.y = target.y;
            simulation.removeEntity(fish);
            simulation.updateGrid(this, oldX, oldY);
            
            // Requirement 21: Energy gain
            this.energy += CONFIG.sharkEnergy.gain;
            moved = true;
        } else {
            const emptyNeighbors = simulation.getAdjacentEmptyCells(this.x, this.y);
            if (emptyNeighbors.length > 0) {
                // Requirement 22: Move to empty cell
                const target = emptyNeighbors[Math.floor(Math.random() * emptyNeighbors.length)];
                this.x = target.x;
                this.y = target.y;
                simulation.updateGrid(this, oldX, oldY);
                moved = true;
            }
        }

        // Requirement 23: Breeding
        if (moved && this.breedAge >= CONFIG.breeding.sharkBreedTime) {
            simulation.spawnEntity('shark', oldX, oldY);
            this.breedAge = 0;
        } else if (!moved && this.breedAge >= CONFIG.breeding.sharkBreedTime) {
            // Requirement 25: Breeding-ready but cannot move
            this.breedAge = 0;
        }
        // Requirement 26: Not breeding-ready and cannot move (breedAge increments via super.act)
    }
}
