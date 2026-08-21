/**
 * @file Framework-independent Wa-Tor simulation engine.
 */

import { Fish } from './Fish.js';
import { Shark } from './Shark.js';
import { SIM } from '../config.js';

/**
 * Toroidal Wa-Tor predator-prey cellular automaton (prd-v001.md AC 4,
 * 6-7, 10-27).
 *
 * State uses a flat `Int32Array` grid mapping cell index to entity ID
 * (0 = water) plus a `Map` of live entity objects keyed by ID
 * (design D1). The engine has no Phaser or DOM dependency and can run
 * headless. Movement considers only orthogonal neighbors with toroidal
 * wrapping (AC 10). Each chronon randomizes the turn order of living
 * entities, skips newborns (AC 12) and entities that died mid-chronon
 * (AC 13), then records a population sample for the history chart.
 */
export class WatorSimulation {
  /**
   * Creates and randomly populates a new world (AC 6-7).
   *
   * @param {number} [width=SIM.gridWidth] Grid width in cells.
   * @param {number} [height=SIM.gridHeight] Grid height in cells.
   */
  constructor(width = SIM.gridWidth, height = SIM.gridHeight) {
    /** @type {number} Grid width in cells. */
    this.width = width;
    /** @type {number} Grid height in cells. */
    this.height = height;
    /** @type {Int32Array} Flat grid of entity IDs; 0 means water (AC 27). */
    this.grid = new Int32Array(width * height);
    /** @type {Map<number, import('./Entity.js').Entity>} Live entities by ID. */
    this.entities = new Map();
    /** @type {number} Number of elapsed chronons. */
    this.chronon = 0;
    /** @type {number} Next entity ID to assign; IDs start at 1 so 0 stays "water". */
    this.nextId = 1;
    /**
     * Rolling population history: one `{fish, sharks}` sample per chronon,
     * most recent last, capped at HISTORY.windowSize entries (AC 45).
     * @type {Array<{fish: number, sharks: number}>}
     */
    this.history = [];
    this.populate();
    this.recordHistory();
  }

  /**
   * Converts an x/y coordinate to a flat grid index with toroidal
   * wrapping (AC 10).
   *
   * @param {number} x Column (wraps horizontally).
   * @param {number} y Row (wraps vertically).
   * @returns {number} Flat grid index.
   */
  index(x, y) {
    const wx = ((x % this.width) + this.width) % this.width;
    const wy = ((y % this.height) + this.height) % this.height;
    return wy * this.width + wx;
  }

