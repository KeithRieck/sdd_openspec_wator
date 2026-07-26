/**
 * Main simulation scene.
 *
 * Owns the WatorSimulation, runs the chronon update loop, renders the
 * world grid, stats panel, controls panel, and population history chart.
 * All rendering uses Phaser Graphics — no sprites or DOM overlays.
 *
 * @extends Phaser.Scene
 */
import { CONFIG } from '../config.js';
import { WatorSimulation, Status } from '../simulation/WatorSimulation.js';

export class SimulationScene extends Phaser.Scene {
  constructor() {
    super({ key: 'SimulationScene' });
  }

  /**
   * Initialize the simulation, graphics layers, and UI.
   */
  create() {
    // Simulation state
    this.sim = new WatorSimulation();
    this.selectedSpeed = CONFIG.defaultSpeed;
    this.elapsedMs = 0;

    // Population history (rolling window)
    this.fishHistory = [];
    this.sharkHistory = [];

    // Graphics layers (draw order matters)
    this.worldGfx = this.add.graphics();
    this.uiGfx = this.add.graphics();
    this.chartGfx = this.add.graphics();

    // Text objects (created once, updated each frame)
    this.statusText = this.add.text(0, 0, '', { color: '#ffffff', fontSize: '14px' });
    this.chrononText = this.add.text(0, 0, '', { color: '#ffffff', fontSize: '14px' });
    this.fishText = this.add.text(0, 0, '', { color: '#33cc33', fontSize: '14px' });
    this.sharkText = this.add.text(0, 0, '', { color: '#3399ff', fontSize: '14px' });

    // Button labels (created once)
    this.playPauseLabel = this.add.text(0, 0, 'Pause', {
      color: '#ffffff', fontSize: '14px'
    }).setOrigin(0.5);
    this.stepLabel = this.add.text(0, 0, 'Step', {
      color: '#ffffff', fontSize: '14px'
    }).setOrigin(0.5);
    this.resetLabel = this.add.text(0, 0, 'Reset', {
      color: '#ffffff', fontSize: '14px'
    }).setOrigin(0.5);

    // Speed button labels
    this.speedLabels = CONFIG.speedOptions.map((s) =>
      this.add.text(0, 0, `${s}x`, {
        color: '#ffffff', fontSize: '12px'
      }).setOrigin(0.5)
    );

    // Speed button highlight graphics
    this.speedHighlight = this.add.graphics();

    // Layout and input
    this._setupInput();
    this._computeLayout();
    this.scale.on('resize', () => this._computeLayout());
  }

  /**
   * Game loop: advance chronons based on elapsed time, then redraw.
   *
   * @param {number} _time    - Total elapsed time (unused).
   * @param {number} delta    - Time since last frame in ms.
   */
  update(_time, delta) {
    if (this.sim.isRunning && !this.sim.isTerminal) {
      this.elapsedMs += delta;
      const chrononMs = 1000 / this.selectedSpeed;

      let chrononsThisFrame = 0;
      while (this.elapsedMs >= chrononMs && chrononsThisFrame < this.selectedSpeed) {
        this.sim.tick();
        this.elapsedMs -= chrononMs;
        chrononsThisFrame++;

        // Record population sample
        this._recordSample();

        if (this.sim.isTerminal) break;
      }
    }

    this._redraw();
  }

  // ═══════════════════════════════════════════════════════════
  //  LAYOUT
  // ═══════════════════════════════════════════════════════════

  /**
   * Compute layout regions from the current window size.
   *
   * Wide layout: stats left, world center, controls right, chart bottom.
   * Narrow layout: world on top, controls below, chart at bottom.
   */
  _computeLayout() {
    const w = this.scale.width;
    const h = this.scale.height;
    const chartH = Math.floor(h * CONFIG.chartHeightFraction);
    const mainH = h - chartH;
    const narrow = w < CONFIG.narrowBreakpoint;

    if (narrow) {
      // Narrow: world takes most of the width, controls below
      const margin = 8;
      const controlsH = 120;
      const worldH = mainH - controlsH - margin * 2;
      const cellW = (w - margin * 2) / CONFIG.gridWidth;
      const cellH = worldH / CONFIG.gridHeight;
      const cellSize = Math.min(cellW, cellH);
      const worldW = Math.floor(cellSize * CONFIG.gridWidth);
      const worldHActual = Math.floor(cellSize * CONFIG.gridHeight);

      this.layout = {
        narrow: true,
        worldX: Math.floor((w - worldW) / 2),
        worldY: margin,
        worldW,
        worldH: worldHActual,
        cellSize,
        chartX: 0,
        chartY: mainH,
        chartW: w,
        chartH,
        statsX: margin,
        statsY: margin,
        controlsX: margin,
        controlsY: worldHActual + margin * 2,
        controlsW: w - margin * 2,
      };
    } else {
      // Wide: three-column layout
      const sideW = Math.floor(w * CONFIG.sidePanelFraction);
      const worldAreaW = w - sideW * 2;
      const margin = 12;

      const cellW = (worldAreaW - margin * 2) / CONFIG.gridWidth;
      const cellH = (mainH - margin * 2) / CONFIG.gridHeight;
      const cellSize = Math.min(cellW, cellH);
      const worldW = Math.floor(cellSize * CONFIG.gridWidth);
      const worldH = Math.floor(cellSize * CONFIG.gridHeight);

      this.layout = {
        narrow: false,
        worldX: Math.floor((w - worldW) / 2),
        worldY: Math.floor((mainH - worldH) / 2),
        worldW,
        worldH,
        cellSize,
        chartX: 0,
        chartY: mainH,
        chartW: w,
        chartH,
        statsX: margin,
        statsY: margin,
        controlsX: w - sideW + margin,
        controlsY: margin,
        controlsW: sideW - margin * 2,
      };
    }
  }

