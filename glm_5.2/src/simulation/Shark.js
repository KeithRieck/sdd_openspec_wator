import Entity from './Entity.js';
import {
    SHARK_BREED_TIME,
    INITIAL_SHARK_ENERGY,
    SHARK_ENERGY_GAIN,
    SHARK_ENERGY_COST_PER_CHRONON
} from '../config.js';

/**
 * A shark entity in the Wa-Tor simulation.
 *
 * Sharks hunt fish: each chronon they prefer to move to an adjacent cell
 * occupied by a fish, devouring it and gaining energy. If no fish are
 * adjacent, the shark moves to a random empty cell. Each chronon the shark
 * loses energy; at zero energy it starves and is removed. Sharks breed
 * like fish once they survive `SHARK_BREED_TIME` chronons.
 */
export default class Shark extends Entity {
    /**
     * Create a new shark.
     *
     * @param {number} id - Stable unique integer ID.
     * @param {number} x - Column position.
     * @param {number} y - Row position.
     * @param {number} birthChronon - Chronon of birth.
     * @param {number} [energy=INITIAL_SHARK_ENERGY] - Starting energy.
     */
    constructor(id, x, y, birthChronon, energy = INITIAL_SHARK_ENERGY) {
        super(id, x, y, birthChronon);
        this.energy = energy;
    }

    /**
     * Perform the shark's action for this chronon.
     *
     * Rules (PRD requirements 18-26):
     * - Decrement energy by SHARK_ENERGY_COST_PER_CHRONON.
     * - If energy <= 0: remove the shark (starvation), no move or eat.
     * - Else if an adjacent fish exists: move there, eat the fish, gain energy.
     * - Else if an adjacent empty cell exists: move there.
     * - Breeding logic mirrors fish: if breeding-ready and moved, leave a
     *   newborn shark (energy = INITIAL_SHARK_ENERGY) in the old cell and
     *   reset breed timer; if breeding-ready and blocked, reset timer;
     *   if not breeding-ready and blocked, increment timer.
     *
     * @param {Array<Entity|null>} grid - Flat grid array.
     * @param {object} sim - The WatorSimulation instance.
     */
    act(grid, sim) {
        // Requirement 18: decrement energy before movement or eating.
        this.energy -= SHARK_ENERGY_COST_PER_CHRONON;

        // Requirement 19: starve if energy reaches zero.
        if (this.energy <= 0) {
            sim.removeEntity(this);
            return;
        }

        // Requirement 20: prefer adjacent fish.
        const fishTarget = sim.randomFishNeighbor(this.x, this.y);
        let moved = false;
        let oldX = this.x;
        let oldY = this.y;

        if (fishTarget !== null) {
            const eaten = sim.entityAt(fishTarget.x, fishTarget.y);
            if (eaten !== null) {
                sim.removeEntity(eaten);
            }
            sim.moveEntity(this, fishTarget.x, fishTarget.y);
            // Requirement 21: gain energy from eating.
            this.energy += SHARK_ENERGY_GAIN;
            moved = true;
        } else {
            // Requirement 22: no fish, try empty neighbor.
            const emptyTarget = sim.randomEmptyNeighbor(this.x, this.y);
            if (emptyTarget !== null) {
                sim.moveEntity(this, emptyTarget.x, emptyTarget.y);
                moved = true;
            }
        }

        const breeding = this.canBreed();
        if (moved) {
            // Requirement 23: breed if ready and moved — newborn in old cell.
            if (breeding) {
                sim.spawnShark(oldX, oldY);
                this.breedAge = 0;
            } else {
                this.breedAge++;
            }
        } else {
            // Requirements 25-26: blocked.
            if (breeding) {
                this.breedAge = 0;
            } else {
                this.breedAge++;
            }
        }
    }

    /**
     * Whether this shark is ready to breed.
     *
     * @returns {boolean} True if breedAge has reached SHARK_BREED_TIME.
     */
    canBreed() {
        return this.breedAge >= SHARK_BREED_TIME;
    }
}
