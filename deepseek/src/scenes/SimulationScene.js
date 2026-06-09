import { WatorSimulation } from '../simulation/WatorSimulation.js';
import {
    SPEEDS, DEFAULT_SPEED_INDEX, HISTORY_WINDOW,
    COLOR_FISH, COLOR_SHARK, COLOR_WATER, COLOR_UI_BG, COLOR_TEXT,
    COLOR_BUTTON, COLOR_BUTTON_HOVER, COLOR_BUTTON_ACTIVE,
    COLOR_BUTTON_DISABLED, COLOR_BUTTON_DISABLED_TEXT,
    COLOR_CHART_FISH, COLOR_CHART_SHARK, COLOR_CHART_BG,
    FONT_FAMILY, STATS_FONT_SIZE, BUTTON_FONT_SIZE,
    FISH_RADIUS_RATIO, SHARK_RADIUS_RATIO,
    LAYOUT_PADDING, LAYOUT_GAP, STATS_PANEL_WIDTH, CONTROLS_PANEL_WIDTH,
    CHART_HEIGHT_RATIO, CHART_MIN_HEIGHT,
    BUTTON_WIDTH, BUTTON_HEIGHT, BUTTON_RADIUS,
    MAX_CHRONONS_PER_FRAME, NARROW_BREAKPOINT, MIN_CELL_SIZE
} from '../config.js';

/**
 * Main Phaser scene that owns the simulation, rendering, controls, stats,
 * population history chart, and responsive layout.
 */
export class SimulationScene extends Phaser.Scene {
    constructor() {
        super('SimulationScene');
    }

    /** @override */
    create() {
        this.sim = new WatorSimulation();
        this.isRunning = true;
        this.isTerminal = false;
        this.terminalStatus = '';
        this.speedIndex = DEFAULT_SPEED_INDEX;
        this.speed = SPEEDS[DEFAULT_SPEED_INDEX];
        this.chrononAccumulator = 0;
        this.historyData = [];

        // --- Layout ---
        this.computeLayout();

        // --- Graphics objects ---
        this.worldGfx = this.add.graphics();
        this.uiBgGfx = this.add.graphics();
        this.controlsGfx = this.add.graphics();
        this.chartGfx = this.add.graphics();

        // --- Stats text ---
        this.chrononText = this.add.text(0, 0, '', this.textStyle());
        this.fishText = this.add.text(0, 0, '', this.textStyle());
        this.sharksText = this.add.text(0, 0, '', this.textStyle());
        this.statusText = this.add.text(0, 0, '', this.textStyle({ fontSize: STATS_FONT_SIZE + 2, fontStyle: 'bold' }));

        // --- Button text objects ---
        this.buttonTexts = [];
        this.actionButtonTexts = [];

        // --- Build UI ---
        this.createControlButtons();
        this.renderControls();

        // --- Resize listener ---
        this.scale.on('resize', this.handleResize, this);

        // --- Initial render ---
        this.renderAll();
    }

