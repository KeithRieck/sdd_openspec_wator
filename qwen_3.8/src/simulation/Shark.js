import Entity from './Entity.js';
import {
    SHARK_BREED_TIME,
    SHARK_ENERGY_COST_PER_CHRONON,
    SHARK_ENERGY_GAIN
} from '../config.js';

/**
 * A shark entity.
 *
 * Implements the shark chronon rules (wator-simulation R4–R7): energy is
 * decremented first and the shark dies at 0; otherwise it eats a random
 * adjacent fish (gaining energy) or wanders to a random adjacent empty cell.
 * A breeding-ready shark leaves a newborn shark (with initial energy) in its
 * old cell when it moves. The breed timer resets to 0 whenever the shark is
 * breeding-ready (moved or not) and otherwise ages by one chronon
 * (wator-simulation R7.3, R7.4, design D5).
 */
export default class Shark extends Entity {
    /**
     * Create a new shark.
     *
     * @param {number} id - Unique entity identifier.
     * @param {number} x - Column position (0-based).
     * @param {number} y - Row position (0-based).
     * @param {number} energy - Initial energy value.
     */
    constructor(id, x, y, energy) {
        super(id, 'shark', x, y);
        this.energy = energy;
    }

    /**
     * Act for the current chronon.
     *
     * @param {import('./WatorSimulation.js').default} sim - The owning simulation.
     */
    act(sim) {
        // Energy cost is applied before movement or eating
        // (wator-simulation R4.1).
        this.energy -= SHARK_ENERGY_COST_PER_CHRONON;
        if (this.energy <= 0) {
            // Starvation: removed without moving or eating (R4.2).
            sim.kill(this);
            return;
        }

        const breedingReady = this.breedAge >= SHARK_BREED_TIME;
        const fishNeighbors = sim.fishNeighbors(this.x, this.y);

        if (fishNeighbors.length > 0) {
            // Eat a randomly selected adjacent fish (wator-simulation R5.1).
            const prey = fishNeighbors[Math.floor(Math.random() * fishNeighbors.length)];
            const oldX = this.x;
            const oldY = this.y;
            sim.kill(prey);
            sim.moveEntity(this, prey.x, prey.y);
            this.energy += SHARK_ENERGY_GAIN; // R5.2
            if (breedingReady) {
                sim.spawnShark(oldX, oldY); // R7.1
                this.breedAge = 0;
            } else {
                this.breedAge += 1;
            }
            return;
        }

        const empties = sim.emptyNeighbors(this.x, this.y);
        if (empties.length > 0) {
            // Wander to a randomly selected adjacent empty cell (R6.1).
            const target = empties[Math.floor(Math.random() * empties.length)];
            const oldX = this.x;
            const oldY = this.y;
            sim.moveEntity(this, target.x, target.y);
            if (breedingReady) {
                sim.spawnShark(oldX, oldY); // R7.1
                this.breedAge = 0;
            } else {
                this.breedAge += 1;
            }
            return;
        }

        // Boxed in: no movement (R6.2). Reset the timer if breeding-ready,
        // otherwise age it (R7.3, R7.4).
        this.breedAge = breedingReady ? 0 : this.breedAge + 1;
    }
}
