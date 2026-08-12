import { Entity } from './Entity.js';

/**
 * Fish entity class
 * @class Fish
 * @extends Entity
 */
export class Fish extends Entity {
    /**
     * Create a fish
     * @param {number} id - Unique identifier
     * @param {number} x - X position
     * @param {number} y - Y position
     */
    constructor(id, x, y) {
        super(id, 'fish', x, y);
    }

    /**
     * Fish act logic
     * @param {WatorSimulation} sim - Simulation instance
     */
    act(sim) {
        if (!this.isAlive() || this.isBornThisChronon()) {
            return;
        }

        const neighbors = sim.getNeighbors(this.getX(), this.getY());
        const emptyNeighbors = neighbors.filter(n => sim.isEmpty(n.x, n.y));

        if (emptyNeighbors.length === 0) {
            if (this.canBreed(sim.config.FISH_BREED_TIME)) {
                this.resetBreedAge();
            } else {
                this.ageOneChronon();
            }
            return;
        }

        const target = sim.randomChoice(emptyNeighbors);
        const oldX = this.getX();
        const oldY = this.getY();

        sim.moveEntity(this, target.x, target.y);

        if (this.canBreed(sim.config.FISH_BREED_TIME)) {
            sim.createFish(oldX, oldY);
            this.resetBreedAge();
        } else {
            this.ageOneChronon();
        }
    }
}
