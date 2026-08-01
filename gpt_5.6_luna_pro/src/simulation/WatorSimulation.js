import { CONFIG, DIRECTIONS } from '../config.js';
import { Fish } from './Fish.js';
import { Shark } from './Shark.js';

/** Framework-independent Wa-Tor simulation engine. */
export class WatorSimulation {
  /** Create and randomly populate a toroidal Wa-Tor world. */
  constructor(options = {}) {
    this.config = mergeConfig(CONFIG, options);
    this.reset();
  }

  /** Replace the world with a new random run. */
  reset() {
    this.width = this.config.grid.width;
    this.height = this.config.grid.height;
    this.grid = new Array(this.width * this.height).fill(null);
    this.entities = new Map();
    this.nextEntityId = 1;
    this.chronon = 0;
    this.history = [];
    this.terminalStatus = null;
    this.populateRandomly();
  }

  /** Advance exactly one chronon unless the ecosystem is terminal. */
  advanceChronon() {
    if (this.terminalStatus) return false;

    const turnOrder = this.shuffle([...this.entities.keys()]);
    for (const id of turnOrder) {
      const entity = this.entities.get(id);
      if (!entity || !entity.alive) continue;
      if (entity.type === 'fish') this.actFish(entity);
      else this.actShark(entity);
    }

    this.chronon += 1;
    this.recordHistory();
    this.updateTerminalStatus();
    return true;
  }

  /** Return the current chronon number. */
  getChronon() {
    return this.chronon;
  }

  /** Return the number of living fish. */
  getFishCount() {
    return this.countType('fish');
  }

  /** Return the number of living sharks. */
  getSharkCount() {
    return this.countType('shark');
  }

  /** Return the current terminal status, or null for an active ecosystem. */
  getStatus() {
    return this.terminalStatus;
  }

  /** Return whether the ecosystem has reached a terminal state. */
  isTerminal() {
    return this.terminalStatus !== null;
  }

  /** Return a read-only snapshot of all living entity records. */
  getEntities() {
    return [...this.entities.values()]
      .filter((entity) => entity.alive)
      .map((entity) => snapshotEntity(entity));
  }

  /** Return a read-only snapshot of the entity at a toroidal position. */
  getEntityAt(position) {
    const id = this.grid[this.index(position.x, position.y)];
    const entity = id === null ? null : this.entities.get(id);
    return entity && entity.alive ? snapshotEntity(entity) : null;
  }

  /** Return chronological population samples without exposing internal history. */
  getPopulationHistory() {
    return this.history.map((sample) => ({ ...sample }));
  }

  /** Return the configured world dimensions. */
  getDimensions() {
    return { width: this.width, height: this.height };
  }

  /** Create initial entities from configured density probabilities. */
  populateRandomly() {
    const cells = this.shuffle([...Array(this.grid.length).keys()]);
    const fishTarget = Math.floor(this.grid.length * this.config.density.fish);
    const sharkTarget = Math.floor(this.grid.length * this.config.density.shark);
    let cursor = 0;

    for (let i = 0; i < fishTarget; i += 1) {
      this.addEntity(new Fish(this.nextEntityId++, this.positionFromIndex(cells[cursor++])));
    }
    for (let i = 0; i < sharkTarget; i += 1) {
      this.addEntity(new Shark(
        this.nextEntityId++,
        this.positionFromIndex(cells[cursor++]),
        this.config.shark.initialEnergy,
      ));
    }
  }

  /** Apply one fish turn, including movement and breeding. */
  actFish(fish) {
    const empty = this.neighborsOf(fish).filter((cell) => this.grid[this.index(cell.x, cell.y)] === null);
    if (empty.length === 0) {
      if (fish.isBreedReady(this.config.breeding.fishBreedTime)) fish.breedAge = 0;
      else fish.ageBreedTimer();
      return;
    }

    const destination = this.randomChoice(empty);
    const origin = { ...fish.position };
    this.moveEntity(fish, destination);
    if (fish.isBreedReady(this.config.breeding.fishBreedTime)) {
      this.addEntity(new Fish(this.nextEntityId++, origin));
      fish.breedAge = 0;
    } else {
      fish.ageBreedTimer();
    }
  }

