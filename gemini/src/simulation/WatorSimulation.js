import { Config } from '../config.js';

/**
 * Base class representing a generic Wa-Tor entity.
 */
export class WatorEntity {
  /**
   * Create a Wa-Tor entity.
   * @param {number} id - Unique entity ID.
   * @param {string} type - Entity type ('fish' or 'shark').
   * @param {number} x - Horizontal coordinate.
   * @param {number} y - Vertical coordinate.
   */
  constructor(id, type, x, y) {
    this.id = id;
    this.type = type;
    this.x = x;
    this.y = y;
    this.breedAge = 0;
  }
}

/**
 * Class representing a Fish in the Wa-Tor simulation.
 * @extends WatorEntity
 */
export class WatorFish extends WatorEntity {
  /**
   * Create a Fish.
   * @param {number} id - Unique entity ID.
   * @param {number} x - Horizontal coordinate.
   * @param {number} y - Vertical coordinate.
   */
  constructor(id, x, y) {
    super(id, 'fish', x, y);
  }
}

/**
 * Class representing a Shark in the Wa-Tor simulation.
 * @extends WatorEntity
 */
export class WatorShark extends WatorEntity {
  /**
   * Create a Shark.
   * @param {number} id - Unique entity ID.
   * @param {number} x - Horizontal coordinate.
   * @param {number} y - Vertical coordinate.
   * @param {number} energy - Initial energy units.
   */
  constructor(id, x, y, energy) {
    super(id, 'shark', x, y);
    this.energy = energy;
  }
}

/**
 * Class managing the Wa-Tor simulation grid, entities, history, and state updates.
 */
export class WatorSimulation {
  /**
   * Initialize grid dimensions and default simulation state.
   * @param {number} [width=Config.GRID_WIDTH] - Columns count.
   * @param {number} [height=Config.GRID_HEIGHT] - Rows count.
   */
  constructor(width = Config.GRID_WIDTH, height = Config.GRID_HEIGHT) {
    this.width = width;
    this.height = height;
    this.size = width * height;
    
    /** @type {Array<WatorEntity|null>} */
    this.grid = new Array(this.size).fill(null);
    /** @type {Map<number, WatorEntity>} */
    this.entities = new Map();
    
    this.chronon = 0;
    this.fishCount = 0;
    this.sharkCount = 0;
    this.status = 'Paused';
    
    /** @type {Array<{fish: number, sharks: number}>} */
    this.history = [];
    
    this.nextEntityId = 1;
  }

  /**
   * Randomly populates the grid with fish and sharks based on configuration density.
   */
  initialize() {
    this.grid.fill(null);
    this.entities.clear();
    this.nextEntityId = 1;
    this.chronon = 0;

    const indices = Array.from({ length: this.size }, (_, i) => i);
    // Shuffle indices to place entities randomly
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    const totalFish = Math.floor(this.size * Config.FISH_DENSITY);
    const totalSharks = Math.floor(this.size * Config.SHARK_DENSITY);

    let k = 0;
    for (let i = 0; i < totalFish; i++) {
      const index = indices[k++];
      const x = index % this.width;
      const y = Math.floor(index / this.width);
      const id = this.nextEntityId++;
      const fish = new WatorFish(id, x, y);
      this.grid[index] = fish;
      this.entities.set(id, fish);
    }

    for (let i = 0; i < totalSharks; i++) {
      const index = indices[k++];
      const x = index % this.width;
      const y = Math.floor(index / this.width);
      const id = this.nextEntityId++;
      const shark = new WatorShark(id, x, y, Config.INITIAL_SHARK_ENERGY);
      this.grid[index] = shark;
      this.entities.set(id, shark);
    }

    this.updateCounts();
    this.history = [{ fish: this.fishCount, sharks: this.sharkCount }];
    this.status = 'Running';
  }

  /**
   * Resets the simulation state and repopulates the grid.
   */
  reset() {
    this.initialize();
  }

  /**
   * Updates internal entity count tallies.
   */
  updateCounts() {
    let fish = 0;
    let sharks = 0;
    for (const entity of this.entities.values()) {
      if (entity.type === 'fish') fish++;
      else if (entity.type === 'shark') sharks++;
    }
    this.fishCount = fish;
    this.sharkCount = sharks;
  }

  /**
   * Helper mapping coordinate (x, y) to a flat 1D grid array index.
   * Handles toroidal boundary wrapping.
   * @param {number} x - Column index.
   * @param {number} y - Row index.
   * @returns {number} 1D grid array index.
   */
  getGridIndex(x, y) {
    const wrappedX = (x + this.width) % this.width;
    const wrappedY = (y + this.height) % this.height;
    return wrappedY * this.width + wrappedX;
  }

  /**
   * Collects list of orthogonal neighbors for cell (x, y) with toroidal wrapping.
   * @param {number} x - Column coordinate.
   * @param {number} y - Row coordinate.
   * @returns {Array<{x: number, y: number, index: number, entity: WatorEntity|null}>} Neighbors list.
   */
  getOrthogonalNeighbors(x, y) {
    const coords = [
      { x: x, y: y - 1 }, // North
      { x: x + 1, y: y }, // East
      { x: x, y: y + 1 }, // South
      { x: x - 1, y: y }  // West
    ];

    return coords.map((c) => {
      const idx = this.getGridIndex(c.x, c.y);
      const wrappedX = idx % this.width;
      const wrappedY = Math.floor(idx / this.width);
      return {
        x: wrappedX,
        y: wrappedY,
        index: idx,
        entity: this.grid[idx]
      };
    });
  }

