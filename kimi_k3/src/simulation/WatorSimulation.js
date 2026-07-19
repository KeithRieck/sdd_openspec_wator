import { Fish } from './Fish.js';
import { Shark } from './Shark.js';
import {
  GRID_WIDTH,
  GRID_HEIGHT,
  FISH_DENSITY,
  SHARK_DENSITY,
} from '../config.js';

/**
 * Framework-independent Wa-Tor simulation engine (SE-R1 / AC 4).
 * Owns the toroidal grid, the entity registry, chronon execution,
 * and extinction detection. No Phaser imports.
 */
export class WatorSimulation {
  /**
   * @param {object} [dims] optional dimension override
   * @param {number} [dims.width]
   * @param {number} [dims.height]
   */
  constructor(dims = {}) {
    this.width = dims.width ?? GRID_WIDTH;
    this.height = dims.height ?? GRID_HEIGHT;
    /** @type {number} */
    this.chronon = 0;
    /** @type {Map<number, import('./Entity.js').Entity>} entity registry (single source of truth, AC 27) */
    this.entities = new Map();
    /** @type {Array<import('./Entity.js').Entity|null>} flat grid of direct entity references (AC 27) */
    this.grid = new Array(this.width * this.height).fill(null);
    this.nextEntityId = 1;
    this.reset();
  }

  /** @returns {number} a fresh unique entity id */
  allocId() {
    return this.nextEntityId++;
  }

  /**
   * Creates a new random world at configured densities and resets
   * the chronon counter (SE-R2 / AC 6, 7).
   */
  reset() {
    this.chronon = 0;
    this.entities.clear();
    this.grid.fill(null);
    this.nextEntityId = 1;
    const total = this.width * this.height;
    const fishCount = Math.round(total * FISH_DENSITY);
    const sharkCount = Math.round(total * SHARK_DENSITY);
    // Build a shuffled list of cell indices, then deal out populations.
    const cells = Array.from({ length: total }, (_, i) => i);
    for (let i = total - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [cells[i], cells[j]] = [cells[j], cells[i]];
    }
    let cursor = 0;
    for (let n = 0; n < fishCount; n++, cursor++) {
      this.addEntity(new Fish(this.allocId(), cells[cursor], 0), cells[cursor]);
    }
    for (let n = 0; n < sharkCount; n++, cursor++) {
      this.addEntity(new Shark(this.allocId(), cells[cursor], 0), cells[cursor]);
    }
  }

  /**
   * Registers an entity in the registry and grid (SE-R3).
   * @param {import('./Entity.js').Entity} entity
   * @param {number} pos flat grid index
   */
  addEntity(entity, pos) {
    this.entities.set(entity.id, entity);
    this.grid[pos] = entity;
    entity.pos = pos;
  }

  /**
   * Removes an entity from registry and grid (SE-R3).
   * @param {import('./Entity.js').Entity} entity
   */
  removeEntity(entity) {
    if (this.entities.delete(entity.id) && this.grid[entity.pos] === entity) {
      this.grid[entity.pos] = null;
    }
  }

  /**
   * Moves an entity between cells, keeping grid and record consistent
   * (SE-R3.1 referential consistency).
   * @param {import('./Entity.js').Entity} entity
   * @param {number} to flat grid index of destination
   */
  moveEntity(entity, to) {
    this.grid[entity.pos] = null;
    this.grid[to] = entity;
    entity.pos = to;
  }

  /**
   * Returns the four orthogonal neighbor indices with toroidal wrapping
   * (SE-R4 / AC 10).
   * @param {number} pos flat grid index
   * @returns {number[]} neighbor indices [north, east, south, west]
   */
  neighbors(pos) {
    const w = this.width;
    const total = this.grid.length;
    const x = pos % w;
    const north = pos - w < 0 ? pos - w + total : pos - w;
    const south = pos + w >= total ? pos + w - total : pos + w;
    const east = x === w - 1 ? pos - (w - 1) : pos + 1;
    const west = x === 0 ? pos + (w - 1) : pos - 1;
    return [north, east, south, west];
  }

  /**
   * @param {number} pos
   * @returns {number[]} adjacent empty cell indices
   */
  emptyNeighbors(pos) {
    return this.neighbors(pos).filter((i) => this.grid[i] === null);
  }

  /**
   * @param {number} pos
   * @returns {number[]} adjacent fish-occupied cell indices
   */
  fishNeighbors(pos) {
    return this.neighbors(pos).filter((i) => this.grid[i] instanceof Fish);
  }

  /**
   * Advances the world one chronon: snapshot ids, shuffle, skip
   * dead/eaten/newborn entities, dispatch polymorphically (SE-R5 / AC 11-13).
   * @returns {{chronon: number, fish: number, sharks: number, terminal: string|null}}
   */
  stepChronon() {
    const ids = Array.from(this.entities.keys());
    for (let i = ids.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }
    for (const id of ids) {
      const entity = this.entities.get(id);
      if (!entity) continue; // AC 13: died or eaten before its turn
      if (entity.bornChronon === this.chronon) continue; // AC 12: newborn waits
      entity.act(this);
    }
    this.chronon++;
    const { fish, sharks } = this.counts();
    return { chronon: this.chronon, fish, sharks, terminal: this.terminalStatus(fish, sharks) };
  }

  /**
   * @returns {{fish: number, sharks: number}} current population counts
   */
  counts() {
    let fish = 0;
    let sharks = 0;
    for (const e of this.entities.values()) {
      if (e instanceof Fish) fish++;
      else if (e instanceof Shark) sharks++;
    }
    return { fish, sharks };
  }

  /**
   * Determines terminal status after a chronon (SE-R9 / AC 37-40).
   * @param {number} fish
   * @param {number} sharks
   * @returns {string|null}
   */
  terminalStatus(fish, sharks) {
    if (fish === 0 && sharks === 0) return 'Ecosystem collapsed';
    if (sharks === 0) return 'Sharks extinct';
    if (fish === 0) return 'Fish extinct';
    return null;
  }
}
