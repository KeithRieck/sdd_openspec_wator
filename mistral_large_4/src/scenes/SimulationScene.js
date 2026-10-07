/**
 * Main simulation scene for the Wa-Tor app.
 *
 * This scene owns the entire browser window and orchestrates:
 * - The WatorSimulation engine (pure JavaScript, no Phaser dependency)
 * - World rendering using Phaser Graphics (fish as green circles, sharks as blue circles)
 * - UI panels (stats, controls, speed, history chart)
 * - Speed-based simulation advancement
 * - Responsive layout for wide and narrow windows
 *
 * @see prd-v001.md requirements #5, #28-52
 */
import { Config } from '../config.js';
import { WatorSimulation } from '../simulation/WatorSimulation.js';
import { StatsPanel } from '../ui/StatsPanel.js';
import { ControlsPanel } from '../ui/ControlsPanel.js';
import { SpeedControls } from '../ui/SpeedControls.js';
import { HistoryChart } from '../ui/HistoryChart.js';

/**
 * Main Phaser scene for the Wa-Tor simulation.
 * Manages simulation state, rendering, and UI.
 */
export class SimulationScene extends Phaser.Scene {
    /**
     * Create the simulation scene.
     */
    constructor() {
        super({ key: 'SimulationScene' });
    }

    /**
     * Initialize the scene with simulation and UI.
     */
    create() {
        // Create the simulation engine (PRD #4 - independent of Phaser)
        /** @type {WatorSimulation} */
        this.simulation = new WatorSimulation();

        // Simulation state
        /** @type {boolean} True if simulation is running */
        this.isRunning = true;

        /** @type {number} Current speed in chronons per second */
        this.speed = Config.DEFAULT_SPEED;

        /** @type {number} Time accumulator for speed control (PRD #48) */
        this.accumulator = 0;

        // Create world graphics for rendering (PRD #50)
        /** @type {Phaser.GameObjects.Graphics} */
        this.worldGraphics = this.add.graphics();

        // Create UI components
        /** @type {StatsPanel} */
        this.statsPanel = null;

        /** @type {ControlsPanel} */
        this.controlsPanel = null;

        /** @type {SpeedControls} */
        this.speedControls = null;

        /** @type {HistoryChart} */
        this.historyChart = null;

        // Set up resize handling (PRD #9)
        this.scale.on('resize', this.handleResize, this);

        // Initial layout
        this.layout();

        // Initial render
        this.renderWorld();
        this.updateUI();
    }

    /**
     * Update loop - advances simulation based on speed.
     * (PRD #48)
     * @param {number} time - Game time in milliseconds
     * @param {number} delta - Time since last update in milliseconds
     */
    update(time, delta) {
        if (!this.isRunning || this.simulation.isTerminal) {
            return;
        }

        // Accumulate time and step simulation at selected speed (PRD #48)
        this.accumulator += delta;
        const interval = Config.getSpeedInterval(this.speed);

        while (this.accumulator >= interval) {
            this.simulation.step();
            this.accumulator -= interval;

            // Stop if terminal state reached
            if (this.simulation.isTerminal) {
                this.isRunning = false;
                break;
            }
        }

        // Render updated state (PRD #29 - immediate updates, no animation)
        this.renderWorld();
        this.updateUI();
    }

