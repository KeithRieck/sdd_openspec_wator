import Entity from './Entity.js';
import { FISH_BREED_TIME } from '../config.js';

/**
 * Prey occupant that swims into empty water and breeds after a delay.
 * wator-simulation requirements 5 and 6.
 */
export default class Fish extends Entity {
    /**
     * @returns {string}
     */
    get type() {
        return 'fish';
    }

    /**
     * @returns {number}
     */
    get breedTime() {
        return FISH_BREED_TIME;
    }

    /**
     * Move to a random empty neighbor and apply fish breeding.
     * wator-simulation requirements 5 and 6.
     *
     * @param {import('./WatorWorld.js').default} world - Occupancy façade.
     */
    act(world) {
        const destination = world.pick(world.emptyNeighbors(this.x, this.y));
        const moved = destination !== null;
        const originX = this.x;
        const originY = this.y;
        const ready = this.ageOrResetBreed();

        if (moved) {
            world.move(this, destination.x, destination.y);
        }

        if (ready && moved) {
            world.spawn(new Fish(world.createId(), originX, originY));
        }
    }
}
