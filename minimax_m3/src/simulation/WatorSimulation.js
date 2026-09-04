import Grid from './Grid.js';
import Fish from './Fish.js';
import Shark from './Shark.js';
import {
    GRID_WIDTH,
    GRID_HEIGHT,
    FISH_DENSITY,
    SHARK_DENSITY,
    FISH_BREED_TIME,
    SHARK_BREED_TIME,
    INITIAL_SHARK_ENERGY,
    SHARK_ENERGY_GAIN,
    SHARK_ENERGY_COST_PER_CHRONON,
    DEFAULT_SPEED,
    SPEED_OPTIONS,
    HISTORY_WINDOW
} from '../config.js';

/**
 * The framework-free Wa-Tor simulation.
 *
 * Owns the toroidal grid, the population of entities, the chronon counter,
 * the running/paused state, and a rolling history ring buffer of population
 * samples. The chronon algorithm:
 *
 *   1. Snapshot all current entity ids into an array.
 *   2. Shuffle the array using Math.random().
 *   3. For each id in shuffled order:
 *      - Find the entity on the grid by id. If null, it died or was eaten
 *        since snapshot; skip.
 *      - Otherwise, ask the entity to act. The act may move, eat, breed, or
 *        die. Newborns created this chronon are added to a deferred set and
 *        will not be in the snapshot for any subsequent iteration this
 *        chronon; they join the active set on the next chronon.
 *   4. Increment chronon, record history sample, check extinction.
 *
 * Status values:
 *   - 'running'  : simulation is advancing chronons
 *   - 'paused'   : not advancing (user-requested pause)
 *   - 'sharks-extinct', 'fish-extinct', 'ecosystem-collapsed' : terminal
 */
export default class WatorSimulation {
    /**
     * Create a new simulation with default constants.
     *
     * @param {object} [overrides] - Optional constant overrides; any field
     *   here replaces the default from config.js.
     */
    constructor(overrides = {}) {
        const cfg = {
            gridWidth: GRID_WIDTH,
            gridHeight: GRID_HEIGHT,
            fishDensity: FISH_DENSITY,
            sharkDensity: SHARK_DENSITY,
            fishBreedTime: FISH_BREED_TIME,
            sharkBreedTime: SHARK_BREED_TIME,
            initialSharkEnergy: INITIAL_SHARK_ENERGY,
            sharkEnergyGain: SHARK_ENERGY_GAIN,
            sharkEnergyCostPerChronon: SHARK_ENERGY_COST_PER_CHRONON,
            defaultSpeed: DEFAULT_SPEED,
            historyWindow: HISTORY_WINDOW,
            ...overrides
        };
        this.config = cfg;

        this.width = cfg.gridWidth;
        this.height = cfg.gridHeight;
        this.grid = new Grid(this.width, this.height);

        /** Monotonically increasing id assigned to each new entity. */
        this._nextId = 1;
        /** Chronon counter, incremented at the end of each step(). */
        this.chronon = 0;
        /** Selected chronons-per-second. */
        this.speed = cfg.defaultSpeed;
        /** Whether the simulation is currently advancing (user-controlled). */
        this.running = true;
        /** Terminal status if any. null while running or paused non-terminal. */
        this._terminal = null;
        /** Rolling ring buffer of {chronon, fish, sharks} samples. */
        this._history = [];

        /** Spawn the initial random population. */
        this._populate();
    }

