import { Fish } from './Fish.js';
import { Shark } from './Shark.js';
import {
  GRID_WIDTH,
  GRID_HEIGHT,
  FISH_DENSITY,
  SHARK_DENSITY,
  FISH_BREED_TIME,
  SHARK_BREED_TIME,
  INITIAL_SHARK_ENERGY,
  SHARK_ENERGY_GAIN,
  SHARK_ENERGY_COST,
  HISTORY_SIZE
} from '../config.js';

/**
 * Wa-Tor predator-prey simulation engine.
 * Framework-independent — no Phaser imports.
 * Owns a flat toroidal grid and OO entity map.
 */
export class WatorSimulation {
  /**
   * Create a new simulation with random initial population.
   * @param {object} [overrides] - Optional config overrides
   * @param {number} [overrides.width] - Grid width
   * @param {number} [overrides.height] - Grid height
   */
  constructor(overrides = {}) {
    /** @type {number} */
    this.width = overrides.width ?? GRID_WIDTH;
    /** @type {number} */
    this.height = overrides.height ?? GRID_HEIGHT;
    /** @type {(number|null)[]} */
    this.grid = new Array(this.width * this.height).fill(null);
    /** @type {Map<number, import('./Entity.js').Entity>} */
    this.entities = new Map();
    /** @type {number} */
    this.nextId = 0;
    /** @type {number} */
    this.chronon = 0;
    /** @type {{fish:number, sharks:number}[]} */
    this.history = [];

    this._populate();
    this._recordHistory();
  }

