/**
 * @fileoverview Entity manager for Wa-Tor simulation
 * Handles all entity lifecycle and spatial queries
 */

import { Fish } from './Fish.js';
import { Shark } from './Shark.js';
import { GRID_WIDTH, GRID_HEIGHT } from './config.js';

/**
 * Manages all entities in the simulation
 */
export class EntityManager {
  /**
   * Create a new EntityManager
   */
  constructor() {
    this.entities = new Map(); // id -> Entity
    this.grid = this.createEmptyGrid();
    this.fishCount = 0;
    this.sharkCount = 0;
  }
  
  /**
   * Create an empty grid
   * @returns {Array<Array<Entity|null>>}
   */
  createEmptyGrid() {
    return Array.from({ length: GRID_HEIGHT }, () => 
      Array.from({ length: GRID_WIDTH }, () => null)
    );
  }
  
  /**
   * Add an entity to the simulation
   * @param {Entity} entity - The entity to add
   */
  addEntity(entity) {
    this.entities.set(entity.id, entity);
    this.grid[entity.y][entity.x] = entity;
    
    if (entity.getType() === 'fish') {
      this.fishCount++;
    } else if (entity.getType() === 'shark') {
      this.sharkCount++;
    }
  }
  
  /**
   * Remove an entity from the simulation
   * @param {number} id - Entity ID
   */
  removeEntity(id) {
    const entity = this.entities.get(id);
    if (entity) {
      this.clearCell(entity.x, entity.y);
      this.entities.delete(id);
      
      if (entity.getType() === 'fish') {
        this.fishCount--;
      } else if (entity.getType() === 'shark') {
        this.sharkCount--;
      }
    }
  }
  
  /**
   * Clear a cell in the grid
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   */
  clearCell(x, y) {
    this.grid[y][x] = null;
  }
  
  /**
   * Set a cell in the grid
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @param {Entity} entity - The entity to place
   */
  setCell(x, y, entity) {
    this.grid[y][x] = entity;
  }
  
  /**
   * Get orthogonal neighbors with toroidal wrapping
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @returns {Array<{x: number, y: number}>}
   */
  getNeighbors(x, y) {
    return [
      { x, y: (y - 1 + GRID_HEIGHT) % GRID_HEIGHT }, // North
      { x: (x + 1) % GRID_WIDTH, y },                // East
      { x, y: (y + 1) % GRID_HEIGHT },               // South
      { x: (x - 1 + GRID_WIDTH) % GRID_WIDTH, y }     // West
    ];
  }
  
  /**
   * Get empty neighbors
   * @param {Entity} entity - The entity
   * @returns {Array<{x: number, y: number}>}
   */
  getEmptyNeighbors(entity) {
    return this.getNeighbors(entity.x, entity.y)
      .filter(({ x, y }) => this.grid[y][x] === null);
  }
  
  /**
   * Get fish neighbors (for sharks)
   * @param {Entity} entity - The shark entity
   * @returns {Array<{x: number, y: number, entity: Entity}>}
   */
  getFishNeighbors(entity) {
    return this.getNeighbors(entity.x, entity.y)
      .map(({ x, y }) => ({ x, y, entity: this.grid[y][x] }))
      .filter(({ entity: e }) => e?.isAlive && e.getType() === 'fish');
  }
  
  /**
   * Process all entities in random order
   * @param {WatorSimulation} simulation - The simulation instance
   */
  processAll(simulation) {
    // Collect all entity IDs and shuffle
    const entityIds = Array.from(this.entities.keys());
    this.shuffleArray(entityIds);
    
    // Process each entity in random order
    for (const id of entityIds) {
      const entity = this.entities.get(id);
      
      // Skip if entity died before its turn
      if (!this.entities.has(id) || !entity.isAlive) continue;
      
      // Skip if entity was born this chronon (breedAge === 0 and no energy for sharks)
      if (entity.breedAge === 0 && (entity.getType() !== 'shark' || entity.energy === undefined)) {
        entity.incrementBreedAge();
        continue;
      }
      
      // Process entity
      entity.process(simulation);
    }
  }
  
  /**
   * Shuffle array in place
   * @param {Array} array - Array to shuffle
   */
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  
  /**
   * Reset the entity manager
   */
  reset() {
    this.entities.clear();
    this.grid = this.createEmptyGrid();
    this.fishCount = 0;
    this.sharkCount = 0;
  }
}