import { Entity } from './Entity.js';
import {
  SHARK_BREED_TIME,
  INITIAL_SHARK_ENERGY,
  SHARK_ENERGY_GAIN,
  SHARK_ENERGY_COST,
} from '../config.js';

/**
 * Shark: loses energy each chronon, starves at zero, hunts adjacent
 * fish, otherwise moves to empty cells, and breeds after surviving
 * SHARK_BREED_TIME chronons (SE-R7, SE-R8 / AC 18-26).
 */
export class Shark extends Entity {
  /**
   * @param {number} id
   * @param {number} pos
   * @param {number} bornChronon
   * @param {number} [energy] defaults to INITIAL_SHARK_ENERGY
   */
  constructor(id, pos, bornChronon, energy = INITIAL_SHARK_ENERGY) {
    super(id, pos, bornChronon);
    this.type = 'shark';
    /** @type {number} */
    this.energy = energy;
  }

  /**
   * Executes one chronon of shark behavior in fixed order (AC 18-26):
   * energy decrement, starvation removal, eat-or-move, then breeding.
   * @param {import('./WatorSimulation.js').WatorSimulation} sim
   */
  act(sim) {
    this.energy -= SHARK_ENERGY_COST; // AC 18: decrement first
    if (this.energy <= 0) {
      sim.removeEntity(this); // AC 19: starve without moving/eating
      return;
    }
    const fishCells = sim.fishNeighbors(this.pos);
    const empties = fishCells.length === 0 ? sim.emptyNeighbors(this.pos) : [];
    const destinations = fishCells.length > 0 ? fishCells : empties;
    const ready = this.breedReady(SHARK_BREED_TIME);
    if (destinations.length > 0) {
      const dest = destinations[(Math.random() * destinations.length) | 0];
      const oldPos = this.pos;
      if (fishCells.length > 0) {
        sim.removeEntity(sim.grid[dest]); // AC 20: devour the fish
        this.energy += SHARK_ENERGY_GAIN; // AC 21
      }
      sim.moveEntity(this, dest);
      if (ready) {
        sim.addEntity(this.spawn(sim, oldPos), oldPos); // AC 23, 24
        this.breedReset();
      } else {
        this.breedAge++;
      }
    } else if (ready) {
      this.breedReset(); // AC 25: blocked but breeding-ready resets
    } else {
      this.breedAge++; // AC 26: blocked non-ready shark keeps aging
    }
  }

  /**
   * Newborn sharks start with INITIAL_SHARK_ENERGY (AC 24).
   * @param {import('./WatorSimulation.js').WatorSimulation} sim
   * @param {number} pos
   * @returns {Shark}
   */
  spawn(sim, pos) {
    return new Shark(sim.allocId(), pos, sim.chronon);
  }
}
