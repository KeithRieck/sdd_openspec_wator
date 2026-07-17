/**
 * @typedef {Object} Sample
 * @property {number} fish
 * @property {number} sharks
 */

/**
 * Fixed-capacity rolling record of population samples, one per chronon.
 *
 * Stores the most recent `capacity` samples (default 500). When full, recording
 * a new sample drops the oldest, so the history chart shows a sliding window of
 * recent population over time.
 */
export class PopulationHistory {
  /**
   * @param {number} capacity Maximum number of samples retained.
   */
  constructor(capacity) {
    this.capacity = capacity;
    /** @type {Sample[]} */
    this.samples = [];
  }

  /** @returns {number} Number of samples currently stored. */
  get length() {
    return this.samples.length;
  }

  /**
   * Records one sample, evicting the oldest if at capacity.
   * @param {number} fish
   * @param {number} sharks
   */
  record(fish, sharks) {
    this.samples.push({ fish, sharks });
    if (this.samples.length > this.capacity) {
      this.samples.shift();
    }
  }

  /** Empties the history. */
  clear() {
    this.samples.length = 0;
  }

  /**
   * Invokes a callback for each sample in order, oldest first.
   * @param {(sample: Sample, index: number, total: number) => void} callback
   */
  forEach(callback) {
    const total = this.samples.length;
    for (let i = 0; i < total; i++) {
      callback(this.samples[i], i, total);
    }
  }
}
