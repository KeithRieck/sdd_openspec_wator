import WatorSimulation from '../simulation/WatorSimulation.js';
import StatsPanel from '../ui/StatsPanel.js';
import ControlPanel from '../ui/ControlPanel.js';
import PopulationChart from '../ui/PopulationChart.js';
import {
    COLORS,
    FISH_RADIUS,
    SHARK_RADIUS,
    DEFAULT_SPEED,
    MAX_STEPS_PER_FRAME,
    NARROW_BREAKPOINT,
    LAYOUT
} from '../config.js';

/**
 * The main simulation scene.
 *
 * Owns the {@link WatorSimulation}, a single world Graphics object, and the
 * stats/controls/chart UI. It launches the simulation running at the default
 * speed (simulation-app R1), schedules chronons with a time accumulator
 * (simulation-app R5), renders the world with Graphics (simulation-app R4),
 * and reflows its layout on resize (simulation-app R6).
 */
export default class SimulationScene extends Phaser.Scene {
    /**
     * Create the simulation scene.
     */
    constructor() {
        super('SimulationScene');
    }

    /**
     * Build the simulation, world graphics, and UI, then start running.
     */
    create() {
        this.sim = new WatorSimulation();
        this.running = true;
        this.speed = DEFAULT_SPEED;
        this.speedAcc = 0;

        this.worldGfx = this.add.graphics();

        this.stats = new StatsPanel(this, 0, 0, LAYOUT.statsWidth);
        this.controls = new ControlPanel(this, 0, 0, LAYOUT.controlsWidth, {
            onPlayPause: () => this._onPlayPause(),
            onStep: () => this._onStep(),
            onReset: () => this._onReset(),
            onSpeed: (speed) => this._onSpeed(speed)
        });
        this.chart = new PopulationChart(this, 0, 0, 100, LAYOUT.chartHeight);

        this.controls.setRunning(this.running);
        this.controls.setSpeed(this.speed);

        this.scale.on('resize', () => this.layout());
        this.layout();
        this._refreshUI();
    }

    /**
     * Advance the simulation according to the selected speed.
     *
     * A time accumulator steps the simulation while enough time has elapsed
     * for a chronon, capped at MAX_STEPS_PER_FRAME per frame so a throttled
     * tab does not trigger an unbounded burst (simulation-app R5, design D7).
     *
     * @param {number} time - Current frame time in ms.
     * @param {number} delta - Time since the last frame in ms.
     */
    update(time, delta) {
        if (this.running && !this.sim.terminal) {
            this.speedAcc += delta;
            const frameTime = 1000 / this.speed;
            let steps = 0;
            while (this.speedAcc >= frameTime && steps < MAX_STEPS_PER_FRAME) {
                this.sim.step();
                this.speedAcc -= frameTime;
                steps++;
                if (this.sim.terminal) {
                    break;
                }
            }
            // Drop any leftover time so we never bank catch-up work
            // (simulation-app R5.2).
            if (this.speedAcc >= frameTime) {
                this.speedAcc = 0;
            }
        } else {
            this.speedAcc = 0;
        }

        this._renderWorld();
        this._refreshUI();
    }

