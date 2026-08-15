/**
 * Shark entity class for the Wa-Tor simulation.
 * Sharks hunt fish, manage energy, and breed when their breed timer reaches the threshold.
 * @module simulation/Shark
 */
import { Entity } from './Entity.js';

/**
 * Represents a shark in the Wa-Tor world.
 * Sharks prioritize eating adjacent fish, manage starvation energy, and reproduce after surviving SHARK_BREED_TIME chronons.
 */
export class Shark extends Entity {
    /**
     * Create a new shark.
     * @param {number} id - Unique entity identifier
     * @param {number} x - Grid column position
     * @param {number} y - Grid row position
     * @param {number} initialEnergy - Starting energy value
     */
    constructor(id, x, y, initialEnergy) {
        super(id, x, y);
        /**
         * Current energy level. Decrements each chronon; reaches 0 = death.
         * @type {number}
         * @private
         */
        this._energy = initialEnergy;
    }

    /**
     * Get the entity type identifier.
     * @returns {string} Always returns "shark"
     */
    getType() {
        return 'shark';
    }

    /**
     * Get the shark's current energy level.
     * @returns {number} Current energy
     */
    getEnergy() {
        return this._energy;
    }

    /**
     * Set the shark's energy level directly.
     * @param {number} energy - New energy value
     */
    setEnergy(energy) {
        this._energy = energy;
    }

    /**
     * Decrement the shark's energy by the given cost.
     * @param {number} cost - Energy cost to subtract
     */
    decrementEnergy(cost) {
        this._energy -= cost;
    }

    /**
     * Add energy to the shark (when eating a fish).
     * @param {number} gain - Energy to add
     */
    addEnergy(gain) {
        this._energy += gain;
    }

    /**
     * Check if the shark has died (energy <= 0).
     * @returns {boolean} True if energy <= 0
     */
    isDead() {
        return this._energy <= 0;
    }

    /**
     * Perform the shark's action for the current chronon.
     * Sharks first lose energy, then die if energy reaches 0.
     * Otherwise, they try to eat adjacent fish, or move to empty cells.
     * If breeding-ready and movement occurs, a new shark is left behind.
     * @param {Object} grid - The simulation grid interface with methods:
     *   - getWidth(): number
     *   - getHeight(): number
     *   - getCell(x, y): Entity|null
     *   - setCell(x, y, entity): void
     *   - getEmptyNeighbors(x, y): Array<{x: number, y: number}>
     *   - getFishNeighbors(x, y): Array<{x: number, y: number}>
     *   - getNextEntityId(): number
     * @param {Object} config - Configuration constants
     * @returns {Object} Action result with properties:
     *   - died: boolean - whether the shark died
     *   - moved: boolean - whether the shark moved
     *   - ate: boolean - whether the shark ate a fish
     *   - bred: boolean - whether a new shark was created
     *   - newEntity: Shark|null - the new shark if bred, null otherwise
     *   - newX: number - new x position if moved
     *   - newY: number - new y position if moved
     *   - eatenFishId: number|null - ID of eaten fish if any
     */
    act(grid, config) {
        // Decrement energy at start of action
        this.decrementEnergy(config.SHARK_ENERGY_COST_PER_CHRONON);

        // Check for death
        if (this.isDead()) {
            return {
                died: true,
                moved: false,
                ate: false,
                bred: false,
                newEntity: null,
                newX: this._x,
                newY: this._y,
                eatenFishId: null,
            };
        }

        const fishNeighbors = grid.getFishNeighbors(this._x, this._y);
        const emptyNeighbors = grid.getEmptyNeighbors(this._x, this._y);
        const breedingReady = this.isBreedingReady(config.SHARK_BREED_TIME);
        const oldX = this._x;
        const oldY = this._y;

        if (fishNeighbors.length > 0) {
            // Eat a random adjacent fish
            const target = fishNeighbors[Math.floor(Math.random() * fishNeighbors.length)];
            const eatenFish = grid.getCell(target.x, target.y);
            const eatenFishId = eatenFish ? eatenFish.getId() : null;

            this.setPosition(target.x, target.y);
            grid.setCell(target.x, target.y, this);
            grid.setCell(oldX, oldY, null);
            this.addEnergy(config.SHARK_ENERGY_GAIN);

            if (breedingReady) {
                // Breed: leave a new shark in the old cell
                this.resetBreedAge();
                const newShark = new Shark(grid.getNextEntityId(), oldX, oldY, config.INITIAL_SHARK_ENERGY);
                grid.setCell(oldX, oldY, newShark);
                return {
                    died: false,
                    moved: true,
                    ate: true,
                    bred: true,
                    newEntity: newShark,
                    newX: target.x,
                    newY: target.y,
                    eatenFishId: eatenFishId,
                };
            } else {
                // Not breeding-ready: age the breed timer
                this.incrementBreedAge();
                return {
                    died: false,
                    moved: true,
                    ate: true,
                    bred: false,
                    newEntity: null,
                    newX: target.x,
                    newY: target.y,
                    eatenFishId: eatenFishId,
                };
            }
        } else if (emptyNeighbors.length > 0) {
            // No fish adjacent, move to random empty cell
            const target = emptyNeighbors[Math.floor(Math.random() * emptyNeighbors.length)];

            this.setPosition(target.x, target.y);
            grid.setCell(target.x, target.y, this);
            grid.setCell(oldX, oldY, null);

            if (breedingReady) {
                // Breed: leave a new shark in the old cell
                this.resetBreedAge();
                const newShark = new Shark(grid.getNextEntityId(), oldX, oldY, config.INITIAL_SHARK_ENERGY);
                grid.setCell(oldX, oldY, newShark);
                return {
                    died: false,
                    moved: true,
                    ate: false,
                    bred: true,
                    newEntity: newShark,
                    newX: target.x,
                    newY: target.y,
                    eatenFishId: null,
                };
            } else {
                // Not breeding-ready: age the breed timer
                this.incrementBreedAge();
                return {
                    died: false,
                    moved: true,
                    ate: false,
                    bred: false,
                    newEntity: null,
                    newX: target.x,
                    newY: target.y,
                    eatenFishId: null,
                };
            }
        } else {
            // No valid moves (surrounded by sharks)
            if (breedingReady) {
                // Breeding-ready but cannot move: reset breed timer
                this.resetBreedAge();
            } else {
                // Not breeding-ready and cannot move: age the breed timer
                this.incrementBreedAge();
            }
            return {
                died: false,
                moved: false,
                ate: false,
                bred: false,
                newEntity: null,
                newX: this._x,
                newY: this._y,
                eatenFishId: null,
            };
        }
    }
}