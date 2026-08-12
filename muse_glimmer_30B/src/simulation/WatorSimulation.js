import { Fish } from './Fish.js';
import { Shark } from './Shark.js';

/**
 * Wa-Tor simulation engine
 * @class WatorSimulation
 */
export class WatorSimulation {
    #width;
    #height;
    #grid;
    #entities;
    #chronon;
    #nextId;
    #config;
    #history;

    /**
     * Create simulation
     * @param {Object} config - Simulation configuration
     */
    constructor(config) {
        this.#width = config.GRID_WIDTH;
        this.#height = config.GRID_HEIGHT;
        this.#config = config;
        this.#grid = new Array(this.#width * this.#height).fill(null);
        this.#entities = new Map();
        this.#chronon = 0;
        this.#nextId = 1;
        this.#history = [];
    }

    get width() { return this.#width; }
    get height() { return this.#height; }
    get chronon() { return this.#chronon; }
    get config() { return this.#config; }
    get history() { return this.#history; }

    init() {
        this.#grid.fill(null);
        this.#entities.clear();
        this.#chronon = 0;
        this.#nextId = 1;
        this.#history = [];

        const totalCells = this.#width * this.#height;
        const fishCount = Math.floor(totalCells * this.#config.FISH_DENSITY);
        const sharkCount = Math.floor(totalCells * this.#config.SHARK_DENSITY);

        const positions = this.#getRandomPositions(totalCells, fishCount + sharkCount);

        for (let i = 0; i < fishCount; i++) {
            const pos = positions[i];
            this.createFish(pos.x, pos.y);
        }

        for (let i = 0; i < sharkCount; i++) {
            const pos = positions[fishCount + i];
            this.createShark(pos.x, pos.y);
        }

        this.recordHistory();
    }

    reset() {
        this.init();
    }

    step() {
        this.#entities.forEach(e => e.clearBornFlag());

        const ids = Array.from(this.#entities.keys());
        this.#shuffle(ids);

        for (const id of ids) {
            const entity = this.#entities.get(id);
            if (!entity || !entity.isAlive() || entity.isBornThisChronon()) {
                continue;
            }
            entity.act(this);
        }

        this.#chronon++;
        this.recordHistory();
    }

    getPopulation() {
        let fish = 0;
        let sharks = 0;
        this.#entities.forEach(e => {
            if (e.isAlive()) {
                if (e.getType() === 'fish') fish++;
                else if (e.getType() === 'shark') sharks++;
            }
        });
        return { fish, sharks };
    }

    isTerminal() {
        const pop = this.getPopulation();
        return pop.fish === 0 || pop.sharks === 0;
    }

    getNeighbors(x, y) {
        const dirs = [[0,-1],[1,0],[0,1],[-1,0]];
        return dirs.map(([dx,dy]) => ({
            x: (x + dx + this.#width) % this.#width,
            y: (y + dy + this.#height) % this.#height
        }));
    }

    isEmpty(x, y) {
        return this.#grid[y * this.#width + x] === null;
    }

    getEntityAt(x, y) {
        return this.#grid[y * this.#width + x];
    }

    moveEntity(entity, x, y) {
        const oldIndex = entity.getY() * this.#width + entity.getX();
        const newIndex = y * this.#width + x;
        this.#grid[oldIndex] = null;
        this.#grid[newIndex] = entity;
        entity.setPosition(x, y);
    }

    removeEntity(entity) {
        const index = entity.getY() * this.#width + entity.getX();
        this.#grid[index] = null;
        this.#entities.delete(entity.getId());
    }

    createFish(x, y) {
        const id = this.#nextId++;
        const fish = new Fish(id, x, y);
        fish.markBornThisChronon();
        this.#entities.set(id, fish);
        this.#grid[y * this.#width + x] = fish;
        return fish;
    }

    createShark(x, y) {
        const id = this.#nextId++;
        const shark = new Shark(id, x, y, this.#config.INITIAL_SHARK_ENERGY);
        shark.markBornThisChronon();
        this.#entities.set(id, shark);
        this.#grid[y * this.#width + x] = shark;
        return shark;
    }

    randomChoice(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    recordHistory() {
        const pop = this.getPopulation();
        this.#history.push({ chronon: this.#chronon, fish: pop.fish, sharks: pop.sharks });
        if (this.#history.length > this.#config.HISTORY_WINDOW) {
            this.#history.shift();
        }
    }

    #getRandomPositions(total, count) {
        const positions = [];
        const used = new Set();
        while (positions.length < count) {
            const x = Math.floor(Math.random() * this.#width);
            const y = Math.floor(Math.random() * this.#height);
            const key = `${x},${y}`;
            if (!used.has(key)) {
                used.add(key);
                positions.push({ x, y });
            }
        }
        return positions;
    }

    #shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}
