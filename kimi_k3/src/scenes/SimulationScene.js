import { WatorSimulation } from '../simulation/WatorSimulation.js';
import { Button } from '../ui/Button.js';
import {
  SPEEDS,
  DEFAULT_SPEED_INDEX,
  HISTORY_LENGTH,
  COLOR_WATER,
  COLOR_FISH,
  COLOR_SHARK,
  COLOR_TEXT,
  MIN_WORLD_WIDTH_WIDE,
  STATS_PANEL_WIDTH,
  CONTROLS_PANEL_WIDTH,
  CHART_HEIGHT,
  PANEL_MARGIN,
} from '../config.js';

const HEX_FISH = '#33cc55';
const HEX_SHARK = '#3388ff';
const BTN_HEIGHT = 36;
const BTN_GAP = 8;

/**
 * Main scene: owns the simulation, run/speed/terminal state, the
 * population history, all Phaser-native UI, rendering, and layout
 * (design D3).
 */
export class SimulationScene extends Phaser.Scene {
  constructor() {
    super('simulation');
  }

  /** Creates simulation, graphics layers, UI, and initial layout. */
  create() {
    this.sim = new WatorSimulation();
    this.running = true; // CS-R3 / AC 1: start running immediately
    /** @type {string|null} */
    this.terminal = null;
    this.speedIndex = DEFAULT_SPEED_INDEX;
    this.accumulator = 0;
    /** @type {Array<[number, number]>} [fish, sharks] samples (PC-R2) */
    this.history = [];
    this.recordSample();

    this.worldGfx = this.add.graphics();
    this.chartGfx = this.add.graphics();
    this.statsText = this.add.text(0, 0, '', {
      fontFamily: 'sans-serif',
      fontSize: '18px',
      color: COLOR_TEXT,
      lineSpacing: 8,
    });

    this.speedButtons = SPEEDS.map(
      (s, i) => new Button(this, `${s}x`, () => this.setSpeed(i)),
    );
    this.playButton = new Button(this, 'Pause', () => this.togglePlay());
    this.stepButton = new Button(this, 'Step', () => this.doStep());
    this.resetButton = new Button(this, 'Reset', () => this.doReset());

    this.scale.on('resize', () => this.layout());
    this.layout();
    this.refreshUI();
  }

  /**
   * Advances the simulation according to the selected speed using a
   * simple accumulator; no catch-up compensation when the browser
   * throttles (CS-R4 / AC 34, 48, 49).
   * @param {number} time
   * @param {number} delta ms since last frame
   */
  update(time, delta) {
    if (!this.running || this.terminal) return;
    this.accumulator += delta;
    const msPerChronon = 1000 / SPEEDS[this.speedIndex];
    let advanced = false;
    while (this.accumulator >= msPerChronon) {
      this.accumulator -= msPerChronon;
      this.advanceOne();
      advanced = true;
      if (this.terminal) break;
    }
    if (advanced) {
      this.renderWorld();
      this.renderChart();
      this.refreshUI();
    }
  }

  /**
   * Advances exactly one chronon, records a history sample, and checks
   * for extinction (AC 35: manual steps also record a sample, PC-R2).
   */
  advanceOne() {
    const result = this.sim.stepChronon();
    this.recordSample();
    if (result.terminal) {
      this.terminal = result.terminal;
      this.running = false; // CS-R7 / AC 37: auto-pause on extinction
    }
  }

  /** Appends one population sample, keeping the rolling window (PC-R2 / AC 45). */
  recordSample() {
    const { fish, sharks } = this.sim.counts();
    this.history.push([fish, sharks]);
    if (this.history.length > HISTORY_LENGTH) {
      this.history.splice(0, this.history.length - HISTORY_LENGTH);
    }
  }

  /**
   * Selects a new speed; running state is unaffected (CS-R4.1, CS-R5.2).
   * @param {number} index index into SPEEDS
   */
  setSpeed(index) {
    this.speedIndex = index;
    this.accumulator = 0;
    this.refreshUI();
  }

  /** Toggles play/pause unless terminal (CS-R7.2 / AC 43). */
  togglePlay() {
    if (this.terminal) return;
    this.running = !this.running;
    this.accumulator = 0;
    this.refreshUI();
  }

