/**
 * Fish entity class for the Wa-Tor simulation.
 * Fish move to adjacent empty cells and breed when their breed timer reaches the threshold.
 * @module simulation/Fish
 */
import { Entity } from './Entity.js';

/**
 * Represents a fish in the Wa-Tor world.
 * Fish move randomly to adjacent empty cells and reproduce after surviving FISH_BREED_TIME chronons.
 */
export class Fish extends Entity {
    /**
     * Create a new fish.
     * @param {number} id - Unique entity identifier
     * @param {number} x - Grid column position
     * @param {number} y - Grid row position
     */
    constructor(id, x, y) {
        super(id, x, y);
    }

    /**
     * Get the entity type identifier.
     * @returns {string} Always returns "fish"
     */
    getType() {
        return 'fish';
    }

    /**
     * Perform the fish's action for the current chronon.
     * Fish attempt to move to a random adjacent empty cell.
     * If breeding-ready and movement occurs, a new fish is left behind.
     * @param {Object} grid - The simulation grid interface with methods:
     *   - getWidth(): number
     *   - getHeight(): number
     *   - getCell(x, y): Entity|null
     *   - setCell(x, y, entity): void
     *   - getEmptyNeighbors(x, y): Array<{x: number, y: number}>
     * @param {Object} config - Configuration constants
     * @returns {Object} Action result with properties:
     *   - moved: boolean - whether the fish moved
     *   - bred: boolean - whether a new fish was created
     *   - newEntity: Fish|null - the new fish if bred, null otherwise
     *   - newX: number - new x position if moved
     *   - newY: number - new y position if moved
     */
    act(grid, config) {
        const emptyNeighbors = grid.getEmptyNeighbors(this._x, this._y);
        const breedingReady = this.isBreedingReady(config.FISH_BREED_TIME);

        if (emptyNeighbors.length === 0) {
            // No empty adjacent cells - cannot move
            if (breedingReady) {
                // Breeding-ready but cannot move: reset breed timer
                this.resetBreedAge();
            } else {
                // Not breeding-ready and cannot move: age the breed timer
                this.incrementBreedAge();
            }
            return {
                moved: false,
                bred: false,
                newEntity: null,
                newX: this._x,
                newY: this._y,
            };
        }

        // Move to a random empty neighbor
        const target = emptyNeighbors[Math.floor(Math.random() * emptyNeighbors.length)];
        const oldX = this._x;
        const oldY = this._y;

        this.setPosition(target.x, target.y);
        grid.setCell(target.x, target.y, this);
        grid.setCell(oldX, oldY, null);

        if (breedingReady) {
            // Breed: leave a new fish in the old cell
            this.resetBreedAge();
            const newFish = new Fish(grid.getNextEntityId(), oldX, oldY);
            grid.setCell(oldX, oldY, newFish);
            return {
                moved: true,
                bred: true,
                newEntity: newFish,
                newX: target.x,
                newY: target.y,
            };
        } else {
            // Not breeding-ready: age the breed timer
            this.incrementBreedAge();
            return {
                moved: true,
                bred: false,
                newEntity: null,
                newX: target.x,
                newY: target.y,
            };
        }
    }
}