  // ═══════════════════════════════════════════════════════════
  //  REDRAWING
  // ═══════════════════════════════════════════════════════════

  /**
   * Clear and redraw all visual layers.
   */
  _redraw() {
    this._drawWorld();
    this._drawUI();
    this._drawChart();
  }

  /**
   * Draw the world grid: green circles for fish, blue for sharks.
   */
  _drawWorld() {
    const g = this.worldGfx;
    g.clear();
    const { worldX, worldY, cellSize } = this.layout;
    const grid = this.sim.grid;
    const fishR = CONFIG.fishRadius * (cellSize / 8);
    const sharkR = CONFIG.sharkRadius * (cellSize / 8);

    for (const entity of grid.entities.values()) {
      const cx = worldX + entity.x * cellSize + cellSize / 2;
      const cy = worldY + entity.y * cellSize + cellSize / 2;

      if (entity.type === 'fish') {
        g.fillStyle(CONFIG.fishColor, 1);
        g.fillCircle(cx, cy, fishR);
      } else {
        g.fillStyle(CONFIG.sharkColor, 1);
        g.fillCircle(cx, cy, sharkR);
      }
    }
  }

  /**
   * Draw stats, status, and controls.
   */
  _drawUI() {
    const g = this.uiGfx;
    g.clear();
    const l = this.layout;
    const sim = this.sim;

    // --- Stats panel (left) ---
    this.chrononText.setPosition(l.statsX, l.statsY);
    this.chrononText.setText(`Chronon: ${sim.chrononCount}`);

    this.fishText.setPosition(l.statsX, l.statsY + 22);
    this.fishText.setText(`Fish: ${sim.fishCount()}`);

    this.sharkText.setPosition(l.statsX, l.statsY + 44);
    this.sharkText.setText(`Sharks: ${sim.sharkCount()}`);

    this.statusText.setPosition(l.statsX, l.statsY + 66);
    this.statusText.setText(this._statusString());

    // --- Controls panel (right) ---
    const cx = l.controlsX;
    const cy = l.controlsY;
    const bw = Math.min(l.controlsW - 8, 120);
    const bh = 30;
    const gap = 6;
    let by = cy;

    // Play/Pause button
    this._drawButton(g, cx, by, bw, bh, 0x226622);
    this.playPauseLabel.setPosition(cx + bw / 2, by + bh / 2);
    this.playPauseLabel.setText(sim.isTerminal ? 'Paused' : sim.isRunning ? 'Pause' : 'Play');
    by += bh + gap;

    // Step button
    const stepEnabled = !sim.isRunning && !sim.isTerminal;
    this._drawButton(g, cx, by, bw, bh, stepEnabled ? 0x226622 : 0x333333);
    this.stepLabel.setPosition(cx + bw / 2, by + bh / 2);
    this.stepLabel.setAlpha(stepEnabled ? 1 : 0.4);
    by += bh + gap;

    // Reset button
    this._drawButton(g, cx, by, bw, bh, 0x664422);
    this.resetLabel.setPosition(cx + bw / 2, by + bh / 2);
    by += bh + gap + 8;

    // Speed buttons (horizontal row)
    const speedBtnW = Math.min(Math.floor((bw + gap) / CONFIG.speedOptions.length) - gap, 40);
    const speedGap = 3;
    let sx = cx;

    this.speedHighlight.clear();
    for (let i = 0; i < CONFIG.speedOptions.length; i++) {
      const speed = CONFIG.speedOptions[i];
      const selected = speed === this.selectedSpeed;
      this._drawButton(g, sx, by, speedBtnW, bh, selected ? 0x446688 : 0x333344);
      this.speedLabels[i].setPosition(sx + speedBtnW / 2, by + bh / 2);
      sx += speedBtnW + speedGap;
    }
  }

