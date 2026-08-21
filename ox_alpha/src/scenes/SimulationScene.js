/**
 * @file SimulationScene: owns the world rendering, UI panels, and the
 * simulation lifecycle.
 */

// import Phaser from 'phaser';

import { SIM, SPEED, RENDER, UI } from '../config.js';
import { WatorSimulation } from '../simulation/WatorSimulation.js';
import { Fish } from '../simulation/Fish.js';
import { Shark } from '../simulation/Shark.js';
import { solveLayout } from '../ui/LayoutSolver.js';
import { StatsPanel } from '../ui/StatsPanel.js';
import { ControlPanel } from '../ui/ControlPanel.js';
import { HistoryChart } from '../ui/HistoryChart.js';

/**
 * The single scene that renders and controls the entire app window
 * (AC 5): world viewport in the center, stats left, controls right,
 * history chart bottom (AC 51), reflowed on narrow viewports (AC 52).
 *
 * Lifecycle (AC 1, 34-43): starts running at the default speed with no
 * landing page; supports pause/play, single-step while paused, speed
 * changes, reset, and terminal extinction auto-pause. Rendering uses
 * Phaser Graphics only (AC 50) with immediate per-chronon updates and
 * no movement animation (AC 29).
 */
export class SimulationScene extends Phaser.Scene {
  /**
   * Phaser scene key for this scene.
   *
   * @returns {string} Scene key.
   */
  static get sceneKey() {
    return 'SimulationScene';
  }

  /**
   * Creates the scene with its Phaser scene key.
   */
  constructor() {
    super(SimulationScene.sceneKey);
  }

  /**
   * Builds the initial simulation, panels, and graphics layers, then
   * starts running at the default speed (AC 1, 36).
   *
   * @returns {void}
   */
  create() {
    /** @type {WatorSimulation} The active simulation world. */
    this.sim = new WatorSimulation();
    /** @type {number} Selected speed multiplier (chronons per second). */
    this.speed = SPEED.default;
    /** @type {boolean} Whether the simulation is advancing. */
    this.running = true;
    /** @type {boolean} Whether a terminal extinction state was reached. */
    this.terminal = false;
    /** @type {number} Leftover frame time accumulator for speed pacing. */
    this.accumulator = 0;

    // Water is created first so it renders beneath the creature layer
    // (Phaser draws objects in creation order).
    /** @type {Phaser.GameObjects.Graphics} Water background layer. */
    this.waterGfx = this.add.graphics();
    /** @type {Phaser.GameObjects.Graphics} World creature drawing layer. */
    this.worldGfx = this.add.graphics();

    this.scale.on('resize', this.handleResize, this);

    this.buildPanels();
    this.applyLayout();
    this.refreshStats();
  }

  /**
   * Instantiates the stats, controls, and chart panels.
   *
   * @returns {void}
   */
  buildPanels() {
    const viewport = this.getViewport();
    const layout = solveLayout(viewport.width, viewport.height, this.sim.width, this.sim.height);
    /** @type {StatsPanel} Left-side population readouts. */
    this.statsPanel = new StatsPanel(this, layout.stats);
    /** @type {ControlPanel} Right-side action and speed controls. */
    this.controlPanel = new ControlPanel(
      this,
      layout.controls,
      {
        onTogglePlay: () => this.togglePlay(),
        onStep: () => this.stepOnce(),
        onReset: () => this.resetWorld(),
        onSpeed: (speed) => {
          this.speed = speed;
        },
      },
      this.speed
    );
    /** @type {HistoryChart} Bottom population history chart. */
    this.historyChart = new HistoryChart(this, layout.chart, this.sim.history);
  }

  /**
   * Returns the current viewport size from the Phaser scale manager.
   *
   * @returns {{width: number, height: number}} Viewport size in pixels.
   */
  getViewport() {
    return { width: this.scale.width, height: this.scale.height };
  }

  /**
   * Recomputes layout and re-renders everything (AC 9, 52). Called on
   * scene creation and browser resize; never changes grid dimensions.
   *
   * @returns {void}
   */
  applyLayout() {
    const viewport = this.getViewport();
    const layout = solveLayout(viewport.width, viewport.height, this.sim.width, this.sim.height);
    /** @type {{cell: number, offsetX: number, offsetY: number}} World scale. */
    this.worldScale = layout.worldScale;
    this.statsPanel.layout(layout.stats);
    this.controlPanel.layout(layout.controls);
    this.historyChart.layout(layout.chart);
    this.drawWorld();
  }

  /**
   * Resize event handler delegating to layout recomputation.
   *
   * @returns {void}
   */
  handleResize() {
    this.applyLayout();
  }

