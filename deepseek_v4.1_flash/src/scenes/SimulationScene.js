/**
 * The simulation display.
 *
 * This scene owns the simulation instance and is the only place that draws.
 * It renders the world, the live statistics, and the population history chart,
 * hosts the playback controls, and paces chronons with a millisecond
 * accumulator. All drawing uses Phaser `Graphics` and `Text`; there are no
 * sprite objects and no DOM controls over the canvas
 * (`simulation-ui/world-rendering` §1.5, `app-shell/static-hosting` §4.3).
 */

import WatorSimulation from '../simulation/WatorSimulation.js';
import PhaserButton from '../ui/PhaserButton.js';
import { computeLayout } from '../ui/layout.js';
import {
    COLORS,
    STATUS,
    SPEED_OPTIONS,
    DEFAULT_SPEED,
    RENDER,
    LAYOUT,
    toCssColor
} from '../config.js';

export default class SimulationScene extends Phaser.Scene {
    /** Create the simulation scene under the scene key `Simulation`. */
    constructor() {
        super({ key: 'Simulation' });
    }

    /**
     * Build the simulation, its graphics, its text, and its controls.
     *
     * @returns {void}
     */
    create() {
        /** @type {WatorSimulation} The single owner of simulation state. */
        this.simulation = new WatorSimulation();

        /** @type {number} Currently selected speed in chronons per second. */
        this.speed = DEFAULT_SPEED;
        /** @type {boolean} Whether the simulation is running (`app-shell` §3.1). */
        this.running = true;
        /** @type {number} Banked milliseconds not yet spent as whole chronons. */
        this.accumulator = 0;

        this.worldGraphics = this.add.graphics();
        this.chartGraphics = this.add.graphics();
        this._createStatsText();
        this._createControls();

        this.layout = null;
        this._applyLayout(this.scale.width, this.scale.height);

        this.scale.on('resize', (size) => this._applyLayout(size.width, size.height));

        this._render();
    }

    /**
     * Advance the simulation according to the selected speed.
     *
     * A millisecond accumulator banks elapsed frame time and spends it in whole
     * chronons, so the selected speed is honoured on any refresh rate. Surplus
     * beyond one chronon's worth is discarded rather than banked, which is why
     * a hidden or throttled tab does not burst on return (design D7,
     * `simulation-ui/playback-controls` §1.4).
     *
     * @param {number} time - Current time supplied by Phaser, in milliseconds.
     * @param {number} delta - Milliseconds elapsed since the previous frame.
     * @returns {void}
     */
    update(time, delta) {
        if (!this.running || this.simulation.isTerminal) {
            return;
        }

        const msPerChronon = 1000 / this.speed;
        this.accumulator += delta;

        let stepped = false;
        while (this.accumulator >= msPerChronon) {
            this.simulation.step();
            this.accumulator -= msPerChronon;
            stepped = true;
            if (this.simulation.isTerminal) break;
        }

        // No catch-up: never let a long stall replay as a burst of chronons.
        if (this.accumulator > msPerChronon) {
            this.accumulator = 0;
        }

        if (stepped) {
            this._render();
            if (this.simulation.isTerminal) {
                this.running = false;
                this.accumulator = 0;
                this._syncControls();
            }
        }
    }

    // -----------------------------------------------------------------------
    // Controls (spec `simulation-ui/playback-controls`)
    // -----------------------------------------------------------------------

    /**
     * Create the speed row and the three action buttons.
     *
     * Built once; reflow only repositions them, so the narrow arrangement never
     * rebuilds controls (`simulation-ui/world-rendering` §5.4, design D8).
     *
     * @private
     * @returns {void}
     */
    _createControls() {
        const selectedStyle = { selected: COLORS.fish, selectedBorder: COLORS.fish };

        /** @type {PhaserButton[]} */
        this.speedButtons = SPEED_OPTIONS.map((speed, index) =>
            new PhaserButton(
                this,
                0, 0, 10, 10,
                `${speed}x`,
                () => this._selectSpeed(speed, index),
                selectedStyle
            )
        );

        this.playButton = new PhaserButton(this, 0, 0, 10, 10, 'Pause', () => this._toggleRun());
        this.stepButton = new PhaserButton(this, 0, 0, 10, 10, 'Step', () => this._stepOnce());
        this.resetButton = new PhaserButton(this, 0, 0, 10, 10, 'Reset', () => this._reset());

        this._syncControls();
    }

    /**
     * Select a speed by button index.
     *
     * Changing speed never resumes a paused run
     * (`simulation-ui/playback-controls` §1.5).
     *
     * @private
     * @param {number} speed - Speed in chronons per second.
     * @param {number} index - Index of the selected button.
     * @returns {void}
     */
    _selectSpeed(speed, index) {
        this.speed = speed;
        this.speedButtons.forEach((button, i) => button.setSelected(i === index));
        if (!this.running) {
            this.accumulator = 0;
        }
    }

