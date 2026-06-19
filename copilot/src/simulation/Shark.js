/**
 * Shark entity implementation for Wa-Tor.
 */
import Entity from './Entity.js';
import { CONFIG } from '../config.js';

export default class Shark extends Entity {
  constructor(id, x, y, bornChronon = 0, energy = CONFIG.INITIAL_SHARK_ENERGY) {
    super(id, 'shark', x, y, bornChronon);
    this.energy = energy;
  }

  /**
   * @param {import('./WatorSimulation.js').default} sim
   */
  act(sim) {
    const chronon = sim.getChronon();
    if (this.bornChronon === chronon) return;

    this.energy -= CONFIG.SHARK_ENERGY_COST_PER_CHRONON;
    if (this.energy <= 0) {
      sim.removeEntity(this.id);
      return;
    }

    const fishNeighbors = sim.getFishNeighbors(this.x, this.y);
    const oldX = this.x;
    const oldY = this.y;

    if (fishNeighbors.length > 0) {
      const prey = sim.randomChoice(fishNeighbors);
      sim.removeEntity(prey.id);
      const moved = sim.moveEntity(this.id, prey.x, prey.y);
      if (moved) {
        this.energy += CONFIG.SHARK_ENERGY_GAIN;
        if (this.canBreed(CONFIG.SHARK_BREED_TIME)) {
          sim.spawnEntity('shark', oldX, oldY, chronon, CONFIG.INITIAL_SHARK_ENERGY);
          this.resetBreed();
        } else {
          this.age();
        }
      } else {
        if (this.canBreed(CONFIG.SHARK_BREED_TIME)) {
          this.resetBreed();
        } else {
          this.age();
        }
      }
      return;
    }

    const emptyNeighbors = sim.getEmptyNeighbors(this.x, this.y);
    if (emptyNeighbors.length > 0) {
      const dest = sim.randomChoice(emptyNeighbors);
      const moved = sim.moveEntity(this.id, dest.x, dest.y);
      if (moved) {
        if (this.canBreed(CONFIG.SHARK_BREED_TIME)) {
          sim.spawnEntity('shark', oldX, oldY, chronon, CONFIG.INITIAL_SHARK_ENERGY);
          this.resetBreed();
        } else {
          this.age();
        }
      } else {
        if (this.canBreed(CONFIG.SHARK_BREED_TIME)) {
          this.resetBreed();
        } else {
          this.age();
        }
      }
    } else {
      if (this.canBreed(CONFIG.SHARK_BREED_TIME)) {
        this.resetBreed();
      } else {
        this.age();
      }
    }
  }
}
