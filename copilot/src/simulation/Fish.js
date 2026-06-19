/**
 * Fish entity implementation for Wa-Tor.
 */
import Entity from './Entity.js';
import { CONFIG } from '../config.js';

export default class Fish extends Entity {
  constructor(id, x, y, bornChronon = 0) {
    super(id, 'fish', x, y, bornChronon);
  }

  /**
   * @param {import('./WatorSimulation.js').default} sim
   */
  act(sim) {
    const chronon = sim.getChronon();
    if (this.bornChronon === chronon) return;

    const emptyNeighbors = sim.getEmptyNeighbors(this.x, this.y);
    if (emptyNeighbors.length > 0) {
      const dest = sim.randomChoice(emptyNeighbors);
      const oldX = this.x;
      const oldY = this.y;
      const moved = sim.moveEntity(this.id, dest.x, dest.y);
      if (moved) {
        if (this.canBreed(CONFIG.FISH_BREED_TIME)) {
          sim.spawnEntity('fish', oldX, oldY, chronon);
          this.resetBreed();
        } else {
          this.age();
        }
      } else {
        if (this.canBreed(CONFIG.FISH_BREED_TIME)) {
          this.resetBreed();
        } else {
          this.age();
        }
      }
    } else {
      if (this.canBreed(CONFIG.FISH_BREED_TIME)) {
        this.resetBreed();
      } else {
        this.age();
      }
    }
  }
}
