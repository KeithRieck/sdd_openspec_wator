/**
 * Abstract base class for Wa-Tor entities. Holds shared state
 * (id, position, breed age, birth chronon) and shared movement/breeding
 * plumbing. Species behavior lives in subclasses (SE-R3a).
 */
export class Entity {
  /**
   * @param {number} id unique entity id
   * @param {number} pos flat grid index of the entity's cell
   * @param {number} bornChronon chronon at which the entity was created
   */
  constructor(id, pos, bornChronon) {
    /** @type {number} */
    this.id = id;
    /** @type {number} */
    this.pos = pos;
    /** @type {number} */
    this.breedAge = 0;
    /** @type {number} */
    this.bornChronon = bornChronon;
    /** @type {string} species tag, overridden by subclasses */
    this.type = 'entity';
  }

  /**
   * Species-specific action for one chronon. Implemented by subclasses.
   * @param {import('./WatorSimulation.js').WatorSimulation} sim
   */
  act(sim) { // eslint-disable-line no-unused-vars
    throw new Error('Entity.act() is abstract');
  }

  /**
   * @param {number} breedTime configured breed threshold
   * @returns {boolean} true when the entity is ready to reproduce
   */
  breedReady(breedTime) {
    return this.breedAge >= breedTime;
  }

  /** Resets the breed timer (AC 15, 16, 23, 25). */
  breedReset() {
    this.breedAge = 0;
  }

  /**
   * Creates a newborn of the same species. Implemented by subclasses.
   * @param {import('./WatorSimulation.js').WatorSimulation} sim
   * @param {number} pos flat grid index for the newborn
   * @returns {Entity}
   */
  spawn(sim, pos) { // eslint-disable-line no-unused-vars
    throw new Error('Entity.spawn() is abstract');
  }
}