    /** @private Toggle between running and paused. @returns {void} */
    _toggleRun() {
        if (this.simulation.isTerminal) return;
        this.running = !this.running;
        this.accumulator = 0;
        this._syncControls();
        this._render();
    }

    /**
     * Advance exactly one chronon while paused.
     *
     * @private
     * @returns {void}
     */
    _stepOnce() {
        if (this.running || this.simulation.isTerminal) return;
        this.simulation.step();
        this.accumulator = 0;
        this._syncControls();
        this._render();
    }

    /**
     * Start a fresh random run at the selected speed.
     *
     * Clears the chronon count, terminal status, and population history, and
     * resumes running (`simulation-ui/playback-controls` §4).
     *
     * @private
     * @returns {void}
     */
    _reset() {
        this.simulation.reset();
        this.running = true;
        this.accumulator = 0;
        this._syncControls();
        this._render();
    }

    /**
     * Reflect simulation state in control availability and labels.
     *
     * Step is disabled while running, Play is disabled once terminal, and the
     * play control reads as Pause or Play to match the run state
     * (`simulation-ui/playback-controls` §3).
     *
     * @private
     * @returns {void}
     */
    _syncControls() {
        const terminal = this.simulation.isTerminal;
        this.playButton.setEnabled(!terminal);
        this.playButton.setLabel(this.running ? 'Pause' : 'Play');
        this.stepButton.setEnabled(!this.running && !terminal);
        this.speedButtons.forEach((button, i) => button.setSelected(SPEED_OPTIONS[i] === this.speed));
        this.resetButton.setEnabled(true);
    }

    // -----------------------------------------------------------------------
    // Layout and reflow (spec `simulation-ui/world-rendering` §5)
    // -----------------------------------------------------------------------

    /**
     * Recompute layout for a window size and reposition everything.
     *
     * Only rectangles change here; simulation grid dimensions are never
     * touched by a resize (`simulation-ui/world-rendering` §5.5).
     *
     * @private
     * @param {number} width - Window width in CSS pixels.
     * @param {number} height - Window height in CSS pixels.
     * @returns {void}
     */
    _applyLayout(width, height) {
        this.layout = computeLayout(width, height);

        this.speedButtons.forEach((button, i) => {
            const r = this.layout.speedRects[i];
            button.setSize(r.width, r.height);
            button.setPosition(r.x, r.y);
        });
        const a = this.layout.actionRects;
        this.playButton.setSize(a.play.width, a.play.height);
        this.playButton.setPosition(a.play.x, a.play.y);
        this.stepButton.setSize(a.step.width, a.step.height);
        this.stepButton.setPosition(a.step.x, a.step.y);
        this.resetButton.setSize(a.reset.width, a.reset.height);
        this.resetButton.setPosition(a.reset.x, a.reset.y);

        this._positionStats();
        if (this.worldGraphics) this._render();
    }

    /**
     * Position the statistics readout for the current arrangement.
     *
     * Wide layouts stack the rows vertically inside the left panel; the narrow
     * arrangement places them in a horizontal strip above the world.
     *
     * @private
     * @returns {void}
     */
    _positionStats() {
        const s = this.layout.stats;
        const rows = ['chronon', 'fish', 'sharks', 'status'];
        if (this.layout.narrow) {
            const columnWidth = s.width / rows.length;
            rows.forEach((key, i) => {
                const x = s.x + columnWidth * i + 6;
                this.statValues[key].setPosition(x, s.y + 4);
                this.statValues[key].setFontSize(LAYOUT.statValueFontSize - 4);
                this.statLabels[key].setPosition(x, s.y + 30);
            });
        } else {
            const rowHeight = 34;
            rows.forEach((key, i) => {
                const y = s.y + i * rowHeight;
                this.statLabels[key].setPosition(s.x, y);
                this.statValues[key].setPosition(s.x, y + 14);
                this.statValues[key].setFontSize(LAYOUT.statValueFontSize);
            });
        }
    }

    /**
     * Create the statistic labels and value texts.
     *
     * @private
     * @returns {void}
     */
    _createStatsText() {
        const labelStyle = {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${LAYOUT.statLabelFontSize}px`,
            color: COLORS.statText
        };
        const valueStyle = {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${LAYOUT.statValueFontSize}px`,
            color: COLORS.statValue
        };

        /** @type {Record<string, Phaser.GameObjects.Text>} */
        this.statLabels = {
            chronon: this.add.text(0, 0, 'Chronon', labelStyle),
            fish: this.add.text(0, 0, 'Fish', labelStyle),
            sharks: this.add.text(0, 0, 'Sharks', labelStyle),
            status: this.add.text(0, 0, 'Status', labelStyle)
        };
        /** @type {Record<string, Phaser.GameObjects.Text>} */
        this.statValues = {
            chronon: this.add.text(0, 0, '0', valueStyle),
            fish: this.add.text(0, 0, '0', valueStyle),
            sharks: this.add.text(0, 0, '0', valueStyle),
            status: this.add.text(0, 0, STATUS.RUNNING, valueStyle)
        };
    }

