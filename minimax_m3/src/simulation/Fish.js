/**
 * A fish entity in the Wa-Tor simulation.
 *
 * Fish move to a random orthogonal empty cell each chronon. When a fish has
 * survived `fishBreedTime` chronons, its next successful move leaves a
 * newborn fish in the old cell and resets the parent's breed timer to 0.
 *
 * Fish do not depend on Phaser; they interact only with the framework-free
 * `Grid` type.
 */
export default class Fish {
    /**
     * Create a fish.
     *
     * @param {number} id - Globally unique entity id assigned by the simulation.
     * @param {number} x - Initial column.
     * @param {number} y - Initial row.
     * @param {number} breedTime - Number of chronons before the fish is breeding-ready.
     */
    constructor(id, x, y, breedTime) {
        this.id = id;
        this.x = x;
        this.y = y;
        /** Discriminator used by Shark to recognize fish cells. */
        this.type = 'fish';
        /** Chronons survived since last breed. Reset to 0 on successful breed. */
        this.breedAge = 0;
        this.breedTime = breedTime;
    }

    /**
     * Take one chronon of action: pick a random adjacent empty cell, move
     * into it, and breed if ready and able to move. If no empty cell is
     * available, do not move; reset the breed timer only if breeding-ready.
     *
     * The simulation places the newborn via `grid.place(...)` so the newborn
     * is added to the grid but is deferred to the next chronon's snapshot.
     *
     * @param {object} grid - The toroidal grid (provides cellAt, place, remove,
     *   orthogonalNeighbors).
     * @param {() => number} rng - Random number source returning [0, 1).
     * @returns {object|null} The newborn fish placed this turn, or null.
     */
    act(grid, rng) {
        const neighbors = grid.orthogonalNeighbors(this.x, this.y);
        const empty = neighbors.filter(n => grid.cellAt(n.x, n.y) === null);
        const breedingReady = this.breedAge >= this.breedTime;

        if (empty.length === 0) {
            // Blocked: per rules, reset breed timer if ready, otherwise age.
            if (breedingReady) {
                this.breedAge = 0;
            } else {
                this.breedAge += 1;
            }
            return null;
        }

        // Pick a random empty cell and move there.
        const target = empty[Math.floor(rng() * empty.length)];
        const oldX = this.x;
        const oldY = this.y;
        grid.remove(this);
        grid.place(this, target.x, target.y);

        let newborn = null;
        if (breedingReady) {
            // Leave a newborn on the old cell and reset the parent's timer.
            // Newborn is constructed with id = -1; the simulation replaces the
            // id immediately after grid.place() (see WatorSimulation.actOne).
            newborn = new Fish(-1, oldX, oldY, this.breedTime);
            grid.place(newborn, oldX, oldY);
            this.breedAge = 0;
        } else {
            this.breedAge += 1;
        }

        return newborn;
    }
}
