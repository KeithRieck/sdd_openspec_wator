/**
 * Main simulation scene for the Wa-Tor simulation.
 * Manages the game loop, UI components, and simulation stepping.
 * @module scenes/SimulationScene
 */
import { WatorSimulation, SimulationStatus } from '../simulation/WatorSimulation.js';
import { WorldRenderer } from '../ui/WorldRenderer.js';
import { StatsPanel } from '../ui/StatsPanel.js';
import { ControlPanel } from '../ui/ControlPanel.js';
import { HistoryChart } from '../ui/HistoryChart.js';
import Config from '../config.js';

/**
 * Main simulation scene - handles rendering, input, and simulation stepping.
 */
export default class SimulationScene extends Phaser.Scene {
    /**
     * Create the simulation scene.
     */
    constructor() {
        super({ key: 'SimulationScene' });

        /** @type {WatorSimulation} */
        this._simulation = null;

        /** @type {WorldRenderer} */
        this._worldRenderer = null;

        /** @type {StatsPanel} */
        this._statsPanel = null;

        /** @type {ControlPanel} */
        this._controlPanel = null;

        /** @type {HistoryChart} */
        this._historyChart = null;

        /** @type {number} */
        this._speedIndex = Config.DEFAULT_SPEED_INDEX;

        /** @type {boolean} */
        this._isRunning = true;

        /** @type {number} */
        this._accumulator = 0;

        /** @type {number} */
        this._chrononsPerSecond = Config.SPEED_OPTIONS[Config.DEFAULT_SPEED_INDEX];
    }

    /**
     * Initialize the simulation and UI components.
     */
    create() {
        // Create simulation
        this._simulation = new WatorSimulation(Config);
        this._simulation.initialize();

        // Create UI components
        this._worldRenderer = new WorldRenderer(this, this._simulation);
        this._statsPanel = new StatsPanel(this, this._simulation);
        this._historyChart = new HistoryChart(this, this._simulation);

        this._controlPanel = new ControlPanel(this, this._simulation, {
            onSpeedChange: (index) => this._onSpeedChange(index),
            onPlayPause: () => this._onPlayPause(),
            onStep: () => this._onStep(),
            onReset: () => this._onReset(),
        });

        // Initial layout
        this._layout();

        // Handle resize
        this.scale.on('resize', this._layout, this);

        // Set initial running state
        this._controlPanel.setRunning(this._isRunning);
    }

    /**
     * Handle window resize - recompute layout.
     * @private
     */
    _layout() {
        const width = this.scale.width;
        const height = this.scale.height;

        // Reserve space for history chart at bottom
        const chartHeight = this._historyChart.getRequiredHeight();
        const chartY = height - chartHeight;

        // Available area for world + side panels
        const availableHeight = chartY;
        const statsWidth = this._statsPanel.getRequiredWidth();
        const controlsWidth = this._controlPanel.getRequiredWidth();

        // World area in the middle
        const worldX = statsWidth;
        const worldY = 0;
        const worldWidth = width - statsWidth - controlsWidth;
        const worldHeight = availableHeight;

        // Resize world renderer
        this._worldRenderer.resize(worldWidth, worldHeight, worldX, worldY);

        // Resize stats panel (left)
        this._statsPanel.resize(0, 0, statsWidth, availableHeight);

        // Resize control panel (right)
        this._controlPanel.resize(
            width - controlsWidth,
            0,
            controlsWidth,
            availableHeight
        );

        // Resize history chart (bottom)
        this._historyChart.resize(0, chartY, width, chartHeight);
    }

    /**
     * Phaser update loop - advance simulation based on speed.
     * @param {number} time - Current time in ms
     * @param {number} delta - Delta time in ms since last frame
     */
    update(time, delta) {
        // Update UI components
        this._statsPanel.update();
        this._controlPanel.update();
        this._historyChart.render();
        this._worldRenderer.render();

        if (!this._isRunning) {
            return;
        }

        // Accumulate time and step simulation at configured rate
        this._accumulator += delta;
        const msPerChronon = 1000 / this._chrononsPerSecond;

        while (this._accumulator >= msPerChronon) {
            this._simulation.step();
            this._accumulator -= msPerChronon;

            // Check for terminal state
            const status = this._simulation.getStatus();
            if (status !== SimulationStatus.RUNNING && status !== SimulationStatus.PAUSED) {
                this._isRunning = false;
                this._controlPanel.setRunning(false);
                break;
            }
        }
    }

    /**
     * Handle speed change.
     * @param {number} index - New speed index
     * @private
     */
    _onSpeedChange(index) {
        this._speedIndex = index;
        this._chrononsPerSecond = Config.SPEED_OPTIONS[index];
    }

    /**
     * Handle play/pause toggle.
     * @private
     */
    _onPlayPause() {
        const status = this._simulation.getStatus();
        if (status !== SimulationStatus.RUNNING && status !== SimulationStatus.PAUSED) {
            return; // Terminal state - cannot play
        }

        this._isRunning = !this._isRunning;
        this._simulation.setRunning(this._isRunning);
        this._controlPanel.setRunning(this._isRunning);
    }

    /**
     * Handle single step.
     * @private
     */
    _onStep() {
        if (this._isRunning) return; // Can't step while running

        const status = this._simulation.getStatus();
        if (status !== SimulationStatus.RUNNING && status !== SimulationStatus.PAUSED) {
            return; // Terminal state - cannot step
        }

        this._simulation.step();

        // Check for terminal state after step
        const newStatus = this._simulation.getStatus();
        if (newStatus !== SimulationStatus.RUNNING && newStatus !== SimulationStatus.PAUSED) {
            this._isRunning = false;
            this._controlPanel.setRunning(false);
        }
    }

    /**
     * Handle reset.
     * @private
     */
    _onReset() {
        this._simulation.reset();
        this._isRunning = true;
        this._simulation.setRunning(true);
        this._controlPanel.setRunning(true);
        this._accumulator = 0;
    }
}