    /**
     * Render the simulation world using Phaser Graphics.
     * (PRD #28, #50)
     */
    renderWorld() {
        this.worldGraphics.clear();

        // Calculate cell size and offset to center the world
        const { cellSize, offsetX, offsetY } = this.calculateWorldTransform();

        // Draw water background (PRD #28)
        this.worldGraphics.fillStyle(Config.WATER_COLOR, 1);
        this.worldGraphics.fillRect(
            offsetX,
            offsetY,
            this.simulation.width * cellSize,
            this.simulation.height * cellSize
        );

        // Draw entities (PRD #28)
        const entities = this.simulation.getLivingEntities();
        for (const entity of entities) {
            const x = entity.position % this.simulation.width;
            const y = Math.floor(entity.position / this.simulation.width);

            const centerX = offsetX + x * cellSize + cellSize / 2;
            const centerY = offsetY + y * cellSize + cellSize / 2;

            if (entity.type === 'fish') {
                // Fish: green circles (PRD #28)
                const radius = cellSize * Config.FISH_RADIUS_RATIO;
                this.worldGraphics.fillStyle(Config.FISH_COLOR, 1);
                this.worldGraphics.fillCircle(centerX, centerY, radius);
            } else if (entity.type === 'shark') {
                // Sharks: blue circles, slightly larger (PRD #28)
                const radius = cellSize * Config.SHARK_RADIUS_RATIO;
                this.worldGraphics.fillStyle(Config.SHARK_COLOR, 1);
                this.worldGraphics.fillCircle(centerX, centerY, radius);
            }
        }
    }

    /**
     * Calculate the transform (cell size and offset) to center the world.
     * @returns {{cellSize: number, offsetX: number, offsetY: number}}
     * @private
     */
    calculateWorldTransform() {
        const gameWidth = this.scale.width;
        const gameHeight = this.scale.height;

        // Calculate available space for world (excluding UI panels and chart)
        const isNarrow = gameWidth < Config.NARROW_LAYOUT_THRESHOLD;

        let availableWidth, availableHeight, worldOffsetY;

        if (isNarrow) {
            // Narrow layout: world takes most of the width, UI stacks below
            availableWidth = gameWidth - Config.UI_PADDING * 2;
            availableHeight = gameHeight - Config.HISTORY_CHART_HEIGHT - Config.UI_PADDING * 3 - 200; // Space for stacked UI
            worldOffsetY = Config.UI_PADDING;
        } else {
            // Wide layout: stats left, world center, controls right
            availableWidth = gameWidth - Config.STATS_PANEL_WIDTH - Config.CONTROLS_PANEL_WIDTH - Config.UI_PADDING * 4;
            availableHeight = gameHeight - Config.HISTORY_CHART_HEIGHT - Config.UI_PADDING * 2;
            worldOffsetY = Config.UI_PADDING;
        }

        // Calculate cell size to fit world in available space
        const cellSize = Math.min(
            availableWidth / this.simulation.width,
            availableHeight / this.simulation.height
        );

        // Center the world
        const worldWidth = this.simulation.width * cellSize;
        const worldHeight = this.simulation.height * cellSize;

        let offsetX;
        if (isNarrow) {
            offsetX = (gameWidth - worldWidth) / 2;
        } else {
            offsetX = Config.STATS_PANEL_WIDTH + Config.UI_PADDING * 2 + (availableWidth - worldWidth) / 2;
        }

        const offsetY = worldOffsetY + (availableHeight - worldHeight) / 2;

        return { cellSize, offsetX, offsetY };
    }

    /**
     * Update all UI components with current simulation state.
     * @private
     */
    updateUI() {
        const stats = this.simulation.getStats();

        if (this.statsPanel) {
            this.statsPanel.update(stats);
        }

        if (this.controlsPanel) {
            this.controlsPanel.updateState(this.isRunning, stats.isTerminal);
        }

        if (this.historyChart) {
            this.historyChart.update(this.simulation.getHistory());
        }
    }

