/**
 * Abstract base class for all Wa-Tor entities.
 * Holds identity, position, and breed timing.
 */
export class Entity {
  /**
   * @param {number} id - Unique entity identifier
   * @param {number} x - Column position
   * @param {number} y - Row position
   */
  constructor(id, x, y) {
    if (new.target === Entity) {
      throw new Error('Entity is abstract and cannot be instantiated directly');
    }
    /** @type {number} */
    this.id = id;
    /** @type {number} */
    this.x = x;
    /** @type {number} */
    this.y = y;
    /** @type {number} */
    this.breedAge = 0;
  }

  /**
   * Check if this entity is ready to breed.
   * @param {number} breedTime - Required chronons to breed
   * @returns {boolean}
   */
  canBreed(breedTime) {
    return this.breedAge >= breedTime;
  }

  /**
   * Age the breed timer by one chronon.
   */
  ageBreed() {
    this.breedAge += 1;
  }

  /**
   * Reset the breed timer to zero.
   */
  resetBreed() {
    this.breedAge = 0;
  }

  /**
   * Get the entity type string.
   * @returns {string}
   */
  getType() {
    throw new Error('getType() must be implemented by subclass');
  }
}
