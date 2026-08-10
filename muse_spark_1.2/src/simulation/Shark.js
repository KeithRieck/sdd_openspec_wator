import { Entity } from './Entity.js';

/**
 * Shark entity — predator in the Wa-Tor simulation.
 */
export class Shark extends Entity {
  /**
   * @param {number} id - Unique identifier
   * @param {number} x - Column position
   * @param {number} y - Row position
   * @param {number} energy - Initial energy
   */
  constructor(id, x, y, energy) {
    super(id, x, y);
    /** @type {number} */
    this.energy = energy;
  }

  /**
   * Get the entity type.
   * @returns {string}
   */
  getType() {
    return 'shark';
  }

  /**
   * Spend energy. Returns true if still alive.
   * @param {number} cost - Energy cost
   * @returns {boolean} True if energy > 0 after spending
   */
  spendEnergy(cost) {
    this.energy -= cost;
    return this.energy > 0;
  }

  /**
   * Gain energy from eating.
   * @param {number} amount - Energy gained
   */
  gainEnergy(amount) {
    this.energy += amount;
  }

  /**
   * Check if shark has starved.
   * @returns {boolean}
   */
  isStarved() {
    return this.energy <= 0;
  }
}
