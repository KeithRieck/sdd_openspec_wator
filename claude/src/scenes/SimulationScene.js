import { CONFIG } from '../config.js';
import { WatorSimulation } from '../simulation/WatorSimulation.js';
import { Layout } from '../ui/Layout.js';
import { PopulationHistory } from '../ui/PopulationHistory.js';

const MAX_STEPS_PER_FRAME = 64;

/**
 * Main scene: owns the simulation, draws the whole window with Phaser
 * `Graphics`, and provides Phaser-native controls.
 *
 * Drives a {@link WatorSimulation} engine (which knows nothing about Phaser),
 * renders the world, statistics, and a population-history chart, and lays out
 * stats on the left, world in the center, controls on the right, and the chart
 * across the bottom. Stepping is paced by a chronon accumulator on Phaser's
 * update loop with no catch-up compensation when the tab is throttled.
 */
export class SimulationScene extends Phaser.Scene {
  constructor() {
    super('SimulationScene');
  }

  /** Builds the engine, graphics layers, text, and controls, then starts running. */
  create() {
    this.sim = new WatorSimulation(CONFIG);
    this.layout = new Layout(CONFIG);
    this.history = new PopulationHistory(CONFIG.historyWindow);

    this.speed = CONFIG.defaultSpeed;
    this.running = true;
    this.terminal = false;
    this.statusText = 'Running';
    this.accumulator = 0;

    this.panelGfx = this.add.graphics();
    this.worldGfx = this.add.graphics();
    this.chartGfx = this.add.graphics();

    this.titleLabel = this.add.text(0, 0, 'Wa·Tor', {
      fontFamily: 'system-ui, sans-serif',
      fontSize: '20px',
      color: CONFIG.textColor,
      fontStyle: 'bold',
    });
    this.statsLabel = this.add.text(0, 0, '', {
      fontFamily: 'ui-monospace, monospace',
      fontSize: '15px',
      color: CONFIG.textColor,
      lineSpacing: 7,
    });

    /** @type {Array<Object>} */
    this.buttons = [];
    this.buildControls();

    this.history.record(this.sim.fishCount(), this.sim.sharkCount());

    this.scale.on('resize', this.onResize, this);
    this.onResize(this.scale.gameSize);
  }

  /**
   * Creates the Phaser-native control buttons once: a horizontal speed row
   * (1x/5x/10x/30x/60x) and the Play/Pause, Step, and Reset action buttons, each
   * action on its own row. Positioning happens later in {@link onResize}.
   */
  buildControls() {
    for (const value of CONFIG.speedOptions) {
      this.buttons.push(
        this.makeButton(`${value}x`, 'speed', () => this.setSpeed(value), {
          speed: value,
        })
      );
    }
    this.playButton = this.makeButton('Pause', 'action', () =>
      this.togglePlay()
    );
    this.stepButton = this.makeButton('Step', 'action', () => this.stepOnce());
    this.resetButton = this.makeButton('Reset', 'action', () => this.reset());
    this.buttons.push(this.playButton, this.stepButton, this.resetButton);
  }

