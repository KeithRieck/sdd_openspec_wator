/**
 * Base class for all entities (fish and sharks) in the Wa-Tor simulation.
 *
 * Entity provides common properties (position, identity, breeding age)
 * and lifecycle methods. Subclasses must override {@link Entity#act}
 * and {@link Entity#createBaby} to implement species-specific behavior.
 *
 * @module simulation/Entity
 */
export class Entity {
  /**
   * Create an entity.
   *
   * @param {number} id   - Unique identifier.
   * @param {string} type - Entity type ("fish" or "shark").
   * @param {number} x    - Grid column.
   * @param {number} y    - Grid row.
   */
  constructor(id, type, x, y) {
    /** @type {number} */
    this.id = id;

    /** @type {string} */
    this.type = type;

    /** @type {number} */
    this.x = x;

    /** @type {number} */
    this.y = y;

    /** @type {number} Chronons survived since birth or last breed. */
    this.breedAge = 0;

    /** @type {boolean} Whether the entity is still alive. */
    this.alive = true;

    /**
     * Whether this entity was born during the current chronon.
     * Newborns are skipped for one full chronon (AC #12).
     *
     * @type {boolean}
     */
    this.bornThisChronon = true;
  }

  /**
   * Perform this entity's turn in the current chronon.
   *
   * Subclasses MUST override this method with species-specific behavior
   * (movement, eating, breeding, dying).
   *
   * @param {import('./Grid.js').Grid} grid - The simulation grid.
   * @abstract
   */
  act(grid) {
    throw new Error(`${this.constructor.name}.act() must be overridden`);
  }

  /**
   * Increment the breed age timer by one chronon.
   */
  age() {
    this.breedAge++;
  }

  /**
   * Check if this entity has reached its breeding threshold.
   *
   * @returns {boolean} True if breedAge >= breedTime.
   */
  canBreed() {
    throw new Error(`${this.constructor.name}.canBreed() must be overridden`);
  }

  /**
   * Mark this entity as dead.
   */
  die() {
    this.alive = false;
  }

  /**
   * Create a newborn of the same species at the given position.
   *
   * Subclasses MUST override to return the correct species type.
   *
   * @param {number} id - ID for the newborn.
   * @param {number} x  - Grid column for the newborn.
   * @param {number} y  - Grid row for the newborn.
   * @returns {Entity} A new entity instance.
   * @abstract
   */
  createBaby(id, x, y) {
    throw new Error(`${this.constructor.name}.createBaby() must be overridden`);
  }
}
