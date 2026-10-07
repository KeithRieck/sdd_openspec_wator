/**
 * Shark entity in the Wa-Tor simulation.
 *
 * Sharks hunt adjacent fish for energy, lose energy each chronon, and die
 * when energy reaches zero. Sharks can also reproduce after surviving a
 * configurable number of chronons. Eating a fish counts as a successful
 * move for breeding purposes.
 *
 * @see prd-v001.md requirements #18-26
 */
import { Entity } from './Entity.js';

/**
 * Represents a shark in the Wa-Tor ecosystem.
 * Extends Entity with shark-specific energy management, hunting, and breeding.
 */
export class Shark extends Entity {
    /**
     * Create a new shark.
     * @param {number} id - Unique identifier for this shark
     * @param {number} position - Flat grid array index of the shark's cell
     * @param {number} breedTime - Number of chronons before this shark can breed
     * @param {number} initialEnergy - Starting energy for this shark
     * @param {number} energyGain - Energy gained when eating a fish
     * @param {number} energyCostPerChronon - Energy lost per chronon
     */
    constructor(id, position, breedTime, initialEnergy, energyGain, energyCostPerChronon) {
        super(id, position, breedTime);
        /** @type {string} Entity type identifier */
        this.type = 'shark';

        /** @type {number} Current energy level */
        this.energy = initialEnergy;

        /** @type {number} Initial energy (used for newborn sharks) */
        this.initialEnergy = initialEnergy;

        /** @type {number} Energy gained when eating a fish */
        this.energyGain = energyGain;

        /** @type {number} Energy cost per chronon */
        this.energyCostPerChronon = energyCostPerChronon;
    }

    /**
     * Perform the shark's action for the current chronon.
     *
     * Behavior (PRD #18-26):
     * 1. Decrement energy by cost per chronon
     * 2. If energy reaches 0, die immediately (no movement or eating)
     * 3. If adjacent fish exist, move to one and eat it (gain energy)
     * 4. Else if adjacent empty cells exist, move to one
     * 5. If moved and breeding-ready, leave newborn shark in old cell
     * 6. If breeding-ready but cannot move, reset breed timer
     * 7. If not breeding-ready and cannot move, age the breed timer
     *
     * @param {Array<number|null>} grid - The flat grid array
     * @param {Map<number, Entity>} entities - Map of entity ID to entity object
     * @param {import('./RandomNumberGenerator.js').RandomNumberGenerator} rng - Single RNG source
     * @param {object} simulation - Reference to WatorSimulation for helper methods
     */
    act(grid, entities, rng, simulation) {
        // Step 1: Decrement energy (PRD #18)
        this.energy -= this.energyCostPerChronon;

        // Step 2: Check for starvation (PRD #19)
        if (this.energy <= 0) {
            simulation.removeEntity(this);
            return;
        }

        // Step 3: Check for adjacent fish to eat (PRD #20-21)
        const fishNeighbors = simulation.getFishNeighbors(this.position);

        let moved = false;
        let oldPosition = this.position;

        if (fishNeighbors.length > 0) {
            // Eat a fish - move to its cell and consume it
            const targetPosition = rng.pickRandom(fishNeighbors);
            const eatenFish = entities.get(grid[targetPosition]);

            // Remove the eaten fish
            simulation.removeEntity(eatenFish);

            // Move shark to the fish's cell
            simulation.moveEntity(this, targetPosition);

            // Gain energy from eating (PRD #21)
            this.eat();

            moved = true;
        } else {
            // Step 4: No fish adjacent - try to move to empty cell (PRD #22)
            const emptyNeighbors = simulation.getEmptyNeighbors(this.position);

            if (emptyNeighbors.length > 0) {
                const newPosition = rng.pickRandom(emptyNeighbors);
                simulation.moveEntity(this, newPosition);
                moved = true;
            }
        }

        // Step 5-7: Handle breeding and aging (PRD #23-26)
        if (moved) {
            if (this.canBreed()) {
                // Breeding-ready and moved: create newborn (PRD #23-24)
                simulation.createShark(oldPosition);
                this.resetBreedAge();
            } else {
                // Moved but not breeding-ready: age
                this.age();
            }
        } else {
            // Could not move (PRD #25-26)
            if (this.canBreed()) {
                // Breeding-ready but cannot move: reset breed timer
                this.resetBreedAge();
            } else {
                // Not breeding-ready and cannot move: age
                this.age();
            }
        }
    }

    /**
     * Gain energy from eating a fish (PRD #21).
     */
    eat() {
        this.energy += this.energyGain;
    }

    /**
     * Lose energy (called externally if needed).
     * @param {number} amount - Amount of energy to lose
     * @returns {boolean} True if shark is still alive, false if it died
     */
    loseEnergy(amount) {
        this.energy -= amount;
        if (this.energy <= 0) {
            this.die();
            return false;
        }
        return true;
    }
}

export default Shark;