  /**
   * Creates one interactive button (background rectangle plus centered label).
   * @param {string} text
   * @param {('speed'|'action')} group
   * @param {() => void} onClick
   * @param {Object} [meta]
   * @returns {Object}
   */
  makeButton(text, group, onClick, meta = {}) {
    const rect = this.add
      .rectangle(0, 0, 10, 10, CONFIG.buttonColor)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });
    const label = this.add
      .text(0, 0, text, {
        fontFamily: 'system-ui, sans-serif',
        fontSize: '15px',
        color: CONFIG.textColor,
      })
      .setOrigin(0.5);
    const button = { rect, label, group, onClick, enabled: true, ...meta };
    rect.on('pointerdown', () => {
      if (button.enabled) onClick();
    });
    return button;
  }

  /**
   * Recomputes the layout and repositions every element for the new canvas size
   * without changing the simulation grid dimensions, then redraws.
   * @param {{width: number, height: number}} size
   */
  onResize(size) {
    const width = size.width;
    const height = size.height;
    if (!width || !height) return;
    this.layout.recompute(width, height);

    this.titleLabel.setPosition(this.layout.stats.x + 14, 16);
    this.statsLabel.setPosition(this.layout.stats.x + 14, 56);

    this.layoutControls();
    this.render();
  }

  /**
   * Positions the speed row and action buttons inside the controls panel: speed
   * buttons share one row across the panel width; action buttons stack below,
   * each on its own full-width row.
   */
  layoutControls() {
    const c = this.layout.controls;
    const pad = 14;
    const gap = 8;
    const innerX = c.x + pad;
    const innerW = c.w - pad * 2;
    let y = c.y + pad + 12;

    const speed = this.buttons.filter((b) => b.group === 'speed');
    const sw = (innerW - gap * (speed.length - 1)) / speed.length;
    const sh = 34;
    speed.forEach((b, i) => {
      this.placeButton(b, innerX + i * (sw + gap) + sw / 2, y + sh / 2, sw, sh);
    });
    y += sh + gap * 2;

    const ah = 44;
    for (const b of [this.playButton, this.stepButton, this.resetButton]) {
      this.placeButton(b, innerX + innerW / 2, y + ah / 2, innerW, ah);
      y += ah + gap;
    }
  }

  /**
   * Centers a button's rectangle and label at a point and updates its hit area.
   * @param {Object} button
   * @param {number} cx
   * @param {number} cy
   * @param {number} w
   * @param {number} h
   */
  placeButton(button, cx, cy, w, h) {
    button.rect.setPosition(cx, cy).setSize(w, h);
    if (button.rect.input) button.rect.input.hitArea.setTo(0, 0, w, h);
    button.label.setPosition(cx, cy);
  }

  /**
   * Phaser update loop. Accumulates fractional chronons at the selected speed
   * and runs whole steps, capping steps per frame so a throttled or
   * backgrounded tab does not trigger catch-up compensation.
   * @param {number} _time
   * @param {number} delta Milliseconds since the previous frame.
   */
  update(_time, delta) {
    if (!this.running || this.terminal) return;
    this.accumulator += (delta / 1000) * this.speed;

    let stepped = 0;
    while (this.accumulator >= 1 && !this.terminal && stepped < MAX_STEPS_PER_FRAME) {
      this.advance();
      this.accumulator -= 1;
      stepped++;
    }
    // No catch-up: discard any backlog beyond what this frame ran.
    if (this.accumulator > 1) this.accumulator = 0;
    if (stepped > 0) this.render();
  }

  /** Advances the engine one chronon, records history, and checks extinction. */
  advance() {
    this.sim.step();
    this.history.record(this.sim.fishCount(), this.sim.sharkCount());
    this.checkExtinction();
  }

  /**
   * Detects extinction and, if reached, auto-pauses the run and sets the
   * terminal status message.
   */
  checkExtinction() {
    const fish = this.sim.fishCount();
    const sharks = this.sim.sharkCount();
    if (fish > 0 && sharks > 0) return;

    this.terminal = true;
    this.running = false;
    if (fish === 0 && sharks === 0) this.statusText = 'Ecosystem collapsed';
    else if (sharks === 0) this.statusText = 'Sharks extinct';
    else this.statusText = 'Fish extinct';
    this.refreshControls();
  }

  /** Toggles between running and paused (no effect once terminal). */
  togglePlay() {
    if (this.terminal) return;
    this.running = !this.running;
    this.statusText = this.running ? 'Running' : 'Paused';
    this.refreshControls();
    this.render();
  }

  /** Advances exactly one chronon while paused and not terminal. */
  stepOnce() {
    if (this.running || this.terminal) return;
    this.advance();
    this.render();
  }

  /**
   * Selects a speed. A speed change never resumes a paused or terminal run.
   * @param {number} value
   */
  setSpeed(value) {
    this.speed = value;
    this.refreshControls();
    this.render();
  }

  /**
   * Resets to a fresh random world at chronon zero, clears status and history,
   * and resumes running at the currently selected speed.
   */
  reset() {
    this.sim.reset();
    this.history.clear();
    this.history.record(this.sim.fishCount(), this.sim.sharkCount());
    this.terminal = false;
    this.running = true;
    this.statusText = 'Running';
    this.accumulator = 0;
    this.refreshControls();
    this.render();
  }

  /** Updates button colors, labels, and enabled states from the run state. */
  refreshControls() {
    if (this.playButton) {
      this.playButton.label.setText(this.running ? 'Pause' : 'Play');
      this.setButtonEnabled(this.playButton, !this.terminal);
    }
    if (this.stepButton) {
      this.setButtonEnabled(this.stepButton, !this.running && !this.terminal);
    }
    for (const b of this.buttons) {
      if (b.group !== 'speed') continue;
      const active = b.speed === this.speed;
      b.rect.setFillStyle(active ? CONFIG.buttonActiveColor : CONFIG.buttonColor);
    }
  }

  /**
   * Enables or disables a button, dimming the disabled state.
   * @param {Object} button
   * @param {boolean} enabled
   */
  setButtonEnabled(button, enabled) {
    button.enabled = enabled;
    button.rect.setFillStyle(
      enabled ? CONFIG.buttonColor : CONFIG.buttonDisabledColor
    );
    button.label.setAlpha(enabled ? 1 : 0.4);
  }

  /** Redraws panels, the world, stats text, the chart, and control states. */
  render() {
    this.drawPanels();
    this.drawWorld();
    this.drawStats();
    this.drawChart();
    this.refreshControls();
  }

  /** Draws the stats and controls panel backgrounds and the world border. */
  drawPanels() {
    const g = this.panelGfx;
    g.clear();
    g.fillStyle(CONFIG.panelColor, 1);
    const { stats, controls, world } = this.layout;
    g.fillRect(stats.x, stats.y, stats.w, stats.h);
    g.fillRect(controls.x, controls.y, controls.w, controls.h);
    g.lineStyle(1, CONFIG.worldBorderColor, 1);
    g.strokeRect(
      this.layout.worldOffsetX,
      this.layout.worldOffsetY,
      this.layout.cellSize * CONFIG.gridWidth,
      this.layout.cellSize * CONFIG.gridHeight
    );
  }

  /**
   * Draws the world in a single Graphics pass: water background, then fish as
   * green circles and sharks as slightly larger blue circles. No grid lines, no
   * sprites, no movement animation.
   */
  drawWorld() {
    const g = this.worldGfx;
    const cell = this.layout.cellSize;
    const ox = this.layout.worldOffsetX;
    const oy = this.layout.worldOffsetY;
    g.clear();
    g.fillStyle(CONFIG.waterColor, 1);
    g.fillRect(ox, oy, cell * CONFIG.gridWidth, cell * CONFIG.gridHeight);

    const fishR = Math.max(0.5, cell * 0.4);
    const sharkR = Math.max(0.6, cell * 0.5);
    this.sim.forEachEntity((e) => {
      const cx = ox + e.x * cell + cell / 2;
      const cy = oy + e.y * cell + cell / 2;
      if (e.type === 'fish') {
        g.fillStyle(CONFIG.fishColor, 1);
        g.fillCircle(cx, cy, fishR);
      } else {
        g.fillStyle(CONFIG.sharkColor, 1);
        g.fillCircle(cx, cy, sharkR);
      }
    });
  }

  /** Updates the left-side statistics text (Chronon, Fish, Sharks, Status). */
  drawStats() {
    this.statsLabel.setText(
      [
        'Chronon',
        `  ${this.sim.chronon}`,
        '',
        'Fish',
        `  ${this.sim.fishCount()}`,
        '',
        'Sharks',
        `  ${this.sim.sharkCount()}`,
        '',
        'Status',
        `  ${this.statusText}`,
      ].join('\n')
    );
  }

  /**
   * Draws the population-history chart across the bottom: fish line in green,
   * shark line in blue, scaled to the window's peak population, with no titles
   * or text labels.
   */
  drawChart() {
    const g = this.chartGfx;
    const r = this.layout.chart;
    g.clear();
    g.fillStyle(CONFIG.panelColor, 1);
    g.fillRect(r.x, r.y, r.w, r.h);

    if (this.history.length < 2) return;
    const pad = 10;
    const plotW = r.w - pad * 2;
    const plotH = r.h - pad * 2;
    const span = Math.max(1, this.history.capacity - 1);

    let max = 1;
    this.history.forEach((s) => {
      if (s.fish > max) max = s.fish;
      if (s.sharks > max) max = s.sharks;
    });

    const xAt = (i) => r.x + pad + (i / span) * plotW;
    const yAt = (v) => r.y + pad + plotH - (v / max) * plotH;

    this.drawSeries(g, CONFIG.fishColor, (s) => s.fish, xAt, yAt);
    this.drawSeries(g, CONFIG.sharkColor, (s) => s.sharks, xAt, yAt);
  }

  /**
   * Strokes one population series as a polyline.
   * @param {Phaser.GameObjects.Graphics} g
   * @param {number} color
   * @param {(sample: Object) => number} pick
   * @param {(index: number) => number} xAt
   * @param {(value: number) => number} yAt
   */
  drawSeries(g, color, pick, xAt, yAt) {
    g.lineStyle(2, color, 1);
    g.beginPath();
    this.history.forEach((s, i) => {
      const x = xAt(i);
      const y = yAt(pick(s));
      if (i === 0) g.moveTo(x, y);
      else g.lineTo(x, y);
    });
    g.strokePath();
  }
}
