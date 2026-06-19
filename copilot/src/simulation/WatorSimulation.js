/**
 * Pure Wa-Tor engine implementation.
 */
import Grid from './Grid.js';
import Fish from './Fish.js';
import Shark from './Shark.js';
import { CONFIG } from '../config.js';

export default class WatorSimulation {
  constructor(config = CONFIG) {
    this.config = config;
    this.grid = new Grid(config.GRID_WIDTH, config.GRID_HEIGHT);
    this.entities = new Map();
    this._nextId = 1;
    this.chronon = 0;
    this.history = [];
  }

  getChronon() {
    return this.chronon;
  }

  randomChoice(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  _createEntity(type, id, x, y, bornChronon, energy) {
    if (type === 'fish') return new Fish(id, x, y, bornChronon);
    if (type === 'shark') return new Shark(id, x, y, bornChronon, energy);
    throw new Error(`Unknown entity type: ${type}`);
  }

  spawnEntity(type, x, y, bornChronon = this.chronon, energy) {
    const id = this._nextId++;
    const entity = this._createEntity(type, id, x, y, bornChronon, energy);
    this.entities.set(id, entity);
    this.grid.setCell(x, y, id);
    return entity;
  }

  removeEntity(id) {
    const entity = this.entities.get(id);
    if (!entity) return false;
    this.grid.setCell(entity.x, entity.y, null);
    this.entities.delete(id);
    return true;
  }

  moveEntity(id, x, y) {
    const entity = this.entities.get(id);
    if (!entity) return false;
    if (this.grid.getCell(x, y) !== null) return false;
    this.grid.setCell(entity.x, entity.y, null);
    entity.x = ((x % this.grid.width) + this.grid.width) % this.grid.width;
    entity.y = ((y % this.grid.height) + this.grid.height) % this.grid.height;
    this.grid.setCell(entity.x, entity.y, id);
    return true;
  }

  getEmptyNeighbors(x, y) {
    return this.grid.neighbors4(x, y).filter(pos => this.grid.getCell(pos.x, pos.y) === null);
  }

  getFishNeighbors(x, y) {
    return this.grid.neighbors4(x, y)
      .map(pos => ({ ...pos, id: this.grid.getCell(pos.x, pos.y) }))
      .filter(pos => pos.id !== null)
      .map(pos => ({ ...pos, entity: this.entities.get(pos.id) }))
      .filter(pos => pos.entity && pos.entity.type === 'fish')
      .map(pos => ({ id: pos.id, x: pos.x, y: pos.y }));
  }

  step(n = 1) {
    for (let i = 0; i < n; i++) {
      this._stepOnce();
    }
  }

  _stepOnce() {
    const ids = Array.from(this.entities.keys());
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }

    for (const id of ids) {
      const entity = this.entities.get(id);
      if (!entity) continue;
      if (entity.bornChronon === this.chronon) continue;
      entity.act(this);
    }

    this.chronon += 1;
    this._recordHistory();
  }

  _recordHistory() {
    const stats = this.getStats();
    this.history.push({ chronon: this.chronon, fish: stats.fish, sharks: stats.sharks });
    if (this.history.length > this.config.HISTORY_WINDOW) {
      this.history.shift();
    }
  }

  getStats() {
    let fish = 0;
    let sharks = 0;
    for (const entity of this.entities.values()) {
      if (entity.type === 'fish') fish += 1;
      if (entity.type === 'shark') sharks += 1;
    }
    return { chronon: this.chronon, fish, sharks };
  }

  reset() {
    this.grid = new Grid(this.config.GRID_WIDTH, this.config.GRID_HEIGHT);
    this.entities.clear();
    this._nextId = 1;
    this.chronon = 0;
    this.history = [];

    const totalCells = this.grid.width * this.grid.height;
    const fishCount = Math.floor(totalCells * this.config.FISH_DENSITY);
    const sharkCount = Math.floor(totalCells * this.config.SHARK_DENSITY);

    const positions = [];
    for (let y = 0; y < this.grid.height; y++) {
      for (let x = 0; x < this.grid.width; x++) {
        positions.push({ x, y });
      }
    }

    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }

    let index = 0;
    for (let i = 0; i < fishCount && index < positions.length; i++, index++) {
      const pos = positions[index];
      this.spawnEntity('fish', pos.x, pos.y, this.chronon);
    }
    for (let i = 0; i < sharkCount && index < positions.length; i++, index++) {
      const pos = positions[index];
      this.spawnEntity('shark', pos.x, pos.y, this.chronon, this.config.INITIAL_SHARK_ENERGY);
    }
  }
}
