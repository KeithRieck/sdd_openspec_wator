/**
 * Fish entity for Wa-Tor simulation.
 * Fish move randomly to adjacent empty cells and reproduce after surviving
 * a certain number of chronons.
 */
import { Entity } from './Entity.js';
import { FISH_BREED_TIME } from '../config.js';

export class Fish extends Entity {
    /**
     * Creates a new Fish entity.
     * @param {string} id - Unique identifier for the fish
     * @param {number} x - X coordinate on the grid
     * @param {number} y - Y coordinate on the grid
     */
    constructor(id, x, y) {
        super(id, x, y, 'fish');
    }

    /**
     * Creates a copy of this fish at a new position.
     * @param {string} newId - The ID for the new fish
     * @param {number} newX - The new X coordinate
     * @param {number} newY - The new Y coordinate
     * @returns {Fish} A new fish entity
     */
    clone(newId, newX, newY) {
        return new Fish(newId, newX, newY);
    }

    /**
     * Checks if this fish is ready to breed.
     * @returns {boolean} True if breedAge >= FISH_BREED_TIME
     */
    isBreedingReady() {
        return this.breedAge >= FISH_BREED_TIME;
    }
}
