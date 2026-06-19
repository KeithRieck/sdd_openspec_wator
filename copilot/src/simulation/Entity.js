/**
 * Abstract base class for Wa-Tor entities.
 */
export default class Entity {
  /**
   * @param {number} id
   * @param {'fish'|'shark'} type
   * @param {number} x
   * @param {number} y
   * @param {number} bornChronon
   */
  constructor(id, type, x, y, bornChronon = 0) {
    this.id = id;
    this.type = type;
    this.x = x;
    this.y = y;
    this.breedAge = 0;
    this.bornChronon = bornChronon;
  }

  age() {
    this.breedAge += 1;
  }

  canBreed(breedTime) {
    return this.breedAge >= breedTime;
  }

  resetBreed() {
    this.breedAge = 0;
  }

  /**
   * @param {import('./WatorSimulation.js').default} sim
   */
  act(sim) {
    throw new Error('Entity.act() must be implemented by subclasses');
  }
}
