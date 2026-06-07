export const ENTITY_TYPES = {
  fish: "fish",
  shark: "shark"
};

export const STATUS = {
  running: "Running",
  paused: "Paused",
  fishExtinct: "Fish extinct",
  sharksExtinct: "Sharks extinct",
  collapsed: "Ecosystem collapsed"
};

/**
 * Runs the framework-independent Wa-Tor cellular automaton.
 */
export class WatorSimulation {
  /**
   * Creates a simulation using programmer-editable model constants.
   *
   * @param {object} config Simulation grid, population, and model settings.
   */
  constructor(config) {
    this.config = config;
    this.width = config.grid.width;
    this.height = config.grid.height;
    this.cellCount = this.width * this.height;
    this.reset();
  }

  /**
   * Builds a new random world and clears chronon and terminal state.
   */
  reset() {
    this.grid = new Array(this.cellCount).fill(null);
    this.entities = new Map();
    this.nextEntityId = 1;
    this.chronon = 0;
    this.terminalStatus = null;
    this.populateRandomly();
  }

  /**
   * Advances the world by one chronon using a randomized snapshot of current entities.
   *
   * @returns {object} Population counts and terminal status after the chronon.
   */
  step() {
    if (this.terminalStatus) {
      return this.getStatus();
    }

    const turnIds = this.shuffle([...this.entities.keys()]);

    for (const entityId of turnIds) {
      const entity = this.entities.get(entityId);
      if (!entity) {
        continue;
      }

      if (entity.type === ENTITY_TYPES.fish) {
        this.actFish(entity);
      } else {
        this.actShark(entity);
      }
    }

    this.chronon += 1;
    this.updateTerminalStatus();
    return this.getStatus();
  }

  /**
   * Returns immutable-enough data for rendering without exposing live entity records.
   *
   * @returns {object} Snapshot of grid dimensions, chronon, counts, status, and entities.
   */
  getSnapshot() {
    const entities = [];

    for (const entity of this.entities.values()) {
      entities.push({ ...entity });
    }

    return {
      width: this.width,
      height: this.height,
      chronon: this.chronon,
      counts: this.getPopulationCounts(),
      terminalStatus: this.terminalStatus,
      entities
    };
  }

  /**
   * Counts live fish and sharks from entity records.
   *
   * @returns {object} Current fish and shark totals.
   */
  getPopulationCounts() {
    let fish = 0;
    let sharks = 0;

    for (const entity of this.entities.values()) {
      if (entity.type === ENTITY_TYPES.fish) {
        fish += 1;
      } else {
        sharks += 1;
      }
    }

    return { fish, sharks };
  }

  /**
   * Resolves display status from terminal state and caller running state.
   *
   * @param {boolean} isRunning Whether the scene is currently running.
   * @returns {object} Counts, chronon, terminal status, and display label.
   */
  getStatus(isRunning = true) {
    const counts = this.getPopulationCounts();
    return {
      chronon: this.chronon,
      counts,
      terminalStatus: this.terminalStatus,
      label: this.terminalStatus ?? (isRunning ? STATUS.running : STATUS.paused)
    };
  }

  /**
   * Randomly fills the grid using fish first, then sharks in remaining empty cells.
   */
  populateRandomly() {
    const cells = this.shuffle(Array.from({ length: this.cellCount }, (_, index) => index));
    const fishTarget = Math.floor(this.cellCount * this.config.population.fishDensity);
    const sharkTarget = Math.floor(this.cellCount * this.config.population.sharkDensity);

    for (let index = 0; index < fishTarget && cells.length > 0; index += 1) {
      this.createEntity(ENTITY_TYPES.fish, this.positionFromIndex(cells.pop()));
    }

    for (let index = 0; index < sharkTarget && cells.length > 0; index += 1) {
      this.createEntity(ENTITY_TYPES.shark, this.positionFromIndex(cells.pop()), {
        energy: this.config.model.initialSharkEnergy
      });
    }

    this.updateTerminalStatus();
  }

  /**
   * Applies fish movement and breeding rules for one chronon action.
   *
   * @param {object} entity Fish entity record.
   */
  actFish(entity) {
    entity.breedAge += 1;
    const oldPosition = { x: entity.x, y: entity.y };
    const destination = this.chooseRandom(this.getEmptyNeighbors(oldPosition));
    const canBreed = entity.breedAge >= this.config.model.fishBreedTime;

    if (!destination) {
      if (canBreed) {
        entity.breedAge = 0;
      }
      return;
    }

    this.moveEntity(entity, destination);

    if (canBreed) {
      this.createEntity(ENTITY_TYPES.fish, oldPosition);
      entity.breedAge = 0;
    }
  }

