/**
 * Single random number generator for the Wa-Tor simulation.
 * R7: Single RNG for all random choices
 */
export default class RandomGenerator {
    /**
     * Create a random generator.
     */
    constructor() {
        // Uses Math.random() internally
    }

    /**
     * Get the next random number in [0, 1).
     * @returns {number} Random number
     */
    next() {
        return Math.random();
    }

    /**
     * Get a random integer in [min, max).
     * @param {number} min - Minimum (inclusive)
     * @param {number} max - Maximum (exclusive)
     * @returns {number} Random integer
     */
    nextInt(min, max) {
        return Math.floor(this.next() * (max - min)) + min;
    }

    /**
     * Get a random boolean.
     * @returns {boolean} Random boolean
     */
    nextBoolean() {
        return this.next() < 0.5;
    }

    /**
     * Shuffle an array in place.
     * @param {Array} array - Array to shuffle
     * @returns {Array} Shuffled array
     */
    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(this.next() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}
