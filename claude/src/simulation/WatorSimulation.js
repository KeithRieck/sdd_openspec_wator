import { CONFIG } from '../config.js';

/**
 * @typedef {Object} Entity
 * @property {number} id        Unique, monotonically increasing identifier.
 * @property {('fish'|'shark')} type
 * @property {number} x         Column index.
 * @property {number} y         Row index.
 * @property {number} breedAge  Chronons survived since last reproduction.
 * @property {number} energy    Remaining energy (sharks only; 0 for fish).
 */

const EMPTY = -1;

/**
 * Returns a random integer in the range [0, n).
 * @param {number} n
 * @returns {number}
 */
function randInt(n) {
  return Math.floor(Math.random() * n);
}

/**
 * Returns a random element of a non-empty array.
 * @template T
 * @param {T[]} arr
 * @returns {T}
 */
function choice(arr) {
  return arr[randInt(arr.length)];
}

/**
 * Framework-independent Wa-Tor predator-prey engine.
 *
 * Owns all simulation rules on a rectangular toroidal grid: fish and shark
 * movement, breeding, and shark energy/starvation. It has no dependency on
 * Phaser or any renderer — state is held in a flat occupancy grid plus a map of
 * entity records, and {@link WatorSimulation#step} advances the world by one
 * chronon. Callers render by reading {@link WatorSimulation#forEachEntity} and
 * the population counts.
 */
export class WatorSimulation {
  /**
   * @param {typeof CONFIG} [config] Model constants; defaults to {@link CONFIG}.
   */
  constructor(config = CONFIG) {
    this.config = config;
    this.width = config.gridWidth;
    this.height = config.gridHeight;
    this.chronon = 0;

    /** @type {Int32Array} Flat grid of entity ids, or EMPTY for water. */
    this.grid = new Int32Array(this.width * this.height).fill(EMPTY);
    /** @type {Map<number, Entity>} */
    this.entities = new Map();
    this._nextId = 0;
    this._fish = 0;
    this._shark = 0;

    this.reset();
  }

  /**
   * Clears the world and randomly repopulates it from the configured densities,
   * resetting the chronon counter to zero.
   */
  reset() {
    this.grid.fill(EMPTY);
    this.entities.clear();
    this._nextId = 0;
    this._fish = 0;
    this._shark = 0;
    this.chronon = 0;
    this.populate();
  }