  /**
   * Populate grid randomly with fish and sharks.
   */
  _populate() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const r = Math.random();
        const idx = this._idx(x, y);
        if (r < SHARK_DENSITY) {
          const shark = new Shark(this.nextId++, x, y, INITIAL_SHARK_ENERGY);
          this.grid[idx] = shark.id;
          this.entities.set(shark.id, shark);
        } else if (r < SHARK_DENSITY + FISH_DENSITY) {
          const fish = new Fish(this.nextId++, x, y);
          this.grid[idx] = fish.id;
          this.entities.set(fish.id, fish);
        }
      }
    }
  }

  /**
   * Convert (x,y) to flat index.
   * @param {number} x
   * @param {number} y
   * @returns {number}
   */
  _idx(x, y) {
    return y * this.width + x;
  }

  /**
   * Get orthogonal neighbors with toroidal wrapping.
   * @param {number} x
   * @param {number} y
   * @returns {{x:number,y:number,idx:number}[]}
   */
  _neighbors(x, y) {
    const w = this.width;
    const h = this.height;
    return [
      { x: x, y: (y - 1 + h) % h, idx: this._idx(x, (y - 1 + h) % h) },
      { x: (x + 1) % w, y: y, idx: this._idx((x + 1) % w, y) },
      { x: x, y: (y + 1) % h, idx: this._idx(x, (y + 1) % h) },
      { x: (x - 1 + w) % w, y: y, idx: this._idx((x - 1 + w) % w, y) }
    ];
  }

  /**
   * Get adjacent empty cells.
   * @param {number} x
   * @param {number} y
   * @returns {{x:number,y:number,idx:number}[]}
   */
  _emptyNeighbors(x, y) {
    return this._neighbors(x, y).filter(n => this.grid[n.idx] === null);
  }

  /**
   * Get adjacent fish cells.
   * @param {number} x
   * @param {number} y
   * @returns {{x:number,y:number,idx:number}[]}
   */
  _fishNeighbors(x, y) {
    return this._neighbors(x, y).filter(n => {
      const id = this.grid[n.idx];
      if (id === null) return false;
      const e = this.entities.get(id);
      return e instanceof Fish;
    });
  }

  /**
   * Shuffle array in place using Fisher-Yates with Math.random().
   * @param {any[]} arr
   */
  _shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  /**
   * Pick a random element from array.
   * @param {any[]} arr
   * @returns {any}
   */
  _randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /**
   * Get current population counts.
   * @returns {{fish:number, sharks:number}}
   */
  getCounts() {
    let fish = 0;
    let sharks = 0;
    for (const e of this.entities.values()) {
      if (e instanceof Fish) fish++;
      else if (e instanceof Shark) sharks++;
    }
    return { fish, sharks };
  }

  /**
   * Get history copy.
   * @returns {{fish:number, sharks:number}[]}
   */
  getHistory() {
    return this.history.slice();
  }

  /**
   * Record current counts to history.
   */
  _recordHistory() {
    const c = this.getCounts();
    this.history.push({ fish: c.fish, sharks: c.sharks });
    if (this.history.length > HISTORY_SIZE) {
      this.history.shift();
    }
  }

  /**
   * Advance simulation by one chronon.
   * Implements all Wa-Tor rules: randomized order, newborn/eaten skip,
   * fish movement/breeding, shark energy/starvation/eating/breeding.
   */
  step() {
    const ids = [...this.entities.keys()];
    this._shuffle(ids);
    const bornThisChronon = new Set();

    for (const id of ids) {
      const entity = this.entities.get(id);
      if (!entity) continue;
      if (bornThisChronon.has(id)) continue;

      if (entity instanceof Fish) {
        const empties = this._emptyNeighbors(entity.x, entity.y);
        if (empties.length > 0) {
          const dest = this._randomChoice(empties);
          const willBreed = entity.canBreed(FISH_BREED_TIME);
          const oldX = entity.x;
          const oldY = entity.y;
          const oldIdx = this._idx(oldX, oldY);
          const destIdx = this._idx(dest.x, dest.y);
          this.grid[destIdx] = entity.id;
          this.grid[oldIdx] = null;
          entity.x = dest.x;
          entity.y = dest.y;
          if (willBreed) {
            const newborn = new Fish(this.nextId++, oldX, oldY);
            this.grid[oldIdx] = newborn.id;
            this.entities.set(newborn.id, newborn);
            bornThisChronon.add(newborn.id);
            entity.resetBreed();
          } else {
            entity.ageBreed();
          }
        } else {
          if (entity.canBreed(FISH_BREED_TIME)) {
            entity.resetBreed();
          } else {
            entity.ageBreed();
          }
        }
      } else if (entity instanceof Shark) {
        const alive = entity.spendEnergy(SHARK_ENERGY_COST);
        if (!alive) {
          const idx = this._idx(entity.x, entity.y);
          this.grid[idx] = null;
          this.entities.delete(entity.id);
          continue;
        }
        const fishNbrs = this._fishNeighbors(entity.x, entity.y);
        let moved = false;
        const oldX = entity.x;
        const oldY = entity.y;
        const oldIdx = this._idx(oldX, oldY);

        if (fishNbrs.length > 0) {
          const dest = this._randomChoice(fishNbrs);
          const destIdx = this._idx(dest.x, dest.y);
          const eatenId = this.grid[destIdx];
          if (eatenId !== null) {
            this.entities.delete(eatenId);
          }
          this.grid[destIdx] = entity.id;
          this.grid[oldIdx] = null;
          entity.x = dest.x;
          entity.y = dest.y;
          entity.gainEnergy(SHARK_ENERGY_GAIN);
          moved = true;
        } else {
          const empties = this._emptyNeighbors(entity.x, entity.y);
          if (empties.length > 0) {
            const dest = this._randomChoice(empties);
            const destIdx = this._idx(dest.x, dest.y);
            this.grid[destIdx] = entity.id;
            this.grid[oldIdx] = null;
            entity.x = dest.x;
            entity.y = dest.y;
            moved = true;
          }
        }

        if (entity.canBreed(SHARK_BREED_TIME) && moved) {
          const newborn = new Shark(this.nextId++, oldX, oldY, INITIAL_SHARK_ENERGY);
          this.grid[oldIdx] = newborn.id;
          this.entities.set(newborn.id, newborn);
          bornThisChronon.add(newborn.id);
          entity.resetBreed();
        } else if (entity.canBreed(SHARK_BREED_TIME) && !moved) {
          entity.resetBreed();
        } else if (!moved) {
          entity.ageBreed();
        } else {
          entity.ageBreed();
        }
      }
    }

    this.chronon += 1;
    this._recordHistory();
  }

  /**
   * Reset simulation to a new random world.
   */
  reset() {
    this.grid.fill(null);
    this.entities.clear();
    this.nextId = 0;
    this.chronon = 0;
    this.history = [];
    this._populate();
    this._recordHistory();
  }
}
