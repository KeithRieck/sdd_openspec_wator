/**
 * The single random-number generator for the whole simulation.
 *
 * Every random choice in the app - world seeding, turn-order shuffling, and
 * movement selection - is drawn from one instance of this class, satisfying
 * requirement `world-model` §2.3 and `chronon-rules` §1.2. This module is the
 * only place in `src/` that calls `Math.random()`, which keeps the source of
 * randomness in one auditable spot.
 */
export default class RandomSource {
    /**
     * Create a random-number generator.
     *
     * @param {Function} [source=Math.random] - Zero-argument function returning
     *   a float in `[0, 1)`. Defaults to `Math.random`; injectable so a caller
     *   can supply a deterministic substitute without editing call sites.
     */
    constructor(source = Math.random) {
        this.source = source;
    }

    /** @returns {number} A float in `[0, 1)`. */
    next() {
        return this.source();
    }

    /**
     * Pick one element from a non-empty array uniformly at random.
     *
     * @template T
     * @param {T[]} items - Non-empty array to choose from.
     * @returns {T} The selected element.
     */
    pick(items) {
        return items[Math.floor(this.next() * items.length)];
    }
}
