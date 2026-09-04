import PhaserButton from '../ui/PhaserButton.js';
import WatorSimulation from '../simulation/WatorSimulation.js';
import {
    GRID_WIDTH,
    GRID_HEIGHT,
    FISH_COLOR,
    SHARK_COLOR,
    WATER_COLOR,
    FISH_RADIUS,
    SHARK_RADIUS,
    SPEED_OPTIONS,
    DEFAULT_SPEED
} from '../config.js';

/**
 * The main application scene. Owns:
 *   - the simulation engine instance
 *   - the responsive layout (stats, world, controls, chart rectangles)
 *   - all Phaser-native UI (text, Graphics, PhaserButtons)
 *   - the accumulator-based timing loop in update()
 *
 * The scene does not implement any Wa-Tor rules; those live in the engine.
 */
export default class SimulationScene extends Phaser.Scene {
    /**
     * Construct the scene with a stable key.
     */
    constructor() {
        super('SimulationScene');
    }

    /**
     * Phaser lifecycle: build the simulation and all UI. Runs once.
     */
    create() {
        this.simulation = new WatorSimulation();
        this.selectedSpeed = DEFAULT_SPEED;
        this.simulation.setSpeed(this.selectedSpeed);
        /** Accumulator for chronon timing. */
        this._accumulatorMs = 0;

        // Graphics layers, recreated on each layout pass.
        this._worldGraphics = null;
        this._chartGraphics = null;

        // Stats text and button references — populated by _buildUi().
        this._statsTexts = {};
        this._buttons = {};

        this._buildUi();
        this._layout();

        // Redraw whenever the window resizes.
        this.scale.on('resize', () => this._layout());

        // Initial paint.
        this._render();
    }

    /**
     * Construct all UI elements that are not affected by resize (buttons and
     * text objects). Their positions are updated in _layout().
     *
     * @private
     */
    _buildUi() {
        // Stats panel: Chronon, Fish, Sharks, Status.
        const statsStyle = { fontFamily: 'Arial, sans-serif', fontSize: '18px', color: '#e0e0e0' };
        this._statsTexts.chrononLabel = this.add.text(0, 0, 'Chronon', statsStyle);
        this._statsTexts.chrononValue = this.add.text(0, 0, '0', { ...statsStyle, fontSize: '24px', color: '#ffffff' });
        this._statsTexts.fishLabel = this.add.text(0, 0, 'Fish', statsStyle);
        this._statsTexts.fishValue = this.add.text(0, 0, '0', { ...statsStyle, fontSize: '24px', color: '#4caf50' });
        this._statsTexts.sharkLabel = this.add.text(0, 0, 'Sharks', statsStyle);
        this._statsTexts.sharkValue = this.add.text(0, 0, '0', { ...statsStyle, fontSize: '24px', color: '#2196f3' });
        this._statsTexts.statusLabel = this.add.text(0, 0, 'Status', statsStyle);
        this._statsTexts.statusValue = this.add.text(0, 0, 'Running', { ...statsStyle, fontSize: '24px', color: '#ffffff' });

        // Speed row: 1x, 5x, 10x, 30x, 60x.
        const speedLabels = SPEED_OPTIONS.map(s => `${s}x`);
        this._buttons.speeds = speedLabels.map((label, i) => {
            const speed = SPEED_OPTIONS[i];
            const btn = new PhaserButton(this, 0, 0, 80, 40, label, () => {
                this.selectedSpeed = speed;
                this.simulation.setSpeed(speed);
                // Per spec: speed change does not resume a paused simulation.
                this._syncSpeedButtons();
            });
            return btn;
        });

        // Action buttons: Play/Pause, Step, Reset — each on its own row.
        this._buttons.playPause = new PhaserButton(this, 0, 0, 160, 44, 'Pause', () => {
            if (this.simulation._terminal) return;
            this.simulation.setRunning(!this.simulation.running);
            this._syncButtons();
        });
        this._buttons.step = new PhaserButton(this, 0, 0, 160, 44, 'Step', () => {
            if (!this.simulation.running && !this.simulation._terminal) {
                this.simulation.step();
                this._render();
            }
        });
        this._buttons.reset = new PhaserButton(this, 0, 0, 160, 44, 'Reset', () => {
            this.simulation.reset();
            this.simulation.setSpeed(this.selectedSpeed);
            this._accumulatorMs = 0;
            this._syncButtons();
            this._render();
        });
    }

