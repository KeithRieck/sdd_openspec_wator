/**
 * A fish entity in the Wa-Tor world (spec Req 18).
 *
 * Fish forage and breed: on its turn a fish moves to a random adjacent empty
 * cell and may leave a new fish behind (spec Req 11, 12). Fish never carry
 * energy. This module is part of the Phaser-free simulation engine (spec
 * Req 2.2).
 */

import Entity from './Entity.js';
import { FISH_BREED_TIME } from '../config.js';

export default class Fish extends Entity {
    /**
     * Chronons a fish must survive before breeding (spec Req 12).
     *
     * @returns {number} Fish breed time in chronons.
     */
    get breedTime() {
        return FISH_BREED_TIME;
    }

    /**
     * Fish chronon action: age one chronon, then move to a random adjacent
     * empty cell with the shared breed table, or stay put and age when
     * surrounded (spec Req 11.1, 11.2, 12.1-12.3).
     */
    act() {
        this.ageOneChronon();
        this.tryMoveOrBreed(this.sim.emptyNeighbors(this.pos));
    }
}
