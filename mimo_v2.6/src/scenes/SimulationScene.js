/**
 * The main Phaser scene: owns the window layout, rendering, controls, and the
 * per-frame chronon pump for the Wa-Tor simulation (spec Req 2.3, 21, 28).
 *
 * Layout is stats left, world center, controls right, and the history chart
 * across the bottom on wide windows, reflowing to a compact top-bar layout on
 * narrow ones (spec Req 29.1, 29.2). All input is Phaser-native through
 * {@link PhaserButton}; there are no DOM controls or keyboard shortcuts
 * (spec Req 2.3).
 */

import WatorSimulation from '../simulation/WatorSimulation.js';
import Shark from '../simulation/Shark.js';
import StatsPanel from '../ui/StatsPanel.js';
import HistoryChart from '../ui/HistoryChart.js';
import PhaserButton from '../ui/PhaserButton.js';
import {
    COLORS,
    GRID_COLS,
    GRID_ROWS,
    FISH_RADIUS_FACTOR,
    SHARK_RADIUS_FACTOR,
    SPEED_OPTIONS,
    DEFAULT_SPEED,
    FRAME_DELTA_CLAMP_MS,
    LAYOUT_BREAKPOINT
} from '../config.js';

/** Outer margin (px) around panels. */
const MARGIN = 12;

/** Inner padding (px) inside the controls panel. */
const PAD = 10;

/** Gap (px) between stacked buttons. */
const GAP = 8;

/** Button height (px); kept at touch-target size in both layouts. */
const BUTTON_H = 44;

/** Width (px) of the stats and controls columns in wide mode. */
const SIDE_W = 210;

export default class SimulationScene extends Phaser.Scene {
    /** Create the simulation scene under the key `SimulationScene`. */
    constructor() {
        super('SimulationScene');
    }

    /**
     * Build the engine, panels, and controls, lay them out, and keep the
     * layout fresh across window resizes (spec Req 5.1).
     */
    create() {
        this.sim = new WatorSimulation();
        this.speed = DEFAULT_SPEED;
        this.accumulator = 0;
        this.worldGfx = this.add.graphics();
        this.stats = new StatsPanel(this);
        this.chart = new HistoryChart(this);
        this._createControls();
        this.layout();
        this.scale.on('resize', () => this.layout());
        this._redraw();
    }

    /**
     * Phaser frame update: advance chronons by the selected speed and redraw
     * the display exactly once per frame (spec Req 21.1, 28.1).
     *
     * @param {number} time - Current game time (ms).
     * @param {number} delta - Milliseconds since the previous frame.
     */
    update(time, delta) {
        this._pumpChronons(delta);
        this._redraw();
    }

    /**
     * Recompute every panel rectangle and the world scale for the current
     * window size without touching simulation state (spec Req 5.1). Wide
     * windows use the three-column layout (spec Req 29.1); narrow windows
     * reflow to stats and controls sharing a top bar (spec Req 29.2). The
     * world is scaled by whole-cell sizing and centered so any grid
     * dimensions degrade gracefully (spec Req 4.1).
     */
    layout() {
        const w = this.scale.width;
        const h = this.scale.height;
        const chartH = Math.max(72, Math.min(140, Math.round(h * 0.16)));
        const barH = 2 * PAD + 4 * BUTTON_H + 3 * GAP;
        let statsRect;
        let controlsRect;
        let worldArea;
        if (w >= LAYOUT_BREAKPOINT) {
            const contentH = h - chartH - 3 * MARGIN;
            statsRect = { x: MARGIN, y: MARGIN, w: SIDE_W, h: contentH };
            controlsRect = { x: w - MARGIN - SIDE_W, y: MARGIN, w: SIDE_W, h: contentH };
            const left = 2 * MARGIN + SIDE_W;
            worldArea = { x: left, y: MARGIN, w: w - 2 * left, h: contentH };
        } else {
            const half = (w - 3 * MARGIN) / 2;
            statsRect = { x: MARGIN, y: MARGIN, w: half, h: barH };
            controlsRect = { x: 2 * MARGIN + half, y: MARGIN, w: half, h: barH };
            worldArea = {
                x: MARGIN,
                y: 2 * MARGIN + barH,
                w: w - 2 * MARGIN,
                h: h - chartH - barH - 3 * MARGIN
            };
        }
        const cell = Math.min(worldArea.w / GRID_COLS, worldArea.h / GRID_ROWS);
        const worldW = GRID_COLS * cell;
        const worldH = GRID_ROWS * cell;
        this.cellSize = cell;
        this.worldRect = {
            x: worldArea.x + (worldArea.w - worldW) / 2,
            y: worldArea.y + (worldArea.h - worldH) / 2,
            w: worldW,
            h: worldH
        };
        this.stats.setBounds(statsRect.x, statsRect.y, statsRect.w, statsRect.h);
        this.chart.setBounds(0, h - chartH, w, chartH);
        this._layoutControls(controlsRect);
    }

    /**
     * Create the Play/Pause, Step, and Reset action buttons (one per row)
     * and the five segmented speed buttons in one horizontal row, all via
     * {@link PhaserButton} (spec Req 23.1). Positions are finalized in
     * {@link SimulationScene#_layoutControls}.
     *
     * @private
     */
    _createControls() {
        this.playBtn = new PhaserButton(this, 0, 0, BUTTON_H, BUTTON_H, 'Pause', () => this._togglePlay());
        this.stepBtn = new PhaserButton(this, 0, 0, BUTTON_H, BUTTON_H, 'Step', () => this._stepOnce());
        this.resetBtn = new PhaserButton(this, 0, 0, BUTTON_H, BUTTON_H, 'Reset', () => this._reset());
        this.speedBtns = SPEED_OPTIONS.map((value) =>
            new PhaserButton(this, 0, 0, BUTTON_H, BUTTON_H, `${value}x`, () => this._setSpeed(value))
        );
    }

