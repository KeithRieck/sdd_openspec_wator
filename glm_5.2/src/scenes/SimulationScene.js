import WatorSimulation from '../simulation/WatorSimulation.js';
import PhaserButton from '../ui/PhaserButton.js';
import HistoryChart from '../ui/HistoryChart.js';
import {
    COLORS,
    LAYOUT,
    SPEED_OPTIONS,
    DEFAULT_SPEED,
    STATUS,
    FISH_RADIUS_FACTOR,
    SHARK_RADIUS_FACTOR,
    GRID_WIDTH,
    GRID_HEIGHT
} from '../config.js';

/**
 * The main simulation scene.
 *
 * Owns the WatorSimulation engine instance and renders the full app window
 * through Phaser: stats panel (left), world display (center), controls panel
 * (right), and population history chart (bottom). Drives the engine via an
 * accumulator in update() and redraws every frame. All UI is Phaser-native
 * (Graphics + Text + PhaserButton); no DOM overlays.
 */
export default class SimulationScene extends Phaser.Scene {
    /**
     * Construct the simulation scene with its scene key.
     */
    constructor() {
        super('SimulationScene');
    }

    /**
     * Phaser create lifecycle: instantiate the engine, build all UI, wire
     * callbacks, and lay out the scene.
     */
    create() {
        this.sim = new WatorSimulation();
        this.sim.init();

        this.speed = DEFAULT_SPEED;
        this.accumulator = 0;

        // World rendering graphics.
        this.worldGraphics = this.add.graphics();

        // Stats text objects (left panel).
        this.statsTexts = {
            chronon: this.add.text(0, 0, '', this._statsStyle()),
            fish: this.add.text(0, 0, '', this._statsStyle()),
            sharks: this.add.text(0, 0, '', this._statsStyle()),
            status: this.add.text(0, 0, '', this._statsStyle())
        };

        // History chart — reads directly from the simulation's rolling history.
        this.chart = new HistoryChart(this, this.sim.history);

        // Build controls.
        this._createButtons();

        // Layout everything for the current window size.
        this.layout();

        // Handle browser resize.
        this.scale.on('resize', (gameSize) => {
            this.layout();
        });

        // Initial draw.
        this.drawWorld();
        this.drawStats();
    }

