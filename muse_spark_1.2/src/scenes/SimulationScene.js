import { WatorSimulation } from '../simulation/WatorSimulation.js';
import { Fish } from '../simulation/Fish.js';
import { Shark } from '../simulation/Shark.js';
import { COLORS, GRID_WIDTH, GRID_HEIGHT, SPEEDS, DEFAULT_SPEED } from '../config.js';
import { Button } from '../ui/Button.js';
import { Chart } from '../ui/Chart.js';

/**
 * Main simulation scene — owns layout, rendering, controls, and timing.
 * Phaser owns the entire window; no DOM overlays.
 */
export class SimulationScene extends Phaser.Scene {
  constructor() {
    super({ key: 'SimulationScene' });
    /** @type {WatorSimulation|null} */
    this.sim = null;
    /** @type {Phaser.GameObjects.Graphics|null} */
    this.worldGfx = null;
    /** @type {Phaser.GameObjects.Graphics|null} */
    this.chartGfx = null;
    /** @type {Phaser.GameObjects.Text[]} */
    this.statTexts = [];
    /** @type {Button[]} */
    this.speedButtons = [];
    /** @type {Button|null} */
    this.playButton = null;
    /** @type {Button|null} */
    this.stepButton = null;
    /** @type {Button|null} */
    this.resetButton = null;
    /** @type {number} */
    this.speed = DEFAULT_SPEED;
    /** @type {boolean} */
    this.running = true;
    /** @type {boolean} */
    this.terminal = false;
    /** @type {number} */
    this.acc = 0;
    /** @type {number} */
    this.cellSize = 0;
    /** @type {number} */
    this.offsetX = 0;
    /** @type {number} */
    this.offsetY = 0;
  }

  /**
   * Create scene — initialize simulation, graphics, stats, controls, and layout.
   */
  create() {
    this.sim = new WatorSimulation();

    this.worldGfx = this.add.graphics();
    this.chartGfx = this.add.graphics();

    // Stats texts on left
    const statLabels = ['Chronon: 0', 'Fish: 0', 'Sharks: 0', 'Status: Running'];
    for (let i = 0; i < statLabels.length; i++) {
      const t = this.add.text(0, 0, statLabels[i], {
        fontSize: '14px',
        fontFamily: 'monospace',
        color: COLORS.text
      });
      this.statTexts.push(t);
    }

    // Speed buttons (one row)
    for (let i = 0; i < SPEEDS.length; i++) {
      const btn = new Button(this, 0, 0, 28, 26, `${SPEEDS[i]}x`, () => this._onSpeed(SPEEDS[i]));
      if (SPEEDS[i] === this.speed) btn.setSelected(true);
      this.speedButtons.push(btn);
    }

    // Action buttons (each own row)
    this.playButton = new Button(this, 0, 0, 120, 32, 'Pause', () => this._onPlayPause());
    this.stepButton = new Button(this, 0, 0, 120, 32, 'Step', () => this._onStep());
    this.resetButton = new Button(this, 0, 0, 120, 32, 'Reset', () => this._onReset());

    this.layout();
    this._updateStats();
    this._updateButtons();

    this.scale.on('resize', () => this.layout());

    // Initial render
    this._renderWorld();
    this._renderChart();
  }

  /**
   * Compute layout for wide-only arrangement.
   * Stats left, world center, controls right, chart bottom.
   */
  layout() {
    const W = this.scale.width;
    const H = this.scale.height;
    const PADDING = 12;
    const STATS_W = 140;
    const CONTROLS_W = 160;
    const CHART_H = 100;

    // Chart area
    const chartX = PADDING;
    const chartY = H - CHART_H - PADDING;
    const chartW = W - PADDING * 2;
    const chartH = CHART_H;
    this._chartBounds = { x: chartX, y: chartY, w: chartW, h: chartH };

    // Available area for world (between stats and controls, above chart)
    const availX = STATS_W + PADDING * 2;
    const availY = PADDING;
    const availW = W - STATS_W - CONTROLS_W - PADDING * 4;
    const availH = chartY - PADDING - availY;

    this.cellSize = Math.min(availW / GRID_WIDTH, availH / GRID_HEIGHT);
    const worldW = this.cellSize * GRID_WIDTH;
    const worldH = this.cellSize * GRID_HEIGHT;
    this.offsetX = availX + (availW - worldW) / 2;
    this.offsetY = availY + (availH - worldH) / 2;

    // Position stats texts
    const statsX = PADDING + 8;
    let statsY = PADDING + 16;
    for (const t of this.statTexts) {
      t.setPosition(statsX, statsY);
      statsY += 22;
    }

    // Position speed buttons in one row
    const controlsX = W - CONTROLS_W - PADDING;
    const speedY = PADDING + 16;
    const speedBtnW = 28;
    const speedGap = 4;
    for (let i = 0; i < this.speedButtons.length; i++) {
      const bx = controlsX + 8 + i * (speedBtnW + speedGap) + speedBtnW / 2;
      const by = speedY + 13;
      this.speedButtons[i].setPosition(bx, by);
    }

    // Position action buttons each on own row
    const actionX = controlsX + CONTROLS_W / 2;
    let actionY = speedY + 40;
    this.playButton.setPosition(actionX, actionY);
    actionY += 40;
    this.stepButton.setPosition(actionX, actionY);
    actionY += 40;
    this.resetButton.setPosition(actionX, actionY);

    // Re-render after layout change
    if (this.worldGfx) this._renderWorld();
    if (this.chartGfx) this._renderChart();
  }

