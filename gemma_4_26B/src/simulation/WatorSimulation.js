import { CONFIG } from '../config.js';
import { Fish, Shark } from './Entities.js';

/**
 * The core simulation engine for Wa-Tor.
 * Manages the toroidal grid, entity lifecycle, and chronon advancement.
 */
export class WatorSimulation {
    constructor() {
        this.width = CONFIG.grid.width;
        this.height = CONFIG.grid.height;
        
        // Flat grid array for spatial lookups: stores entity ID or null
        this.grid = new Array(this.width * this.height).fill(null);
        
        // Map of all living entities: ID -> Entity instance
        this.entities = new Map();
        this.nextId = 1;
        
        this.chronon = 0;
        this.history = [];
        this.status = 'Running';
        
        this.initialize();
    }

    /**
     * Initializes the simulation grid and populates it randomly.
     */
    initialize() {
        this.entities.clear();
        this.grid.fill(null);
        this.chronon = 0;
        this.history = [];
        this.status = 'Running';
        this.nextId = 1;

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const rand = Math.random();
                if (rand < CONFIG.density.shark) {
                    this.spawnEntity('shark', x, y);
                } else if (rand < CONFIG.density.shark + CONFIG.density.fish) {
                    this.spawnEntity('fish', x, y);
                }
            }
        }

        // Requirement 12: The initial population is not born mid-chronon, so clear
        // the newborn flag so these entities act starting with the first chronon.
        for (const entity of this.entities.values()) {
            entity.isNewborn = false;
        }

        this._recordHistory();
    }

    /**
     * Helper to handle toroidal coordinate wrapping.
     * @param {number} x 
     * @param {number} y 
     * @returns {{x: number, y: number}}
     */
    getWrappedCoords(x, y) {
        return {
            x: (x + this.width) % this.width,
            y: (y + this.height) % this.height
        };
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
            entity = new Shark(id, x, y, CONFIG.sharkEnergy.initial);
        }
        
        this.entities.set(id, entity);
        this.grid[y * this.width + x] = id;
    }

    /**
     * Removes an entity from the simulation.
     * @param {Entity} entity 
     */
    removeEntity(entity) {
        this.grid[entity.y * this.width + entity.x] = null;
        this.entities.delete(entity.id);
    }

    /**
     * Updates the grid when an entity moves.
     * @param {Entity} entity 
     * @param {number} oldX 
     * @param {number} oldY 
     */
    updateGrid(entity, oldX, oldY) {
        this.grid[oldY * this.width + oldX] = null;
        this.grid[entity.y * this.width + entity.x] = entity.id;
    }

    /**
     * Returns the entity at the given coordinates, if any.
     * @param {number} x 
     * @param {number} y 
     * @returns {Entity|null}
     */
    getEntityAt(x, y) {
        const coords = this.getWrappedCoords(x, y);
        const id = this.grid[coords.y * this.width + coords.x];
        return id ? this.entities.get(id) : null;
    }

    /**
     * Gets all adjacent cells that are currently empty.
     * @param {number} x 
     * @param {number} y 
     * @returns {Array<{x: number, y: number}>}
     */
    getAdjacentEmptyCells(x, y) {
        const empty = [];
        const neighbors = [
            { x: x, y: y - 1 }, // North
            { x: x + 1, y: y }, // East
            { x: x, y: y + 1 }, // South
            { x: x - 1, y: y }, // West
        ];

        for (const n of neighbors) {
            const wrapped = this.getWrappedCoords(n.x, n.y);
            if (this.grid[wrapped.y * this.width + wrapped.x] === null) {
                empty.push(wrapped);
            }
        }
        return empty;
    }

    /**
     * Gets all adjacent cells occupied by fish.
     * @param {number} x 
     * @param {number} y 
     * @returns {Array<{x: number, y: number}>}
     */
    getAdjacentFishCells(x, y) {
        const fishCells = [];
        const neighbors = [
            { x: x, y: y - 1 }, // North
            { x: x + 1, y: y }, // East
            { x: x, y: y + 1 }, // South
            { x: x - 1, y: y }, // West
        ];

        for (const n of neighbors) {
            const wrapped = this.getWrappedCoords(n.x, n.y);
            const entity = this.getEntityAt(wrapped.x, wrapped.y);
            if (entity instanceof Fish) {
                fishCells.push(wrapped);
            }
        }
        return fishCells;
    }

    /**
     * Advances the simulation by one chronon.
     */
    advanceChronon() {
        if (this.status !== 'Running' && this.status !== 'Paused') return;

        this.chronon++;
        
        // Requirement 11: Collect IDs and randomize order
        const entityIds = Array.from(this.entities.keys());
        for (let i = entityIds.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [entityIds[i], entityIds[j]] = [entityIds[j], entityIds[i]];
        }

        for (const id of entityIds) {
            const entity = this.entities.get(id);
            
            // Requirement 13: Skip if entity died/eaten before its turn
            if (!entity) continue;
            
            // Requirement 12: Prevent newborns from acting within the same chronon.
            // An entity's isNewborn flag is cleared at the end of the chronon so it
            // may act from the next chronon onward.
            if (entity.isNewborn) continue;
            
            entity.act(this);
        }

        // Requirement 12: Clear the newborn flag on all surviving entities after the
        // turn loop so entities born this chronon can act next chronon. Without this,
        // newborn flags clear only inside act() and unbred initial entities stay frozen.
        for (const entity of this.entities.values()) {
            entity.isNewborn = false;
        }

        this._checkExtinction();
        this._recordHistory();
    }

    _checkExtinction() {
        let fishCount = 0;
        let sharkCount = 0;
        
        for (const entity of this.entities.values()) {
            if (entity instanceof Fish) fishCount++;
            else if (entity instanceof Shark) sharkCount++;
        }

        if (fishCount === 0 && sharkCount === 0) {
            this.status = 'Ecosystem collapsed';
        } else if (fishCount === 0) {
            this.status = 'Fish extinct';
        } else if (sharkCount === 0) {
            this.status = 'Sharks extinct';
        }

        if (this.status !== 'Running' && this.status !== 'Paused') {
            this.status = this.status; // Keep terminal status
            // The renderer will handle the auto-pause logic based on this status
        }
    }

    _recordHistory() {
        const fish = Array.from(this.entities.values()).filter(e => e instanceof Fish).length;
        const sharks = Array.from(this.entities.values()).filter(e => e instanceof Shark).length;
        
        this.history.push({ fish, sharks });
        
        // Requirement 45: Rolling window of 500
        if (this.history.length > CONFIG.ui.historyWindow) {
            this.history.shift();
        }
    }

    /**
     * Returns a snapshot of the current state for the renderer.
     */
    getState() {
        return {
            entities: Array.from(this.entities.values()),
            stats: {
                chronon: this.chronon,
                fishCount: this.history[this.history.length - 1]?.fish || 0,
                sharkCount: this.history[this.history.length - 1]?.sharks || 0,
                status: this.status,
                history: this.history
            },
            dimensions: { width: this.width, height: this.height }
        };
    }

    reset() {
        this.initialize();
    }
}
