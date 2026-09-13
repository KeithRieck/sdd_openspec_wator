/**
 * A fish in the Wa-Tor world.
 *
 * Fish are the prey. On its turn a fish moves to a randomly selected adjacent
 * empty cell when one exists, and reproduces once it is breeding-ready and
 * successfully moves (`chronon-rules` §2). A fish does not track energy
 * (`world-model` §4.3).
 */

import Entity from './Entity.js';
import { FISH, FISH_BREED_TIME } from '../config.js';

export default class Fish extends Entity {
    /** @returns {string} The `fish` kind identifier. */
    get kind() {
        return FISH;
    }

    /** @returns {number} Chronons a fish must survive before reproducing. */
    get breedTime() {
        return FISH_BREED_TIME;
    }

    /**
     * Take this fish's turn for the current chronon.
     *
     * The order of operations follows `chronon-rules` §2:
     *
     * 1. Move to a random adjacent empty cell, if any exists.
     * 2. If breeding-ready and the move succeeded, leave a newborn fish in the
     *    cell just vacated and reset the breed timer.
     * 3. If breeding-ready but unable to move, reset the breed timer.
     * 4. If not breeding-ready, leave the breed timer aging.
     *
     * @param {import('./types.js').World} world - Simulation capabilities.
     * @returns {void}
     */
    act(world) {
        const from = this.position;
        const open = [];
        for (const neighbor of world.neighbors(from)) {
            if (world.isEmpty(neighbor)) open.push(neighbor);
        }

        let moved = false;
        if (open.length > 0) {
            // The first mover claims a contested cell, so the world is read
            // and written in place (design D5).
            world.move(this, world.rng.pick(open));
            moved = true;
        }

        if (this.isBreeding()) {
            // Reproduction leaves the newborn behind in the vacated cell. The
            // newborn is absent from this chronon's snapshot, so it cannot act
            // until the next chronon (`chronon-rules` §1.3, §2.3).
            if (moved) {
                world.spawn(from, FISH);
            }
            this.breedAge = 0;
        }
        // A fish that is not breeding-ready is left alone: the simulation
        // advances every survivor's breed age once at the start of the chronon,
        // so a blocked fish keeps aging and eventually becomes breeding-ready
        // (`chronon-rules` §2.5). Advancing it here as well would double-count.
    }
}
