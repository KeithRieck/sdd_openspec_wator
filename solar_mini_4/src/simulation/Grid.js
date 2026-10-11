/**
 * Toroidal grid for the Wa-Tor simulation.
 * R2: Toroidal grid with edge wrapping
 * R3: Flat grid array + entity objects
 * R27: Flat grid array with one slot per cell
 */
import {
    FISH_BREED_TIME,
    INITIAL_SHARK_ENERGY,
    SHARK_BREED_TIME,
    SHARK_ENERGY_GAIN,
    SHARK_ENERGY_COST_PER_CHRONON
} from '../config.js';

export default class Grid {
    /**
     * Create a grid.
     * @param {number} width - Grid width (columns)
     * @param {number} height - Grid height (rows)
     */
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.cells = new Array(width * height).fill(null);
        this.entities = [];
        this.nextId = 0;
    }

    /**
     * Get the flat array index for a cell.
     * @param {number} x - X position
     * @param {number} y - Y position
     * @returns {number} Flat index
     */
    getFlatIndex(x, y) {
        return y * this.width + x;
    }

    /**
     * Get cell coordinates from a flat index.
     * @param {number} index - Flat index
     * @returns {{x: number, y: number}} Cell coordinates
     */
    getCoords(index) {
        return {
            x: index % this.width,
            y: Math.floor(index / this.width)
        };
    }

    /**
     * Get the entity at a cell.
     * @param {number} x - X position
     * @param {number} y - Y position
     * @returns {Entity|null} Entity at cell or null
     */
    getCell(x, y) {
        const index = this.getFlatIndex(x, y);
        return this.cells[index] !== null ? this.entities[this.cells[index]] : null;
    }

    /**
     * Check if a cell is empty.
     * @param {number} x - X position
     * @param {number} y - Y position
     * @returns {boolean} True if empty
     */
    isEmpty(x, y) {
        return this.getCell(x, y) === null;
    }

    /**
     * Check if a cell is occupied.
     * @param {number} x - X position
     * @param {number} y - Y position
     * @returns {boolean} True if occupied
     */
    isOccupied(x, y) {
        return !this.isEmpty(x, y);
    }

    /**
     * Get orthogonal neighbors of a cell (toroidal).
     * @param {number} x - X position
     * @param {number} y - Y position
     * @returns {Array<{x: number, y: number}>} Neighbor coordinates
     */
    getNeighbors(x, y) {
        const neighbors = [];
        const wrappedX = ((x % this.width) + this.width) % this.width;
        const wrappedY = ((y % this.height) + this.height) % this.height;

        neighbors.push({ x: (wrappedX + 1) % this.width, y: wrappedY });
        neighbors.push({ x: (wrappedX - 1 + this.width) % this.width, y: wrappedY });
        neighbors.push({ x: wrappedX, y: (wrappedY + 1) % this.height });
        neighbors.push({ x: wrappedX, y: (wrappedY - 1 + this.height) % this.height });

        return neighbors;
    }

    /**
     * Get empty neighbors of a cell (toroidal).
     * @param {number} x - X position
     * @param {number} y - Y position
     * @returns {Array<{x: number, y: number}>} Empty neighbor coordinates
     */
    getEmptyNeighbors(x, y) {
        return this.getNeighbors(x, y).filter((neighbor) => this.isEmpty(neighbor.x, neighbor.y));
    }

    /**
     * Get fish neighbors of a cell (toroidal).
     * @param {number} x - X position
     * @param {number} y - Y position
     * @returns {Array<Entity>} Fish entities
     */
    getFishNeighbors(x, y) {
        return this.getNeighbors(x, y)
            .map((neighbor) => this.getCell(neighbor.x, neighbor.y))
            .filter((entity) => entity !== null && entity instanceof Fish);
    }

    /**
     * Get a random empty neighbor.
     * @param {number} x - X position
     * @param {number} y - Y position
     * @returns {{x: number, y: number}} Random empty neighbor
     */
    getRandomEmptyNeighbor(x, y) {
        const emptyNeighbors = this.getEmptyNeighbors(x, y);
        return emptyNeighbors[Math.floor(Math.random() * emptyNeighbors.length)];
    }

    /**
     * Get a random fish neighbor.
     * @param {number} x - X position
     * @param {number} y - Y position
     * @returns {Entity} Random fish neighbor
     */
    getRandomFishNeighbor(x, y) {
        const fishNeighbors = this.getFishNeighbors(x, y);
        return fishNeighbors[Math.floor(Math.random() * fishNeighbors.length)];
    }

    /**
     * Set an entity at a cell.
     * @param {Entity} entity - Entity to place
     */
    setEntity(entity) {
        const index = this.getFlatIndex(entity.x, entity.y);
        this.cells[index] = entity.id;
        this.entities[entity.id] = entity;
    }

    /**
     * Remove an entity from a cell.
     * @param {Entity} entity - Entity to remove
     */
    removeEntity(entity) {
        const index = this.getFlatIndex(entity.x, entity.y);
        this.cells[index] = null;
        delete this.entities[entity.id];
    }

    /**
     * Move an entity to a new cell.
     * @param {Entity} entity - Entity to move
     * @param {number} newX - New X position
     * @param {number} newY - New Y position
     */
    moveEntity(entity, newX, newY) {
        this.removeEntity(entity);
        entity.x = newX;
        entity.y = newY;
        this.setEntity(entity);
    }

    /**
     * Create a fish at a cell.
     * @param {number} x - X position
     * @param {number} y - Y position
     * @returns {Fish} New fish
     */
    createFish(x, y) {
        const id = this.nextId++;
        const fish = new Fish(id, x, y, FISH_BREED_TIME);
        this.setEntity(fish);
        return fish;
    }

    /**
     * Create a shark at a cell.
     * @param {number} x - X position
     * @param {number} y - Y position
     * @returns {Shark} New shark
     */
    createShark(x, y) {
        const id = this.nextId++;
        const shark = new Shark(
            id,
            x,
            y,
            INITIAL_SHARK_ENERGY,
            SHARK_BREED_TIME,
            SHARK_ENERGY_GAIN,
            SHARK_ENERGY_COST_PER_CHRONON
        );
        this.setEntity(shark);
        return shark;
    }
}
