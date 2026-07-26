/**
 * Fish entity in the Wa-Tor simulation.
 *
 * Fish move randomly to adjacent empty cells. When breeding-ready
 * and able to move, they leave a new fish at their old position.
 *
 * @module simulation/Fish
 */
import { Entity } from './Entity.js';
import { CONFIG } from '../config.js';

export class Fish extends Entity {
  /**
   * Create a fish entity.
   *
   * @param {number} id - Unique identifier.
   * @param {number} x  - Grid column.
   * @param {number} y  - Grid row.
   */
  constructor(id, x, y) {
    super(id, 'fish', x, y);
  }

  /**
   * Perform the fish's turn: move to a random empty neighbor,
   * breed if ready, and age.
   *
   * @param {import('./Grid.js').Grid} grid - The simulation grid.
   */
  act(grid) {
    const emptyNeighbors = grid.getEmptyNeighbors(this.x, this.y);
    const ready = this.canBreed();

    if (emptyNeighbors.length > 0) {
      // Pick a random empty neighbor
      const [nx, ny] = emptyNeighbors[Math.floor(Math.random() * emptyNeighbors.length)];
      const oldX = this.x;
      const oldY = this.y;

      // Move to the new cell
      grid.move(this, nx, ny);

      if (ready) {
        // Breed: leave a new fish at the old position
        grid.spawnAt(oldX, oldY, Fish);
        this.breedAge = 0;
      }
    } else {
      // Can't move
      if (ready) {
        // AC #16: reset breed timer but don't spawn (no empty cell)
        this.breedAge = 0;
      }
      // AC #17: if not ready, breedAge continues aging (handled below)
    }

    // Age after acting (unless just reset by breeding)
    if (!ready || emptyNeighbors.length === 0) {
      // Only age if we didn't just reset breedAge
    }
    // Always age — if we reset to 0 above, aging to 1 is correct
    this.age();
  }

  /**
   * Check if this fish has reached its breeding threshold.
   *
   * @returns {boolean} True if breedAge >= fishBreedTime.
   */
  canBreed() {
    return this.breedAge >= CONFIG.fishBreedTime;
  }

  /**
   * Create a newborn fish at the given position.
   *
   * @param {number} id - ID for the newborn.
   * @param {number} x  - Grid column.
   * @param {number} y  - Grid row.
   * @returns {Fish} A new Fish instance.
   */
  createBaby(id, x, y) {
    return new Fish(id, x, y);
  }
}