    /**
     * Computes all layout positions and sizes based on current viewport.
     */
    computeLayout() {
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        const narrow = w < NARROW_BREAKPOINT;

        const chartH = Math.max(Math.floor(h * CHART_HEIGHT_RATIO), CHART_MIN_HEIGHT);
        const mainH = h - chartH;

        if (narrow) {
            const worldH = Math.floor(mainH * 0.55);
            const uiH = mainH - worldH;
            const halfW = Math.floor(w / 2);

            this.statsX = LAYOUT_PADDING;
            this.statsY = LAYOUT_PADDING;
            this.statsW = halfW - LAYOUT_PADDING * 2;

            this.controlsX = halfW + LAYOUT_PADDING;
            this.controlsY = LAYOUT_PADDING;
            this.controlsW = halfW - LAYOUT_PADDING * 2;

            this.worldX = LAYOUT_PADDING;
            this.worldY = uiH;
            this.worldW = w - LAYOUT_PADDING * 2;
            this.worldH = worldH - LAYOUT_PADDING;
            this.narrow = true;
        } else {
            this.statsX = LAYOUT_PADDING;
            this.statsY = LAYOUT_PADDING;
            this.statsW = STATS_PANEL_WIDTH;

            this.controlsX = w - CONTROLS_PANEL_WIDTH - LAYOUT_PADDING;
            this.controlsY = LAYOUT_PADDING;
            this.controlsW = CONTROLS_PANEL_WIDTH;

            this.worldX = this.statsX + this.statsW + LAYOUT_PADDING;
            this.worldY = LAYOUT_PADDING;
            this.worldW = this.controlsX - this.worldX - LAYOUT_PADDING;
            this.worldH = mainH - LAYOUT_PADDING * 2;
            this.narrow = false;
        }

        this.chartX = LAYOUT_PADDING;
        this.chartY = mainH;
        this.chartW = w - LAYOUT_PADDING * 2;
        this.chartH = chartH - LAYOUT_PADDING;

        // Cell size: fit grid into world area
        this.cellSize = Math.max(
            MIN_CELL_SIZE,
            Math.min(
                Math.floor(this.worldW / this.sim.width),
                Math.floor(this.worldH / this.sim.height)
            )
        );

        // Center the grid within the world area
        this.gridPixelW = this.cellSize * this.sim.width;
        this.gridPixelH = this.cellSize * this.sim.height;
        this.gridOffsetX = this.worldX + Math.floor((this.worldW - this.gridPixelW) / 2);
        this.gridOffsetY = this.worldY + Math.floor((this.worldH - this.gridPixelH) / 2);

        // Radii
        this.fishRadius = Math.max(1, Math.floor(this.cellSize * FISH_RADIUS_RATIO));
        this.sharkRadius = Math.max(1, Math.floor(this.cellSize * SHARK_RADIUS_RATIO));
    }

    /**
     * Creates interactive control buttons (speed row + action buttons).
     */
    createControlButtons() {
        this.controlsGfx.setInteractive(
            new Phaser.Geom.Rectangle(0, 0, this.cameras.main.width, this.cameras.main.height),
            Phaser.Geom.Rectangle.Contains
        );

        this.controlsGfx.on('pointerover', (pointer) => {
            this.pointerOver = this.hitTest(pointer.x, pointer.y);
            this.renderControls();
        });

        this.controlsGfx.on('pointerout', () => {
            this.pointerOver = -1;
            this.renderControls();
        });

        this.controlsGfx.on('pointerdown', (pointer) => {
            const idx = this.hitTest(pointer.x, pointer.y);
            if (idx >= 0 && idx < SPEEDS.length) {
                this.handleSpeedChange(idx);
            } else if (idx === SPEEDS.length) {
                this.handlePlayPause();
            } else if (idx === SPEEDS.length + 1) {
                this.handleStep();
            } else if (idx === SPEEDS.length + 2) {
                this.handleReset();
            }
        });

        this.pointerOver = -1;
        this.pointerDown = -1;
    }

    /**
     * Tests which button index the pointer coordinates fall within.
     * @param {number} px
     * @param {number} py
     * @returns {number} button index or -1
     */
    hitTest(px, py) {
        for (let i = 0; i < this.buttonBounds.length; i++) {
            const b = this.buttonBounds[i];
            if (px >= b.x && px <= b.x + b.w && py >= b.y && py <= b.y + b.h) {
                return i;
            }
        }
        return -1;
    }

    /**
     * Draws all control buttons on the controls Graphics.
     * Call this whenever button state changes (hover, select, disable).
     */
    renderControls() {
        this.controlsGfx.clear();
        this.buttonBounds = [];

        if (this.narrow) {
            this.renderControlsNarrow();
        } else {
            this.renderControlsWide();
        }
    }

