import {
  FISH_DENSITY,
  GRID_HEIGHT,
  GRID_WIDTH,
  HISTORY_LENGTH,
  INITIAL_SHARK_ENERGY,
  SHARK_DENSITY
} from '../config.js';
import { Fish } from './Fish.js';
import { Shark } from './Shark.js';

/**
 * Phaser-independent Wa-Tor engine.
 * Owns the toroidal grid, entity registry, chronon loop, history, and extinction state.
 * Spec: wator-simulation R1–R2, R4, R9, R12–R14.
 */
export class WatorSimulation {
  /**
   * @param {object} [options]
   * @param {number} [options.width]
   * @param {number} [options.height]
   * @param {number} [options.fishDensity]
   * @param {number} [options.sharkDensity]
   */
  constructor(options = {}) {
    this.width = options.width ?? GRID_WIDTH;
    this.height = options.height ?? GRID_HEIGHT;
    this.fishDensity = options.fishDensity ?? FISH_DENSITY;
    this.sharkDensity = options.sharkDensity ?? SHARK_DENSITY;

    /** @type {Array<number|null>} */
    this.grid = [];
    /** @type {Map<number, import('./Entity.js').Entity>} */
    this.entities = new Map();
    this.nextId = 1;
    this.chronon = 0;
    /** @type {Array<{chronon:number, fish:number, sharks:number}>} */
    this.history = [];
    /** @type {string|null} */
    this.extinctionStatus = null;
    this.fishCount = 0;
    this.sharkCount = 0;

    this.reset();
  }

  /**
   * Rebuild a random world at chronon 0 and seed history.
   */
  reset() {
    const cellCount = this.width * this.height;
    this.grid = new Array(cellCount).fill(null);
    this.entities.clear();
    this.nextId = 1;
    this.chronon = 0;
    this.extinctionStatus = null;
    this.fishCount = 0;
    this.sharkCount = 0;
    this.history = [];

    const indices = Array.from({ length: cellCount }, (_, i) => i);
    this.#shuffle(indices);

    const fishTarget = Math.floor(cellCount * this.fishDensity);
    const sharkTarget = Math.floor(cellCount * this.sharkDensity);
    let cursor = 0;

    // bornChronon -1 so initial population can act on chronon 0's first step.
    for (let i = 0; i < fishTarget && cursor < indices.length; i += 1, cursor += 1) {
      const index = indices[cursor];
      const { x, y } = this.#indexToCoord(index);
      const fish = new Fish(this.allocateId(), x, y, -1, 0);
      this.spawn(fish);
    }

    for (let i = 0; i < sharkTarget && cursor < indices.length; i += 1, cursor += 1) {
      const index = indices[cursor];
      const { x, y } = this.#indexToCoord(index);
      const shark = new Shark(this.allocateId(), x, y, -1, 0, INITIAL_SHARK_ENERGY);
      this.spawn(shark);
    }

    this.#recordHistory();
  }

  /**
   * Advance the world by one chronon.
   * Spec: wator-simulation R9, R12–R14.
   */
  step() {
    if (this.extinctionStatus) {
      return;
    }

    const ids = Array.from(this.entities.keys());
    this.#shuffle(ids);

    for (const id of ids) {
      const entity = this.entities.get(id);
      if (!entity || !entity.canAct(this.chronon)) {
        continue;
      }
      entity.act(this);
    }

    this.chronon += 1;
    this.#recordHistory();
    this.#evaluateExtinction();
  }

  /** @returns {number} */
  getChronon() {
    return this.chronon;
  }

  /** @returns {number} */
  getFishCount() {
    return this.fishCount;
  }

  /** @returns {number} */
  getSharkCount() {
    return this.sharkCount;
  }

  /** @returns {string|null} */
  getExtinctionStatus() {
    return this.extinctionStatus;
  }

  /** @returns {Array<{chronon:number, fish:number, sharks:number}>} */
  getHistory() {
    return this.history;
  }

  /**
   * Plain snapshots for rendering.
   * @returns {Array<{id:number, type:string, x:number, y:number}>}
   */
  getRenderEntities() {
    const list = [];
    for (const entity of this.entities.values()) {
      list.push({
        id: entity.id,
        type: entity.type,
        x: entity.x,
        y: entity.y
      });
    }
    return list;
  }

  /** @returns {number} */
  allocateId() {
    const id = this.nextId;
    this.nextId += 1;
    return id;
  }

