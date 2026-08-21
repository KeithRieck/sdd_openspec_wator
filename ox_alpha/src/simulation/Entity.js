/**
 * @file Abstract base class for all Wa-Tor entities.
 */

/**
 * Abstract base class for fish and sharks.
 *
 * Implements the shared chronon action cycle as a template method
 * (design D2): a pre-act hook, polymorphic destination selection, and
 * shared breeding bookkeeping. Subclasses are {@link Fish} and
 * {@link Shark}. The class knows nothing about Phaser (AC 4).
 *
 * Breeding rules implemented here (AC 15-17, 23, 25-26):
 * - breeding-ready + successful move: newborn of the same type is left
 *   in the old cell and the parent's breed timer resets to 0;
 * - breeding-ready + blocked: breed timer resets to 0;
 * - not breeding-ready + blocked: breed timer keeps aging.
 */
export class Entity {
  /**
   * Creates an entity.
   *
   * @param {number} id Unique entity ID (positive integer).
   * @param {number} pos Flat grid index of the entity's cell.
   * @param {number} breedTime Chronons needed before this entity may breed.
   * @param {boolean} [bornThisChronon=false] True when created during the
   *   current chronon; such entities do not act until the next chronon (AC 12).
   */
  constructor(id, pos, breedTime, bornThisChronon = false) {
    /** @type {number} Unique entity ID. */
    this.id = id;
    /** @type {number} Flat grid index of the occupied cell. */
    this.pos = pos;
    /** @type {number} Number of chronons survived since last breeding. */
    this.breedAge = 0;
    /** @type {number} Chronons required before breeding is possible. */
    this.breedTime = breedTime;
    /** @type {boolean} True while the entity is alive (not eaten/starved). */
    this.alive = true;
    /** @type {boolean} True when born during the current chronon (AC 12). */
    this.bornThisChronon = bornThisChronon;
  }

  /**
   * Numeric type discriminator for this entity's class. Subclasses
   * override with a unique constant.
   *
   * @returns {number} Type code.
   */
  get type() {
    throw new Error('Entity.type must be overridden by subclasses');
  }

  /**
   * Template method advancing this entity one chronon (AC 11-26).
   *
   * Sequence: pre-act hook (may kill the entity, e.g. shark starvation)
   * -> breed aging -> destination selection -> movement -> breeding
   * bookkeeping -> post-move hook (shark eating).
   *
   * @param {import('./WatorSimulation.js').WatorSimulation} sim Owning simulation.
   * @returns {void}
   */
  act(sim) {
    if (!this.preAct(sim)) {
      return; // Entity died in preAct (AC 19).
    }
    const oldPos = this.pos;
    const destination = this.selectDestination(sim);
    const moved = destination !== oldPos;
    if (moved) {
      sim.moveEntity(this, destination);
    }
    const breedingReady = this.breedAge >= this.breedTime;
    if (moved) {
      if (breedingReady) {
        sim.spawnChild(this, oldPos);
        this.breedAge = 0;
      } else {
        this.breedAge += 1;
      }
    } else if (breedingReady) {
      // Blocked while breeding-ready: reset the timer (AC 16, 25).
      this.breedAge = 0;
    } else {
      // Blocked below the threshold: keep aging (AC 17, 26).
      this.breedAge += 1;
    }
    if (moved) {
      this.afterMove(sim, oldPos);
    }
  }

  /**
   * Pre-action hook invoked before movement. Default behavior is to
   * survive. {@link Shark} overrides this to drain energy and starve
   * before moving or eating (AC 18-19).
   *
   * @param {import('./WatorSimulation.js').WatorSimulation} sim Owning simulation.
   * @returns {boolean} True if the entity survives to act, false if it died.
   */
  preAct(sim) {
    return true;
  }

  /**
   * Selects the destination cell for this chronon. Returns the current
   * position when no valid destination exists (no movement).
   *
   * @param {import('./WatorSimulation.js').WatorSimulation} sim Owning simulation.
   * @returns {number} Flat grid index of the destination cell.
   */
  selectDestination(sim) {
    return this.pos;
  }

  /**
   * Post-move hook invoked after a successful move. Default behavior is
   * a no-op. {@link Shark} overrides this to devour a fish and gain
   * energy (AC 20-21).
   *
   * @param {import('./WatorSimulation.js').WatorSimulation} sim Owning simulation.
   * @param {number} oldPos Flat grid index of the cell moved from.
   * @returns {void}
   */
  afterMove(sim, oldPos) {}
}