  /**
   * Advances the simulation according to the selected speed using a
   * frame-time accumulator (AC 48, design D6). Chronons per frame are
   * capped so a stalled tab does not trigger catch-up bursts (AC 49).
   *
   * @param {number} _time Total elapsed milliseconds (unused).
   * @param {number} delta Milliseconds since the previous frame.
   * @returns {void}
   */
  update(_time, delta) {
    if (!this.running || this.terminal) {
      return;
    }
    this.accumulator += delta;
    const interval = 1000 / this.speed;
    let steps = 0;
    while (this.accumulator >= interval && steps < SPEED.maxChrononsPerFrame) {
      this.accumulator -= interval;
      steps += 1;
    }
    if (this.accumulator > interval * SPEED.maxChrononsPerFrame) {
      this.accumulator = 0; // Drop backlog instead of catching up (AC 49).
    }
    for (let i = 0; i < steps; i++) {
      this.sim.step();
      if (this.checkTerminal()) {
        break;
      }
    }
    if (steps > 0) {
      this.drawWorld();
      this.historyChart.redraw();
      this.refreshStats();
    }
  }

  /**
   * Toggles between running and paused (AC 34-35, 42). Ignored while
   * terminal because Play is disabled (AC 43).
   *
   * @returns {void}
   */
  togglePlay() {
    if (this.terminal) {
      return;
    }
    this.running = !this.running;
    this.accumulator = 0;
    this.refreshStats();
  }

  /**
   * Advances exactly one chronon while paused (AC 35). No-op while
   * running because Step is disabled (AC 34).
   *
   * @returns {void}
   */
  stepOnce() {
    if (this.running || this.terminal) {
      return;
    }
    this.sim.step();
    this.checkTerminal();
    this.drawWorld();
    this.historyChart.redraw();
    this.refreshStats();
  }

  /**
   * Creates a fresh random world and resumes running at the selected
   * speed (AC 36): chronon 0, cleared extinction status and history.
   *
   * @returns {void}
   */
  resetWorld() {
    this.sim = new WatorSimulation();
    this.terminal = false;
    this.running = true;
    this.accumulator = 0;
    this.historyChart.history = this.sim.history;
    this.applyLayout();
    this.refreshStats();
  }

  /**
   * Detects terminal extinction states, auto-pauses, and records the
   * status (AC 37-40).
   *
   * @returns {boolean} True when a terminal state was just reached.
   */
  checkTerminal() {
    const pop = this.sim.getPopulation();
    if (pop.terminal) {
      this.terminal = true;
      this.running = false;
      this.lastStatus = pop.status;
      this.refreshStats();
      return true;
    }
    return false;
  }

  /**
   * Refreshes the stats panel and control enablement from current
   * state (AC 30, 34, 41-43).
   *
   * @returns {void}
   */
  refreshStats() {
    const pop = this.sim.getPopulation();
    const status = this.terminal ? this.lastStatus : this.running ? 'Running' : 'Paused';
    this.statsPanel.update({
      chronon: this.sim.chronon,
      fish: pop.fish,
      sharks: pop.sharks,
      status,
    });
    this.controlPanel.updateState({ running: this.running, terminal: this.terminal });
  }

  /**
   * Redraws the water background and all creatures as circles using
   * Phaser Graphics (AC 28, 50): green fish, larger blue sharks, no
   * grid lines, no sprites, no animation (AC 29).
   *
   * @returns {void}
   */
  drawWorld() {
    const { cell, offsetX, offsetY } = this.worldScale;
    const water = this.waterGfx;
    water.clear();
    water.fillStyle(RENDER.waterColor, 1);
    water.fillRect(offsetX, offsetY, cell * this.sim.width, cell * this.sim.height);

    const g = this.worldGfx;
    g.clear();
    const fishR = Math.max(1, cell * RENDER.fishRadiusFactor);
    const sharkR = Math.max(1, cell * RENDER.sharkRadiusFactor);
    for (const entity of this.sim.entities.values()) {
      const x = offsetX + (entity.pos % this.sim.width) * cell + cell / 2;
      const y = offsetY + Math.floor(entity.pos / this.sim.width) * cell + cell / 2;
      if (entity.type === Fish.prototype.type) {
        g.fillStyle(RENDER.fishColor, 1);
        g.fillCircle(x, y, fishR);
      } else if (entity.type === Shark.prototype.type) {
        g.fillStyle(RENDER.sharkColor, 1);
        g.fillCircle(x, y, sharkR);
      }
    }
  }
}