    /**
     * Compute layout regions from the canvas size and position all UI.
     *
     * Wide windows place stats left, world center, controls right, and the
     * chart across the bottom. Narrow windows (below NARROW_BREAKPOINT) stack
     * the world on top with stats and controls below, chart at the bottom.
     * The world preserves its aspect ratio via cellSize = min(regionW/gridW,
     * regionH/gridH) and is centered (simulation-app R6, design D8).
     */
    layout() {
        const W = this.scale.width;
        const H = this.scale.height;
        const pad = LAYOUT.padding;
        const chartH = LAYOUT.chartHeight;
        const narrow = W < NARROW_BREAKPOINT;

        let worldRegion;
        if (!narrow) {
            // Wide: stats | world | controls, chart across the bottom.
            const topH = H - chartH - pad * 3;
            const worldW = W - LAYOUT.statsWidth - LAYOUT.controlsWidth - pad * 4;
            const worldX = LAYOUT.statsWidth + pad * 2;
            worldRegion = { x: worldX, y: pad, w: worldW, h: topH };

            this.stats.setPosition(pad, pad);
            this.controls.setPosition(W - LAYOUT.controlsWidth - pad, pad);
            this.chart.setPosition(pad, H - chartH - pad, W - pad * 2, chartH);
        } else {
            // Narrow: world on top, stats + controls side by side below,
            // chart at the bottom. Reserve room for the full control panel
            // (which is taller than the stats panel) plus the chart.
            const bottomH = chartH + this.controls.height + pad * 3;
            const worldH = H - bottomH;
            worldRegion = { x: pad, y: pad, w: W - pad * 2, h: worldH };

            const statsY = worldRegion.y + worldRegion.h + pad;
            const halfW = (W - pad * 3) / 2;
            this.stats.setPosition(pad, statsY);
            this.controls.setPosition(pad * 2 + halfW, statsY);
            this.chart.setPosition(pad, H - chartH - pad, W - pad * 2, chartH);
        }

        // World cell size preserving aspect ratio, centered in its region.
        const cellSize = Math.max(1, Math.min(worldRegion.w / this.sim.width, worldRegion.h / this.sim.height));
        this.cellSize = cellSize;
        this.worldW = cellSize * this.sim.width;
        this.worldH = cellSize * this.sim.height;
        this.worldX = worldRegion.x + (worldRegion.w - this.worldW) / 2;
        this.worldY = worldRegion.y + (worldRegion.h - this.worldH) / 2;
    }

    /**
     * Render the water background and all living entities as circles.
     *
     * Fish are green circles, sharks are slightly larger blue circles; there
     * are no grid lines and no movement animation (simulation-app R4).
     *
     * @private
     */
    _renderWorld() {
        const g = this.worldGfx;
        g.clear();

        // Water background.
        g.fillStyle(COLORS.water, 1);
        g.fillRect(this.worldX, this.worldY, this.worldW, this.worldH);

        const fishR = this.cellSize * FISH_RADIUS;
        const sharkR = this.cellSize * SHARK_RADIUS;

        for (const e of this.sim.livingEntities) {
            const cx = this.worldX + (e.x + 0.5) * this.cellSize;
            const cy = this.worldY + (e.y + 0.5) * this.cellSize;
            if (e.type === 'fish') {
                g.fillStyle(COLORS.fish, 1);
                g.fillCircle(cx, cy, fishR);
            } else {
                g.fillStyle(COLORS.shark, 1);
                g.fillCircle(cx, cy, sharkR);
            }
        }
    }

    /**
     * Refresh the stats, chart, and control states from the simulation.
     *
     * @private
     */
    _refreshUI() {
        this.stats.update(this.sim.chronon, this.sim.fishCount, this.sim.sharkCount, this._statusText());
        this.chart.draw(this.sim.history);
        this.controls.setRunning(this.running && !this.sim.terminal);
        this.controls.setTerminal(this.sim.terminal);
    }

    /**
     * The status text to display (ui-controls R6).
     *
     * @private
     * @returns {string}
     */
    _statusText() {
        if (this.sim.terminal) {
            return this.sim.status;
        }
        return this.running ? 'Running' : 'Paused';
    }

    /**
     * Toggle running/paused. No-op when terminal (ui-controls R2.2, R7.2).
     *
     * @private
     */
    _onPlayPause() {
        if (this.sim.terminal) {
            return;
        }
        this.running = !this.running;
        this.speedAcc = 0;
    }

    /**
     * Advance exactly one chronon while paused (ui-controls R4.1).
     *
     * @private
     */
    _onStep() {
        if (this.running || this.sim.terminal) {
            return;
        }
        this.sim.step();
    }

    /**
     * Reset to a new world and resume running at the selected speed
     * (ui-controls R5.1).
     *
     * @private
     */
    _onReset() {
        this.sim.reset();
        this.running = true;
        this.speedAcc = 0;
    }

    /**
     * Change the selected speed without resuming a paused simulation
     * (ui-controls R3.2, R3.3).
     *
     * @private
     * @param {number} speed - New speed in chronons per second.
     */
    _onSpeed(speed) {
        this.speed = speed;
        this.speedAcc = 0;
        this.controls.setSpeed(speed);
    }
}
