import {
    COLORS,
    DEFAULT_SPEED,
    LAYOUT,
    MAX_DELTA_MS,
    MAX_STEPS_PER_FRAME
} from '../config.js';
import WatorSimulation from '../simulation/WatorSimulation.js';
import ControlPanel from '../ui/ControlPanel.js';
import HistoryChart from '../ui/HistoryChart.js';
import StatsPanel from '../ui/StatsPanel.js';
import WorldView from '../ui/WorldView.js';

/**
 * Full-window Wa-Tor viewer: layout, playback clock, and Phaser UI wiring.
 * wator-app requirements 1, 5, 6, 7, 8, 9, 10, and 12.
 */
export default class SimulationScene extends Phaser.Scene {
    constructor() {
        super('SimulationScene');
        this.simulation = null;
        this.running = true;
        this.speed = DEFAULT_SPEED;
        this.accumulator = 0;
        this.worldView = null;
        this.statsPanel = null;
        this.controlPanel = null;
        this.historyChart = null;
        this.background = null;
    }

    /**
     * Build the engine and UI, then start a running world at 10x.
     */
    create() {
        this.cameras.main.setBackgroundColor(COLORS.background);
        this.background = this.add.graphics();
        this.simulation = new WatorSimulation();
        this.running = true;
        this.speed = DEFAULT_SPEED;
        this.accumulator = 0;

        this.worldView = new WorldView(this);
        this.statsPanel = new StatsPanel(this);
        this.historyChart = new HistoryChart(this);
        this.controlPanel = new ControlPanel(this, {
            onSpeed: (speed) => this.setSpeed(speed),
            onPlayPause: () => this.toggleRunning(),
            onStep: () => this.stepOnce(),
            onReset: () => this.resetWorld()
        });

        this.scale.on('resize', () => this.layout());
        this.layout();
        this.refresh();
    }

    /**
     * Advance the simulation without catch-up. wator-app requirement 12.
     *
     * @param {number} _time - Phaser clock.
     * @param {number} delta - Frame delta in milliseconds.
     */
    update(_time, delta) {
        if (!this.running || this.simulation.isTerminal()) {
            return;
        }

        this.accumulator += Math.min(delta, MAX_DELTA_MS);
        const interval = 1000 / this.speed;
        let steps = 0;
        while (this.accumulator >= interval && steps < MAX_STEPS_PER_FRAME) {
            this.simulation.step();
            this.accumulator -= interval;
            steps += 1;
            if (this.simulation.isTerminal()) {
                this.running = false;
                this.accumulator = 0;
                break;
            }
        }
        if (steps > 0) {
            this.refresh();
        }
    }

    /**
     * Wide four-region or stacked narrow layout.
     * wator-app requirements 5, 6, and 7.
     */
    layout() {
        const width = this.scale.width;
        const height = this.scale.height;
        const pad = LAYOUT.padding;
        this.background.clear();
        this.background.fillStyle(COLORS.background, 1);
        this.background.fillRect(0, 0, width, height);

        const snapshot = this.simulation.snapshot();
        const useWide = width >= LAYOUT.wideBreakpoint;
        const chartHeight = LAYOUT.chartHeight;
        const chartBounds = {
            x: pad,
            y: height - pad - chartHeight,
            width: width - pad * 2,
            height: chartHeight
        };

        if (useWide) {
            const contentTop = pad;
            const contentHeight = chartBounds.y - pad - contentTop;
            const statsBounds = {
                x: pad,
                y: contentTop,
                width: LAYOUT.statsWidth,
                height: contentHeight
            };
            const controlsBounds = {
                x: width - pad - LAYOUT.controlsWidth,
                y: contentTop,
                width: LAYOUT.controlsWidth,
                height: contentHeight
            };
            const worldBounds = {
                x: statsBounds.x + statsBounds.width + pad,
                y: contentTop,
                width: controlsBounds.x - pad - (statsBounds.x + statsBounds.width + pad),
                height: contentHeight
            };
            this.statsPanel.resize(statsBounds, false);
            this.controlPanel.resize(controlsBounds);
            this.worldView.resize(worldBounds, snapshot.width, snapshot.height);
        } else {
            const statsHeight = 56;
            const controlsHeight = LAYOUT.minHit * 4 + 40;
            const statsBounds = {
                x: pad,
                y: pad,
                width: width - pad * 2,
                height: statsHeight
            };
            const controlsBounds = {
                x: pad,
                y: chartBounds.y - pad - controlsHeight,
                width: width - pad * 2,
                height: controlsHeight
            };
            const worldBounds = {
                x: pad,
                y: statsBounds.y + statsBounds.height + pad,
                width: width - pad * 2,
                height: controlsBounds.y - pad - (statsBounds.y + statsBounds.height + pad)
            };
            this.statsPanel.resize(statsBounds, true);
            this.controlPanel.resize(controlsBounds);
            this.worldView.resize(worldBounds, snapshot.width, snapshot.height);
        }

        this.historyChart.resize(chartBounds);
        this.refresh();
    }

    /**
     * Redraw world, stats, chart, and control states.
     */
    refresh() {
        const snapshot = this.simulation.snapshot();
        if (snapshot.terminal && this.running) {
            this.running = false;
        }
        this.worldView.draw(snapshot);
        this.statsPanel.draw(snapshot, this.running);
        this.historyChart.draw(snapshot.history);
        this.controlPanel.sync(this.speed, this.running, snapshot.terminal);
    }

    /**
     * Change chronons per second without resuming.
     * wator-app requirement 8.
     *
     * @param {number} speed - Selected speed.
     */
    setSpeed(speed) {
        this.speed = speed;
        this.controlPanel.sync(this.speed, this.running, this.simulation.isTerminal());
    }

    /**
     * Toggle play/pause when the run is not terminal.
     * wator-app requirement 9.
     */
    toggleRunning() {
        if (this.simulation.isTerminal()) {
            return;
        }
        this.running = !this.running;
        if (!this.running) {
            this.accumulator = 0;
        }
        this.refresh();
    }

    /**
     * Advance exactly one chronon while paused.
     * wator-app requirement 9.
     */
    stepOnce() {
        if (this.running || this.simulation.isTerminal()) {
            return;
        }
        this.simulation.step();
        if (this.simulation.isTerminal()) {
            this.running = false;
        }
        this.refresh();
    }

    /**
     * Rebuild a random world and resume at the selected speed.
     * wator-app requirement 9.
     */
    resetWorld() {
        this.simulation.reset();
        this.running = true;
        this.accumulator = 0;
        this.refresh();
    }
}
