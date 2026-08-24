import Entity from './Entity.js';
import {
    INITIAL_SHARK_ENERGY,
    SHARK_BREED_TIME,
    SHARK_ENERGY_COST,
    SHARK_ENERGY_GAIN
} from '../config.js';

/**
 * Predator occupant that starves, hunts fish, and breeds after a delay.
 * wator-simulation requirements 7, 8, and 9.
 */
export default class Shark extends Entity {
    /**
     * @param {number} id - Stable identity.
     * @param {number} x - Column.
     * @param {number} y - Row.
     * @param {number} [energy=INITIAL_SHARK_ENERGY] - Remaining starvation energy.
     * @param {number} [breedAge=0] - Chronons since last breed reset.
     */
    constructor(id, x, y, energy = INITIAL_SHARK_ENERGY, breedAge = 0) {
        super(id, x, y, breedAge);
        this.energy = energy;
    }

    /**
     * @returns {string}
     */
    get type() {
        return 'shark';
    }

    /**
     * @returns {number}
     */
    get breedTime() {
        return SHARK_BREED_TIME;
    }

    /**
     * Spend energy, hunt or move, then breed if the shark still lives.
     * wator-simulation requirements 7, 8, and 9.
     *
     * @param {import('./WatorWorld.js').default} world - Occupancy façade.
     */
    act(world) {
        this.energy -= SHARK_ENERGY_COST;
        if (this.energy <= 0) {
            world.remove(this);
            return;
        }

        const originX = this.x;
        const originY = this.y;
        const preyCell = world.pick(world.fishNeighbors(this.x, this.y));
        let moved = false;

        if (preyCell) {
            world.remove(world.get(preyCell.x, preyCell.y));
            world.move(this, preyCell.x, preyCell.y);
            this.energy += SHARK_ENERGY_GAIN;
            moved = true;
        } else {
            const emptyCell = world.pick(world.emptyNeighbors(this.x, this.y));
            if (emptyCell) {
                world.move(this, emptyCell.x, emptyCell.y);
                moved = true;
            }
        }

        const ready = this.ageOrResetBreed();
        if (ready && moved) {
            world.spawn(new Shark(world.createId(), originX, originY, INITIAL_SHARK_ENERGY));
        }
    }
}
