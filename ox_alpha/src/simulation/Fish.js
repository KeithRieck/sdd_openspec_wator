/**
 * @file Fish entity class for the Wa-Tor simulation.
 */

import { Entity } from './Entity.js';
import { RENDER } from '../config.js';

/**
 * Numeric type code identifying fish entities.
 *
 * @constant {number}
 */
export const FISH_TYPE = 1;

/**
 * A fish: the prey species of the Wa-Tor world.
 *
 * Fish move to a random adjacent empty cell each chronon (AC 14) and
 * breed after surviving {@link Fish#breedTime} chronons. All other
 * behavior (breeding bookkeeping, blocked handling) is inherited from
 * {@link Entity}.
 */
export class Fish extends Entity {
  /**
   * Creates a fish.
   *
   * @param {number} id Unique entity ID.
   * @param {number} pos Flat grid index of the fish's cell.
   * @param {number} breedTime Chronons before the fish may breed.
   * @param {boolean} [bornThisChronon=false] True when born this chronon.
   */
  constructor(id, pos, breedTime, bornThisChronon = false) {
    super(id, pos, breedTime, bornThisChronon);
  }

  /**
   * Returns the fish type code.
   *
   * @returns {number} The {@link FISH_TYPE} constant.
   */
  get type() {
    return FISH_TYPE;
  }

  /**
   * Returns the fish rendering radius factor.
   *
   * @returns {number} Fraction of a cell used as the circle radius.
   */
  get radiusFactor() {
    return RENDER.fishRadiusFactor;
  }

  /**
   * Returns the fish rendering color.
   *
   * @returns {number} Numeric fill color for fish circles.
   */
  get color() {
    return RENDER.fishColor;
  }

  /**
   * Selects a random adjacent empty cell, or stays put when blocked
   * (AC 14).
   *
   * @param {import('./WatorSimulation.js').WatorSimulation} sim Owning simulation.
   * @returns {number} Flat grid index of the destination cell.
   */
  selectDestination(sim) {
    const empties = sim.emptyNeighbors(this.pos);
    if (empties.length === 0) {
      return this.pos;
    }
    return empties[Math.floor(Math.random() * empties.length)];
  }
}