  /**
   * Applies shark starvation, eating, movement, and breeding rules for one action.
   *
   * @param {object} entity Shark entity record.
   */
  actShark(entity) {
    entity.breedAge += 1;
    entity.energy -= this.config.model.sharkEnergyCostPerChronon;

    if (entity.energy <= 0) {
      this.removeEntity(entity.id);
      return;
    }

    const oldPosition = { x: entity.x, y: entity.y };
    const fishDestination = this.chooseRandom(this.getFishNeighbors(oldPosition));
    const destination = fishDestination ?? this.chooseRandom(this.getEmptyNeighbors(oldPosition));
    const canBreed = entity.breedAge >= this.config.model.sharkBreedTime;

    if (!destination) {
      if (canBreed) {
        entity.breedAge = 0;
      }
      return;
    }

    if (fishDestination) {
      const eatenId = this.grid[this.indexFor(destination.x, destination.y)];
      this.removeEntity(eatenId);
      entity.energy += this.config.model.sharkEnergyGain;
    }

    this.moveEntity(entity, destination);

    if (canBreed) {
      this.createEntity(ENTITY_TYPES.shark, oldPosition, {
        energy: this.config.model.initialSharkEnergy
      });
      entity.breedAge = 0;
    }
  }

  getOrthogonalNeighbors(position) {
    return [
      { x: position.x, y: this.wrapY(position.y - 1) },
      { x: this.wrapX(position.x + 1), y: position.y },
      { x: position.x, y: this.wrapY(position.y + 1) },
      { x: this.wrapX(position.x - 1), y: position.y }
    ];
  }

  getEmptyNeighbors(position) {
    return this.getOrthogonalNeighbors(position).filter((neighbor) => {
      return this.grid[this.indexFor(neighbor.x, neighbor.y)] === null;
    });
  }

  getFishNeighbors(position) {
    return this.getOrthogonalNeighbors(position).filter((neighbor) => {
      const entityId = this.grid[this.indexFor(neighbor.x, neighbor.y)];
      const entity = this.entities.get(entityId);
      return entity?.type === ENTITY_TYPES.fish;
    });
  }

  /**
   * Moves an entity record and keeps the flat occupancy grid in sync.
   *
   * @param {object} entity Existing entity record.
   * @param {object} position Destination position.
   */
  moveEntity(entity, position) {
    this.grid[this.indexFor(entity.x, entity.y)] = null;
    entity.x = position.x;
    entity.y = position.y;
    this.grid[this.indexFor(entity.x, entity.y)] = entity.id;
  }

  /**
   * Creates one fish or shark at an empty cell.
   *
   * @param {string} type Entity type.
   * @param {object} position Target position.
   * @param {object} options Optional shark energy.
   * @returns {object} Created entity record.
   */
  createEntity(type, position, options = {}) {
    const entity = {
      id: this.nextEntityId,
      type,
      x: position.x,
      y: position.y,
      breedAge: 0
    };

    if (type === ENTITY_TYPES.shark) {
      entity.energy = options.energy ?? this.config.model.initialSharkEnergy;
    }

    this.nextEntityId += 1;
    this.entities.set(entity.id, entity);
    this.grid[this.indexFor(position.x, position.y)] = entity.id;
    return entity;
  }

  removeEntity(entityId) {
    const entity = this.entities.get(entityId);
    if (!entity) {
      return;
    }

    this.grid[this.indexFor(entity.x, entity.y)] = null;
    this.entities.delete(entityId);
  }

  /**
   * Updates terminal status after a chronon or reset.
   */
  updateTerminalStatus() {
    const { fish, sharks } = this.getPopulationCounts();

    if (fish === 0 && sharks === 0) {
      this.terminalStatus = STATUS.collapsed;
    } else if (fish === 0) {
      this.terminalStatus = STATUS.fishExtinct;
    } else if (sharks === 0) {
      this.terminalStatus = STATUS.sharksExtinct;
    } else {
      this.terminalStatus = null;
    }
  }

  shuffle(items) {
    const shuffled = [...items];

    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }

    return shuffled;
  }

  chooseRandom(items) {
    if (items.length === 0) {
      return null;
    }

    return items[Math.floor(Math.random() * items.length)];
  }

  indexFor(x, y) {
    return y * this.width + x;
  }

  positionFromIndex(index) {
    return {
      x: index % this.width,
      y: Math.floor(index / this.width)
    };
  }

  wrapX(x) {
    return (x + this.width) % this.width;
  }

  wrapY(y) {
    return (y + this.height) % this.height;
  }
}