    /**
     * Compute the four rectangles (stats, world, controls, chart) from the
     * current scene size and reposition all UI elements. Preserves the
     * world's aspect ratio by letterboxing within the available space.
     *
     * @private
     */
    _layout() {
        const W = this.scale.width;
        const H = this.scale.height;

        // Decide layout based on aspect ratio: wide = 3-column, narrow = stacked.
        const isWide = W >= 900;

        // Chart height: ~18% of height, clamped to a sensible range.
        const chartHeight = Math.max(80, Math.min(160, Math.round(H * 0.18)));
        const chartRect = { x: 0, y: H - chartHeight, w: W, h: chartHeight };

        if (isWide) {
            const sideW = Math.max(180, Math.round(W * 0.18));
            const topH = H - chartHeight;
            const statsRect = { x: 0, y: 0, w: sideW, h: topH };
            const controlsRect = { x: W - sideW, y: 0, w: sideW, h: topH };
            const worldRect = fitAspect(
                { x: sideW, y: 0, w: W - 2 * sideW, h: topH },
                GRID_WIDTH / GRID_HEIGHT
            );
            this._applyLayout(statsRect, worldRect, controlsRect, chartRect);
        } else {
            // Narrow / tablet layout: stats and controls share the row below the world.
            const worldRect = fitAspect(
                { x: 0, y: 0, w: W, h: Math.round((H - chartHeight) * 0.6) },
                GRID_WIDTH / GRID_HEIGHT
            );
            const bottomY = worldRect.y + worldRect.h;
            const bottomH = (H - chartHeight) - bottomY;
            const halfW = Math.floor(W / 2);
            const statsRect = { x: 0, y: bottomY, w: halfW, h: bottomH };
            const controlsRect = { x: halfW, y: bottomY, w: W - halfW, h: bottomH };
            this._applyLayout(statsRect, worldRect, controlsRect, chartRect);
        }

        this._layoutStats();
        this._layoutControls();
        this._render();
    }

    /**
     * Apply world and chart rectangles; recompute scaling factors used by
     * the world and chart renderers.
     *
     * @private
     */
    _applyLayout(statsRect, worldRect, controlsRect, chartRect) {
        this._statsRect = statsRect;
        this._worldRect = worldRect;
        this._controlsRect = controlsRect;
        this._chartRect = chartRect;
        this._cellSize = worldRect.w / GRID_WIDTH;
    }

    /**
     * Position the stats panel text inside the stats rectangle.
     *
     * @private
     */
    _layoutStats() {
        const r = this._statsRect;
        const x = r.x + 16;
        let y = r.y + 16;
        const order = [
            ['chrononLabel', 'chrononValue'],
            ['fishLabel', 'fishValue'],
            ['sharkLabel', 'sharkValue'],
            ['statusLabel', 'statusValue']
        ];
        for (const [labelKey, valueKey] of order) {
            this._statsTexts[labelKey].setPosition(x, y);
            this._statsTexts[valueKey].setPosition(x, y + 22);
            y += 56;
        }
    }

    /**
     * Position the speed row and the three action buttons inside the
     * controls rectangle.
     *
     * @private
     */
    _layoutControls() {
        const r = this._controlsRect;
        const cx = r.x + 16;
        let y = r.y + 16;
        const speedBtnW = (r.w - 32) / SPEED_OPTIONS.length;
        for (let i = 0; i < this._buttons.speeds.length; i++) {
            this._buttons.speeds[i].setPosition(cx + i * speedBtnW, y);
            this._buttons.speeds[i].setSize(Math.floor(speedBtnW - 4), 40);
        }
        y += 56;
        this._buttons.playPause.setPosition(cx, y);
        y += 56;
        this._buttons.step.setPosition(cx, y);
        y += 56;
        this._buttons.reset.setPosition(cx, y);
    }

    /**
     * Per-frame update: advance the chronon accumulator and step the
     * simulation as needed. Also re-syncs buttons (since extinction can
     * happen mid-loop) and redraws if a chronon fired.
     *
     * @param {number} time - Phaser time (ms).
     * @param {number} delta - Frame delta (ms).
     */
    update(time, delta) {
        if (!this.simulation.running || this.simulation._terminal) {
            // Still keep button sync up to date.
            this._syncButtons();
            return;
        }
        this._accumulatorMs += delta;
        const interval = 1000 / this.simulation.speed;
        let stepped = false;
        while (this._accumulatorMs >= interval && this.simulation.running && !this.simulation._terminal) {
            this._accumulatorMs -= interval;
            this.simulation.step();
            stepped = true;
        }
        if (stepped) this._render();
        this._syncButtons();
    }

    /**
     * Render the world, the stats text, and the chart. Called after every
     * state change.
     *
     * @private
     */
    _render() {
        this._renderWorld();
        this._renderStats();
        this._renderChart();
        this._syncSpeedButtons();
    }

    /**
     * Draw the world: water background, then one circle per fish/shark.
     *
     * @private
     */
    _renderWorld() {
        if (this._worldGraphics) this._worldGraphics.destroy();
        this._worldGraphics = this.add.graphics();
        const g = this._worldGraphics;
        const r = this._worldRect;
        g.fillStyle(WATER_COLOR, 1);
        g.fillRect(r.x, r.y, r.w, r.h);

        const cs = this._cellSize;
        for (let x = 0; x < GRID_WIDTH; x++) {
            for (let y = 0; y < GRID_HEIGHT; y++) {
                const e = this.simulation.grid.cells[x][y];
                if (!e) continue;
                const cx = r.x + (x + 0.5) * cs;
                const cy = r.y + (y + 0.5) * cs;
                if (e.type === 'fish') {
                    g.fillStyle(FISH_COLOR, 1);
                    g.fillCircle(cx, cy, Math.max(1, FISH_RADIUS * (cs / 8)));
                } else if (e.type === 'shark') {
                    g.fillStyle(SHARK_COLOR, 1);
                    g.fillCircle(cx, cy, Math.max(1, SHARK_RADIUS * (cs / 8)));
                }
            }
        }
    }

