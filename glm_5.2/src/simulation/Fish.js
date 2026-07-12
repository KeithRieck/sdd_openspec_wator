import Entity from './Entity.js';
import { FISH_BREED_TIME } from '../config.js';

/**
 * A fish entity in the Wa-Tor simulation.
 *
 * Fish move to random adjacent empty cells. Once a fish has survived
 * `FISH_BREED_TIME` chronons, it may reproduce by leaving a new fish in its
 * old cell when it moves. If a breeding-ready fish cannot move, its breed
 * timer resets to 0 without producing offspring.
 */
export default class Fish extends Entity {
    /**
     * Perform the fish's action for this chronon.
     *
     * Rules (PRD requirements 14-17):
     * - Find a random empty orthogonal neighbor (toroidal).
     * - If one exists, move there.
     * - If breeding-ready and moved: leave a new fish in the old cell,
     *   reset breed timer to 0.
     * - If breeding-ready and could not move: reset breed timer to 0.
     * - If not breeding-ready and could not move: increment breed timer.
     *
     * @param {Array<Entity|null>} grid - Flat grid array.
     * @param {object} sim - The WatorSimulation instance.
     */
    act(grid, sim) {
        const target = sim.randomEmptyNeighbor(this.x, this.y);
        const moved = target !== null;
        const breeding = this.canBreed();

        if (moved) {
            const oldX = this.x;
            const oldY = this.y;
            sim.moveEntity(this, target.x, target.y);
            if (breeding) {
                sim.spawnFish(oldX, oldY);
                this.breedAge = 0;
            } else {
                this.breedAge++;
            }
        } else {
            // Could not move
            if (breeding) {
                this.breedAge = 0;
            } else {
                this.breedAge++;
            }
        }
    }

    /**
     * Whether this fish is ready to breed.
     *
     * @returns {boolean} True if breedAge has reached FISH_BREED_TIME.
     */
    canBreed() {
        return this.breedAge >= FISH_BREED_TIME;
    }
}
