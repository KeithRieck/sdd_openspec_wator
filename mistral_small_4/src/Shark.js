/**
 * @fileoverview Shark entity class for Wa-Tor simulation
 * Extends the base Entity class
 */

import { Entity } from './Entity.js';
import { 
  SHARK_BREED_TIME, 
  INITIAL_SHARK_ENERGY,
  SHARK_ENERGY_GAIN,
  SHARK_ENERGY_COST_PER_CHRONON 
} from './config.js';

/**
 * Shark entity class
 * @extends Entity
 */
export class Shark extends Entity {
  /**
   * Create a new Shark
   * @param {Object} options - Shark options
   * @param {number} options.x - X coordinate
   * @param {number} options.y - Y coordinate
   */
  constructor({ x, y }) {
    super({ x, y, breedTime: SHARK_BREED_TIME });
    this.energy = INITIAL_SHARK_ENERGY;
  }
  
  /**
   * Process shark for one chronon
   * Shark loses energy, hunts fish, moves, and may breed
   * @param {WatorSimulation} simulation - The simulation instance
   */
  process(simulation) {
    if (!this.isAlive) return;
    
    // Decrement energy first (PRD requirement)
    this.energy -= SHARK_ENERGY_COST_PER_CHRONON;
    
    // Check for death
    if (this.energy <= 0) {
      this.kill();
      simulation.clearCell(this.x, this.y);
      return;
    }
    
    this.incrementBreedAge();
    
    // Try to eat fish
    const fishNeighbors = simulation.getFishNeighbors(this);
    
    if (fishNeighbors.length > 0) {
      // Eat random fish
      const fishData = fishNeighbors[Math.floor(Math.random() * fishNeighbors.length)];
      const fish = fishData.entity;
      
      // Remove fish
      fish.kill();
      simulation.clearCell(fish.x, fish.y);
      simulation.removeEntity(fish.id);
      
      // Move shark to fish position
      simulation.clearCell(this.x, this.y);
      this.x = fish.x;
      this.y = fish.y;
      simulation.setCell(this.x, this.y, this);
      
      // Gain energy
      this.energy += SHARK_ENERGY_GAIN;
      
      // Check breeding
      if (this.isBreedingReady()) {
        const newborn = this.breed(simulation);
        if (newborn) {
          simulation.addEntity(newborn);
        }
      }
    } else {
      // No fish available, try to move to empty cell
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
      // If no empty neighbors, shark stays in place
    }
  }
  
  /**
   * Breed shark - create a new shark in an empty adjacent cell
   * @param {WatorSimulation} simulation - The simulation instance
   * @returns {Shark|null} Newborn shark or null if breeding failed
   */
  breed(simulation) {
    const emptyNeighbors = simulation.getEmptyNeighbors(this);
    
    if (emptyNeighbors.length > 0) {
      const newPos = emptyNeighbors[Math.floor(Math.random() * emptyNeighbors.length)];
      
      // Create newborn shark
      const newborn = new Shark({
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