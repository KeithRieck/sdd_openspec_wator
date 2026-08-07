/**
 * Base Entity class for Wa-Tor simulation.
 * Represents a creature on the toroidal grid with common properties.
 */
export class Entity {
    /**
     * Creates a new Entity.
     * @param {string} id - Unique identifier for the entity
     * @param {number} x - X coordinate on the grid
     * @param {number} y - Y coordinate on the grid
     * @param {string} type - Type of entity ('fish' or 'shark')
     */
    constructor(id, x, y, type) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.breedAge = 0;
        this.type = type;
    }

    /**
     * Increments the breed age of the entity.
     */
    age() {
        this.breedAge++;
    }

    /**
     * Resets the breed age to 0.
     */
    resetBreedAge() {
        this.breedAge = 0;
    }

    /**
     * Checks if the entity is ready to breed.
     * @param {number} breedTime - The breed time threshold for this entity type
     * @returns {boolean} True if breedAge >= breedTime
     */
    isBreedingReady(breedTime) {
        return this.breedAge >= breedTime;
    }

    /**
     * Gets the grid index for this entity's position.
     * @param {number} width - The width of the grid
     * @returns {number} The flat array index
     */
    getGridIndex(width) {
        return this.y * width + this.x;
    }

    /**
     * Creates a copy of this entity at a new position.
     * @param {string} newId - The ID for the new entity
     * @param {number} newX - The new X coordinate
     * @param {number} newY - The new Y coordinate
     * @returns {Entity} A new entity with the same type
     */
    clone(newId, newX, newY) {
        return new Entity(newId, newX, newY, this.type);
    }
}
