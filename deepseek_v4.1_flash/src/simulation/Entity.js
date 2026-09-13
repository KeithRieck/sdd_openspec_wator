/**
 * Shared behavior for every creature in the Wa-Tor world.
 *
 * `Entity` is the base class named by requirement `world-model` §4. It holds
 * the state common to fish and sharks - identity, grid position, breed age,
 * and liveness - and leaves the per-chronon decision to subclasses through the
 * abstract {@link Entity#act} method (`world-model` §4.3, `chronon-rules` §2).
 *
 * Position is stored as a flat grid index (`world-model` §3.1). The index is
 * the single source of truth for where the entity is; `x` and `y` are provided
 * as derived conveniences for rendering.
 *
 * @typedef {Object} EntityOptions
 * @property {number} id - Unique, never-reused entity identifier.
 * @property {number} position - Flat grid index of the entity's cell.
 */

export default class Entity {
    /**
     * Create an entity at a flat grid position.
     *
     * @param {EntityOptions} options - Identity and initial position.
     */
    constructor({ id, position }) {
        /** @type {number} Unique identifier, never reused (`world-model` §3.4). */
        this.id = id;
        /** @type {number} Flat grid index of this entity's cell. */
        this.position = position;
        /** @type {number} Chronons survived since the last reproduction. */
        this.breedAge = 0;
        /** @type {boolean} False once the entity has died or been eaten. */
        this.alive = true;
    }

    /** @returns {string} Either `fish` or `shark`. */
    get kind() {
        throw new Error('Entity subclasses must define `kind`');
    }

    /** @returns {number} Chronons required before this entity may reproduce. */
    get breedTime() {
        throw new Error('Entity subclasses must define `breedTime`');
    }

    /**
     * Decide this entity's action for the current chronon.
     *
     * Implemented by each subclass, which performs its own movement,
     * predation, and reproduction (`world-model` §4.3, `chronon-rules` §2).
     *
     * @param {import('./types.js').World} world - Capabilities the entity may
     *   use, supplied by the simulation (design D3).
     * @returns {void}
     */
    act(world) {
        throw new Error('Entity subclasses must implement `act(world)`');
    }

    /**
     * Report whether this entity is ready to reproduce.
     *
     * @returns {boolean} True once the breed age has reached the breed time
     *   configured for this entity's kind (`world-model` §4.2).
     */
    isBreeding() {
        return this.breedAge >= this.breedTime;
    }
}
