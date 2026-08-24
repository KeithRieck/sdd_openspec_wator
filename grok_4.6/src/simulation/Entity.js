/**
 * Shared Wa-Tor occupant: identity, toroidal position, and breed age.
 *
 * Fish and Shark extend this class. The type getter lets the viewer inspect
 * occupants without instanceof. wator-simulation requirement 10.
 */
export default class Entity {
    /**
     * @param {number} id - Stable identity for turn-order snapshots.
     * @param {number} x - Column.
     * @param {number} y - Row.
     * @param {number} [breedAge=0] - Chronons survived since last breed reset.
     */
    constructor(id, x, y, breedAge = 0) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.breedAge = breedAge;
    }

    /**
     * Occupant kind used by snapshots and rendering.
     *
     * @returns {string}
     */
    get type() {
        return 'entity';
    }

    /**
     * Breed threshold for this species.
     *
     * @returns {number}
     */
    get breedTime() {
        return 0;
    }

    /**
     * Whether this occupant may reproduce on this action.
     * wator-simulation requirements 6 and 9.
     *
     * @returns {boolean}
     */
    isBreedingReady() {
        return this.breedAge >= this.breedTime;
    }

    /**
     * Age one chronon, then reset if the occupant is now breeding-ready.
     * Returns whether the occupant was ready this action.
     * wator-simulation requirements 6 and 9.
     *
     * @returns {boolean}
     */
    ageOrResetBreed() {
        this.breedAge += 1;
        if (this.breedAge >= this.breedTime) {
            this.breedAge = 0;
            return true;
        }
        return false;
    }

    /**
     * Perform this occupant's chronon action.
     *
     * @param {object} _world - Occupancy façade.
     */
    act(_world) {
        throw new Error('Entity.act must be implemented by a species class');
    }
}
