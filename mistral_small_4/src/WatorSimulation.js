/**
 * @fileoverview Core Wa-Tor simulation engine
 * Uses EntityManager for entity management
 */

import { EntityManager } from './EntityManager.js';
import { Fish } from './Fish.js';
import { Shark } from './Shark.js';
import { 
  GRID_WIDTH, 
  GRID_HEIGHT,
  FISH_DENSITY,
  SHARK_DENSITY,
  DEFAULT_SPEED
} from './config.js';

/**
 * Main simulation class
 */
export class WatorSimulation {
  /**
   * Create a new simulation
   * @param {Object} [options] - Configuration options
   */
  constructor(options = {}) {
    // Simulation state
    this.isRunning = true;
    this.speed = options.speed || DEFAULT_SPEED;
    this.chronon = 0;
    this.entityManager = new EntityManager();
    this.populationHistory = [];
    
    // Initialize with random entities
    this.initializeSimulation();
  }
  
  /**
   * Initialize simulation with random entities
   */
  initializeSimulation() {
    // Calculate number of entities
    const totalCells = GRID_WIDTH * GRID_HEIGHT;
    const fishCount = Math.floor(totalCells * FISH_DENSITY);
    const sharkCount = Math.floor(totalCells * SHARK_DENSITY);
    
    // Create fish
    for (let i = 0; i < fishCount; i++) {
      this.addRandomEntity(Fish);
    }
    
    // Create sharks
    for (let i = 0; i < sharkCount; i++) {
      this.addRandomEntity(Shark);
    }
    
    // Record initial population
    this.recordPopulationHistory();
  }
  
  /**
   * Add a random entity to the grid
   * @param {Function} EntityClass - Entity class (Fish or Shark)
   */
  addRandomEntity(EntityClass) {
    let x, y;
    let attempts = 0;
    const maxAttempts = 100;
    
    // Find empty cell
    do {
      x = Math.floor(Math.random() * GRID_WIDTH);
      y = Math.floor(Math.random() * GRID_HEIGHT);
      attempts++;
      
      if (attempts >= maxAttempts) {
        console.warn(`Could not find empty cell for ${EntityClass.name} after ${maxAttempts} attempts`);
        return;
      }
    } while (this.entityManager.grid[y][x] !== null);
    
    // Create entity
    const entity = new EntityClass({ x, y });
    
    // Add to entity manager
    this.entityManager.addEntity(entity);
  }
  
  /**
   * Process one chronon
   */
  step() {
    if (!this.isRunning) return;
    
    this.chronon++;
    
    // Process all entities
    this.entityManager.processAll(this);
    
    // Update statistics
    this.recordPopulationHistory();
  }
  
  /**
   * Record population history
   */
  recordPopulationHistory() {
    this.populationHistory.push({
      chronon: this.chronon,
      fish: this.entityManager.fishCount,
      sharks: this.entityManager.sharkCount
    });
    
    // Keep only last 100 entries
    if (this.populationHistory.length > 100) {
      this.populationHistory.shift();
    }
  }
  
  /**
   * Get empty neighbors
   * @param {Entity} entity - The entity
   * @returns {Array<{x: number, y: number}>}
   */
  getEmptyNeighbors(entity) {
    return this.entityManager.getEmptyNeighbors(entity);
  }
  
  /**
   * Get fish neighbors (for sharks)
   * @param {Entity} entity - The shark entity
   * @returns {Array<{x: number, y: number, entity: Entity}>}
   */
  getFishNeighbors(entity) {
    return this.entityManager.getFishNeighbors(entity);
  }
  
  /**
   * Clear a cell
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   */
  clearCell(x, y) {
    this.entityManager.clearCell(x, y);
  }
  
  /**
   * Set a cell
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @param {Entity} entity - The entity
   */
  setCell(x, y, entity) {
    this.entityManager.setCell(x, y, entity);
  }
  
  /**
   * Add an entity
   * @param {Entity} entity - The entity to add
   */
  addEntity(entity) {
    this.entityManager.addEntity(entity);
  }
  
  /**
   * Remove an entity
   * @param {number} id - Entity ID
   */
  removeEntity(id) {
    this.entityManager.removeEntity(id);
  }
  
  /**
   * Reset simulation to initial state
   */
  reset() {
    this.isRunning = true;
    this.chronon = 0;
    this.entityManager.reset();
    this.populationHistory = [];
    this.initializeSimulation();
  }
  
  /**
   * Set simulation speed
   * @param {number} speed - Speed multiplier
   */
  setSpeed(speed) {
    if ([1, 5, 10, 30, 60].includes(speed)) {
      this.speed = speed;
    }
  }
  
  /**
   * Pause simulation
   */
  pause() {
    this.isRunning = false;
  }
  
  /**
   * Resume simulation
   */
  resume() {
    this.isRunning = true;
  }
  
  /**
   * Single step simulation
   */
  singleStep() {
    this.step();
  }
  
  /**
   * Get fish count
   * @returns {number}
   */
  get fishCount() {
    return this.entityManager.fishCount;
  }
  
  /**
   * Get shark count
   * @returns {number}
   */
  get sharkCount() {
    return this.entityManager.sharkCount;
  }
  
  /**
   * Get population history
   * @returns {Array<Object>}
   */
  getPopulationHistory() {
    return this.populationHistory;
  }
}