  /**
   * @param {number} x
   * @param {number} y
   * @returns {Array<{x:number, y:number}>}
   */
  getOrthogonalNeighbors(x, y) {
    return [
      { x, y: this.#wrapY(y - 1) },
      { x: this.#wrapX(x + 1), y },
      { x, y: this.#wrapY(y + 1) },
      { x: this.#wrapX(x - 1), y }
    ];
  }

  /**
   * @param {number} x
   * @param {number} y
   * @returns {Array<{x:number, y:number}>}
   */
  getEmptyNeighbors(x, y) {
    return this.getOrthogonalNeighbors(x, y).filter((cell) => this.getEntityAt(cell.x, cell.y) === null);
  }

  /**
   * @param {number} x
   * @param {number} y
   * @returns {Array<{x:number, y:number}>}
   */
  getFishNeighbors(x, y) {
    return this.getOrthogonalNeighbors(x, y).filter((cell) => {
      const entity = this.getEntityAt(cell.x, cell.y);
      return entity !== null && entity.type === 'fish';
    });
  }

  /**
   * @param {number} x
   * @param {number} y
   * @returns {import('./Entity.js').Entity|null}
   */
  getEntityAt(x, y) {
    const id = this.grid[this.#coordToIndex(x, y)];
    if (id === null || id === undefined) {
      return null;
    }
    return this.entities.get(id) ?? null;
  }

  /**
   * @param {import('./Entity.js').Entity} entity
   * @param {number} x
   * @param {number} y
   */
  move(entity, x, y) {
    if (!entity.alive) {
      return;
    }
    const from = this.#coordToIndex(entity.x, entity.y);
    const to = this.#coordToIndex(x, y);
    if (this.grid[from] === entity.id) {
      this.grid[from] = null;
    }
    this.grid[to] = entity.id;
    entity.x = x;
    entity.y = y;
  }

  /**
   * @param {import('./Entity.js').Entity} entity
   */
  remove(entity) {
    if (!entity.alive) {
      return;
    }
    entity.alive = false;
    const index = this.#coordToIndex(entity.x, entity.y);
    if (this.grid[index] === entity.id) {
      this.grid[index] = null;
    }
    this.entities.delete(entity.id);
    if (entity.type === 'fish') {
      this.fishCount = Math.max(0, this.fishCount - 1);
    } else if (entity.type === 'shark') {
      this.sharkCount = Math.max(0, this.sharkCount - 1);
    }
  }

  /**
   * @param {import('./Entity.js').Entity} entity
   */
  spawn(entity) {
    const index = this.#coordToIndex(entity.x, entity.y);
    this.grid[index] = entity.id;
    this.entities.set(entity.id, entity);
    if (entity.type === 'fish') {
      this.fishCount += 1;
    } else if (entity.type === 'shark') {
      this.sharkCount += 1;
    }
  }

  #recordHistory() {
    this.history.push({
      chronon: this.chronon,
      fish: this.fishCount,
      sharks: this.sharkCount
    });
    if (this.history.length > HISTORY_LENGTH) {
      this.history.splice(0, this.history.length - HISTORY_LENGTH);
    }
  }

  #evaluateExtinction() {
    const fish = this.fishCount;
    const sharks = this.sharkCount;
    if (fish === 0 && sharks === 0) {
      this.extinctionStatus = 'Ecosystem collapsed';
    } else if (sharks === 0) {
      this.extinctionStatus = 'Sharks extinct';
    } else if (fish === 0) {
      this.extinctionStatus = 'Fish extinct';
    } else {
      this.extinctionStatus = null;
    }
  }

  /**
   * @param {number[]} array
   */
  #shuffle(array) {
    for (let i = array.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = array[i];
      array[i] = array[j];
      array[j] = tmp;
    }
  }

  /**
   * @param {number} x
   * @param {number} y
   * @returns {number}
   */
  #coordToIndex(x, y) {
    return y * this.width + x;
  }

  /**
   * @param {number} index
   * @returns {{x:number, y:number}}
   */
  #indexToCoord(index) {
    return {
      x: index % this.width,
      y: Math.floor(index / this.width)
    };
  }

  /**
   * @param {number} x
   * @returns {number}
   */
  #wrapX(x) {
    return (x + this.width) % this.width;
  }

  /**
   * @param {number} y
   * @returns {number}
   */
  #wrapY(y) {
    return (y + this.height) % this.height;
  }
}
