/**
 * A shark entity in the Wa-Tor world (spec Req 18).
 *
 * Sharks hunt fish and manage a starvation-energy budget. A shark carries
 * energy in addition to the shared entity state (spec Req 18.1). This module
 * is part of the Phaser-free simulation engine (spec Req 2.2).
 */

import Entity from './Entity.js';
import {
    SHARK_BREED_TIME,
    INITIAL_SHARK_ENERGY,
    SHARK_ENERGY_GAIN,
    SHARK_ENERGY_COST_PER_CHRONON
} from '../config.js';

export default class Shark extends Entity {
    /**
     * Create a shark with full starting energy: newborn sharks begin with
     * `initialSharkEnergy` (spec Req 17.1).
     *
     * @param {import('./WatorSimulation.js').default} sim - Owning simulation.
     * @param {number} id - Unique entity ID.
     * @param {number} pos - Flat grid index of the shark's cell.
     * @param {number} bornChronon - Chronon of birth.
     */
    constructor(sim, id, pos, bornChronon) {
        super(sim, id, pos, bornChronon);
        this.energy = INITIAL_SHARK_ENERGY;
    }

    /**
     * Chronons a shark must survive before breeding (spec Req 17).
     *
     * @returns {number} Shark breed time in chronons.
     */
    get breedTime() {
        return SHARK_BREED_TIME;
    }

    /**
     * Shark chronon action in the design D4 order: age one chronon, pay the
     * energy cost before any movement or eating (spec Req 13.1), starve in
     * place at zero energy (spec Req 14.1), then hunt an adjacent fish (spec
     * Req 15.1) or roam to empty water (spec Req 16.1, 16.2) with the shared
     * breed table (spec Req 17.1-17.3).
     */
    act() {
        this.ageOneChronon();
        this.energy -= SHARK_ENERGY_COST_PER_CHRONON;
        if (this.energy <= 0) {
            this.sim.removeEntity(this);
            return;
        }
        const prey = this.sim.fishNeighbors(this.pos);
        if (prey.length > 0) {
            this._hunt(prey);
            return;
        }
        this.tryMoveOrBreed(this.sim.emptyNeighbors(this.pos));
    }

    /**
     * Eat a randomly selected adjacent fish: remove the fish, move onto its
     * cell, and gain `sharkEnergyGain` energy (spec Req 15.1). Eating counts
     * as a successful move for breeding (spec Req 17.1).
     *
     * @param {number[]} prey - Flat grid indices of adjacent fish cells.
     */
    _hunt(prey) {
        const dest = this.sim.randomChoice(prey);
        const oldCell = this.pos;
        this.sim.removeEntity(this.sim.entityAt(dest));
        this.sim.moveEntityTo(this, dest);
        this.energy += SHARK_ENERGY_GAIN;
        this.spawnIfReady(oldCell);
    }
}
