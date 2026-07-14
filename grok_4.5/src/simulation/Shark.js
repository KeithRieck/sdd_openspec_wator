import {
  INITIAL_SHARK_ENERGY,
  SHARK_BREED_TIME,
  SHARK_ENERGY_COST,
  SHARK_ENERGY_GAIN
} from '../config.js';
import { Entity } from './Entity.js';

/**
 * Predator entity with energy, hunting preference, and breed-on-move behavior.
 * Spec: wator-simulation R6–R8.
 */
export class Shark extends Entity {
  /**
   * @param {number} id
   * @param {number} x
   * @param {number} y
   * @param {number} bornChronon
   * @param {number} [breedAge=0]
   * @param {number} [energy=INITIAL_SHARK_ENERGY]
   */
  constructor(id, x, y, bornChronon, breedAge = 0, energy = INITIAL_SHARK_ENERGY) {
    super(id, x, y, bornChronon, breedAge);
    this.energy = energy;
  }

  /** @returns {'shark'} */
  get type() {
    return 'shark';
  }

  /** @returns {number} */
  getBreedTime() {
    return SHARK_BREED_TIME;
  }

  /**
   * Decrement energy first; die with no breed-age change when energy hits 0.
   * @param {import('./WatorSimulation.js').WatorSimulation} world
   * @returns {boolean}
   */
  survivePrelude(world) {
    this.energy -= SHARK_ENERGY_COST;
    if (this.energy <= 0) {
      world.remove(this);
      return false;
    }
    return true;
  }

  /**
   * Prefer a random adjacent fish; otherwise move to a random empty neighbor.
   * @param {import('./WatorSimulation.js').WatorSimulation} world
   * @returns {boolean}
   */
  tryMove(world) {
    const fishCells = world.getFishNeighbors(this.x, this.y);
    if (fishCells.length > 0) {
      const target = fishCells[Math.floor(Math.random() * fishCells.length)];
      const prey = world.getEntityAt(target.x, target.y);
      if (prey) {
        world.remove(prey);
      }
      world.move(this, target.x, target.y);
      this.energy += SHARK_ENERGY_GAIN;
      return true;
    }

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
   * @returns {Shark}
   */
  createOffspring(id, x, y, bornChronon) {
    return new Shark(id, x, y, bornChronon, 0, INITIAL_SHARK_ENERGY);
  }
}
