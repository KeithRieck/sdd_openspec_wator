/**
 * @fileoverview Base Entity class for Wa-Tor simulation
 * All entities (Fish, Sharks) extend this base class
 * @abstract
 */

import { FISH_BREED_TIME, SHARK_BREED_TIME } from './config.js';

/**
 * Base entity class
 * @abstract
 */
export class Entity {
  /**
   * Create a new entity
   * @param {Object} options - Entity options
   * @param {number} options.x - X coordinate
   * @param {number} options.y - Y coordinate
   * @param {number} options.breedTime - Breeding threshold
   */
  constructor({ x, y, breedTime }) {
    this.id = this.generateId();
    this.x = x;
    this.y = y;
    this.breedAge = 0;
    this.breedTime = breedTime;
    this._isAlive = true;
  }
  
  /**
   * Generate a unique entity ID
   * @returns {number}
   */
  generateId() {
    return Date.now() + Math.floor(Math.random() * 1000);
  }
  
  /**
   * Check if entity is alive
   * @returns {boolean}
   */
  get isAlive() {
    return this._isAlive;
  }
  
  /**
   * Kill the entity
   */
  kill() {
    this._isAlive = false;
  }
  
  /**
   * Increment breed age
   */
  incrementBreedAge() {
    this.breedAge++;
  }
  
  /**
   * Check if entity is ready to breed
   * @returns {boolean}
   */
  isBreedingReady() {
    return this.breedAge >= this.breedTime;
  }
  
  /**
   * Reset breed timer
   */
  resetBreedTimer() {
    this.breedAge = 0;
  }
  
  /**
   * Get entity type
   * @returns {string}
   */
  getType() {
    return this.constructor.name.toLowerCase();
  }
  
  /**
   * Abstract method - process entity for one chronon
   * @param {WatorSimulation} simulation - The simulation instance
   */
  process(simulation) {
    throw new Error('Method process() must be implemented by subclass');
  }
  
  /**
   * Abstract method - breed entity
   * @param {WatorSimulation} simulation - The simulation instance
   * @returns {Entity|null} Newborn entity or null if breeding failed
   */
  breed(simulation) {
    throw new Error('Method breed() must be implemented by subclass');
  }
}