  /** Advances exactly one chronon while paused (CS-R5 / AC 35). */
  doStep() {
    if (this.running || this.terminal) return;
    this.advanceOne();
    this.renderWorld();
    this.renderChart();
    this.refreshUI();
  }

  /** Resets to a new random world and resumes at the selected speed (CS-R6 / AC 36). */
  doReset() {
    this.sim.reset();
    this.history = [];
    this.recordSample();
    this.terminal = null;
    this.running = true;
    this.accumulator = 0;
    this.renderWorld();
    this.renderChart();
    this.refreshUI();
  }

  /**
   * Computes the layout for the current window size: wide mode when the
   * world can keep at least MIN_WORLD_WIDTH_WIDE px between the side
   * panels, otherwise narrow mode (AS-R5 / AC 51, 52; design D5).
   */
  layout() {
    const W = this.scale.width;
    const H = this.scale.height;
    const chartH = Math.min(CHART_HEIGHT, Math.floor(H * 0.25));
    const wide =
      W - STATS_PANEL_WIDTH - CONTROLS_PANEL_WIDTH - 4 * PANEL_MARGIN >=
      MIN_WORLD_WIDTH_WIDE;

    if (wide) {
      const worldX = STATS_PANEL_WIDTH + 2 * PANEL_MARGIN;
      const worldW = W - STATS_PANEL_WIDTH - CONTROLS_PANEL_WIDTH - 4 * PANEL_MARGIN;
      const worldH = H - chartH - 2 * PANEL_MARGIN;
      this.worldRect = this.fitRect(worldX, PANEL_MARGIN, worldW, worldH);
      this.statsRect = { x: PANEL_MARGIN, y: PANEL_MARGIN, w: STATS_PANEL_WIDTH, h: worldH };
      this.controlsRect = {
        x: W - CONTROLS_PANEL_WIDTH - PANEL_MARGIN,
        y: PANEL_MARGIN,
        w: CONTROLS_PANEL_WIDTH,
        h: worldH,
      };
    } else {
      // Narrow mode (Option B): world full-width on top, stats left /
      // controls right below, chart full-width at the bottom (AC 52).
      const controlsH = 5 * BTN_HEIGHT + 4 * BTN_GAP + 8;
      const statsH = 120;
      const belowH = Math.max(controlsH, statsH) + 2 * PANEL_MARGIN;
      const worldH = Math.max(120, H - belowH - chartH - 3 * PANEL_MARGIN);
      this.worldRect = this.fitRect(PANEL_MARGIN, PANEL_MARGIN, W - 2 * PANEL_MARGIN, worldH);
      const belowY = this.worldRect.y + this.worldRect.h + PANEL_MARGIN;
      const halfW = Math.floor((W - 3 * PANEL_MARGIN) / 2);
      this.statsRect = { x: PANEL_MARGIN, y: belowY, w: halfW, h: belowH - PANEL_MARGIN };
      this.controlsRect = {
        x: 2 * PANEL_MARGIN + halfW,
        y: belowY,
        w: W - 3 * PANEL_MARGIN - halfW,
        h: belowH - PANEL_MARGIN,
      };
    }
    this.chartRect = { x: 0, y: H - chartH, w: W, h: chartH };

    this.placeControls();
    this.renderWorld();
    this.renderChart();
    this.refreshUI();
  }

  /**
   * Fits a rectangle of the world's aspect ratio into the given box,
   * centered (RE-R4 / AC 8).
   * @returns {{x: number, y: number, w: number, h: number}}
   */
  fitRect(x, y, w, h) {
    const aspect = this.sim.width / this.sim.height;
    let fw = w;
    let fh = w / aspect;
    if (fh > h) {
      fh = h;
      fw = h * aspect;
    }
    return { x: x + (w - fw) / 2, y: y + (h - fh) / 2, w: fw, h: fh };
  }