  /** Apply one shark turn, including energy, hunting, movement, and breeding. */
  actShark(shark) {
    shark.energy -= this.config.shark.energyCostPerChronon;
    if (shark.energy <= 0) {
      this.removeEntity(shark);
      return;
    }

    const neighbors = this.neighborsOf(shark);
    const prey = neighbors.filter((cell) => {
      const id = this.grid[this.index(cell.x, cell.y)];
      return id !== null && this.entities.get(id)?.type === 'fish';
    });
    const empty = neighbors.filter((cell) => this.grid[this.index(cell.x, cell.y)] === null);
    const destination = prey.length > 0 ? this.randomChoice(prey) : this.randomChoice(empty);

    if (!destination) {
      if (shark.isBreedReady(this.config.breeding.sharkBreedTime)) shark.breedAge = 0;
      else shark.ageBreedTimer();
      return;
    }

    const origin = { ...shark.position };
    const preyId = this.grid[this.index(destination.x, destination.y)];
    if (preyId !== null) this.removeEntity(this.entities.get(preyId));
    this.moveEntity(shark, destination);
    if (preyId !== null) shark.energy += this.config.shark.energyGain;

    if (shark.isBreedReady(this.config.breeding.sharkBreedTime)) {
      this.addEntity(new Shark(this.nextEntityId++, origin, this.config.shark.initialEnergy));
      shark.breedAge = 0;
    } else {
      shark.ageBreedTimer();
    }
  }

  /** Return the four orthogonal neighbors with toroidal wrapping. */
  neighborsOf(entity) {
    return DIRECTIONS.map((direction) => ({
      x: (entity.position.x + direction.x + this.width) % this.width,
      y: (entity.position.y + direction.y + this.height) % this.height,
    }));
  }

  addEntity(entity) {
    this.entities.set(entity.id, entity);
    this.grid[this.index(entity.position.x, entity.position.y)] = entity.id;
  }

  moveEntity(entity, destination) {
    this.grid[this.index(entity.position.x, entity.position.y)] = null;
    entity.position = { x: destination.x, y: destination.y };
    this.grid[this.index(destination.x, destination.y)] = entity.id;
  }

  removeEntity(entity) {
    if (!entity || !entity.alive) return;
    this.grid[this.index(entity.position.x, entity.position.y)] = null;
    entity.die();
    this.entities.delete(entity.id);
  }

  index(x, y) {
    return y * this.width + x;
  }

  positionFromIndex(index) {
    return { x: index % this.width, y: Math.floor(index / this.width) };
  }

  countType(type) {
    let count = 0;
    for (const entity of this.entities.values()) if (entity.type === type && entity.alive) count += 1;
    return count;
  }

  recordHistory() {
    this.history.push({ chronon: this.chronon, fish: this.getFishCount(), sharks: this.getSharkCount() });
    if (this.history.length > this.config.historyLimit) this.history.shift();
  }

  updateTerminalStatus() {
    const fish = this.getFishCount();
    const sharks = this.getSharkCount();
    if (fish === 0 && sharks === 0) this.terminalStatus = 'Ecosystem collapsed';
    else if (sharks === 0) this.terminalStatus = 'Sharks extinct';
    else if (fish === 0) this.terminalStatus = 'Fish extinct';
  }

  shuffle(values) {
    for (let i = values.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [values[i], values[j]] = [values[j], values[i]];
    }
    return values;
  }

  randomChoice(values) {
    return values.length === 0 ? null : values[Math.floor(Math.random() * values.length)];
  }
}

function snapshotEntity(entity) {
  return Object.freeze({
    id: entity.id,
    type: entity.type,
    position: Object.freeze({ ...entity.position }),
    breedAge: entity.breedAge,
    alive: entity.alive,
    ...(entity.type === 'shark' ? { energy: entity.energy } : {}),
  });
}

function mergeConfig(base, overrides) {
  return {
    ...base,
    ...overrides,
    grid: { ...base.grid, ...overrides.grid },
    density: { ...base.density, ...overrides.density },
    breeding: { ...base.breeding, ...overrides.breeding },
    shark: { ...base.shark, ...overrides.shark },
    colors: { ...base.colors, ...overrides.colors },
    speedOptions: [...(overrides.speedOptions || base.speedOptions)],
  };
}
