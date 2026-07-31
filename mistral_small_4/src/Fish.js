/**
 * @fileoverview Fish entity class for Wa-Tor simulation
 * Extends the base Entity class
 */

import { Entity } from './Entity.js';
import { FISH_BREED_TIME } from './config.js';

/**
 * Fish entity class
 * @extends Entity
 */
export class Fish extends Entity {
  /**
   * Create a new Fish
   * @param {Object} options - Fish options
   * @param {number} options.x - X coordinate
   * @param {number} options.y - Y coordinate
   */
  constructor({ x, y }) {
    super({ x, y, breedTime: FISH_BREED_TIME });
  }
  
  /**
   * Process fish for one chronon
   * Fish moves to a random empty adjacent cell and may breed
   * @param {WatorSimulation} simulation - The simulation instance
   */
  process(simulation) {
    if (!this.isAlive) return;
    
    this.incrementBreedAge();
    
    // Try to move to empty cell
    const emptyNeighbors = simulation.getEmptyNeighbors(this);
    
    if (emptyNeighbors.length > 0) {
      // Move to random empty cell
      const newPos = emptyNeighbors[Math.floor(Math.random() * emptyNeighbors.length)];
      
      // Clear old position
      simulation.clearCell(this.x, this.y);
      
      // Update position
      this.x = newPos.x;
      this.y = newPos.y;
      
      // Place in new position
      simulation.setCell(this.x, this.y, this);
      
      // Check breeding
      if (this.isBreedingReady()) {
        const newborn = this.breed(simulation);
        if (newborn) {
          simulation.addEntity(newborn);
        }
      }
    }
    // If no empty neighbors, fish stays in place
  }
  
  /**
   * Breed fish - create a new fish in an empty adjacent cell
   * @param {WatorSimulation} simulation - The simulation instance
   * @returns {Fish|null} Newborn fish or null if breeding failed
   */
  breed(simulation) {
    const emptyNeighbors = simulation.getEmptyNeighbors(this);
    
    if (emptyNeighbors.length > 0) {
      const newPos = emptyNeighbors[Math.floor(Math.random() * emptyNeighbors.length)];
      
      // Create newborn fish
      const newborn = new Fish({
        x: newPos.x,
        y: newPos.y
      });
      
      // Reset parent's breed timer
      this.resetBreedTimer();
      
      return newborn;
    }
    
    // Cannot breed, reset timer
    this.resetBreedTimer();
    return null;
  }
}