    /**
     * Perform layout based on window size.
     * (PRD #51-52)
     */
    layout() {
        const gameWidth = this.scale.width;
        const gameHeight = this.scale.height;
        const isNarrow = gameWidth < Config.NARROW_LAYOUT_THRESHOLD;

        // Destroy existing UI if re-laying out
        if (this.statsPanel) {
            this.statsPanel.destroy();
            this.controlsPanel.destroy();
            this.speedControls.destroy();
            this.historyChart.destroy();
        }

        if (isNarrow) {
            // Narrow layout: stack vertically (PRD #52)
            // Stats at top-left, controls at top-right, world below, chart at bottom
            this.statsPanel = new StatsPanel(this, Config.UI_PADDING, Config.UI_PADDING, Config.STATS_PANEL_WIDTH);

            this.controlsPanel = new ControlsPanel(
                this,
                gameWidth - Config.CONTROLS_PANEL_WIDTH - Config.UI_PADDING,
                Config.UI_PADDING,
                {
                    onPlayPause: () => this.togglePlayPause(),
                    onStep: () => this.stepOnce(),
                    onReset: () => this.resetSimulation()
                }
            );

            // Speed controls below stats
            this.speedControls = new SpeedControls(
                this,
                Config.UI_PADDING,
                130,
                (speed) => this.setSpeed(speed)
            );

            // History chart at bottom
            this.historyChart = new HistoryChart(
                this,
                Config.UI_PADDING,
                gameHeight - Config.HISTORY_CHART_HEIGHT - Config.UI_PADDING,
                gameWidth - Config.UI_PADDING * 2,
                Config.HISTORY_CHART_HEIGHT
            );
        } else {
            // Wide layout: stats left, world center, controls right, chart bottom (PRD #51)
            this.statsPanel = new StatsPanel(this, Config.UI_PADDING, Config.UI_PADDING, Config.STATS_PANEL_WIDTH);

            this.controlsPanel = new ControlsPanel(
                this,
                gameWidth - Config.CONTROLS_PANEL_WIDTH - Config.UI_PADDING,
                Config.UI_PADDING,
                {
                    onPlayPause: () => this.togglePlayPause(),
                    onStep: () => this.stepOnce(),
                    onReset: () => this.resetSimulation()
                }
            );

            // Speed controls below action buttons
            this.speedControls = new SpeedControls(
                this,
                gameWidth - Config.CONTROLS_PANEL_WIDTH - Config.UI_PADDING,
                Config.UI_PADDING + (Config.BUTTON_HEIGHT + Config.BUTTON_SPACING) * 3 + Config.UI_PADDING,
                (speed) => this.setSpeed(speed)
            );

            // History chart at bottom
            this.historyChart = new HistoryChart(
                this,
                Config.UI_PADDING,
                gameHeight - Config.HISTORY_CHART_HEIGHT - Config.UI_PADDING,
                gameWidth - Config.UI_PADDING * 2,
                Config.HISTORY_CHART_HEIGHT
            );
        }

        // Re-render world with new layout
        this.renderWorld();
        this.updateUI();
    }

    /**
     * Handle window resize event.
     * (PRD #9)
     * @private
     */
    handleResize() {
        this.layout();
    }

    /**
     * Toggle between running and paused states.
     * (PRD #34-35)
     */
    togglePlayPause() {
        if (this.simulation.isTerminal) {
            return; // Cannot play when terminal (PRD #43)
        }

        this.isRunning = !this.isRunning;
        this.simulation.status = this.isRunning ? 'Running' : 'Paused';
        this.updateUI();
    }

    /**
     * Advance the simulation by exactly one chronon.
     * (PRD #35)
     */
    stepOnce() {
        if (this.isRunning || this.simulation.isTerminal) {
            return; // Step only works when paused (PRD #34-35)
        }

        this.simulation.step();
        this.renderWorld();
        this.updateUI();
    }

    /**
     * Reset the simulation to a new random world.
     * (PRD #36)
     */
    resetSimulation() {
        this.simulation.reset();
        this.isRunning = true;
        this.accumulator = 0;
        this.renderWorld();
        this.updateUI();
    }

    /**
     * Set the simulation speed.
     * (PRD #34-35, #48)
     * @param {number} speed - New speed in chronons per second
     */
    setSpeed(speed) {
        this.speed = speed;
        // Speed change takes effect immediately for running sim (PRD #34)
        // or is remembered for when paused (PRD #35)
    }
}

export default SimulationScene;
