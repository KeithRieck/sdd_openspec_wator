import {
    FISH_DENSITY,
    GRID_HEIGHT,
    GRID_WIDTH,
    HISTORY_WINDOW,
    SHARK_DENSITY
} from '../config.js';
import Fish from './Fish.js';
import Shark from './Shark.js';
import WatorWorld from './WatorWorld.js';

/**
 * Headless Wa-Tor engine: init, step, history, and extinction.
 *
 * Does not import Phaser. wator-simulation requirements 2, 4, 10, 11, 12, 14.
 */
export default class WatorSimulation {
    constructor() {
        this.world = new WatorWorld(GRID_WIDTH, GRID_HEIGHT);
        this.chronon = 0;
        this.history = [];
        this.status = 'Running';
        this.fishCount = 0;
        this.sharkCount = 0;
        this.reset();
    }

    /**
     * Rebuild a random world at chronon 0. wator-simulation requirement 2.
     */
    reset() {
        this.world = new WatorWorld(GRID_WIDTH, GRID_HEIGHT);
        this.chronon = 0;
        this.history = [];
        this.status = 'Running';
        this._populate();
        this._countPopulations();
    }

    /**
     * Advance one chronon. wator-simulation requirements 4, 11, and 12.
     */
    step() {
        if (this.isTerminal()) {
            return;
        }

        const turnIds = Array.from(this.world.entities.keys());
        this._shuffle(turnIds);

        for (const id of turnIds) {
            const entity = this.world.entities.get(id);
            if (!entity) {
                continue;
            }
            entity.act(this.world);
        }

        this.chronon += 1;
        this._countPopulations();
        this._recordHistory();
        this._updateExtinction();
    }

    /**
     * Whether the run has ended in extinction.
     *
     * @returns {boolean}
     */
    isTerminal() {
        return this.status !== 'Running';
    }

    /**
     * Read-only view for the Phaser layer.
     *
     * @returns {object}
     */
    snapshot() {
        return {
            width: this.world.width,
            height: this.world.height,
            chronon: this.chronon,
            fishCount: this.fishCount,
            sharkCount: this.sharkCount,
            status: this.status,
            terminal: this.isTerminal(),
            occupants: Array.from(this.world.entities.values()).map((entity) => ({
                id: entity.id,
                type: entity.type,
                x: entity.x,
                y: entity.y
            })),
            history: this.history.slice()
        };
    }

    /**
     * Place exact density slices onto shuffled cells.
     * wator-simulation requirement 2.
     *
     * @private
     */
    _populate() {
        const cellCount = this.world.width * this.world.height;
        const indexes = Array.from({ length: cellCount }, (_, index) => index);
        this._shuffle(indexes);

        const fishCount = Math.floor(cellCount * FISH_DENSITY);
        const sharkCount = Math.floor(cellCount * SHARK_DENSITY);

        for (let i = 0; i < fishCount; i += 1) {
            const index = indexes[i];
            const x = index % this.world.width;
            const y = Math.floor(index / this.world.width);
            this.world.spawn(new Fish(this.world.createId(), x, y));
        }

        for (let i = 0; i < sharkCount; i += 1) {
            const index = indexes[fishCount + i];
            const x = index % this.world.width;
            const y = Math.floor(index / this.world.width);
            this.world.spawn(new Shark(this.world.createId(), x, y));
        }
    }

    /**
     * Fisher–Yates shuffle using Math.random().
     *
     * @param {Array} items - Array mutated in place.
     * @private
     */
    _shuffle(items) {
        for (let i = items.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            const swap = items[i];
            items[i] = items[j];
            items[j] = swap;
        }
    }

    /**
     * Recount living fish and sharks.
     *
     * @private
     */
    _countPopulations() {
        let fishCount = 0;
        let sharkCount = 0;
        for (const entity of this.world.entities.values()) {
            if (entity.type === 'fish') {
                fishCount += 1;
            } else if (entity.type === 'shark') {
                sharkCount += 1;
            }
        }
        this.fishCount = fishCount;
        this.sharkCount = sharkCount;
    }

    /**
     * Append one sample and trim the rolling window.
     * wator-simulation requirement 11.
     *
     * @private
     */
    _recordHistory() {
        this.history.push({
            chronon: this.chronon,
            fish: this.fishCount,
            sharks: this.sharkCount
        });
        if (this.history.length > HISTORY_WINDOW) {
            this.history.splice(0, this.history.length - HISTORY_WINDOW);
        }
    }

    /**
     * Set the terminal reason when a species is gone.
     * wator-simulation requirement 12.
     *
     * @private
     */
    _updateExtinction() {
        const noFish = this.fishCount === 0;
        const noSharks = this.sharkCount === 0;
        if (noFish && noSharks) {
            this.status = 'Ecosystem collapsed';
        } else if (noFish) {
            this.status = 'Fish extinct';
        } else if (noSharks) {
            this.status = 'Sharks extinct';
        }
    }
}