    /**
     * Fill the grid with a random initial population per the configured
     * densities. Cells are sampled independently; sharks do not replace fish
     * and vice versa — the densities compete for the same empty pool.
     *
     * @private
     */
    _populate() {
        const total = this.width * this.height;
        const fishTarget = Math.round(total * this.config.fishDensity);
        const sharkTarget = Math.round(total * this.config.sharkDensity);

        const allCells = [];
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                allCells.push({ x, y });
            }
        }
        // Shuffle cell order so first picks are random.
        for (let i = allCells.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allCells[i], allCells[j]] = [allCells[j], allCells[i]];
        }

        let fishPlaced = 0;
        let sharkPlaced = 0;
        for (const cell of allCells) {
            if (fishPlaced < fishTarget) {
                const f = new Fish(this._nextId++, cell.x, cell.y, this.config.fishBreedTime);
                this.grid.place(f, cell.x, cell.y);
                fishPlaced++;
            } else if (sharkPlaced < sharkTarget) {
                const s = new Shark(
                    this._nextId++, cell.x, cell.y,
                    this.config.sharkBreedTime,
                    this.config.initialSharkEnergy,
                    this.config.sharkEnergyGain,
                    this.config.sharkEnergyCostPerChronon
                );
                this.grid.place(s, cell.x, cell.y);
                sharkPlaced++;
            } else {
                break;
            }
        }
    }

    /**
     * Advance the simulation by exactly one chronon. Performs the snapshot,
     * shuffle, iterate, newborn-defer, record, and extinction-check sequence
     * described in the class header.
     */
    step() {
        if (this._terminal) return;

        // Snapshot ids of all currently-alive entities.
        const ids = [];
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                const e = this.grid.cells[x][y];
                if (e) ids.push(e.id);
            }
        }
        // Fisher-Yates shuffle.
        for (let i = ids.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [ids[i], ids[j]] = [ids[j], ids[i]];
        }

        // Set of newborn ids created this chronon. They will join the active
        // entity set for the next chronon but must NOT act during this one.
        // We track by id rather than reference to avoid double-action even if
        // a newborn somehow shares an id slot.
        const newbornIds = new Set();

        for (const id of ids) {
            const e = this.grid.findById(id);
            if (!e) {
                // Died or eaten before its turn. Skip.
                continue;
            }
            if (e.type === 'fish') {
                const nb = e.act(this.grid, Math.random);
                if (nb) {
                    nb.id = this._nextId++;
                    newbornIds.add(nb.id);
                }
            } else if (e.type === 'shark') {
                const result = e.act(this.grid, Math.random);
                if (result.dead) {
                    this.grid.remove(e);
                }
                if (result.eaten) {
                    // Prey already removed from grid by Shark.act; nothing to do.
                }
                if (result.newborn) {
                    result.newborn.id = this._nextId++;
                    newbornIds.add(result.newborn.id);
                }
            }
        }

        this.chronon += 1;
        this._recordSample();
        this._checkExtinction();
    }

    /**
     * Reset to a fresh random world with chronon 0, cleared history, no
     * terminal state, and the simulation running at the previously selected
     * speed.
     */
    reset() {
        this.grid = new Grid(this.width, this.height);
        this._nextId = 1;
        this.chronon = 0;
        this._history = [];
        this._terminal = null;
        this.running = true;
        this._populate();
    }

    /**
     * Pause or resume the simulation. Cannot resume from a terminal state;
     * the caller must reset() first.
     *
     * @param {boolean} value - True to run, false to pause.
     */
    setRunning(value) {
        if (this._terminal) {
            this.running = false;
            return;
        }
        this.running = !!value;
    }

    /**
     * Change the selected speed. Does not affect running state.
     *
     * @param {number} speed - Chronons per second; must be one of SPEED_OPTIONS.
     */
    setSpeed(speed) {
        this.speed = speed;
    }

    /** @returns {number} Number of fish currently alive. */
    getFishCount() {
        return this._countByType('fish');
    }

    /** @returns {number} Number of sharks currently alive. */
    getSharkCount() {
        return this._countByType('shark');
    }

    /**
     * Status string for display:
     *   - 'Running'                       : not terminal, running
     *   - 'Paused'                        : not terminal, paused
     *   - 'Sharks extinct' / 'Fish extinct' / 'Ecosystem collapsed' : terminal
     *
     * @returns {string}
     */
    getStatus() {
        if (this._terminal) return this._terminal;
        return this.running ? 'Running' : 'Paused';
    }

    /**
     * Return the rolling population history. Each entry is
     * `{chronon, fish, sharks}`. The array length never exceeds the configured
     * history window.
     *
     * @returns {Array<{chronon:number, fish:number, sharks:number}>}
     */
    getHistorySamples() {
        return this._history.slice();
    }

    /**
     * Walk every cell and count entities matching the given type. O(n) over
     * the grid; acceptable for 100x70.
     *
     * @param {string} type - 'fish' or 'shark'.
     * @returns {number}
     * @private
     */
    _countByType(type) {
        let n = 0;
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                const e = this.grid.cells[x][y];
                if (e && e.type === type) n++;
            }
        }
        return n;
    }

    /**
     * Append a {chronon, fish, sharks} sample to the rolling history buffer
     * and drop the oldest entry if length exceeds the window.
     *
     * @private
     */
    _recordSample() {
        this._history.push({
            chronon: this.chronon,
            fish: this.getFishCount(),
            sharks: this.getSharkCount()
        });
        while (this._history.length > this.config.historyWindow) {
            this._history.shift();
        }
    }

    /**
     * If either population has hit zero, set the terminal status and stop
     * running. If both populations hit zero in the same chronon, the status
     * is 'Ecosystem collapsed'.
     *
     * @private
     */
    _checkExtinction() {
        if (this._terminal) return;
        const fish = this.getFishCount();
        const sharks = this.getSharkCount();
        if (fish === 0 && sharks === 0) {
            this._terminal = 'Ecosystem collapsed';
            this.running = false;
        } else if (sharks === 0) {
            this._terminal = 'Sharks extinct';
            this.running = false;
        } else if (fish === 0) {
            this._terminal = 'Fish extinct';
            this.running = false;
        }
    }
}
