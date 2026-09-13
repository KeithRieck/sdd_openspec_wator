/**
 * A shark in the Wa-Tor world.
 *
 * Sharks are the predators. Each turn a shark first loses energy, then eats an
 * adjacent fish if one is available, otherwise moves to an adjacent empty cell,
 * and finally reproduces if it is breeding-ready and successfully moved
 * (`chronon-rules` §3, §4, §5). Moving onto a fish counts as a successful move
 * for reproduction (PRD req 23).
 *
 * Unlike a fish, a shark tracks energy and dies when it reaches zero
 * (`world-model` §4.3).
 */

import Entity from './Entity.js';
import {
    FISH,
    SHARK,
    SHARK_BREED_TIME,
    INITIAL_SHARK_ENERGY,
    SHARK_ENERGY_GAIN
} from '../config.js';

export default class Shark extends Entity {
    /**
     * Create a shark with the configured initial energy
     * (`chronon-rules` §3.3).
     *
     * @param {import('./Entity.js').EntityOptions} options - Identity and
     *   initial position.
     */
    constructor(options) {
        super(options);
        /** @type {number} Remaining energy; the shark dies at zero. */
        this.energy = INITIAL_SHARK_ENERGY;
    }

    /** @returns {string} The `shark` kind identifier. */
    get kind() {
        return SHARK;
    }

    /** @returns {number} Chronons a shark must survive before reproducing. */
    get breedTime() {
        return SHARK_BREED_TIME;
    }

    /**
     * Take this shark's turn for the current chronon.
     *
     * The order of operations is significant and follows design D6:
     *
     * 1. Spend energy first, and die immediately at zero without moving or
     *    eating (`chronon-rules` §3.1, §3.2).
     * 2. Eat a randomly selected adjacent fish if one exists, gaining energy
     *    (`chronon-rules` §4.1, §4.2). Eating counts as a move.
     * 3. Otherwise move to a randomly selected adjacent empty cell
     *    (`chronon-rules` §4.3).
     * 4. If breeding-ready and a move happened - by moving or by eating - leave
     *    a newborn behind and reset the breed timer; if breeding-ready but
     *    blocked, reset the timer (`chronon-rules` §5).
     *
     * @param {import('./types.js').World} world - Simulation capabilities.
     * @returns {void}
     */
    act(world) {
        const from = this.position;

        // 1. Energy is spent before anything else, and starvation is final for
        // this chronon (`chronon-rules` §3.1, §3.2).
        this.energy -= world.config.sharkEnergyCostPerChronon;
        if (this.energy <= 0) {
            world.remove(this);
            return;
        }

        // 2. Predation takes priority over ordinary movement.
        const prey = [];
        const open = [];
        for (const neighbor of world.neighbors(from)) {
            const occupant = world.entityAt(neighbor);
            if (occupant === null) {
                open.push(neighbor);
            } else if (occupant.kind === FISH) {
                prey.push(neighbor);
            }
        }

        let moved = false;
        if (prey.length > 0) {
            const target = world.rng.pick(prey);
            const victim = world.entityAt(target);
            // Remove the prey first so its cell is genuinely free; moving onto
            // it first would let the removal clear the shark's new cell.
            if (victim) world.remove(victim);
            world.move(this, target);
            this.energy += world.config.sharkEnergyGain;
            moved = true;
        } else if (open.length > 0) {
            world.move(this, world.rng.pick(open));
            moved = true;
        }

        // 3. Breeding. Eating set `moved`, so a feeding shark reproduces on the
        // same terms as one that swam into open water (PRD req 23).
        if (this.isBreeding()) {
            if (moved) {
                world.spawn(from, SHARK);
            }
            this.breedAge = 0;
        }
        // A shark that is not breeding-ready is left alone: the simulation
        // advances every survivor's breed age once at the start of the chronon
        // (`chronon-rules` §5.4).
    }
}