  /**
   * Draw the population history chart.
   */
  _drawChart() {
    const g = this.chartGfx;
    g.clear();
    const { chartX, chartY, chartW, chartH } = this.layout;
    const history = this.sim.chrononCount > 0;

    // Background
    g.fillStyle(0x001122, 1);
    g.fillRect(chartX, chartY, chartW, chartH);

    if (!history || this.fishHistory.length < 2) return;

    const dataLen = this.fishHistory.length;
    const plotX = chartX + 4;
    const plotW = chartW - 8;
    const plotY = chartY + 4;
    const plotH = chartH - 8;

    // Find max population for scaling
    let maxPop = 1;
    for (let i = 0; i < dataLen; i++) {
      if (this.fishHistory[i] > maxPop) maxPop = this.fishHistory[i];
      if (this.sharkHistory[i] > maxPop) maxPop = this.sharkHistory[i];
    }

    const xStep = plotW / (CONFIG.historyWindowSize - 1);

    // Draw fish line (green)
    g.lineStyle(1.5, CONFIG.fishColor, 1);
    g.beginPath();
    for (let i = 0; i < dataLen; i++) {
      const px = plotX + i * xStep;
      const py = plotY + plotH - (this.fishHistory[i] / maxPop) * plotH;
      if (i === 0) g.moveTo(px, py);
      else g.lineTo(px, py);
    }
    g.strokePath();

    // Draw shark line (blue)
    g.lineStyle(1.5, CONFIG.sharkColor, 1);
    g.beginPath();
    for (let i = 0; i < dataLen; i++) {
      const px = plotX + i * xStep;
      const py = plotY + plotH - (this.sharkHistory[i] / maxPop) * plotH;
      if (i === 0) g.moveTo(px, py);
      else g.lineTo(px, py);
    }
    g.strokePath();
  }

  // ═══════════════════════════════════════════════════════════
  //  INPUT
  // ═══════════════════════════════════════════════════════════

  /**
   * Set up pointer interaction for buttons.
   */
  _setupInput() {
    this.input.on('pointerdown', (pointer) => {
      const l = this.layout;
      const cx = l.controlsX;
      const cy = l.controlsY;
      const bw = Math.min(l.controlsW - 8, 120);
      const bh = 30;
      const gap = 6;
      let by = cy;

      // Play/Pause
      if (this._hitTest(pointer, cx, by, bw, bh)) {
        this._togglePlayPause();
        return;
      }
      by += bh + gap;

      // Step
      if (this._hitTest(pointer, cx, by, bw, bh)) {
        this._doStep();
        return;
      }
      by += bh + gap;

      // Reset
      if (this._hitTest(pointer, cx, by, bw, bh)) {
        this._doReset();
        return;
      }
      by += bh + gap + 8;

      // Speed buttons
      const speedBtnW = Math.min(Math.floor((bw + gap) / CONFIG.speedOptions.length) - gap, 40);
      const speedGap = 3;
      let sx = cx;
      for (let i = 0; i < CONFIG.speedOptions.length; i++) {
        if (this._hitTest(pointer, sx, by, speedBtnW, bh)) {
          this.selectedSpeed = CONFIG.speedOptions[i];
          return;
        }
        sx += speedBtnW + speedGap;
      }
    });
  }

  // ═══════════════════════════════════════════════════════════
  //  ACTIONS
  // ═══════════════════════════════════════════════════════════

  /** Toggle play/pause. */
  _togglePlayPause() {
    if (this.sim.isTerminal) return;
    this.sim.isRunning = !this.sim.isRunning;
    this.elapsedMs = 0;
  }

  /** Advance exactly one chronon when paused. */
  _doStep() {
    if (this.sim.isRunning || this.sim.isTerminal) return;
    this.sim.tick();
    this._recordSample();
  }

  /** Reset the simulation to a fresh world. */
  _doReset() {
    this.sim.reset();
    this.fishHistory = [];
    this.sharkHistory = [];
    this.elapsedMs = 0;
    this.selectedSpeed = this.selectedSpeed; // keep speed selection
  }

  // ═══════════════════════════════════════════════════════════
  //  HELPERS
  // ═══════════════════════════════════════════════════════════

  /**
   * Draw a rounded button background.
   */
  _drawButton(g, x, y, w, h, color) {
    g.fillStyle(color, 1);
    g.fillRoundedRect(x, y, w, h, 4);
    g.lineStyle(1, 0x888888, 0.3);
    g.strokeRoundedRect(x, y, w, h, 4);
  }

  /**
   * Get the status display string.
   */
  _statusString() {
    const s = this.sim.status();
    if (s === Status.SHARKS_EXTINCT) return 'Sharks extinct';
    if (s === Status.FISH_EXTINCT) return 'Fish extinct';
    if (s === Status.COLLAPSED) return 'Ecosystem collapsed';
    if (s === Status.PAUSED) return 'Paused';
    return 'Running';
  }

  /**
   * Record a population sample for the history chart.
   */
  _recordSample() {
    this.fishHistory.push(this.sim.fishCount());
    this.sharkHistory.push(this.sim.sharkCount());
    if (this.fishHistory.length > CONFIG.historyWindowSize) {
      this.fishHistory.shift();
      this.sharkHistory.shift();
    }
  }

  /**
   * Check if a pointer is within a rectangular region.
   */
  _hitTest(pointer, x, y, w, h) {
    return pointer.x >= x && pointer.x <= x + w &&
           pointer.y >= y && pointer.y <= y + h;
  }
}