    /**
     * Draws controls for wide (side-panel) layout.
     */
    renderControlsWide() {
        const gfx = this.controlsGfx;
        const bx = this.controlsX;
        let by = this.controlsY;
        const btnH = BUTTON_HEIGHT;

        // Speed buttons — compute width to fit exactly in the panel width in one row
        const nSpeeds = SPEEDS.length;
        const speedBtnW = Math.floor((this.controlsW - LAYOUT_GAP * (nSpeeds - 1)) / nSpeeds);
        let btnX = bx;

        for (let i = 0; i < nSpeeds; i++) {
            const selected = i === this.speedIndex;
            const disabled = this.isTerminal;
            this.drawButton(gfx, btnX, by, speedBtnW, btnH, SPEEDS[i] + 'x', selected, disabled);
            this.buttonBounds.push({ x: btnX, y: by, w: speedBtnW, h: btnH });
            btnX += speedBtnW + LAYOUT_GAP;
        }

        by += btnH + LAYOUT_GAP * 3;

        // Action buttons — each on its own row, full panel width
        const actionW = this.controlsW;
        const actionBtns = [
            { label: this.isRunning ? 'Pause' : 'Play', disabled: this.isTerminal, idx: SPEEDS.length },
            { label: 'Step', disabled: this.isRunning || this.isTerminal, idx: SPEEDS.length + 1 },
            { label: 'Reset', disabled: false, idx: SPEEDS.length + 2 },
        ];

        for (const btn of actionBtns) {
            this.drawButton(gfx, bx, by, actionW, btnH, btn.label, false, btn.disabled);
            this.buttonBounds.push({ x: bx, y: by, w: actionW, h: btnH });
            by += btnH + LAYOUT_GAP;
        }
    }

    /**
     * Draws controls for narrow (stacked) layout.
     */
    renderControlsNarrow() {
        const gfx = this.controlsGfx;
        const bx = this.controlsX;
        let by = this.controlsY;
        const btnH = BUTTON_HEIGHT;
        const btnW = Math.min(Math.floor((this.controlsW - LAYOUT_GAP * (SPEEDS.length - 1)) / SPEEDS.length), 55);

        // Speed buttons horizontal
        let sx = bx;
        for (let i = 0; i < SPEEDS.length; i++) {
            const selected = i === this.speedIndex;
            const disabled = this.isTerminal;
            this.drawButton(gfx, sx, by, btnW, btnH, SPEEDS[i] + 'x', selected, disabled);
            this.buttonBounds.push({ x: sx, y: by, w: btnW, h: btnH });
            sx += btnW + LAYOUT_GAP;
        }

        by += btnH + LAYOUT_GAP * 2;

        // Action buttons
        const actionWidth = this.controlsW;
        const actionBtns = [
            { label: this.isRunning ? 'Pause' : 'Play', disabled: this.isTerminal },
            { label: 'Step', disabled: this.isRunning || this.isTerminal },
            { label: 'Reset', disabled: false },
        ];

        for (const btn of actionBtns) {
            this.drawButton(gfx, bx, by, actionWidth, btnH, btn.label, false, btn.disabled);
            this.buttonBounds.push({ x: bx, y: by, w: actionWidth, h: btnH });
            by += btnH + LAYOUT_GAP;
        }
    }

    /**
     * Draws a single button rectangle with text.
     * @param {Phaser.GameObjects.Graphics} gfx
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @param {string} label
     * @param {boolean} selected
     * @param {boolean} disabled
     */
    drawButton(gfx, x, y, w, h, label, selected, disabled) {
        const idx = this.buttonBounds.length;
        const hovered = idx === this.pointerOver;

        let fillColor = COLOR_BUTTON;
        if (disabled) {
            fillColor = COLOR_BUTTON_DISABLED;
        } else if (selected) {
            fillColor = COLOR_BUTTON_ACTIVE;
        } else if (hovered) {
            fillColor = COLOR_BUTTON_HOVER;
        }

        gfx.fillStyle(fillColor, 1);
        gfx.fillRoundedRect(x, y, w, h, BUTTON_RADIUS);

        const textColor = disabled ? COLOR_BUTTON_DISABLED_TEXT : COLOR_TEXT;
        const txt = this.children.list.find(
            c => c.type === 'Text' && c._btnIdx === idx
        );

        if (!txt) {
            const newTxt = this.add.text(
                x + w / 2, y + h / 2, label,
                {
                    fontFamily: FONT_FAMILY,
                    fontSize: BUTTON_FONT_SIZE + 'px',
                    color: '#' + textColor.toString(16).padStart(6, '0'),
                }
            ).setOrigin(0.5);
            newTxt._btnIdx = idx;
            newTxt.setDepth(10);
        } else {
            txt.setPosition(x + w / 2, y + h / 2);
            txt.setText(label);
            txt.setColor('#' + textColor.toString(16).padStart(6, '0'));
        }
    }

