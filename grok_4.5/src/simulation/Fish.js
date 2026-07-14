import { FISH_BREED_TIME } from '../config.js';
import { Entity } from './Entity.js';

/**
 * Prey entity that moves into empty adjacent cells and breeds by fission on move.
 * Spec: wator-simulation R5, R7, R8.
 */
export class Fish extends Entity {
  /**
   * @param {number} id
   * @param {number} x
   * @param {number} y
   * @param {number} bornChronon
   * @param {number} [breedAge=0]
   */
  constructor(id, x, y, bornChronon, breedAge = 0) {
    super(id, x, y, bornChronon, breedAge);
  }

  /** @returns {'fish'} */
  get type() {
    return 'fish';
  }

  /** @returns {number} */
  getBreedTime() {
    return FISH_BREED_TIME;
  }

  /**
   * Fish have no energy prelude.
   * @returns {boolean}
   */
  survivePrelude() {
    return this.alive;
  }

  /**
   * Move to a random adjacent empty cell when available.
   * @param {import('./WatorSimulation.js').WatorSimulation} world
   * @returns {boolean}
   */
  tryMove(world) {
    const empties = world.getEmptyNeighbors(this.x, this.y);
    if (empties.length === 0) {
      return false;
    }
    const target = empties[Math.floor(Math.random() * empties.length)];
    world.move(this, target.x, target.y);
    return true;
  }

  /**
   * @param {number} id
   * @param {number} x
   * @param {number} y
   * @param {number} bornChronon
   * @returns {Fish}
   */
  createOffspring(id, x, y, bornChronon) {
    return new Fish(id, x, y, bornChronon, 0);
  }
}
