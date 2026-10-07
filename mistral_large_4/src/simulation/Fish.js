/**
 * Fish entity in the Wa-Tor simulation.
 *
 * Fish move randomly to adjacent empty cells and reproduce after surviving
 * a configurable number of chronons. When a breeding-ready fish moves, it
 * leaves a newborn fish in its old position.
 *
 * @see prd-v001.md requirements #14-17
 */
import { Entity } from './Entity.js';

/**
 * Represents a fish in the Wa-Tor ecosystem.
 * Extends Entity with fish-specific movement and breeding behavior.
 */
export class Fish extends Entity {
    /**
     * Create a new fish.
     * @param {number} id - Unique identifier for this fish
     * @param {number} position - Flat grid array index of the fish's cell
     * @param {number} breedTime - Number of chronons before this fish can breed
     */
    constructor(id, position, breedTime) {
        super(id, position, breedTime);
        /** @type {string} Entity type identifier */
        this.type = 'fish';
    }

    /**
     * Perform the fish's action for the current chronon.
     *
     * Behavior (PRD #14-17):
     * 1. Find all adjacent empty cells
     * 2. If any exist, move to a randomly selected one
     * 3. If breeding-ready and moved, leave newborn in old cell and reset breed timer
     * 4. If breeding-ready but cannot move, reset breed timer to 0
     * 5. If not breeding-ready and cannot move, age the breed timer
     *
     * @param {Array<number|null>} grid - The flat grid array
     * @param {Map<number, Entity>} entities - Map of entity ID to entity object
     * @param {import('./RandomNumberGenerator.js').RandomNumberGenerator} rng - Single RNG source
     * @param {object} simulation - Reference to WatorSimulation for helper methods
     */
    act(grid, entities, rng, simulation) {
        // Get adjacent empty cells
        const emptyNeighbors = simulation.getEmptyNeighbors(this.position);

        if (emptyNeighbors.length > 0) {
            // Fish can move - select random empty neighbor
            const newPosition = rng.pickRandom(emptyNeighbors);
            const oldPosition = this.position;

            // Move the fish
            simulation.moveEntity(this, newPosition);

            // Check breeding (PRD #15)
            if (this.canBreed()) {
                // Leave newborn in old position
                simulation.createFish(oldPosition);
                this.resetBreedAge();
            } else {
                // Age the fish
                this.age();
            }
        } else {
            // Fish cannot move (PRD #16-17)
            if (this.canBreed()) {
                // Breeding-ready but cannot move: reset breed timer
                this.resetBreedAge();
            } else {
                // Not breeding-ready: continue aging
                this.age();
            }
        }
    }
}

export default Fish;
