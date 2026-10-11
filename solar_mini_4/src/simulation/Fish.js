/**
 * Fish entity for the Wa-Tor simulation.
 * R4: Fish behavior - movement, breeding, aging
 */
import Entity from './Entity.js';

export default class Fish extends Entity {
    /**
     * Create a fish.
     * @param {number} id - Unique entity ID
     * @param {number} x - X position (column)
     * @param {number} y - Y position (row)
     * @param {number} breedTime - Number of chronons before breeding
     */
    constructor(id, x, y, breedTime) {
        super(id, x, y);
        this.breedTime = breedTime;
        this.breedTimer = 0;
    }

    /**
     * Set the grid reference.
     * @param {Grid} grid - Grid reference
     */
    setGrid(grid) {
        this.grid = grid;
    }
}