  /**
   * Randomly seeds the grid with fish and sharks at the configured densities,
   * placing at most one entity per cell. Initial breed ages are randomized so
   * the population does not breed in synchronized waves.
   */
  populate() {
    const { fishDensity, sharkDensity, fishBreedTime, sharkBreedTime } =
      this.config;
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const roll = Math.random();
        if (roll < fishDensity) {
          this.spawn('fish', x, y).breedAge = randInt(fishBreedTime);
        } else if (roll < fishDensity + sharkDensity) {
          this.spawn('shark', x, y).breedAge = randInt(sharkBreedTime);
        }
      }
    }
  }

  /**
   * Advances the world by exactly one chronon.
   *
   * Snapshots the current entity ids and shuffles them so each surviving entity
   * acts at most once in random order. Entities born during this chronon hold
   * new ids that are absent from the snapshot, so they do not act until the next
   * chronon; entities that die or are eaten before their turn are skipped via a
   * liveness check.
   */
  step() {
    const order = Array.from(this.entities.keys());
    for (let i = order.length - 1; i > 0; i--) {
      const j = randInt(i + 1);
      const tmp = order[i];
      order[i] = order[j];
      order[j] = tmp;
    }

    for (const id of order) {
      const entity = this.entities.get(id);
      if (!entity) continue; // Died or was eaten earlier this chronon.
      if (entity.type === 'fish') {
        this.moveFish(entity);
      } else {
        this.moveShark(entity);
      }
    }

    this.chronon++;
  }

  /**
   * Applies fish rules: age, then move to a random adjacent empty cell if one
   * exists, reproducing into the vacated cell when breeding-ready.
   * @param {Entity} fish
   */
  moveFish(fish) {
    fish.breedAge++;
    const ready = fish.breedAge >= this.config.fishBreedTime;
    const empties = this.emptyNeighbors(fish.x, fish.y);

    if (empties.length > 0) {
      const [ox, oy] = [fish.x, fish.y];
      this.moveEntity(fish, choice(empties));
      if (ready) {
        this.spawn('fish', ox, oy);
        fish.breedAge = 0;
      }
    } else if (ready) {
      fish.breedAge = 0;
    }
  }

  /**
   * Applies shark rules: pay the per-chronon energy cost (dying at zero), then
   * eat a random adjacent fish if any, otherwise move to a random adjacent empty
   * cell. Reproduces into the vacated cell when breeding-ready and it moved.
   * @param {Entity} shark
   */
  moveShark(shark) {
    shark.energy -= this.config.sharkEnergyCostPerChronon;
    if (shark.energy <= 0) {
      this.remove(shark);
      return;
    }

    shark.breedAge++;
    const ready = shark.breedAge >= this.config.sharkBreedTime;
    const [ox, oy] = [shark.x, shark.y];

    const fishCells = this.fishNeighbors(shark.x, shark.y);
    let moved = false;
    if (fishCells.length > 0) {
      const target = choice(fishCells);
      this.remove(this.entities.get(this.grid[this.index(target[0], target[1])]));
      this.moveEntity(shark, target);
      shark.energy += this.config.sharkEnergyGain;
      moved = true;
    } else {
      const empties = this.emptyNeighbors(shark.x, shark.y);
      if (empties.length > 0) {
        this.moveEntity(shark, choice(empties));
        moved = true;
      }
    }

    if (moved && ready) {
      this.spawn('shark', ox, oy);
      shark.breedAge = 0;
    } else if (!moved && ready) {
      shark.breedAge = 0;
    }
  }

  /**
   * Flat-array index for a cell.
   * @param {number} x
   * @param {number} y
   * @returns {number}
   */
  index(x, y) {
    return y * this.width + x;
  }

  /**
   * Returns the four orthogonal neighbor coordinates with toroidal wrapping.
   * @param {number} x
   * @param {number} y
   * @returns {Array<[number, number]>}
   */
  neighbors(x, y) {
    const w = this.width;
    const h = this.height;
    return [
      [x, (y - 1 + h) % h], // North
      [(x + 1) % w, y], // East
      [x, (y + 1) % h], // South
      [(x - 1 + w) % w, y], // West
    ];
  }

  /**
   * Orthogonal neighbors that currently hold no entity.
   * @param {number} x
   * @param {number} y
   * @returns {Array<[number, number]>}
   */
  emptyNeighbors(x, y) {
    return this.neighbors(x, y).filter(
      ([nx, ny]) => this.grid[this.index(nx, ny)] === EMPTY
    );
  }

  /**
   * Orthogonal neighbors that currently hold a fish.
   * @param {number} x
   * @param {number} y
   * @returns {Array<[number, number]>}
   */
  fishNeighbors(x, y) {
    return this.neighbors(x, y).filter(([nx, ny]) => {
      const id = this.grid[this.index(nx, ny)];
      return id !== EMPTY && this.entities.get(id).type === 'fish';
    });
  }

  /**
   * Moves an entity to a new cell, updating both the grid and the record.
   * @param {Entity} entity
   * @param {[number, number]} dest
   */
  moveEntity(entity, dest) {
    this.grid[this.index(entity.x, entity.y)] = EMPTY;
    entity.x = dest[0];
    entity.y = dest[1];
    this.grid[this.index(entity.x, entity.y)] = entity.id;
  }

  /**
   * Creates a new entity, registers it, and writes it into the grid.
   * @param {('fish'|'shark')} type
   * @param {number} x
   * @param {number} y
   * @returns {Entity}
   */
  spawn(type, x, y) {
    const entity = {
      id: this._nextId++,
      type,
      x,
      y,
      breedAge: 0,
      energy: type === 'shark' ? this.config.initialSharkEnergy : 0,
    };
    this.entities.set(entity.id, entity);
    this.grid[this.index(x, y)] = entity.id;
    if (type === 'fish') this._fish++;
    else this._shark++;
    return entity;
  }

  /**
   * Removes an entity from the world (death, starvation, or being eaten).
   * @param {Entity} entity
   */
  remove(entity) {
    this.grid[this.index(entity.x, entity.y)] = EMPTY;
    this.entities.delete(entity.id);
    if (entity.type === 'fish') this._fish--;
    else this._shark--;
  }

  /** @returns {number} Current number of fish. */
  fishCount() {
    return this._fish;
  }

  /** @returns {number} Current number of sharks. */
  sharkCount() {
    return this._shark;
  }

  /**
   * Invokes a callback for every living entity, for rendering.
   * @param {(entity: Entity) => void} callback
   */
  forEachEntity(callback) {
    for (const entity of this.entities.values()) {
      callback(entity);
    }
  }
}