    /**
     * Return the Phaser text style object for stats text.
     *
     * @returns {object} Phaser text style config.
     * @private
     */
    _statsStyle() {
        return {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${LAYOUT.statsFontSize}px`,
            color: '#e0e0e0'
        };
    }

    /**
     * Create the action buttons and speed segmented control.
     *
     * @private
     */
    _createButtons() {
        const w = LAYOUT.controlsPanelWidth - LAYOUT.panelPadding * 2;

        // Action buttons (each on its own row).
        this.playPauseBtn = new PhaserButton(this, 0, 0, w, LAYOUT.buttonHeight, 'Pause', () => this.onPlayPause());
        this.stepBtn = new PhaserButton(this, 0, 0, w, LAYOUT.buttonHeight, 'Step', () => this.onStep());
        this.resetBtn = new PhaserButton(this, 0, 0, w, LAYOUT.buttonHeight, 'Reset', () => this.onReset());

        // Speed segmented control (one horizontal row of 5 buttons).
        this.speedButtons = [];
        const speedBtnW = (w - LAYOUT.buttonSpacing * (SPEED_OPTIONS.length - 1)) / SPEED_OPTIONS.length;
        for (let i = 0; i < SPEED_OPTIONS.length; i++) {
            const speed = SPEED_OPTIONS[i];
            const btn = new PhaserButton(this, 0, 0, speedBtnW, LAYOUT.buttonHeight, `${speed}x`, () => this.onSpeed(speed));
            btn.setSelected(speed === this.speed);
            this.speedButtons.push(btn);
        }

        this._updateControlStates();
    }

    /**
     * Update enabled/selected states of all buttons based on sim state.
     *
     * @private
     */
    _updateControlStates() {
        const terminal = this.sim.isTerminal();
        const running = this.sim.running;

        this.playPauseBtn.setEnabled(!terminal);
        this.playPauseBtn.setLabel(running ? 'Pause' : 'Play');
        this.stepBtn.setEnabled(!running && !terminal);
        this.resetBtn.setEnabled(true);

        for (const btn of this.speedButtons) {
            btn.setEnabled(true);
        }
    }

    /**
     * Phaser update lifecycle: advance the simulation via accumulator and redraw.
     *
     * @param {number} time - Current time in ms.
     * @param {number} delta - Frame delta in ms.
     */
    update(time, delta) {
        if (this.sim.running && !this.sim.isTerminal()) {
            this.accumulator += delta;
            const stepMs = 1000 / this.speed;
            while (this.accumulator >= stepMs) {
                this.sim.step();
                this.accumulator -= stepMs;
                if (this.sim.isTerminal()) {
                    this.accumulator = 0;
                    break;
                }
            }
        }

        this.drawWorld();
        this.drawStats();
        this._drawChart();
        this._updateControlStates();
    }

    /**
     * Draw the world: water background plus fish and shark circles.
     *
     * No grid lines. Fish are green circles; sharks are larger blue circles.
     */
    drawWorld() {
        const g = this.worldGraphics;
        g.clear();

        const region = this.worldRegion;
        if (!region) return;

        // Water background.
        g.fillStyle(COLORS.water, 1);
        g.fillRect(region.x, region.y, region.w, region.h);

        const cellW = region.w / this.sim.width;
        const cellH = region.h / this.sim.height;
        const fishR = Math.min(cellW, cellH) * FISH_RADIUS_FACTOR;
        const sharkR = Math.min(cellW, cellH) * SHARK_RADIUS_FACTOR;

        for (const entity of this.sim.entities.values()) {
            const cx = region.x + (entity.x + 0.5) * cellW;
            const cy = region.y + (entity.y + 0.5) * cellH;
            // Distinguish by checking for energy field (shark-only).
            const isShark = 'energy' in entity;
            if (isShark) {
                g.fillStyle(COLORS.shark, 1);
                g.fillCircle(cx, cy, sharkR);
            } else {
                g.fillStyle(COLORS.fish, 1);
                g.fillCircle(cx, cy, fishR);
            }
        }
    }

    /**
     * Update the stats text objects from simulation state.
     */
    drawStats() {
        this.statsTexts.chronon.setText(`Chronon: ${this.sim.chronon}`);
        this.statsTexts.fish.setText(`Fish: ${this.sim.fishCount}`);
        this.statsTexts.sharks.setText(`Sharks: ${this.sim.sharkCount}`);
        this.statsTexts.status.setText(`Status: ${this.sim.status}`);
    }

    /**
     * Draw the population history chart into its layout region.
     *
     * @private
     */
    _drawChart() {
        const r = this.chartRegion;
        if (!r) return;
        this.chart.draw(r.x, r.y, r.w, r.h);
    }

    /**
     * Play/Pause button handler: toggle running and update button states.
     */
    onPlayPause() {
        if (this.sim.isTerminal()) return;
        this.sim.running = !this.sim.running;
        this.accumulator = 0;
        this._updateControlStates();
    }

    /**
     * Step button handler: advance exactly one chronon while paused.
     *
     * Does not resume running.
     */
    onStep() {
        if (this.sim.running || this.sim.isTerminal()) return;
        this.sim.step();
        this.drawWorld();
        this.drawStats();
        this._drawChart();
        this._updateControlStates();
    }

    /**
     * Reset button handler: create a new random world and resume running.
     */
    onReset() {
        this.sim.reset();
        this.accumulator = 0;
        this._updateControlStates();
        this.drawWorld();
        this.drawStats();
    }

    /**
     * Speed button handler: set the new speed and update segmented control.
     *
     * Does not resume the simulation if paused.
     *
     * @param {number} newSpeed - The selected speed (chronons per second).
     */
    onSpeed(newSpeed) {
        this.speed = newSpeed;
        for (let i = 0; i < SPEED_OPTIONS.length; i++) {
            this.speedButtons[i].setSelected(SPEED_OPTIONS[i] === newSpeed);
        }
        this.accumulator = 0;
    }

    /**
     * Recompute layout regions and reposition all UI elements on resize.
     *
     * Stats panel left, world center (preserving 100:70 aspect), controls
     * right, chart bottom. Reflows for narrow/tablet widths.
     */
    layout() {
        const W = this.scale.width;
        const H = this.scale.height;
        const isNarrow = W < 744;

        if (isNarrow) {
            this._layoutNarrow(W, H);
        } else {
            this._layoutWide(W, H);
        }
    }

    /**
     * Wide layout: stats left, world center, controls right, chart bottom.
     *
     * @param {number} W - Window width.
     * @param {number} H - Window height.
     * @private
     */
    _layoutWide(W, H) {
        const statsW = LAYOUT.statsPanelWidth;
        const controlsW = LAYOUT.controlsPanelWidth;
        const chartH = LAYOUT.chartHeight;

        const worldAreaW = W - statsW - controlsW;
        const worldAreaH = H - chartH;
        const worldAreaX = statsW;
        const worldAreaY = 0;

        // Fit world preserving 100:70 aspect, centered in the area.
        const aspect = GRID_WIDTH / GRID_HEIGHT;
        let worldW = worldAreaW;
        let worldH = worldW / aspect;
        if (worldH > worldAreaH) {
            worldH = worldAreaH;
            worldW = worldH * aspect;
        }
        const worldX = worldAreaX + (worldAreaW - worldW) / 2;
        const worldY = worldAreaY + (worldAreaH - worldH) / 2;
        this.worldRegion = { x: worldX, y: worldY, w: worldW, h: worldH };

        // Stats panel (left).
        this._layoutStats(0, 0, statsW, H);

        // Controls panel (right).
        const controlsX = W - controlsW;
        this._layoutControls(controlsX, 0, controlsW, H);

        // Chart (bottom, full width).
        this.chartRegion = { x: 0, y: H - chartH, w: W, h: chartH };
    }

    /**
     * Narrow/tablet layout: stack panels, world centered, chart bottom.
     *
     * @param {number} W - Window width.
     * @param {number} H - Window height.
     * @private
     */
    _layoutNarrow(W, H) {
        const chartH = LAYOUT.chartHeight;
        const statsH = LAYOUT.statsLineHeight * 4 + LAYOUT.panelPadding * 2;
        const controlsH = LAYOUT.buttonHeight * 4 + LAYOUT.buttonSpacing * 4 + LAYOUT.panelPadding * 2;

        const worldAreaW = W;
        const worldAreaH = H - statsH - controlsH - chartH;

        const aspect = GRID_WIDTH / GRID_HEIGHT;
        let worldW = worldAreaW;
        let worldH = worldW / aspect;
        if (worldH > worldAreaH) {
            worldH = worldAreaH;
            worldW = worldH * aspect;
        }
        const worldX = (W - worldW) / 2;
        const worldY = statsH + (worldAreaH - worldH) / 2;
        this.worldRegion = { x: worldX, y: worldY, w: worldW, h: worldH };

        // Stats at top.
        this._layoutStats(0, 0, W, statsH);

        // Controls below world.
        this._layoutControls(0, statsH + worldAreaH, W, controlsH);

        // Chart at bottom.
        this.chartRegion = { x: 0, y: H - chartH, w: W, h: chartH };
    }

    /**
     * Position stats text objects within a panel region.
     *
     * @param {number} x - Panel left.
     * @param {number} y - Panel top.
     * @param {number} w - Panel width.
     * @param {number} h - Panel height.
     * @private
     */
    _layoutStats(x, y, w, h) {
        const pad = LAYOUT.panelPadding;
        const lh = LAYOUT.statsLineHeight;
        const tx = x + pad;
        let ty = y + pad;
        this.statsTexts.chronon.setPosition(tx, ty); ty += lh;
        this.statsTexts.fish.setPosition(tx, ty); ty += lh;
        this.statsTexts.sharks.setPosition(tx, ty); ty += lh;
        this.statsTexts.status.setPosition(tx, ty);
    }

    /**
     * Position action buttons and speed control within a panel region.
     *
     * @param {number} x - Panel left.
     * @param {number} y - Panel top.
     * @param {number} w - Panel width.
     * @param {number} h - Panel height.
     * @private
     */
    _layoutControls(x, y, w, h) {
        const pad = LAYOUT.panelPadding;
        const innerW = w - pad * 2;
        const btnW = innerW;
        const speedBtnW = (innerW - LAYOUT.buttonSpacing * (SPEED_OPTIONS.length - 1)) / SPEED_OPTIONS.length;

        let cy = y + pad;

        // Speed row first (one horizontal row).
        let cx = x + pad;
        for (let i = 0; i < this.speedButtons.length; i++) {
            this.speedButtons[i].setPosition(cx, cy);
            this.speedButtons[i].setSize(speedBtnW, LAYOUT.buttonHeight);
            cx += speedBtnW + LAYOUT.buttonSpacing;
        }
        cy += LAYOUT.buttonHeight + LAYOUT.buttonSpacing;

        // Action buttons, each on its own row.
        this.playPauseBtn.setPosition(x + pad, cy);
        this.playPauseBtn.setSize(btnW, LAYOUT.buttonHeight);
        cy += LAYOUT.buttonHeight + LAYOUT.buttonSpacing;

        this.stepBtn.setPosition(x + pad, cy);
        this.stepBtn.setSize(btnW, LAYOUT.buttonHeight);
        cy += LAYOUT.buttonHeight + LAYOUT.buttonSpacing;

        this.resetBtn.setPosition(x + pad, cy);
        this.resetBtn.setSize(btnW, LAYOUT.buttonHeight);
    }
}
