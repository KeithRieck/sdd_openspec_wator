import Entity from './Entity.js';
import { FISH_BREED_TIME } from '../config.js';

/**
 * A fish entity.
 *
 * Implements the fish chronon rules (wator-simulation R3): move to a random
 * adjacent empty cell when one exists; a breeding-ready fish leaves a new fish
 * in its old cell when it moves. The breed timer resets to 0 whenever the fish
 * is breeding-ready (moved or not) and otherwise ages by one chronon
 * (wator-simulation R3.3, R3.4, design D5).
 */
export default class Fish extends Entity {
    /**
     * Create a new fish.
     *
     * @param {number} id - Unique entity identifier.
     * @param {number} x - Column position (0-based).
     * @param {number} y - Row position (0-based).
     */
    constructor(id, x, y) {
        super(id, 'fish', x, y);
    }

    /**
     * Act for the current chronon.
     *
     * @param {import('./WatorSimulation.js').default} sim - The owning simulation.
     */
    act(sim) {
        const empties = sim.emptyNeighbors(this.x, this.y);
        const breedingReady = this.breedAge >= FISH_BREED_TIME;

        if (empties.length === 0) {
            // Blocked: reset the timer if breeding-ready, otherwise age it
            // (wator-simulation R3.3, R3.4).
            this.breedAge = breedingReady ? 0 : this.breedAge + 1;
            return;
        }

        // Move to a randomly selected adjacent empty cell (wator-simulation R3.1).
        const target = empties[Math.floor(Math.random() * empties.length)];
        const oldX = this.x;
        const oldY = this.y;
        sim.moveEntity(this, target.x, target.y);

        if (breedingReady) {
            // Leave a new fish in the old cell and reset the timer
            // (wator-simulation R3.2).
            sim.spawnFish(oldX, oldY);
            this.breedAge = 0;
        } else {
            this.breedAge += 1;
        }
    }
}
