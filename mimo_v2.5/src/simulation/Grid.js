/**
 * Toroidal grid that stores entity positions and provides neighbor queries.
 *
 * The grid uses a flat array for O(1) position lookups and a Map for
 * O(1) entity-by-ID access. Positions wrap toroidally so the world
 * has no edges.
 *
 * @module simulation/Grid
 */
import { CONFIG } from '../config.js';

export class Grid {
  /**
   * Create a grid.
   *
   * @param {number} width  - Number of columns.
   * @param {number} height - Number of rows.
   */
  constructor(width = CONFIG.gridWidth, height = CONFIG.gridHeight) {
    /** @type {number} */
    this.width = width;

    /** @type {number} */
    this.height = height;

    /** @type {(import('./Entity.js').Entity|null)[]} Flat cell array. */
    this.cells = new Array(width * height).fill(null);

    /** @type {Map<number, import('./Entity.js').Entity>} Entity lookup by ID. */
    this.entities = new Map();

    /** @type {number} Auto-incrementing entity ID generator. */
    this.nextId = 1;
  }

  /**
   * Convert 2D grid coordinates to a flat array index.
   *
   * @param {number} x - Column.
   * @param {number} y - Row.
   * @returns {number} Flat index.
   */
  index(x, y) {
    return y * this.width + x;
  }

  /**
   * Wrap coordinates toroidally so they stay within grid bounds.
   *
   * @param {number} x - Column (may be negative or >= width).
   * @param {number} y - Row (may be negative or >= height).
   * @returns {[number, number]} Wrapped [x, y].
   */
  wrap(x, y) {
    return [
      ((x % this.width) + this.width) % this.width,
      ((y % this.height) + this.height) % this.height,
    ];
  }

  /**
   * Get the entity at a grid position.
   *
   * @param {number} x - Column.
   * @param {number} y - Row.
   * @returns {import('./Entity.js').Entity|null} The entity or null.
   */
  get(x, y) {
    return this.cells[this.index(x, y)];
  }

  /**
   * Set an entity at a grid position.
   *
   * @param {number} x - Column.
   * @param {number} y - Row.
   * @param {import('./Entity.js').Entity|null} entity - Entity to place, or null to clear.
   */
  set(x, y, entity) {
    this.cells[this.index(x, y)] = entity;
  }

  /**
   * Move an entity to a new position on the grid.
   *
   * Clears the entity's old cell and places it at the new position.
   * The caller must verify the destination is valid before calling.
   *
   * @param {import('./Entity.js').Entity} entity - The entity to move.
   * @param {number} newX - Destination column.
   * @param {number} newY - Destination row.
   */
  move(entity, newX, newY) {
    this.set(entity.x, entity.y, null);
    this.set(newX, newY, entity);
    entity.x = newX;
    entity.y = newY;
  }

  /**
   * Remove an entity from the grid.
   *
   * Clears the entity's cell and removes it from the entity map.
   *
   * @param {import('./Entity.js').Entity} entity - The entity to remove.
   */
  remove(entity) {
    this.set(entity.x, entity.y, null);
    this.entities.delete(entity.id);
    entity.die();
  }

  /**
   * Spawn a new entity at the given position.
   *
   * Assigns the next available ID, registers the entity, and places
   * it on the grid. The entity's `bornThisChronon` flag is set to true.
   *
   * @param {number} x - Column.
   * @param {number} y - Row.
   * @param {typeof import('./Entity.js').Entity} EntityType - Constructor (Fish or Shark).
   * @param {object} [extra] - Extra properties to assign (e.g., { energy } for sharks).
   * @returns {import('./Entity.js').Entity} The spawned entity.
   */
  spawnAt(x, y, EntityType, extra = {}) {
    const id = this.nextId++;
    const entity = new EntityType(id, x, y);
    Object.assign(entity, extra);
    entity.bornThisChronon = true;
    this.set(x, y, entity);
    this.entities.set(id, entity);
    return entity;
  }

  /**
   * Get orthogonal neighbor positions that are empty.
   *
   * @param {number} x - Column.
   * @param {number} y - Row.
   * @returns {[number, number][]} Array of [x, y] pairs for empty neighbors.
   */
  getEmptyNeighbors(x, y) {
    return this._getNeighborsWhere(x, y, (cell) => cell === null);
  }

  /**
   * Get orthogonal neighbor positions that contain fish.
   *
   * @param {number} x - Column.
   * @param {number} y - Row.
   * @returns {[number, number][]} Array of [x, y] pairs for fish neighbors.
   */
  getFishNeighbors(x, y) {
    return this._getNeighborsWhere(x, y, (cell) => cell !== null && cell.type === 'fish');
  }

  /**
   * Get all living entity IDs.
   *
   * @returns {number[]} Array of entity IDs.
   */
  allEntityIds() {
    return Array.from(this.entities.keys());
  }

  /**
   * Get orthogonal neighbor positions matching a filter predicate.
   *
   * @param {number} x - Column.
   * @param {number} y - Row.
   * @param {(cell: import('./Entity.js').Entity|null) => boolean} predicate - Filter function.
   * @returns {[number, number][]} Array of [x, y] pairs.
   * @private
   */
  _getNeighborsWhere(x, y, predicate) {
    const offsets = [[0, -1], [1, 0], [0, 1], [-1, 0]];
    const result = [];
    for (const [dx, dy] of offsets) {
      const [nx, ny] = this.wrap(x + dx, y + dy);
      if (predicate(this.get(nx, ny))) {
        result.push([nx, ny]);
      }
    }
    return result;
  }
}
