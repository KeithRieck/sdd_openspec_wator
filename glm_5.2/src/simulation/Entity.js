/**
 * Abstract base class for all Wa-Tor entities (fish and sharks).
 *
 * An Entity occupies a single cell on the toroidal grid. Each entity has a
 * stable integer ID assigned at construction, a position, a breed age counter,
 * and a birthChronon stamp used to prevent newborns from acting in the same
 * chronon they were born.
 *
 * Concrete subclasses (Fish, Shark) implement the polymorphic `act()` method
 * which encodes the movement, breeding, eating, and starvation rules.
 */
export default class Entity {
    /**
     * Create a new entity.
     *
     * @param {number} id - Stable unique integer ID from the simulation's counter.
     * @param {number} x - Column position on the grid (0..width-1).
     * @param {number} y - Row position on the grid (0..height-1).
     * @param {number} birthChronon - The chronon number in which this entity was created.
     */
    constructor(id, x, y, birthChronon) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.breedAge = 0;
        this.birthChronon = birthChronon;
    }

    /**
     * Perform this entity's action for the current chronon.
     *
     * Subclasses MUST override this to implement fish or shark behavior.
     * The grid and simulation are passed in so the entity can inspect
     * neighbors, move, breed, eat, or die by mutating shared state.
     *
     * @param {Array<Entity|null>} grid - Flat grid array of length width*height.
     * @param {object} sim - The WatorSimulation instance (for IDs, counts, constants).
     */
    act(grid, sim) {
        throw new Error('Entity.act() must be overridden by a subclass');
    }

    /**
     * Whether this entity is ready to breed this chronon.
     *
     * @returns {boolean} True if the breed age has reached the breeding threshold.
     */
    canBreed() {
        throw new Error('Entity.canBreed() must be overridden by a subclass');
    }

    /**
     * The render-time color of this entity as a numeric Phaser color.
     *
     * @returns {number} The color constant from `src/config.js`.
     */
    get color() {
        throw new Error('Entity.color must be overridden by a subclass');
    }

    /**
     * The render-time circle radius as a fraction of cell size.
     *
     * @returns {number} The radius factor constant from `src/config.js`.
     */
    get radiusFactor() {
        throw new Error('Entity.radiusFactor must be overridden by a subclass');
    }
}