    /**
     * Handles speed button click. Does not resume a paused simulation.
     * @param {number} index into SPEEDS array
     */
    handleSpeedChange(index) {
        if (this.isTerminal) return;
        this.speedIndex = index;
        this.speed = SPEEDS[index];
        this.renderControls();
    }

    /** Toggles play/pause state. */
    handlePlayPause() {
        if (this.isTerminal) return;
        this.isRunning = !this.isRunning;
        this.chrononAccumulator = 0;
        this.renderControls();
        this.renderStats();
    }

    /** Advances exactly one chronon (only when paused and not terminal). */
    handleStep() {
        if (this.isRunning || this.isTerminal) return;
        this.sim.tick();
        this.recordHistory();
        this.checkExtinction();
        this.renderAll();
    }

    /** Creates a new random world and resumes running. */
    handleReset() {
        this.sim.reset();
        this.historyData = [];
        this.isRunning = true;
        this.isTerminal = false;
        this.terminalStatus = '';
        this.chrononAccumulator = 0;
        this.renderControls();
        this.renderAll();
    }

    /**
     * Checks for extinction and sets terminal state if needed.
     */
    checkExtinction() {
        const stats = this.sim.getStats();
        if (stats.fish === 0 && stats.sharks === 0) {
            this.isTerminal = true;
            this.isRunning = false;
            this.terminalStatus = 'Ecosystem collapsed';
        } else if (stats.fish === 0) {
            this.isTerminal = true;
            this.isRunning = false;
            this.terminalStatus = 'Fish extinct';
        } else if (stats.sharks === 0) {
            this.isTerminal = true;
            this.isRunning = false;
            this.terminalStatus = 'Sharks extinct';
        }
        if (this.isTerminal) {
            this.renderControls();
        }
    }

    /**
     * Records current population counts into the rolling history window.
     */
    recordHistory() {
        const stats = this.sim.getStats();
        this.historyData.push({ chronon: stats.chronon, fish: stats.fish, sharks: stats.sharks });
        if (this.historyData.length > HISTORY_WINDOW) {
            this.historyData.shift();
        }
    }

    /** @returns {object} text style for stats */
    textStyle(overrides = {}) {
        return Object.assign({
            fontFamily: FONT_FAMILY,
            fontSize: STATS_FONT_SIZE + 'px',
            color: '#' + COLOR_TEXT.toString(16).padStart(6, '0'),
        }, overrides);
    }

    /** Renders the world grid (water + entities). */
    renderWorld() {
        const gfx = this.worldGfx;
        gfx.clear();

        // Water background
        gfx.fillStyle(COLOR_WATER, 1);
        gfx.fillRect(this.gridOffsetX, this.gridOffsetY, this.gridPixelW, this.gridPixelH);

        const entities = this.sim.getEntities();
        const cx = this.gridOffsetX + this.cellSize / 2;
        const cy = this.gridOffsetY + this.cellSize / 2;

        for (const entity of entities.values()) {
            const px = cx + entity.x * this.cellSize;
            const py = cy + entity.y * this.cellSize;
            if (entity.type === 'fish') {
                gfx.fillStyle(COLOR_FISH, 1);
                gfx.fillCircle(px, py, this.fishRadius);
            } else {
                gfx.fillStyle(COLOR_SHARK, 1);
                gfx.fillCircle(px, py, this.sharkRadius);
            }
        }
    }

