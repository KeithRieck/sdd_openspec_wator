/**
 * A shark entity in the Wa-Tor simulation.
 *
 * Sharks first decrement their energy by `sharkEnergyCostPerChronon`. If
 * energy reaches zero, the shark dies immediately without moving or eating.
 * Otherwise, the shark prefers an adjacent fish cell (eats the fish on
 * arrival and gains `sharkEnergyGain` energy); if no fish is adjacent, it
 * moves to a random adjacent empty cell. Breeding behaves like fish: a
 * breeding-ready shark that successfully moves leaves a newborn shark with
 * `initialSharkEnergy` in the old cell and resets the parent's breed timer.
 *
 * Sharks do not depend on Phaser; they interact only with the framework-free
 * `Grid` type.
 */
export default class Shark {
    /**
     * Create a shark.
     *
     * @param {number} id - Globally unique entity id assigned by the simulation.
     * @param {number} x - Initial column.
     * @param {number} y - Initial row.
     * @param {number} breedTime - Chronons before breeding-ready.
     * @param {number} initialEnergy - Energy assigned to a newborn shark.
     * @param {number} energyGain - Energy gained per fish eaten.
     * @param {number} energyCost - Energy lost per chronon.
     */
    constructor(id, x, y, breedTime, initialEnergy, energyGain, energyCost) {
        this.id = id;
        this.x = x;
        this.y = y;
        /** Discriminator used for type queries and rendering. */
        this.type = 'shark';
        this.breedAge = 0;
        this.breedTime = breedTime;
        this.energy = initialEnergy;
        this.initialEnergy = initialEnergy;
        this.energyGain = energyGain;
        this.energyCost = energyCost;
    }

    /**
     * Take one chronon of action. Returns a result describing what happened
     * so the simulation can update its entity collections and newborn set:
     *   - `dead: true` if the shark starved
     *   - `eaten: entity` if the shark ate a fish (caller removes the fish)
     *   - `newborn: Shark` if a newborn was placed on the old cell
     *
     * @param {object} grid - The toroidal grid.
     * @param {() => number} rng - Random number source returning [0, 1).
     * @returns {{dead:boolean, eaten:object|null, newborn:object|null}}
     */
    act(grid, rng) {
        // 1. Decrement energy first.
        this.energy -= this.energyCost;

        if (this.energy <= 0) {
            // Die immediately. Caller will remove us from the grid.
            return { dead: true, eaten: null, newborn: null };
        }

        const neighbors = grid.orthogonalNeighbors(this.x, this.y);

        // 2. Prefer adjacent fish cell.
        const fishNeighbors = neighbors.filter(
            n => grid.cellAt(n.x, n.y) !== null && grid.cellAt(n.x, n.y).type === 'fish'
        );

        const breedingReady = this.breedAge >= this.breedTime;

        if (fishNeighbors.length > 0) {
            const target = fishNeighbors[Math.floor(rng() * fishNeighbors.length)];
            const prey = grid.cellAt(target.x, target.y);
            const oldX = this.x;
            const oldY = this.y;
            grid.remove(this);
            grid.remove(prey);
            grid.place(this, target.x, target.y);
            this.energy += this.energyGain;

            let newborn = null;
            if (breedingReady) {
                newborn = new Shark(
                    -1, oldX, oldY, this.breedTime,
                    this.initialEnergy, this.energyGain, this.energyCost
                );
                grid.place(newborn, oldX, oldY);
                this.breedAge = 0;
            } else {
                this.breedAge += 1;
            }
            return { dead: false, eaten: prey, newborn };
        }

        // 3. No adjacent fish; try empty cell.
        const empty = neighbors.filter(n => grid.cellAt(n.x, n.y) === null);

        if (empty.length === 0) {
            // Blocked: per rules, reset breed timer if ready, otherwise age.
            if (breedingReady) {
                this.breedAge = 0;
            } else {
                this.breedAge += 1;
            }
            return { dead: false, eaten: null, newborn: null };
        }

        const target = empty[Math.floor(rng() * empty.length)];
        const oldX = this.x;
        const oldY = this.y;
        grid.remove(this);
        grid.place(this, target.x, target.y);

        let newborn = null;
        if (breedingReady) {
            newborn = new Shark(
                -1, oldX, oldY, this.breedTime,
                this.initialEnergy, this.energyGain, this.energyCost
            );
            grid.place(newborn, oldX, oldY);
            this.breedAge = 0;
        } else {
            this.breedAge += 1;
        }
        return { dead: false, eaten: null, newborn };
    }
}