  /** Positions all control buttons within the controls panel (CS-R1 / AC 32, 33). */
  placeControls() {
    const { x, y, w } = this.controlsRect;
    const gap = 6;
    const speedW = Math.floor((w - 4 * gap) / 5);
    this.speedButtons.forEach((b, i) => {
      b.setBounds(x + i * (speedW + gap), y, i === 4 ? w - 4 * (speedW + gap) : speedW, BTN_HEIGHT);
    });
    this.playButton.setBounds(x, y + (BTN_HEIGHT + BTN_GAP), w, BTN_HEIGHT);
    this.stepButton.setBounds(x, y + 2 * (BTN_HEIGHT + BTN_GAP), w, BTN_HEIGHT);
    this.resetButton.setBounds(x, y + 3 * (BTN_HEIGHT + BTN_GAP), w, BTN_HEIGHT);
  }

  /**
   * Redraws the world in a single Graphics object: water background,
   * green fish circles, larger blue shark circles, no grid lines
   * (RE-R1, RE-R2, RE-R3 / AC 28, 29, 50).
   */
  renderWorld() {
    const { x, y, w, h } = this.worldRect;
    const cellW = w / this.sim.width;
    const cellH = h / this.sim.height;
    const fishR = Math.max(1, Math.min(cellW, cellH) * 0.35);
    const sharkR = Math.max(1.5, Math.min(cellW, cellH) * 0.48);
    const g = this.worldGfx;
    g.clear();
    g.fillStyle(COLOR_WATER, 1);
    g.fillRect(x, y, w, h);
    for (let i = 0; i < this.sim.grid.length; i++) {
      const e = this.sim.grid[i];
      if (!e) continue;
      const cx = x + (i % this.sim.width) * cellW + cellW / 2;
      const cy = y + Math.floor(i / this.sim.width) * cellH + cellH / 2;
      if (e.type === 'fish') {
        g.fillStyle(COLOR_FISH, 1);
        g.fillCircle(cx, cy, fishR);
      } else {
        g.fillStyle(COLOR_SHARK, 1);
        g.fillCircle(cx, cy, sharkR);
      }
    }
  }

  /**
   * Redraws the rolling population history across the bottom: green
   * fish line, blue shark line, no titles or labels
   * (PC-R1, PC-R3 / AC 44, 46, 47).
   */
  renderChart() {
    const { x, y, w, h } = this.chartRect;
    const g = this.chartGfx;
    g.clear();
    g.fillStyle(0x041f38, 1);
    g.fillRect(x, y, w, h);
    const n = this.history.length;
    if (n < 2) return;
    let max = 1;
    for (const [f, s] of this.history) max = Math.max(max, f, s);
    const plotH = h - 16;
    const stepX = w / (HISTORY_LENGTH - 1);
    const startX = x + w - (n - 1) * stepX;
    /**
     * Draws one population series.
     * @param {number} idx 0 = fish, 1 = sharks
     * @param {number} color
     */
    const drawSeries = (idx, color) => {
      g.lineStyle(2, color, 1);
      g.beginPath();
      for (let i = 0; i < n; i++) {
        const px = startX + i * stepX;
        const py = y + 8 + plotH - (this.history[i][idx] / max) * plotH;
        if (i === 0) g.moveTo(px, py);
        else g.lineTo(px, py);
      }
      g.strokePath();
    };
    drawSeries(0, COLOR_FISH);
    drawSeries(1, COLOR_SHARK);
  }

  /**
   * Updates stats text, status line, and button states/labels
   * (CS-R2, CS-R4.2, CS-R7 / AC 30, 34, 37-43).
   */
  refreshUI() {
    const { fish, sharks } = this.sim.counts();
    const status = this.terminal ?? (this.running ? 'Running' : 'Paused');
    this.statsText.setText(
      `Chronon: ${this.sim.chronon}\n` +
      `Fish:    ${fish}\n` +
      `Sharks:  ${sharks}\n` +
      `Status:  ${status}`,
    );
    this.statsText.setPosition(this.statsRect.x, this.statsRect.y);
    this.speedButtons.forEach((b, i) => b.setActive(i === this.speedIndex));
    this.playButton.setLabel(this.running ? 'Pause' : 'Play');
    this.playButton.setEnabled(!this.terminal); // AC 43: Play locked when terminal
    this.stepButton.setEnabled(!this.running && !this.terminal); // AC 34, 35
  }
}
