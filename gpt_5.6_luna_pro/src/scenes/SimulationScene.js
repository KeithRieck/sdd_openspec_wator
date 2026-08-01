import { CONFIG } from '../config.js';
import { WatorSimulation } from '../simulation/WatorSimulation.js';
import { LayoutManager } from '../ui/LayoutManager.js';
import { StatsPanel } from '../ui/StatsPanel.js';
import { ControlsPanel } from '../ui/ControlsPanel.js';
import { PopulationChart } from '../ui/PopulationChart.js';

/** Phaser scene coordinating simulation playback and all native rendering. */
export class SimulationScene extends Phaser.Scene {
  /** Construct the simulation scene. */
  constructor() {
    super('SimulationScene');
    this.selectedSpeed = CONFIG.defaultSpeed;
    this.running = true;
    this.elapsedSeconds = 0;
  }

  /** Create model, graphics, panels, and initial running view. */
  create() {
    this.simulation = new WatorSimulation();
    this.worldGraphics = this.add.graphics();
    this.statsPanel = new StatsPanel(this);
    this.chart = new PopulationChart(this);
    this.controls = new ControlsPanel(this, {
      onSpeed: (speed) => { this.selectedSpeed = speed; this.redraw(); },
      onPlayPause: () => { if (!this.simulation.isTerminal()) this.running = !this.running; this.redraw(); },
      onStep: () => { if (!this.running && !this.simulation.isTerminal()) { this.simulation.advanceChronon(); this.redraw(); } },
      onReset: () => { this.simulation.reset(); this.running = true; this.elapsedSeconds = 0; this.redraw(); },
    });
    this.scale.on('resize', () => this.redraw());
    this.redraw();
  }

  /** Advance according to selected speed and redraw changed state. */
  update(_, delta) {
    if (!this.running || this.simulation.isTerminal()) return;
    this.elapsedSeconds += delta / 1000;
    const interval = 1 / this.selectedSpeed;
    let changed = false;
    while (this.elapsedSeconds >= interval) {
      this.elapsedSeconds -= interval;
      this.simulation.advanceChronon();
      changed = true;
      if (this.simulation.isTerminal()) {
        this.running = false;
        break;
      }
    }
    if (changed) this.redraw();
  }

  /** Redraw the world, statistics, controls, and chart immediately. */
  redraw() {
    if (!this.simulation) return;
    const { width, height } = this.scale;
    const dimensions = this.simulation.getDimensions();
    const layout = LayoutManager.calculate(width, height, dimensions.width, dimensions.height);
    this.drawWorld(layout.world, dimensions);
    this.statsPanel.render(layout.stats, {
      chronon: this.simulation.getChronon(),
      fish: this.simulation.getFishCount(),
      sharks: this.simulation.getSharkCount(),
      status: this.simulation.getStatus() || (this.running ? 'Running' : 'Paused'),
    });
    this.controls.render(layout.controls, {
      running: this.running,
      terminal: this.simulation.isTerminal(),
      speed: this.selectedSpeed,
    });
    this.chart.render(layout.chart, this.simulation.getPopulationHistory());
  }

  /** Draw the complete current grid using one Phaser graphics object. */
  drawWorld(bounds, dimensions) {
    this.worldGraphics.clear();
    this.worldGraphics.fillStyle(CONFIG.colors.water, 1);
    this.worldGraphics.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
    const cellWidth = bounds.width / dimensions.width;
    const cellHeight = bounds.height / dimensions.height;
    for (const entity of this.simulation.getEntities()) {
      const x = bounds.x + (entity.position.x + 0.5) * cellWidth;
      const y = bounds.y + (entity.position.y + 0.5) * cellHeight;
      const radius = Math.max(1.5, Math.min(cellWidth, cellHeight) * (entity.type === 'shark' ? 0.42 : 0.32));
      this.worldGraphics.fillStyle(entity.type === 'shark' ? CONFIG.colors.shark : CONFIG.colors.fish, 1);
      this.worldGraphics.fillCircle(x, y, radius);
    }
  }
}
