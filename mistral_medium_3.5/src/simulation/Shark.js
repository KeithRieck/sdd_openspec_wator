/**
 * Shark entity for Wa-Tor simulation.
 * Sharks move to adjacent fish cells to eat them, or to empty cells.
 * Sharks lose energy each chronon and die when energy reaches zero.
 * Sharks reproduce after surviving a certain number of chronons.
 */
import { Entity } from './Entity.js';
import { SHARK_BREED_TIME, INITIAL_SHARK_ENERGY, SHARK_ENERGY_GAIN, SHARK_ENERGY_COST_PER_CHRONON } from '../config.js';

export class Shark extends Entity {
    /**
     * Creates a new Shark entity.
     * @param {string} id - Unique identifier for the shark
     * @param {number} x - X coordinate on the grid
     * @param {number} y - Y coordinate on the grid
     * @param {number} energy - Initial energy of the shark
     */
    constructor(id, x, y, energy = INITIAL_SHARK_ENERGY) {
        super(id, x, y, 'shark');
        this.energy = energy;
    }

    /**
     * Creates a copy of this shark at a new position with initial energy.
     * @param {string} newId - The ID for the new shark
     * @param {number} newX - The new X coordinate
     * @param {number} newY - The new Y coordinate
     * @returns {Shark} A new shark entity with initial energy
     */
    clone(newId, newX, newY) {
        return new Shark(newId, newX, newY, INITIAL_SHARK_ENERGY);
    }

    /**
     * Decrements energy by the cost per chronon.
     * @returns {boolean} True if shark is still alive (energy > 0), false if dead
     */
    decrementEnergy() {
        this.energy -= SHARK_ENERGY_COST_PER_CHRONON;
        return this.energy > 0;
    }

    /**
     * Adds energy when eating a fish.
     */
    eatFish() {
        this.energy += SHARK_ENERGY_GAIN;
    }

    /**
     * Checks if this shark is ready to breed.
     * @returns {boolean} True if breedAge >= SHARK_BREED_TIME
     */
    isBreedingReady() {
        return this.breedAge >= SHARK_BREED_TIME;
    }

    /**
     * Gets the current energy of the shark.
     * @returns {number} Current energy value
     */
    getEnergy() {
        return this.energy;
    }
}
