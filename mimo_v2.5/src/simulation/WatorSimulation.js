/**
 * Orchestrates the Wa-Tor simulation.
 *
 * Manages chronon processing, population counting, extinction detection,
 * and simulation state (running, paused, terminal). The simulation
 * engine is framework-independent — no Phaser imports.
 *
 * @module simulation/WatorSimulation
 */
import { CONFIG } from '../config.js';
import { Grid } from './Grid.js';
import { Fish } from './Fish.js';
import { Shark } from './Shark.js';

/** @enum {string} Possible simulation status values. */
export const Status = Object.freeze({
  RUNNING: 'Running',
  PAUSED: 'Paused',
  SHARKS_EXTINCT: 'Sharks extinct',
  FISH_EXTINCT: 'Fish extinct',
  COLLAPSED: 'Ecosystem collapsed',
});

export class WatorSimulation {
  /**
   * Create and initialize a Wa-Tor simulation.
   *
   * Populates the grid with fish and sharks at configured densities.
   */
  constructor() {
    /** @type {Grid} */
    this.grid = null;

    /** @type {number} */
    this.chrononCount = 0;

    /** @type {boolean} Whether the simulation is currently advancing. */
    this.isRunning = true;

    /** @type {boolean} Whether extinction has occurred. */
    this.isTerminal = false;

    this._populate();
  }

  /**
   * Advance the simulation by one chronon.
   *
   * Collects all living entity IDs, shuffles them, then processes
   * each entity in randomized order. Newborns born this chronon
   * are skipped. Dead entities are skipped.
   */
  tick() {
    const ids = this.grid.allEntityIds();

    // Fisher-Yates shuffle
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }

    for (const id of ids) {
      const entity = this.grid.entities.get(id);
      if (!entity || !entity.alive) continue;
      if (entity.bornThisChronon) continue;
      entity.act(this.grid);
    }

    // Clear bornThisChronon on all surviving entities
    for (const entity of this.grid.entities.values()) {
      entity.bornThisChronon = false;
    }

    this.chrononCount++;

    // Check for extinction
    this._checkExtinction();
  }

  /**
   * Get the current fish population.
   *
   * @returns {number} Number of living fish.
   */
  fishCount() {
    let count = 0;
    for (const entity of this.grid.entities.values()) {
      if (entity.type === 'fish') count++;
    }
    return count;
  }

  /**
   * Get the current shark population.
   *
   * @returns {number} Number of living sharks.
   */
  sharkCount() {
    let count = 0;
    for (const entity of this.grid.entities.values()) {
      if (entity.type === 'shark') count++;
    }
    return count;
  }

  /**
   * Get the current simulation status.
   *
   * @returns {string} One of the Status enum values.
   */
  status() {
    if (this.isTerminal) {
      const fish = this.fishCount();
      const sharks = this.sharkCount();
      if (fish === 0 && sharks === 0) return Status.COLLAPSED;
      if (sharks === 0) return Status.SHARKS_EXTINCT;
      return Status.FISH_EXTINCT;
    }
    return this.isRunning ? Status.RUNNING : Status.PAUSED;
  }

  /**
   * Reset the simulation to a fresh random world.
   *
   * Creates a new grid, populates it, resets chronon count,
   * and sets the simulation to running.
   */
  reset() {
    this._populate();
    this.chrononCount = 0;
    this.isRunning = true;
    this.isTerminal = false;
  }

  /**
   * Populate the grid with fish and sharks at configured densities.
   *
   * @private
   */
  _populate() {
    this.grid = new Grid(CONFIG.gridWidth, CONFIG.gridHeight);
    const totalCells = CONFIG.gridWidth * CONFIG.gridHeight;

    // Build a shuffled list of all cell positions
    const positions = [];
    for (let y = 0; y < CONFIG.gridHeight; y++) {
      for (let x = 0; x < CONFIG.gridWidth; x++) {
        positions.push([x, y]);
      }
    }
    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }

    // Place fish first, then sharks
    const fishCount = Math.floor(totalCells * CONFIG.fishDensity);
    const sharkCount = Math.floor(totalCells * CONFIG.sharkDensity);

    let idx = 0;
    for (let i = 0; i < fishCount && idx < positions.length; i++, idx++) {
      const [x, y] = positions[idx];
      this.grid.spawnAt(x, y, Fish);
    }
    for (let i = 0; i < sharkCount && idx < positions.length; i++, idx++) {
      const [x, y] = positions[idx];
      this.grid.spawnAt(x, y, Shark);
    }

    // Clear bornThisChronon on initial population (they act on next tick)
    for (const entity of this.grid.entities.values()) {
      entity.bornThisChronon = false;
    }
  }

  /**
   * Check for extinction and set terminal state if detected.
   *
   * @private
   */
  _checkExtinction() {
    const fish = this.fishCount();
    const sharks = this.sharkCount();

    if (fish === 0 || sharks === 0) {
      this.isTerminal = true;
      this.isRunning = false;
    }
  }
}