    /**
     * Update the stats panel text from the current simulation state.
     *
     * @private
     */
    _renderStats() {
        this._statsTexts.chrononValue.setText(String(this.simulation.chronon));
        this._statsTexts.fishValue.setText(String(this.simulation.getFishCount()));
        this._statsTexts.sharkValue.setText(String(this.simulation.getSharkCount()));
        this._statsTexts.statusValue.setText(this.simulation.getStatus());
    }

    /**
     * Draw the population history chart across the bottom of the window.
     * Two polylines (fish green, shark blue), no titles or text.
     *
     * @private
     */
    _renderChart() {
        if (this._chartGraphics) this._chartGraphics.destroy();
        this._chartGraphics = this.add.graphics();
        const g = this._chartGraphics;
        const r = this._chartRect;
        g.fillStyle(0x081d33, 1);
        g.fillRect(r.x, r.y, r.w, r.h);

        const samples = this.simulation.getHistorySamples();
        if (samples.length < 2) return;

        // Determine y-scale max so both series fit.
        let maxPop = 1;
        for (const s of samples) {
            if (s.fish > maxPop) maxPop = s.fish;
            if (s.sharks > maxPop) maxPop = s.sharks;
        }
        const left = r.x;
        const right = r.x + r.w;
        const top = r.y + 4;
        const bottom = r.y + r.h - 4;
        const innerH = bottom - top;
        const innerW = right - left;
        // X maps sample index to pixel; we use the oldest sample at the left.
        const denom = Math.max(1, samples.length - 1);

        const fishPts = [];
        const sharkPts = [];
        for (let i = 0; i < samples.length; i++) {
            const px = left + (i / denom) * innerW;
            const fishPy = bottom - (samples[i].fish / maxPop) * innerH;
            const sharkPy = bottom - (samples[i].sharks / maxPop) * innerH;
            fishPts.push({ x: px, y: fishPy });
            sharkPts.push({ x: px, y: sharkPy });
        }
        g.lineStyle(2, FISH_COLOR, 1);
        g.beginPath();
        g.moveTo(fishPts[0].x, fishPts[0].y);
        for (let i = 1; i < fishPts.length; i++) g.lineTo(fishPts[i].x, fishPts[i].y);
        g.strokePath();
        g.lineStyle(2, SHARK_COLOR, 1);
        g.beginPath();
        g.moveTo(sharkPts[0].x, sharkPts[0].y);
        for (let i = 1; i < sharkPts.length; i++) g.lineTo(sharkPts[i].x, sharkPts[i].y);
        g.strokePath();
    }

    /**
     * Sync button enabled/selected states from the current simulation.
     * Called after every chronon and on user input.
     *
     * @private
     */
    _syncButtons() {
        const running = this.simulation.running;
        const terminal = !!this.simulation._terminal;

        // Play/Pause: label flips; disabled when terminal.
        this._buttons.playPause.setEnabled(!terminal);
        this._buttons.playPause.setLabel(running ? 'Pause' : 'Play');

        // Step: enabled only when paused and not terminal.
        this._buttons.step.setEnabled(!running && !terminal);

        // Reset is always enabled.
        this._buttons.reset.setEnabled(true);

        this._syncSpeedButtons();
    }

    /**
     * Update the selected state of the speed buttons to reflect the
     * current selected speed.
     *
     * @private
     */
    _syncSpeedButtons() {
        for (let i = 0; i < this._buttons.speeds.length; i++) {
            this._buttons.speeds[i].setSelected(SPEED_OPTIONS[i] === this.selectedSpeed);
        }
    }
}

/**
 * Fit a rectangle of the given aspect ratio inside a bounding rectangle,
 * centering it. Returns the inner rectangle.
 *
 * @param {{x:number,y:number,w:number,h:number}} bounds - Outer bounds.
 * @param {number} aspect - Width / height ratio.
 * @returns {{x:number,y:number,w:number,h:number}}
 */
function fitAspect(bounds, aspect) {
    const boundsAspect = bounds.w / bounds.h;
    let w, h;
    if (boundsAspect > aspect) {
        h = bounds.h;
        w = h * aspect;
    } else {
        w = bounds.w;
        h = w / aspect;
    }
    const x = bounds.x + (bounds.w - w) / 2;
    const y = bounds.y + (bounds.h - h) / 2;
    return { x, y, w, h };
}
