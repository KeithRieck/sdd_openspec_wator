import { COLORS, DEFAULT_SPEED, LAYOUT } from '../config.js';
import { WatorSimulation } from '../simulation/WatorSimulation.js';
import { ControlPanel } from '../ui/ControlPanel.js';
import { PopulationChart } from '../ui/PopulationChart.js';
import { StatsPanel } from '../ui/StatsPanel.js';
import { WorldRenderer } from '../ui/WorldRenderer.js';

/**
 * Main scene: owns run-state, pacing, layout, and wires UI to the engine.
 * Spec: simulation-ui R1, R5–R10; app-shell R3.
 */
export class SimulationScene extends Phaser.Scene {
  constructor() {
    super('SimulationScene');
    /** @type {WatorSimulation|null} */
    this.simulation = null;
    /** @type {StatsPanel|null} */
    this.statsPanel = null;
    /** @type {ControlPanel|null} */
    this.controlPanel = null;
    /** @type {PopulationChart|null} */
    this.chart = null;
    /** @type {WorldRenderer|null} */
    this.worldRenderer = null;

    this.running = true;
    this.terminal = false;
    this.speed = DEFAULT_SPEED;
    this.accumulator = 0;
    this.needsRender = true;
  }

  /**
   * Build simulation, UI components, and event wiring.
   */
  create() {
    this.cameras.main.setBackgroundColor(COLORS.background);
    this.simulation = new WatorSimulation();

    this.statsPanel = new StatsPanel(this);
    this.controlPanel = new ControlPanel(this);
    this.chart = new PopulationChart(this);
    this.worldRenderer = new WorldRenderer(this);
    this.worldRenderer.setGridSize(this.simulation.width, this.simulation.height);
    this.chart.setYMax(this.simulation.width * this.simulation.height);

    this.running = true;
    this.terminal = false;
    this.speed = DEFAULT_SPEED;
    this.accumulator = 0;

    this.controlPanel.setRunning(this.running);
    this.controlPanel.setTerminal(this.terminal);
    this.controlPanel.setSpeed(this.speed);

    this.controlPanel.onPlayPause(() => this.#togglePlayPause());
    this.controlPanel.onStep(() => this.#stepOnce());
    this.controlPanel.onReset(() => this.#resetSimulation());
    this.controlPanel.onSpeed((speed) => {
      this.speed = speed;
      this.controlPanel.setSpeed(speed);
    });

    this.scale.on('resize', this.#handleResize, this);
    this.#layout();
    this.#refreshView();
  }

  /**
   * Advance the simulation according to selected chronons/second while running.
   * Spec: simulation-ui R10, R5–R7.
   * @param {number} _time
   * @param {number} delta
   */
  update(_time, delta) {
    if (!this.simulation) {
      return;
    }

    if (this.running && !this.terminal) {
      // No catch-up for hidden/throttled tabs: clamp delta contribution modestly
      // only to avoid a single huge frame stepping thousands of chronons after resume.
      const capped = Math.min(delta, 100);
      this.accumulator += (capped / 1000) * this.speed;

      let guard = 0;
      while (this.accumulator >= 1 && !this.terminal && guard < 120) {
        this.accumulator -= 1;
        this.simulation.step();
        this.#afterStep();
        guard += 1;
      }
      if (this.terminal) {
        this.accumulator = 0;
      }
    }

    if (this.needsRender) {
      this.#refreshView();
      this.needsRender = false;
    }
  }

  /**
   * Recompute wide layout regions and world scale.
   */
  #layout() {
    const width = this.scale.width;
    const height = this.scale.height;
    const pad = LAYOUT.padding;
    const gap = LAYOUT.gap;
    const statsW = LAYOUT.statsWidth;
    const controlsW = LAYOUT.controlsWidth;
    const chartH = LAYOUT.chartHeight;

    const topH = Math.max(120, height - pad * 2 - gap - chartH);
    const worldW = Math.max(50, width - pad * 2 - gap * 2 - statsW - controlsW);
    const worldH = topH;

    const statsX = pad;
    const statsY = pad;
    const worldX = statsX + statsW + gap;
    const worldY = pad;
    const controlsX = worldX + worldW + gap;
    const controlsY = pad;
    const chartX = pad;
    const chartY = pad + topH + gap;
    const chartW = width - pad * 2;

    // Preserve world aspect ratio inside the world region from live grid size.
    const cols = this.simulation?.width ?? 100;
    const rows = this.simulation?.height ?? 70;
    const gridAspect = cols / rows;
    let drawW = worldW;
    let drawH = drawW / gridAspect;
    if (drawH > worldH) {
      drawH = worldH;
      drawW = drawH * gridAspect;
    }
    const drawX = worldX + (worldW - drawW) / 2;
    const drawY = worldY + (worldH - drawH) / 2;

    this.statsPanel.setBounds(statsX, statsY, statsW, topH);
    this.controlPanel.setBounds(controlsX, controlsY, controlsW, topH);
    this.worldRenderer.setBounds(drawX, drawY, drawW, drawH);
    this.chart.setBounds(chartX, chartY, chartW, chartH);
    this.needsRender = true;
  }

  /**
   * @param {Phaser.Structs.Size} gameSize
   */
  #handleResize(gameSize) {
    if (gameSize) {
      this.cameras.main.setSize(gameSize.width, gameSize.height);
    }
    this.#layout();
    this.#refreshView();
  }

  #togglePlayPause() {
    if (this.terminal) {
      return;
    }
    this.running = !this.running;
    if (!this.running) {
      this.accumulator = 0;
    }
    this.controlPanel.setRunning(this.running);
    this.needsRender = true;
  }

  #stepOnce() {
    if (this.running || this.terminal || !this.simulation) {
      return;
    }
    this.simulation.step();
    this.#afterStep();
    this.needsRender = true;
  }

  #resetSimulation() {
    if (!this.simulation) {
      return;
    }
    this.simulation.reset();
    this.running = true;
    this.terminal = false;
    this.accumulator = 0;
    this.controlPanel.setTerminal(false);
    this.controlPanel.setRunning(true);
    this.controlPanel.setSpeed(this.speed);
    this.needsRender = true;
  }

  #afterStep() {
    const status = this.simulation.getExtinctionStatus();
    if (status) {
      this.terminal = true;
      this.running = false;
      this.controlPanel.setTerminal(true);
      this.controlPanel.setRunning(false);
    }
    this.needsRender = true;
  }

  #refreshView() {
    if (!this.simulation) {
      return;
    }

    const extinction = this.simulation.getExtinctionStatus();
    let statusLabel = 'Running';
    if (extinction) {
      statusLabel = extinction;
    } else if (!this.running) {
      statusLabel = 'Paused';
    }

    this.statsPanel.update({
      chronon: this.simulation.getChronon(),
      fish: this.simulation.getFishCount(),
      sharks: this.simulation.getSharkCount(),
      status: statusLabel
    });

    this.worldRenderer.render(this.simulation.getRenderEntities());
    this.chart.update(this.simulation.getHistory());
  }
}
