/**
 * Abstract base class for all entities in the Wa-Tor simulation.
 *
 * Entities are living creatures (fish or sharks) that occupy cells in the
 * toroidal grid. Each entity has a unique ID, a position (as a flat grid
 * index), a breed age tracking how many chronons until it can reproduce,
 * and lifecycle state flags.
 *
 * Subclasses (Fish, Shark) implement the abstract act() method to define
 * their specific behavior during each chronon.
 *
 * @abstract
 * @see prd-v001.md requirements #27, #58-60
 */
export class Entity {
    /**
     * Create a new entity.
     * @param {number} id - Unique identifier for this entity
     * @param {number} position - Flat grid array index of the entity's cell
     * @param {number} breedTime - Number of chronons before this entity can breed
     */
    constructor(id, position, breedTime) {
        /** @type {number} Unique entity identifier */
        this.id = id;

        /** @type {number} Flat grid array index of the entity's cell */
        this.position = position;

        /** @type {number} Number of chronons survived (increments each chronon) */
        this.breedAge = 0;

        /** @type {number} Number of chronons required before breeding */
        this.breedTime = breedTime;

        /** @type {boolean} True if this entity was born during the current chronon */
        this.bornThisChronon = false;

        /** @type {boolean} True if this entity is alive (not eaten or starved) */
        this.isAlive = true;

        /** @type {string} Entity type identifier ('fish' or 'shark') */
        this.type = 'entity';
    }

    /**
     * Perform this entity's action for the current chronon.
     * Must be implemented by subclasses.
     * @abstract
     * @param {Array<number|null>} grid - The flat grid array (entity ID or null per cell)
     * @param {Map<number, Entity>} entities - Map of entity ID to entity object
     * @param {import('./RandomNumberGenerator.js').RandomNumberGenerator} rng - Single RNG source
     * @param {object} simulation - Reference to the WatorSimulation for helper methods
     */
    act(grid, entities, rng, simulation) {
        throw new Error('Entity.act() must be implemented by subclasses');
    }

    /**
     * Check if this entity is ready to breed.
     * @returns {boolean} True if breedAge >= breedTime
     */
    canBreed() {
        return this.breedAge >= this.breedTime;
    }

    /**
     * Reset the breed age to 0 after successful reproduction.
     */
    resetBreedAge() {
        this.breedAge = 0;
    }

    /**
     * Increment the breed age by 1 (called each chronon the entity survives).
     */
    age() {
        this.breedAge++;
    }

    /**
     * Mark this entity as born during the current chronon.
     * Newborns cannot act until the next chronon (PRD #12).
     */
    markBorn() {
        this.bornThisChronon = true;
    }

    /**
     * Clear the born-this-chronon flag at the start of a new chronon.
     */
    clearBornFlag() {
        this.bornThisChronon = false;
    }

    /**
     * Mark this entity as dead (eaten or starved).
     */
    die() {
        this.isAlive = false;
    }
}

export default Entity;