  /**
   * Render the world grid with water background and entity circles.
   */
  _renderWorld() {
    const g = this.worldGfx;
    g.clear();
    // Water background
    g.fillStyle(COLORS.water, 1);
    const worldW = this.cellSize * GRID_WIDTH;
    const worldH = this.cellSize * GRID_HEIGHT;
    g.fillRect(this.offsetX, this.offsetY, worldW, worldH);
    // Border
    g.lineStyle(1, 0x1a4a6a, 0.6);
    g.strokeRect(this.offsetX, this.offsetY, worldW, worldH);

    if (!this.sim) return;
    const cs = this.cellSize;
    const fishR = cs * 0.35;
    const sharkR = cs * 0.45;
    for (const e of this.sim.entities.values()) {
      const cx = this.offsetX + e.x * cs + cs / 2;
      const cy = this.offsetY + e.y * cs + cs / 2;
      if (e instanceof Fish) {
        g.fillStyle(COLORS.fish, 1);
        g.fillCircle(cx, cy, fishR);
      } else if (e instanceof Shark) {
        g.fillStyle(COLORS.shark, 1);
        g.fillCircle(cx, cy, sharkR);
      }
    }
  }

  /**
   * Render the population history chart.
   */
  _renderChart() {
    if (!this.sim || !this._chartBounds) return;
    const b = this._chartBounds;
    Chart.render(this.chartGfx, this.sim.getHistory(), b.x, b.y, b.w, b.h);
  }

  /**
   * Update stats text display.
   */
  _updateStats() {
    if (!this.sim) return;
    const counts = this.sim.getCounts();
    const status = this._getStatusText(counts);
    this.statTexts[0].setText(`Chronon: ${this.sim.chronon}`);
    this.statTexts[1].setText(`Fish: ${counts.fish}`);
    this.statTexts[2].setText(`Sharks: ${counts.sharks}`);
    this.statTexts[3].setText(`Status: ${status}`);
  }

  /**
   * Get status text based on counts and running state.
   * @param {{fish:number, sharks:number}} counts
   * @returns {string}
   */
  _getStatusText(counts) {
    if (counts.fish === 0 && counts.sharks === 0) return 'Ecosystem collapsed';
    if (counts.fish === 0) return 'Fish extinct';
    if (counts.sharks === 0) return 'Sharks extinct';
    return this.running ? 'Running' : 'Paused';
  }

  /**
   * Check for terminal state and auto-pause.
   */
  _checkTerminal() {
    const c = this.sim.getCounts();
    const isTerminal = c.fish === 0 || c.sharks === 0;
    if (isTerminal && !this.terminal) {
      this.terminal = true;
      this.running = false;
    }
  }

  /**
   * Update button enabled/selected states.
   */
  _updateButtons() {
    for (const btn of this.speedButtons) {
      const val = parseInt(btn.label, 10);
      btn.setSelected(val === this.speed);
    }
    if (this.terminal) {
      this.playButton.setEnabled(false);
      this.playButton.text.setText('Play');
      this.stepButton.setEnabled(false);
    } else if (this.running) {
      this.playButton.setEnabled(true);
      this.playButton.text.setText('Pause');
      this.stepButton.setEnabled(false);
    } else {
      this.playButton.setEnabled(true);
      this.playButton.text.setText('Play');
      this.stepButton.setEnabled(true);
    }
  }

  /**
   * Handle speed selection.
   * @param {number} s
   */
  _onSpeed(s) {
    this.speed = s;
    this._updateButtons();
  }

  /**
   * Handle Play/Pause toggle.
   */
  _onPlayPause() {
    if (this.terminal) return;
    this.running = !this.running;
    this._updateStats();
    this._updateButtons();
  }

  /**
   * Handle Step — advance exactly one chronon while paused.
   */
  _onStep() {
    if (this.running || this.terminal) return;
    this.sim.step();
    this._checkTerminal();
    this._updateStats();
    this._updateButtons();
    this._renderWorld();
    this._renderChart();
  }

  /**
   * Handle Reset — new random world, chronon 0, clear history, resume at selected speed.
   */
  _onReset() {
    this.sim.reset();
    this.terminal = false;
    this.running = true;
    this.acc = 0;
    this._updateStats();
    this._updateButtons();
    this._renderWorld();
    this._renderChart();
  }

  /**
   * Phaser update loop — advances simulation by speed chronons/sec.
   * @param {number} _time
   * @param {number} delta - ms since last frame
   */
  update(_time, delta) {
    if (!this.sim || !this.running || this.terminal) return;
    this.acc += delta;
    const interval = 1000 / this.speed;
    let steps = 0;
    const maxSteps = 60;
    while (this.acc >= interval && steps < maxSteps) {
      this.sim.step();
      this.acc -= interval;
      steps++;
      this._checkTerminal();
      if (this.terminal) {
        this.acc = 0;
        break;
      }
    }
    // If we hit maxSteps, drop remaining acc to avoid spiral
    if (steps >= maxSteps) this.acc = 0;

    this._updateStats();
    this._updateButtons();
    this._renderWorld();
    this._renderChart();
  }
}
