/**
 * Abstract base class for Wa-Tor creatures.
 * Owns shared identity, position, breed age, and the act template method.
 * Spec: wator-simulation R3, R7, R10.
 */
export class Entity {
  /**
   * @param {number} id Unique entity id.
   * @param {number} x Column.
   * @param {number} y Row.
   * @param {number} bornChronon Chronon when this entity was created.
   * @param {number} [breedAge=0] Initial breed age.
   */
  constructor(id, x, y, bornChronon, breedAge = 0) {
    if (new.target === Entity) {
      throw new Error('Entity is abstract and cannot be constructed directly');
    }
    this.id = id;
    this.x = x;
    this.y = y;
    this.bornChronon = bornChronon;
    this.breedAge = breedAge;
    /** @type {boolean} */
    this.alive = true;
  }

  /**
   * @returns {'fish'|'shark'}
   */
  get type() {
    throw new Error('Entity.type must be implemented by subclass');
  }

  /**
   * @param {number} chronon Current simulation chronon before step completion.
   * @returns {boolean}
   */
  canAct(chronon) {
    return this.alive && this.bornChronon < chronon;
  }

  /**
   * @param {number} breedTime Species breed threshold.
   * @returns {boolean}
   */
  isBreedingReady(breedTime) {
    return this.breedAge >= breedTime;
  }

  /** Reset breed age after successful birth. */
  onBreedSuccess() {
    this.breedAge = 0;
  }

  /** Reset breed age when breeding-ready but blocked. */
  onBreedBlocked() {
    this.breedAge = 0;
  }

  /** Age breed counter by one chronon. */
  ageBreed() {
    this.breedAge += 1;
  }

  /**
   * Shared action template: prelude → move → breed bookkeeping.
   * Spec: wator-simulation R5–R8, R10.
   * @param {import('./WatorSimulation.js').WatorSimulation} world
   */
  act(world) {
    if (!this.alive) {
      return;
    }
    if (!this.survivePrelude(world)) {
      return;
    }

    const oldX = this.x;
    const oldY = this.y;
    const moved = this.tryMove(world);
    const breedTime = this.getBreedTime();

    if (this.isBreedingReady(breedTime)) {
      if (moved) {
        const child = this.createOffspring(world.allocateId(), oldX, oldY, world.getChronon());
        world.spawn(child);
        this.onBreedSuccess();
      } else {
        this.onBreedBlocked();
      }
    } else {
      this.ageBreed();
    }
  }

  /**
   * Species-specific start-of-action logic.
   * @param {import('./WatorSimulation.js').WatorSimulation} world
   * @returns {boolean} true if the entity may continue acting.
   */
  // eslint-disable-next-line no-unused-vars
  survivePrelude(world) {
    return true;
  }

  /**
   * Species-specific movement attempt.
   * @param {import('./WatorSimulation.js').WatorSimulation} world
   * @returns {boolean} true if the entity moved.
   */
  // eslint-disable-next-line no-unused-vars
  tryMove(world) {
    throw new Error('Entity.tryMove must be implemented by subclass');
  }

  /**
   * @returns {number}
   */
  getBreedTime() {
    throw new Error('Entity.getBreedTime must be implemented by subclass');
  }

  /**
   * @param {number} id
   * @param {number} x
   * @param {number} y
   * @param {number} bornChronon
   * @returns {Entity}
   */
  // eslint-disable-next-line no-unused-vars
  createOffspring(id, x, y, bornChronon) {
    throw new Error('Entity.createOffspring must be implemented by subclass');
  }
}
