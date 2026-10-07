/**
 * Single random number generator for the entire Wa-Tor simulation.
 *
 * All random choices in the simulation (initialization, movement selection,
 * turn-order shuffling) draw from this single source as required by PRD #61.
 *
 * @see prd-v001.md requirement #61
 */
export class RandomNumberGenerator {
    /**
     * Create a new random number generator.
     * Uses Math.random() as the underlying source.
     */
    constructor() {
        // No state needed - we delegate to Math.random()
    }

    /**
     * Get a random floating-point number in the range [0, 1).
     * @returns {number} Random number between 0 (inclusive) and 1 (exclusive)
     */
    next() {
        return Math.random();
    }

    /**
     * Get a random integer in the range [0, maxExclusive).
     * @param {number} maxExclusive - Upper bound (exclusive)
     * @returns {number} Random integer between 0 (inclusive) and maxExclusive (exclusive)
     */
    nextInt(maxExclusive) {
        return Math.floor(Math.random() * maxExclusive);
    }

    /**
     * Get a random integer in the range [min, max] (both inclusive).
     * @param {number} min - Lower bound (inclusive)
     * @param {number} max - Upper bound (inclusive)
     * @returns {number} Random integer between min and max (inclusive)
     */
    nextIntRange(min, max) {
        return min + Math.floor(Math.random() * (max - min + 1));
    }

    /**
     * Shuffle an array in place using the Fisher-Yates algorithm.
     * @template T
     * @param {T[]} array - Array to shuffle
     * @returns {T[]} The same array, shuffled
     */
    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = this.nextInt(i + 1);
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    /**
     * Pick a random element from an array.
     * @template T
     * @param {T[]} array - Array to pick from
     * @returns {T} A random element from the array
     */
    pickRandom(array) {
        return array[this.nextInt(array.length)];
    }

    /**
     * Check if a random event occurs with the given probability.
     * @param {number} probability - Probability between 0 and 1
     * @returns {boolean} True if the event occurs
     */
    chance(probability) {
        return Math.random() < probability;
    }
}

export default RandomNumberGenerator;
