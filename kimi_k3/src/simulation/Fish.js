import { Entity } from './Entity.js';
import { FISH_BREED_TIME } from '../config.js';

/**
 * Fish: moves to a random adjacent empty cell and reproduces after
 * surviving FISH_BREED_TIME chronons (SE-R6 / AC 14-17).
 */
export class Fish extends Entity {
  /** @param {number} id @param {number} pos @param {number} bornChronon */
  constructor(id, pos, bornChronon) {
    super(id, pos, bornChronon);
    this.type = 'fish';
  }

  /**
   * Executes one chronon of fish behavior: move to a random adjacent
   * empty cell if any; breed on move when ready; reset timer when
   * breeding-ready but blocked; otherwise age (AC 14-17).
   * @param {import('./WatorSimulation.js').WatorSimulation} sim
   */
  act(sim) {
    const empties = sim.emptyNeighbors(this.pos);
    const ready = this.breedReady(FISH_BREED_TIME);
    if (empties.length > 0) {
      const dest = empties[(Math.random() * empties.length) | 0];
      const oldPos = this.pos;
      sim.moveEntity(this, dest);
      if (ready) {
        sim.addEntity(this.spawn(sim, oldPos), oldPos);
        this.breedReset();
      } else {
        this.breedAge++;
      }
    } else if (ready) {
      this.breedReset(); // AC 16: blocked but breeding-ready resets
    } else {
      this.breedAge++; // AC 17: blocked non-ready fish keeps aging
    }
  }

  /**
   * @param {import('./WatorSimulation.js').WatorSimulation} sim
   * @param {number} pos
   * @returns {Fish}
   */
  spawn(sim, pos) {
    return new Fish(sim.allocId(), pos, sim.chronon);
  }
}
