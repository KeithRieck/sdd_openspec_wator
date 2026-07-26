/**
 * Shark entity in the Wa-Tor simulation.
 *
 * Sharks lose energy each chronon, die at zero energy, hunt adjacent
 * fish for energy, move to empty cells when no fish are nearby,
 * and breed when breeding-ready.
 *
 * @module simulation/Shark
 */
import { Entity } from './Entity.js';
import { CONFIG } from '../config.js';

export class Shark extends Entity {
  /**
   * Create a shark entity.
   *
   * @param {number} id     - Unique identifier.
   * @param {number} x      - Grid column.
   * @param {number} y      - Grid row.
   * @param {number} [energy] - Initial energy (defaults to initialSharkEnergy).
   */
  constructor(id, x, y, energy = CONFIG.initialSharkEnergy) {
    super(id, 'shark', x, y);

    /** @type {number} Current energy. Shark dies when this reaches 0. */
    this.energy = energy;
  }

  /**
   * Perform the shark's turn: lose energy, check starvation,
   * hunt fish or move, breed if ready, and age.
   *
   * @param {import('./Grid.js').Grid} grid - The simulation grid.
   */
  act(grid) {
    // AC #18: Decrement energy before anything else
    this.energy -= CONFIG.sharkEnergyCostPerChronon;

    // AC #19: Die immediately if energy reaches 0
    if (this.energy <= 0) {
      grid.remove(this);
      return;
    }

    const fishNeighbors = grid.getFishNeighbors(this.x, this.y);
    const ready = this.canBreed();

    if (fishNeighbors.length > 0) {
      // AC #20: Hunt — move to a random adjacent fish cell
      const [fx, fy] = fishNeighbors[Math.floor(Math.random() * fishNeighbors.length)];
      const prey = grid.get(fx, fy);
      const oldX = this.x;
      const oldY = this.y;

      // Eat the fish (remove it)
      grid.remove(prey);

      // Move to the fish's former position
      grid.move(this, fx, fy);

      // AC #21: Gain energy from eating
      this.energy += CONFIG.sharkEnergyGain;

      if (ready) {
        // AC #23: Breed — leave newborn at old position
        grid.spawnAt(oldX, oldY, Shark);
        this.breedAge = 0;
      }
    } else {
      // No fish nearby — try to move to an empty cell
      const emptyNeighbors = grid.getEmptyNeighbors(this.x, this.y);

      if (emptyNeighbors.length > 0) {
        // AC #22: Move to random empty cell
        const [nx, ny] = emptyNeighbors[Math.floor(Math.random() * emptyNeighbors.length)];
        const oldX = this.x;
        const oldY = this.y;

        grid.move(this, nx, ny);

        if (ready) {
          // AC #23: Breed — leave newborn at old position
          grid.spawnAt(oldX, oldY, Shark);
          this.breedAge = 0;
        }
      } else {
        // AC #25: Can't move at all
        if (ready) {
          this.breedAge = 0;
        }
        // AC #26: if not ready, breedAge continues aging (handled below)
      }
    }

    // Always age (if we reset to 0, aging to 1 is correct)
    this.age();
  }

  /**
   * Check if this shark has reached its breeding threshold.
   *
   * @returns {boolean} True if breedAge >= sharkBreedTime.
   */
  canBreed() {
    return this.breedAge >= CONFIG.sharkBreedTime;
  }

  /**
   * Create a newborn shark at the given position.
   *
   * @param {number} id - ID for the newborn.
   * @param {number} x  - Grid column.
   * @param {number} y  - Grid row.
   * @returns {Shark} A new Shark instance.
   */
  createBaby(id, x, y) {
    return new Shark(id, x, y);
  }
}
