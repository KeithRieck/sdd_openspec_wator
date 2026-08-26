/**
 * Base class for all Wa-Tor entities (fish and sharks).
 *
 * An entity record carries its identity, position, breeding state, and
 * liveness flags (wator-simulation R8). Subclasses implement {@link Entity#act}
 * to define their per-chronon behavior; the simulation engine supplies the
 * grid queries and mutation primitives the behavior relies on (design D2).
 */
export default class Entity {
    /**
     * Create a new entity.
     *
     * @param {number} id - Unique entity identifier.
     * @param {string} type - Entity type tag ('fish' or 'shark').
     * @param {number} x - Column position (0-based).
     * @param {number} y - Row position (0-based).
     */
    constructor(id, type, x, y) {
        this.id = id;
        this.type = type;
        this.x = x;
        this.y = y;
        /** Breeding age in chronons; compared against the breed time. */
        this.breedAge = 0;
        /** False once the entity is eaten or starves. */
        this.alive = true;
        /** True for entities spawned during the current chronon; such
         * entities do not act until the next chronon (wator-simulation R2.2). */
        this.bornThisChronon = false;
    }

    /**
     * Perform this entity's action for the current chronon.
     *
     * Subclasses must override this. The simulation passes itself so the
     * entity can query neighbors and mutate the world through the engine's
     * primitives (design D2).
     *
     * @param {import('./WatorSimulation.js').default} sim - The owning simulation.
     */
    act(sim) {
        throw new Error('Entity.act(sim) must be implemented by a subclass');
    }
}