  /**
   * Executes one full simulation chronon (tick).
   * Gathers all existing entity IDs, shuffles execution order, processes actions,
   * updates history samples, and checks for extinction status.
   */
  tick() {
    if (this.status.includes('extinct') || this.status === 'Ecosystem collapsed') {
      return;
    }

    // 1. Gather all entity IDs at start of turn
    const ids = Array.from(this.entities.keys());

    // 2. Fisher-Yates turn order shuffle
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }

    // 3. Process actions for each entity that is still alive
    for (const id of ids) {
      const entity = this.entities.get(id);
      if (!entity) continue; // Skip if already eaten or starved

      if (entity.type === 'fish') {
        this.runFishTurn(entity);
      } else if (entity.type === 'shark') {
        this.runSharkTurn(entity);
      }
    }

    // 4. Increment chronon count
    this.chronon++;

    // 5. Update counts and check terminal/extinction status
    this.updateCounts();
    
    // Check extinction states
    if (this.fishCount === 0 && this.sharkCount === 0) {
      this.status = 'Ecosystem collapsed';
    } else if (this.fishCount === 0) {
      this.status = 'Fish extinct';
    } else if (this.sharkCount === 0) {
      this.status = 'Sharks extinct';
    }

    // 6. Record population history sample
    this.history.push({ fish: this.fishCount, sharks: this.sharkCount });
    if (this.history.length > Config.CHART.MAX_SAMPLES) {
      this.history.shift();
    }
  }

  /**
   * Processes the turn actions for a single Fish.
   * @param {WatorFish} fish - Fish entity.
   */
  runFishTurn(fish) {
    const neighbors = this.getOrthogonalNeighbors(fish.x, fish.y);
    const emptyNeighbors = neighbors.filter((n) => n.entity === null);

    if (emptyNeighbors.length > 0) {
      // Choose random empty neighbor
      const target = emptyNeighbors[Math.floor(Math.random() * emptyNeighbors.length)];
      const oldIndex = this.getGridIndex(fish.x, fish.y);
      
      // Move fish
      this.grid[oldIndex] = null;
      fish.x = target.x;
      fish.y = target.y;
      this.grid[target.index] = fish;

      // Handle breeding
      if (fish.breedAge >= Config.FISH_BREED_TIME) {
        const babyId = this.nextEntityId++;
        const babyFish = new WatorFish(babyId, oldIndex % this.width, Math.floor(oldIndex / this.width));
        this.grid[oldIndex] = babyFish;
        this.entities.set(babyId, babyFish);
        
        fish.breedAge = 0;
      } else {
        fish.breedAge++;
      }
    } else {
      // Cannot move
      if (fish.breedAge >= Config.FISH_BREED_TIME) {
        fish.breedAge = 0; // Breed timer resets on movement failure
      } else {
        fish.breedAge++;
      }
    }
  }

  /**
   * Processes the turn actions for a single Shark.
   * @param {WatorShark} shark - Shark entity.
   */
  runSharkTurn(shark) {
    // 1. Decrement energy at start of action
    shark.energy -= Config.SHARK_ENERGY_COST;

    // 2. Starve if energy hits zero
    if (shark.energy <= 0) {
      const index = this.getGridIndex(shark.x, shark.y);
      this.grid[index] = null;
      this.entities.delete(shark.id);
      return;
    }

    const neighbors = this.getOrthogonalNeighbors(shark.x, shark.y);
    const fishNeighbors = neighbors.filter((n) => n.entity !== null && n.entity.type === 'fish');

    if (fishNeighbors.length > 0) {
      // Hunt: choose random fish neighbor
      const target = fishNeighbors[Math.floor(Math.random() * fishNeighbors.length)];
      const oldIndex = this.getGridIndex(shark.x, shark.y);

      // Remove eaten fish
      const fishEaten = target.entity;
      this.entities.delete(fishEaten.id);

      // Consume fish energy
      shark.energy += Config.SHARK_ENERGY_GAIN;

      // Move shark to eaten fish cell
      this.grid[oldIndex] = null;
      shark.x = target.x;
      shark.y = target.y;
      this.grid[target.index] = shark;

      // Handle breeding
      if (shark.breedAge >= Config.SHARK_BREED_TIME) {
        const babyId = this.nextEntityId++;
        const babyShark = new WatorShark(babyId, oldIndex % this.width, Math.floor(oldIndex / this.width), Config.INITIAL_SHARK_ENERGY);
        this.grid[oldIndex] = babyShark;
        this.entities.set(babyId, babyShark);

        shark.breedAge = 0;
      } else {
        shark.breedAge++;
      }
    } else {
      // No fish around, check empty cells
      const emptyNeighbors = neighbors.filter((n) => n.entity === null);

      if (emptyNeighbors.length > 0) {
        // Move to random empty space
        const target = emptyNeighbors[Math.floor(Math.random() * emptyNeighbors.length)];
        const oldIndex = this.getGridIndex(shark.x, shark.y);

        this.grid[oldIndex] = null;
        shark.x = target.x;
        shark.y = target.y;
        this.grid[target.index] = shark;

        // Handle breeding
        if (shark.breedAge >= Config.SHARK_BREED_TIME) {
          const babyId = this.nextEntityId++;
          const babyShark = new WatorShark(babyId, oldIndex % this.width, Math.floor(oldIndex / this.width), Config.INITIAL_SHARK_ENERGY);
          this.grid[oldIndex] = babyShark;
          this.entities.set(babyId, babyShark);

          shark.breedAge = 0;
        } else {
          shark.breedAge++;
        }
      } else {
        // Trapped: cannot move
        if (shark.breedAge >= Config.SHARK_BREED_TIME) {
          shark.breedAge = 0; // Breed timer resets on movement failure
        } else {
          shark.breedAge++;
        }
      }
    }
  }
}
