import { Entity } from './Entity.js';

/**
 * Shark entity class
 * @class Shark
 * @extends Entity
 */
export class Shark extends Entity {
    #energy;

    /**
     * Create a shark
     * @param {number} id - Unique identifier
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} energy - Initial energy
     */
    constructor(id, x, y, energy) {
        super(id, 'shark', x, y);
        this.#energy = energy;
    }

    getEnergy() { return this.#energy; }

    loseEnergy(amount) {
        this.#energy -= amount;
    }

    gainEnergy(amount) {
        this.#energy += amount;
    }

    /**
     * Shark act logic
     * @param {WatorSimulation} sim - Simulation instance
     */
    act(sim) {
        if (!this.isAlive() || this.isBornThisChronon()) {
            return;
        }

        this.loseEnergy(sim.config.SHARK_ENERGY_COST_PER_CHRONON);

        if (this.getEnergy() <= 0) {
            this.kill();
            sim.removeEntity(this);
            return;
        }

        const neighbors = sim.getNeighbors(this.getX(), this.getY());
        const fishNeighbors = neighbors.filter(n => {
            const entity = sim.getEntityAt(n.x, n.y);
            return entity && entity.getType() === 'fish';
        });

        let target = null;
        let ateFish = false;

        if (fishNeighbors.length > 0) {
            target = sim.randomChoice(fishNeighbors);
            ateFish = true;
        } else {
            const emptyNeighbors = neighbors.filter(n => sim.isEmpty(n.x, n.y));
            if (emptyNeighbors.length > 0) {
                target = sim.randomChoice(emptyNeighbors);
            }
        }

        if (!target) {
            if (this.canBreed(sim.config.SHARK_BREED_TIME)) {
                this.resetBreedAge();
            } else {
                this.ageOneChronon();
            }
            return;
        }

        const oldX = this.getX();
        const oldY = this.getY();

        if (ateFish) {
            const fish = sim.getEntityAt(target.x, target.y);
            sim.removeEntity(fish);
            this.gainEnergy(sim.config.SHARK_ENERGY_GAIN);
        }

        sim.moveEntity(this, target.x, target.y);

        if (this.canBreed(sim.config.SHARK_BREED_TIME)) {
            sim.createShark(oldX, oldY);
            this.resetBreedAge();
        } else {
            this.ageOneChronon();
        }
    }
}