  /**
   * Randomly fills the grid to the configured fish and shark densities
   * using Math.random() (AC 7). Each cell receives at most one entity.
   *
   * @returns {void}
   */
  populate() {
    const total = this.width * this.height;
    const fishCount = Math.round(total * SIM.fishDensity);
    const sharkCount = Math.round(total * SIM.sharkDensity);
    const cells = Array.from({ length: total }, (_, i) => i);
    // Fisher-Yates shuffle, then take prefix slices for each species.
    for (let i = cells.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cells[i], cells[j]] = [cells[j], cells[i]];
    }
    let cursor = 0;
    for (let n = 0; n < fishCount; n++) {
      this.addEntity(new Fish(this.nextId++, cells[cursor++], SIM.fishBreedTime));
    }
    for (let n = 0; n < sharkCount; n++) {
      this.addEntity(new Shark(this.nextId++, cells[cursor++], SIM.sharkBreedTime));
    }
  }

  /**
   * Registers a new entity in the map and grid.
   *
   * @param {import('./Entity.js').Entity} entity Entity to register.
   * @returns {void}
   */
  addEntity(entity) {
    this.entities.set(entity.id, entity);
    this.grid[entity.pos] = entity.id;
  }

  /**
   * Removes an entity from the map and clears its grid cell.
   *
   * @param {import('./Entity.js').Entity} entity Entity to remove.
   * @returns {void}
   */
  removeEntity(entity) {
    entity.alive = false;
    if (this.grid[entity.pos] === entity.id) {
      this.grid[entity.pos] = 0;
    }
    this.entities.delete(entity.id);
  }

  /**
   * Moves an entity to a destination cell assumed empty at call time.
   * Called by {@link Entity#act} after destination selection.
   *
   * @param {import('./Entity.js').Entity} entity Entity to move.
   * @param {number} destination Flat grid index of the target cell.
   * @returns {void}
   */
  moveEntity(entity, destination) {
    this.grid[entity.pos] = 0;
    entity.pos = destination;
    this.grid[destination] = entity.id;
  }

  /**
   * Spawns a newborn of the same type as the parent in the parent's old
   * cell (AC 15, 23). Newborns are flagged so they do not act until the
   * next chronon (AC 12); newborn sharks start at initial energy (AC 24).
   *
   * @param {import('./Entity.js').Entity} parent Reproducing parent entity.
   * @param {number} birthPos Flat grid index of the parent's old cell.
   * @returns {void}
   */
  spawnChild(parent, birthPos) {
    if (parent.type === Fish.prototype.type) {
      this.addEntity(new Fish(this.nextId++, birthPos, SIM.fishBreedTime, true));
    } else {
      this.addEntity(new Shark(this.nextId++, birthPos, SIM.sharkBreedTime, SIM.initialSharkEnergy, true));
    }
  }

  /**
   * Removes and reports the fish occupying a cell, if any. Called by
   * {@link Shark#afterMove} after moving onto the cell (AC 20-21).
   *
   * The victim is located by scanning the entity map rather than the
   * grid: {@link WatorSimulation#moveEntity} has already overwritten
   * the cell with the shark's own ID by the time this runs.
   *
   * @param {number} pos Flat grid index of the cell to consume.
   * @returns {boolean} True when a fish was devoured.
   */
  consumeAt(pos) {
    for (const candidate of this.entities.values()) {
      if (
        candidate.alive &&
        candidate.pos === pos &&
        candidate.type === Fish.prototype.type
      ) {
        this.removeEntity(candidate);
        return true;
      }
    }
    return false;
  }

  /**
   * Collects the flat indices of orthogonal neighbor cells that are
   * empty (AC 14, 22).
   *
   * @param {number} pos Flat grid index of the origin cell.
   * @returns {number[]} Flat indices of empty neighbor cells.
   */
  emptyNeighbors(pos) {
    return this.neighborsOf(pos).filter((p) => this.grid[p] === 0);
  }

  /**
   * Collects the flat indices of orthogonal neighbor cells occupied by
   * living fish (AC 20).
   *
   * @param {number} pos Flat grid index of the origin cell.
   * @returns {number[]} Flat indices of fish-occupied neighbor cells.
   */
  fishNeighbors(pos) {
    return this.neighborsOf(pos).filter((p) => {
      const id = this.grid[p];
      if (id === 0) {
        return false;
      }
      const occupant = this.entities.get(id);
      return Boolean(occupant && occupant.alive && occupant.type === Fish.prototype.type);
    });
  }

  /**
   * Lists the flat indices of the four orthogonal neighbors of a cell
   * with toroidal edge wrapping (AC 10): north, east, south, west.
   *
   * @param {number} pos Flat grid index of the origin cell.
   * @returns {number[]} Flat indices of the four neighbors.
   */
  neighborsOf(pos) {
    const x = pos % this.width;
    const y = Math.floor(pos / this.width);
    return [
      this.index(x, y - 1), // north
      this.index(x + 1, y), // east
      this.index(x, y + 1), // south
      this.index(x - 1, y), // west
    ];
  }

  /**
   * Advances the world exactly one chronon (AC 11-13): collects living
   * entity IDs present at chronon start, shuffles them (Fisher-Yates),
   * lets each survivor act at most once, clears newborn flags, bumps
   * the counter, and records a population sample.
   *
   * @returns {void}
   */
  step() {
    const ids = [...this.entities.keys()];
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }
    for (const id of ids) {
      const entity = this.entities.get(id);
      if (!entity || !entity.alive || entity.bornThisChronon) {
        continue; // Dead/eaten before its turn (AC 13) or newborn (AC 12).
      }
      entity.act(this);
    }
    for (const entity of this.entities.values()) {
      entity.bornThisChronon = false;
    }
    this.chronon += 1;
    this.recordHistory();
  }

  /**
   * Appends one population sample to the rolling history window
   * (AC 45), dropping the oldest entry beyond the window size.
   *
   * @returns {void}
   */
  recordHistory() {
    let fish = 0;
    let sharks = 0;
    for (const entity of this.entities.values()) {
      if (entity.type === Fish.prototype.type) {
        fish += 1;
      } else {
        sharks += 1;
      }
    }
    this.history.push({ fish, sharks });
    if (this.history.length > HISTORY_WINDOW) {
      this.history.shift();
    }
  }

  /**
   * Reports current populations and whether a terminal extinction state
   * exists (AC 37-40).
   *
   * @returns {{fish: number, sharks: number, terminal: boolean, status: string}}
   *   Population counts plus terminal flag and status text
   *   (`'Sharks extinct'`, `'Fish extinct'`, `'Ecosystem collapsed'`, or `''`).
   */
  getPopulation() {
    let fish = 0;
    let sharks = 0;
    for (const entity of this.entities.values()) {
      if (entity.type === Fish.prototype.type) {
        fish += 1;
      } else if (entity.type === Shark.prototype.type) {
        sharks += 1;
      }
    }
    let status = '';
    if (fish === 0 && sharks === 0) {
      status = 'Ecosystem collapsed';
    } else if (sharks === 0) {
      status = 'Sharks extinct';
    } else if (fish === 0) {
      status = 'Fish extinct';
    }
    return { fish, sharks, terminal: status !== '', status };
  }
}

/**
 * Rolling history window size in chronons (prd-v001.md AC 45).
 *
 * @constant {number}
 */
const HISTORY_WINDOW = 500;
