import { CONFIG } from '../config.js';
import { Fish, Shark } from './Entities.js';

/**
 * The core simulation engine for Wa-Tor.
 * Manages the toroidal grid, entity registry, and the chronon loop.
 */
export class WatorSimulation {
    constructor() {
        this.width = CONFIG.gridWidth;
        this.height = CONFIG.gridHeight;
        
        // Grid stores Entity IDs or null
        this.grid = Array(this.width * this.height).fill(null);
        
        // Registry stores Entity instances
        this.entities = new Map();
        this.nextId = 1;
        
        this.chrononCount = 0;
    }

    /**
     * Initializes the simulation with a random population of fish and sharks.
     */
    initialize() {
        this.entities.clear();
        this.grid.fill(null);
        this.nextId = 1;
        this.chrononCount = 0;

        const totalCells = this.width * this.height;
        const fishCount = Math.floor(totalCells * CONFIG.fishDensity);
        const sharkCount = Math.floor(totalCells * CONFIG.sharkDensity);

        this._populate('fish', fishCount);
        this._populate('shark', sharkCount);
    }

    _populate(type, count) {
        let placed = 0;
        while (placed < count) {
            const x = Math.floor(Math.random() * this.width);
            const y = Math.floor(Math.random() * this.height);
            
            if (this.grid[y * this.width + x] === null) {
                this.spawnEntity(type, x, y);
                placed++;
            }
        }
    }

    /**
     * Spawns a new entity of the given type at the specified coordinates.
     * @param {'fish'|'shark'} type 
     * @param {number} x 
     * @param {number} y 
     */
    spawnEntity(type, x, y) {
        const id = this.nextId++;
        let entity;
        
        if (type === 'fish') {
            entity = new Fish(id, x, y);
        } else {
            entity = new Shark(id, x, y);
        }
        
        this.entities.set(id, entity);
        this.grid[y * this.width + x] = id;
        return entity;
    }

    /**
     * Removes an entity from the simulation.
     * @param {number} id 
     */
    removeEntity(id) {
        const entity = this.entities.get(id);
        if (entity) {
            this.grid[entity.y * this.width + entity.x] = null;
            this.entities.delete(id);
        }
    }

    /**
     * Moves an entity to a new position on the grid.
     * @param {Entity} entity 
     * @param {number} newX 
     * @param {number} newY 
     */
    moveEntity(entity, newX, newY) {
        // Clear old position
        this.grid[entity.y * this.width + entity.x] = null;
        
        // Update entity coordinates
        entity.x = newX;
        entity.y = newY;
        
        // Set new position
        this.grid[newY * this.width + newX] = entity.id;
    }

    /**
     * Gets the entity at the specified coordinates.
     * @param {number} x 
     * @param {number} y 
     * @returns {Entity|null}
     */
    getEntityAt(x, y) {
        const id = this.grid[y * this.width + x];
        return id ? this.entities.get(id) : null;
    }

    /**
     * Advances the simulation by one chronon.
     */
    step() {
        this.chrononCount++;
        
        // 1. Collect and shuffle entity IDs to prevent directional bias
        const entityIds = Array.from(this.entities.keys());
        this._shuffle(entityIds);
        
        // 2. Process each entity's turn
        for (const id of entityIds) {
            const entity = this.entities.get(id);
            // Entity might have been removed (eaten/starved) earlier this chronon
            if (entity) {
                entity.act(this);
            }
        }
    }

    _shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    /**
     * Returns a list of adjacent empty cells, handling toroidal wrapping.
     * @param {number} x 
     * @param {number} y 
     * @returns {{x: number, y: number}[]}
     */
    getEmptyNeighbors(x, y) {
        return this._getNeighbors(x, y).filter(n => this.grid[n.y * this.width + n.x] === null);
    }

    /**
     * Returns a list of adjacent cells occupied by fish, handling toroidal wrapping.
     * @param {number} x 
     * @param {number} y 
     * @returns {{x: number, y: number}[]}
     */
    getFishNeighbors(x, y) {
        return this._getNeighbors(x, y).filter(n => {
            const id = this.grid[n.y * this.width + n.x];
            if (!id) return false;
            const entity = this.entities.get(id);
            return entity && entity instanceof Fish;
        });
    }

    /**
     * Internal helper to get orthogonal neighbors with toroidal wrapping.
     * @param {number} x 
     * @param {number} y 
     * @returns {{x: number, y: number}[]}
     */
    _getNeighbors(x, y) {
        return [
            { x: x, y: (y - 1 + this.height) % this.height }, // North
            { x: (x + 1) % this.width, y: y },               // East
            { x: x, y: (y + 1) % this.height },               // South
            { x: (x - 1 + this.width) % this.width, y: y },   // West
        ];
    }

    /**
     * Returns current population counts.
     * @returns {{fish: number, sharks: number}}
     */
    getPopulation() {
        let fish = 0;
        let sharks = 0;
        for (const entity of this.entities.values()) {
            if (entity instanceof Fish) fish++;
            else if (entity instanceof Shark) sharks++;
        }
        return { fish, sharks };
    }
}
