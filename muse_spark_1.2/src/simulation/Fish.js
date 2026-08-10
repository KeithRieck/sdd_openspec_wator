import { Entity } from './Entity.js';

/**
 * Fish entity — prey in the Wa-Tor simulation.
 */
export class Fish extends Entity {
  /**
   * @param {number} id - Unique identifier
   * @param {number} x - Column position
   * @param {number} y - Row position
   */
  constructor(id, x, y) {
    super(id, x, y);
  }

  /**
   * Get the entity type.
   * @returns {string}
   */
  getType() {
    return 'fish';
  }
}
