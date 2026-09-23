/**
 * Abstract base class for Wa-Tor world entities (spec Req 18, prd-v001 AC 58).
 *
 * Every entity carries an ID, a position (the flat grid index of its cell,
 * spec Req 19.2), a breed age, and the chronon it was born in. The class holds
 * the behavior shared by all species: aging toward breeding readiness (spec
 * Req 59) and the move-plus-breed mechanics of the breed-timer table (design
 * D3). Subclasses decide their own chronon action (spec Req 60) via {@link
 * Entity#act}. This module is part of the Phaser-free simulation engine
 * (spec Req 2.2).
 */
export default class Entity {
    /**
     * Create an entity.
     *
     * @param {import('./WatorSimulation.js').default} sim - Owning simulation.
     * @param {number} id - Unique entity ID stored in the grid slot (spec Req 19.1).
     * @param {number} pos - Flat grid index of the entity's cell (spec Req 19.2).
     * @param {number} bornChronon - Chronon of birth; entities born in the
     *   current chronon do not act until the next one (spec Req 9.1).
     */
    constructor(sim, id, pos, bornChronon) {
        this.sim = sim;
        this.id = id;
        this.pos = pos;
        this.bornChronon = bornChronon;
        this.breedAge = 0;
    }

    /**
     * Chronons this species must survive before becoming breeding-ready.
     * Species-specific; defined by each subclass.
     *
     * @abstract
     * @returns {number} Breed time in chronons.
     */
    get breedTime() {
        throw new Error('Entity subclasses must define breedTime');
    }

    /**
     * Whether this entity has survived long enough to breed (spec Req 59).
     *
     * @returns {boolean} True when the breed age has reached the species breed time.
     */
    get breedReady() {
        return this.breedAge >= this.breedTime;
    }

    /**
     * Perform this entity's action for the current chronon (spec Req 60).
     * Each subclass decides its own behavior.
     *
     * @abstract
     */
    act() {
        throw new Error('Entity subclasses must define act()');
    }

    /**
     * Count one more survived chronon toward breeding readiness (design D3).
     */
    ageOneChronon() {
        this.breedAge += 1;
    }

    /**
     * Reset the breed timer to `0` after reproducing (spec Req 12.1, 17.1).
     */
    resetBreedTimer() {
        this.breedAge = 0;
    }

    /**
     * Spawn a newborn of this entity's own kind in the given cell when
     * breeding-ready, resetting the parent's breed timer (spec Req 12.1,
     * 17.1). No-op when not breeding-ready.
     *
     * @param {number} oldCell - Flat grid index of the cell just vacated.
     */
    spawnIfReady(oldCell) {
        if (this.breedReady) {
            this.sim.spawnAt(oldCell, this.constructor, this.sim.chronon);
            this.resetBreedTimer();
        }
    }

    /**
     * Move to a randomly chosen adjacent empty cell and apply the shared
     * breed-timer table (design D3): a breeding-ready mover leaves a newborn
     * in the old cell (spec Req 12.1, 17.1); a breeding-ready blocked entity
     * resets its timer without spawning (spec Req 12.2, 17.2); a non-ready
     * blocked entity keeps its aged timer (spec Req 12.3, 17.3).
     *
     * @param {number[]} emptyNeighbors - Flat grid indices of adjacent empty cells.
     * @returns {boolean} True when the entity moved, false when it stayed put.
     */
    tryMoveOrBreed(emptyNeighbors) {
        if (emptyNeighbors.length > 0) {
            const dest = this.sim.randomChoice(emptyNeighbors);
            const oldCell = this.pos;
            this.sim.moveEntityTo(this, dest);
            this.spawnIfReady(oldCell);
            return true;
        }
        if (this.breedReady) {
            this.resetBreedTimer();
        }
        return false;
    }
}
