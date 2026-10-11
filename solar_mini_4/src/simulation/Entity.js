/**
 * Base class for all entities in the Wa-Tor simulation.
 * R3: Entity model - base class exposing shared behavior
 * R58: Entity base class defined
 * R59: Shared behavior of entities including position, breed age, breeding readiness
 */
export default class Entity {
    /**
     * Create an entity.
     * @param {number} id - Unique entity ID
     * @param {number} x - X position (column)
     * @param {number} y - Y position (row)
     */
    constructor(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.breedAge = 0;
        this.isAlive = true;
    }

    /**
     * Check if the entity is breeding ready.
     * @returns {boolean} True if breeding ready
     */
    isBreedingReady() {
        return this.breedAge >= this.breedTime;
    }

    /**
     * Reset the breed age to zero.
     */
    resetBreedAge() {
        this.breedAge = 0;
    }

    /**
     * Act during a chronon. Subclasses override this.
     */
    act() {
        // Default: no action
    }
}
