/**
 * Shark entity for the Wa-Tor simulation.
 * R5: Shark behavior - energy, movement, eating, breeding, starvation
 */
import Entity from './Entity.js';

export default class Shark extends Entity {
    /**
     * Create a shark.
     * @param {number} id - Unique entity ID
     * @param {number} x - X position (column)
     * @param {number} y - Y position (row)
     * @param {number} energy - Initial energy
     * @param {number} breedTime - Number of chronons before breeding
     * @param {number} sharkEnergyGain - Energy gained from eating
     * @param {number} sharkEnergyCostPerChronon - Energy cost per chronon
     */
    constructor(id, x, y, energy, breedTime, sharkEnergyGain, sharkEnergyCostPerChronon) {
        super(id, x, y);
        this.energy = energy;
        this.breedTime = breedTime;
        this.breedTimer = 0;
        this.sharkEnergyGain = sharkEnergyGain;
        this.sharkEnergyCostPerChronon = sharkEnergyCostPerChronon;
    }

    /**
     * Set the grid reference.
     * @param {Grid} grid - Grid reference
     */
    setGrid(grid) {
        this.grid = grid;
    }
}