    /** Updates the stats text objects. */
    renderStats() {
        const stats = this.sim.getStats();
        const x = this.statsX + 2;
        let y = this.statsY;

        this.chrononText.setPosition(x, y);
        this.chrononText.setText('Chronon: ' + stats.chronon);
        y += STATS_FONT_SIZE + 4;

        this.fishText.setPosition(x, y);
        this.fishText.setText('Fish: ' + stats.fish);
        y += STATS_FONT_SIZE + 4;

        this.sharksText.setPosition(x, y);
        this.sharksText.setText('Sharks: ' + stats.sharks);
        y += STATS_FONT_SIZE + 8;

        this.statusText.setPosition(x, y);
        let statusStr;
        if (this.isTerminal) {
            statusStr = this.terminalStatus;
        } else if (this.isRunning) {
            statusStr = 'Running';
        } else {
            statusStr = 'Paused';
        }
        this.statusText.setText('Status: ' + statusStr);
        this.statusText.setColor('#' + (this.isTerminal ? 'ff6644' : COLOR_TEXT.toString(16).padStart(6, '0')));
    }

    /** Draws the population history chart. */
    renderChart() {
        const gfx = this.chartGfx;
        gfx.clear();

        // Background
        gfx.fillStyle(COLOR_CHART_BG, 1);
        gfx.fillRect(this.chartX, this.chartY, this.chartW, this.chartH);

        if (this.historyData.length < 2) return;

        const maxPop = Math.max(
            ...this.historyData.map(d => Math.max(d.fish, d.sharks)),
            1
        );

        const stepX = this.chartW / (this.historyData.length - 1);
        const scaleY = this.chartH / maxPop;
        const baseY = this.chartY + this.chartH;

        // Fish line (green)
        gfx.lineStyle(2, COLOR_CHART_FISH, 1);
        for (let i = 1; i < this.historyData.length; i++) {
            const x1 = this.chartX + (i - 1) * stepX;
            const y1 = baseY - this.historyData[i - 1].fish * scaleY;
            const x2 = this.chartX + i * stepX;
            const y2 = baseY - this.historyData[i].fish * scaleY;
            gfx.lineBetween(x1, y1, x2, y2);
        }

        // Shark line (blue)
        gfx.lineStyle(2, COLOR_CHART_SHARK, 1);
        for (let i = 1; i < this.historyData.length; i++) {
            const x1 = this.chartX + (i - 1) * stepX;
            const y1 = baseY - this.historyData[i - 1].sharks * scaleY;
            const x2 = this.chartX + i * stepX;
            const y2 = baseY - this.historyData[i].sharks * scaleY;
            gfx.lineBetween(x1, y1, x2, y2);
        }
    }

    /** Renders the UI background behind stats and controls. */
    renderUIBackground() {
        const gfx = this.uiBgGfx;
        gfx.clear();
        gfx.fillStyle(COLOR_UI_BG, 1);

        if (this.narrow) {
            if (this.statsW > 0) gfx.fillRect(this.statsX, this.statsY, this.statsW, this.statsY + 60);
            if (this.controlsW > 0) gfx.fillRect(this.controlsX, this.controlsY, this.controlsW, this.controlsY + 120);
        }
    }

    /** Renders everything. */
    renderAll() {
        this.renderUIBackground();
        this.renderWorld();
        this.renderStats();
        this.renderChart();
    }

    /**
     * Phaser update loop. Advances the simulation based on elapsed time and speed.
     * @param {number} time
     * @param {number} delta ms since last frame
     */
    update(time, delta) {
        if (!this.isRunning) return;

        this.chrononAccumulator += delta;
        const interval = 1000 / this.speed;
        let ticks = 0;

        while (this.chrononAccumulator >= interval && ticks < MAX_CHRONONS_PER_FRAME) {
            this.sim.tick();
            this.recordHistory();
            this.chrononAccumulator -= interval;
            ticks++;
        }

        if (this.chrononAccumulator > interval * 2) {
            this.chrononAccumulator = 0;
        }

        this.renderAll();
        this.checkExtinction();
    }

    /**
     * Handles browser/Phaser resize events by recomputing layout.
     */
    handleResize() {
        // Clean up old button texts
        const toRemove = this.children.list.filter(c => c.type === 'Text' && c._btnIdx !== undefined);
        toRemove.forEach(c => c.destroy());

        this.computeLayout();
        this.renderControls();
        this.renderAll();
    }
}
