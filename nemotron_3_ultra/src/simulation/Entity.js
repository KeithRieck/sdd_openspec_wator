/**
 * Abstract base class for all entities in the Wa-Tor simulation.
 * Encapsulates common state: unique ID, grid position, and breed age.
 * @module simulation/Entity
 */

/**
 * Represents an entity in the Wa-Tor world.
 * @abstract
 */
export class Entity {
    /**
     * Create a new entity.
     * @param {number} id - Unique entity identifier
     * @param {number} x - Grid column position (0 to width-1)
     * @param {number} y - Grid row position (0 to height-1)
     */
    constructor(id, x, y) {
        /**
         * Unique entity identifier
         * @type {number}
         * @private
         */
        this._id = id;

        /**
         * Grid column position
         * @type {number}
         * @private
         */
        this._x = x;

        /**
         * Grid row position
         * @type {number}
         * @private
         */
        this._y = y;

        /**
         * Number of chronons since last breeding (or since birth)
         * @type {number}
         * @private
         */
        this._breedAge = 0;
    }

    /**
     * Get the entity's unique ID.
     * @returns {number} The entity ID
     */
    getId() {
        return this._id;
    }

    /**
     * Get the entity's grid column position.
     * @returns {number} The x coordinate
     */
    getX() {
        return this._x;
    }

    /**
     * Get the entity's grid row position.
     * @returns {number} The y coordinate
     */
    getY() {
        return this._y;
    }

    /**
     * Set the entity's grid position.
     * @param {number} x - New column position
     * @param {number} y - New row position
     */
    setPosition(x, y) {
        this._x = x;
        this._y = y;
    }

    /**
     * Get the entity's current breed age.
     * @returns {number} The breed age in chronons
     */
    getBreedAge() {
        return this._breedAge;
    }

    /**
     * Increment the entity's breed age by one chronon.
     */
    incrementBreedAge() {
        this._breedAge++;
    }

    /**
     * Reset the entity's breed age to zero (after breeding).
     */
    resetBreedAge() {
        this._breedAge = 0;
    }

    /**
     * Check if the entity is ready to breed.
     * @param {number} breedTime - The required breed time threshold
     * @returns {boolean} True if breed age >= breedTime
     */
    isBreedingReady(breedTime) {
        return this._breedAge >= breedTime;
    }

    /**
     * Get the entity type identifier.
     * Must be overridden by subclasses.
     * @returns {string} The entity type ("fish" or "shark")
     * @abstract
     */
    getType() {
        throw new Error('getType() must be implemented by subclass');
    }

    /**
     * Perform the entity's action for the current chronon.
     * Must be overridden by subclasses.
     * @param {Object} grid - The simulation grid interface
     * @param {Object} config - Configuration constants
     * @returns {Object} Action result describing what happened
     * @abstract
     */
    act(grid, config) {
        throw new Error('act() must be implemented by subclass');
    }
}