    // -----------------------------------------------------------------------
    // Rendering (spec `simulation-ui/world-rendering` §1-§4)
    // -----------------------------------------------------------------------

    /**
     * Draw the current state of the world, the statistics, and the chart.
     *
     * Redrawing from scratch each update is what makes state changes immediate,
     * with no movement interpolation between an entity's old and new cell
     * (`simulation-ui/world-rendering` §2.1, §2.2).
     *
     * @private
     * @returns {void}
     */
    _render() {
        if (!this.layout) return;
        this._drawWorld();
        this._drawChart();
        this._updateStats();
    }

    /**
     * Draw the water, the fish, and the sharks.
     *
     * Every shape is drawn with `Graphics`; no sprites are created
     * (`simulation-ui/world-rendering` §1.5).
     *
     * @private
     * @returns {void}
     */
    _drawWorld() {
        const g = this.worldGraphics;
        const { gridRect, cellSize, world } = this.layout;
        g.clear();

        // Empty water fills only the grid's own bounds; the surrounding region
        // keeps the app background color.
        g.fillStyle(COLORS.water, 1);
        g.fillRect(gridRect.x, gridRect.y, gridRect.width, gridRect.height);
        g.lineStyle(1, COLORS.shark, 0.35);
        g.strokeRect(gridRect.x, gridRect.y, gridRect.width, gridRect.height);

        const fishRadius = Math.max(RENDER.minRadius, cellSize * RENDER.fishRadiusRatio);
        const sharkRadius = Math.max(RENDER.minRadius, cellSize * RENDER.sharkRadiusRatio);
        const half = cellSize / 2;

        for (const entity of this.simulation.entities.values()) {
            const x = entity.position % this.simulation.width;
            const y = (entity.position - x) / this.simulation.width;
            const cx = gridRect.x + x * cellSize + half;
            const cy = gridRect.y + y * cellSize + half;
            if (entity.kind === 'shark') {
                g.fillStyle(COLORS.shark, 1);
                g.fillCircle(cx, cy, sharkRadius);
            } else {
                g.fillStyle(COLORS.fish, 1);
                g.fillCircle(cx, cy, fishRadius);
            }
        }
    }

    /**
     * Draw the rolling population history chart.
     *
     * The chart has no titles and no text labels
     * (`simulation-ui/world-rendering` §4.4). Its vertical scale is fixed to
     * the population recorded when the world was seeded, so the axis does not
     * shift as the run progresses (§4.6). The two lines differ in thickness as
     * well as color so they remain distinguishable without relying on color
     * alone (§4.3).
     *
     * @private
     * @returns {void}
     */
    _drawChart() {
        const g = this.chartGraphics;
        const area = this.layout.chart;
        g.clear();

        g.fillStyle(COLORS.water, 1);
        g.fillRect(area.x, area.y, area.width, area.height);

        const samples = this.simulation.history;
        if (samples.length < 2) return;

        // Fixed vertical scale, anchored to the seeded population and given a
        // little headroom so the initial values are not flush with the top.
        const peak = Math.max(
            1,
            this.simulation.initialFishCount,
            this.simulation.initialSharkCount
        );
        const top = area.y + area.height * RENDER.chartHeadroom;
        const bottom = area.y + area.height - 4;
        const plotHeight = bottom - top;
        const stepX = area.width / Math.max(1, samples.length - 1);

        const yFor = (value) => bottom - Math.min(1, value / peak) * plotHeight;

        g.lineStyle(RENDER.fishLineWidth, COLORS.fish, 1);
        g.beginPath();
        samples.forEach((sample, i) => {
            const x = area.x + i * stepX;
            const y = yFor(sample.fish);
            if (i === 0) g.moveTo(x, y);
            else g.lineTo(x, y);
        });
        g.strokePath();

        g.lineStyle(RENDER.sharkLineWidth, COLORS.shark, 1);
        g.beginPath();
        samples.forEach((sample, i) => {
            const x = area.x + i * stepX;
            const y = yFor(sample.sharks);
            if (i === 0) g.moveTo(x, y);
            else g.lineTo(x, y);
        });
        g.strokePath();
    }

    /**
     * Refresh the statistics readout from the current simulation state.
     *
     * @private
     * @returns {void}
     */
    _updateStats() {
        const p = this.simulation.population();
        this.statValues.chronon.setText(String(p.chronon));
        this.statValues.fish.setText(String(p.fish));
        this.statValues.sharks.setText(String(p.sharks));

        let status = STATUS.PAUSED;
        if (this.simulation.isTerminal) {
            status = this.simulation.terminalStatus;
        } else if (this.running) {
            status = STATUS.RUNNING;
        }
        this.statValues.status.setText(status);
        // Keep the terminal message legible on a narrow strip.
        this.statValues.status.setColor(
            this.simulation.isTerminal ? toCssColor(COLORS.shark) : COLORS.statValue
        );
    }
}