    /**
     * Place and size the control buttons inside the controls rectangle:
     * Play/Pause, Step, and Reset stacked one per row, then the speed row
     * (spec Req 23.1). Buttons are resized and moved rather than recreated.
     *
     * @private
     * @param {{x: number, y: number, w: number, h: number}} rect - Controls area.
     */
    _layoutControls(rect) {
        const x = rect.x + PAD;
        const w = rect.w - 2 * PAD;
        const rows = [this.playBtn, this.stepBtn, this.resetBtn];
        rows.forEach((btn, i) => {
            const y = rect.y + PAD + i * (BUTTON_H + GAP);
            btn.setSize(w, BUTTON_H);
            btn.setPosition(x, y);
        });
        const speedW = (w - (SPEED_OPTIONS.length - 1) * GAP) / SPEED_OPTIONS.length;
        const speedY = rect.y + PAD + rows.length * (BUTTON_H + GAP);
        this.speedBtns.forEach((btn, i) => {
            btn.setSize(speedW, BUTTON_H);
            btn.setPosition(x + i * (speedW + GAP), speedY);
        });
    }

    /**
     * Toggle between running and paused (spec Req 24.1, 24.2). The terminal
     * state ignores this because Play is disabled there (spec Req 26.5).
     *
     * @private
     */
    _togglePlay() {
        if (this.sim.status.terminal) {
            return;
        }
        this.sim.running = !this.sim.running;
        this.accumulator = 0;
    }

    /**
     * Advance exactly one chronon while paused and remain paused (spec
     * Req 24.2). Ignored while running (Step is disabled) and in terminal
     * state, where Reset is required to start another run (spec Req 26.5).
     *
     * @private
     */
    _stepOnce() {
        if (this.sim.running || this.sim.status.terminal) {
            return;
        }
        this.sim.step();
    }

    /**
     * Start a fresh run: new random world, chronon `0`, cleared history and
     * extinction status, resuming at the selected speed (spec Req 25.1).
     *
     * @private
     */
    _reset() {
        this.sim.reset();
        this.accumulator = 0;
    }

    /**
     * Record the selected speed for subsequent updates (spec Req 24.1).
     * Selecting a speed never changes the run state (spec Req 24.3).
     *
     * @private
     * @param {number} value - Chronons per second.
     */
    _setSpeed(value) {
        this.speed = value;
        this.accumulator = 0;
    }

    /**
     * Advance the simulation by the frame's earned chronons: `delta/1000 *
     * speed` accumulates fractionally and whole chronons are batched before
     * the single redraw (spec Req 28.1, design D8). The frame delta is
     * clamped so a throttled tab causes no catch-up burst (spec Req 28.2).
     *
     * @private
     * @param {number} delta - Milliseconds since the previous frame.
     */
    _pumpChronons(delta) {
        if (!this.sim.running) {
            return;
        }
        const clamped = Math.min(delta, FRAME_DELTA_CLAMP_MS);
        this.accumulator += (clamped / 1000) * this.speed;
        let steps = Math.floor(this.accumulator);
        this.accumulator -= steps;
        while (steps > 0 && this.sim.running) {
            this.sim.step();
            steps -= 1;
        }
    }

    /**
     * Redraw the world, stats, chart, and button states in one pass for
     * this frame (spec Req 21.1).
     *
     * @private
     */
    _redraw() {
        this._drawWorld();
        const counts = this.sim.counts;
        this.stats.update(this.sim.chronon, counts.fish, counts.sharks, this.sim.status.text);
        this.chart.draw(this.sim.history);
        this._refreshControls();
    }

    /**
     * Draw the world as water background plus abstract circles: green fish
     * and slightly larger blue sharks, with no grid lines and no sprites
     * (spec Req 20.1).
     *
     * @private
     */
    _drawWorld() {
        const g = this.worldGfx;
        const r = this.worldRect;
        g.clear();
        g.fillStyle(COLORS.water, 1);
        g.fillRect(r.x, r.y, r.w, r.h);
        const cell = this.cellSize;
        const fishR = cell * FISH_RADIUS_FACTOR;
        const sharkR = cell * SHARK_RADIUS_FACTOR;
        this.sim.forEachEntity((entity) => {
            const col = entity.pos % this.sim.cols;
            const row = (entity.pos - col) / this.sim.cols;
            const x = r.x + (col + 0.5) * cell;
            const y = r.y + (row + 0.5) * cell;
            if (entity instanceof Shark) {
                g.fillStyle(COLORS.shark, 1);
                g.fillCircle(x, y, sharkR);
            } else {
                g.fillStyle(COLORS.fish, 1);
                g.fillCircle(x, y, fishR);
            }
        });
    }

    /**
     * Sync button states with the run state: Play/Pause label swap, Step
     * disabled while running (spec Req 24.1) and in terminal state (spec
     * Req 26.5), Play disabled while terminal (spec Req 26.5), and the
     * active speed shown selected (spec Req 23.1).
     *
     * @private
     */
    _refreshControls() {
        const status = this.sim.status;
        this.playBtn.setLabel(status.running ? 'Pause' : 'Play');
        this.playBtn.setEnabled(!status.terminal);
        this.stepBtn.setEnabled(!status.running && !status.terminal);
        this.speedBtns.forEach((btn, i) => {
            btn.setSelected(SPEED_OPTIONS[i] === this.speed);
        });
    }
}
