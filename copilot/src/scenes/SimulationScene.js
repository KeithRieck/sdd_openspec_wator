/**
 * Main simulation scene for the Wa-Tor app.
 */
import WatorSimulation from '../simulation/WatorSimulation.js';
import WorldRenderer from '../render/WorldRenderer.js';
import HistoryChart from '../render/HistoryChart.js';
import UIControls from '../ui/UIControls.js';
import { CONFIG } from '../config.js';

export default class SimulationScene extends Phaser.Scene {
  constructor() {
    super('SimulationScene');
    this.sim = null;
    this.worldRenderer = null;
    this.historyChart = null;
    this.uiControls = null;
    this.statsTexts = {};
    this.isRunning = true;
    this.speed = CONFIG.DEFAULT_SPEED;
    this.timeAccumulator = 0;
  }

  create() {
    this.sim = new WatorSimulation();
    this.sim.reset();

    this.worldRenderer = new WorldRenderer(this);
    this.historyChart = new HistoryChart(this);
    this.uiControls = new UIControls(this, this.onSpeedChange.bind(this), this.onPlayPause.bind(this), this.onStep.bind(this), this.onReset.bind(this));

    this.statsTexts.chronon = this.add.text(0, 0, '', { fontSize: '18px', color: '#ffffff' });
    this.statsTexts.fish = this.add.text(0, 0, '', { fontSize: '18px', color: '#ffffff' });
    this.statsTexts.sharks = this.add.text(0, 0, '', { fontSize: '18px', color: '#ffffff' });
    this.statsTexts.status = this.add.text(0, 0, '', { fontSize: '18px', color: '#ffffff' });

    this.scale.on('resize', this.resize, this);
    this.updateLayout();
    this.uiControls.setSelectedSpeed(this.speed);
    this.uiControls.setPlayEnabled(true);
    this.uiControls.setStepEnabled(!this.isRunning);
  }

  update(time, delta) {
    if (this.isRunning) {
      this.timeAccumulator += delta;
      const delay = 1000 / this.speed;
      while (this.timeAccumulator >= delay) {
        this.sim.step();
        this.timeAccumulator -= delay;
      }
    }

    const stats = this.sim.getStats();
    let status = this.isRunning ? 'Running' : 'Paused';
    if (stats.fish === 0 || stats.sharks === 0) {
      this.isRunning = false;
      status = stats.fish === 0 && stats.sharks === 0 ? 'Ecosystem collapsed' : stats.fish === 0 ? 'Fish extinct' : 'Sharks extinct';
    }

    this.statsTexts.chronon.setText(`Chronon: ${stats.chronon}`);
    this.statsTexts.fish.setText(`Fish: ${stats.fish}`);
    this.statsTexts.sharks.setText(`Sharks: ${stats.sharks}`);
    this.statsTexts.status.setText(`Status: ${status}`);
    this.uiControls.setStepEnabled(!this.isRunning);
    this.uiControls.setPlayEnabled(status !== 'Ecosystem collapsed' && status !== 'Fish extinct' && status !== 'Sharks extinct');

    this.worldRenderer.render({ gridWidth: CONFIG.GRID_WIDTH, gridHeight: CONFIG.GRID_HEIGHT, entities: this._serializeEntities() });
    this.historyChart.render(this.sim.history, this._getHistoryMax());
  }

  _getHistoryMax() {
    if (this.sim.history.length === 0) return 1;
    return Math.max(...this.sim.history.flatMap(sample => [sample.fish, sample.sharks, 1]));
  }

  _serializeEntities() {
    return Array.from(this.sim.entities.values()).map(entity => ({
      id: entity.id,
      type: entity.type,
      x: entity.x,
      y: entity.y
    }));
  }

  onSpeedChange(speed) {
    this.speed = speed;
    this.uiControls.setSelectedSpeed(speed);
  }

  onPlayPause() {
    this.isRunning = !this.isRunning;
  }

  onStep() {
    if (!this.isRunning) {
      this.sim.step();
    }
  }

  onReset() {
    this.sim.reset();
    this.isRunning = true;
  }

  resize(gameSize) {
    if (gameSize) {
      this.scale.resize(gameSize.width, gameSize.height);
    }
    this.updateLayout();
  }

  updateLayout() {
    const width = this.scale.width;
    const height = this.scale.height;
    const sideWidth = Math.max(200, width * 0.16);
    const chartHeight = Math.max(100, height * 0.18);
    const worldWidth = width - sideWidth * 2;
    const worldHeight = height - chartHeight - 40;

    this.worldRenderer.layout(sideWidth, 20, worldWidth, worldHeight, CONFIG.GRID_WIDTH, CONFIG.GRID_HEIGHT);
    this.historyChart.layout(0, height - chartHeight, width, chartHeight);
    this.uiControls.layout(width - sideWidth, 20, sideWidth, worldHeight);

    const statsX = 20;
    const statsY = 20;
    const lineHeight = 26;
    this.statsTexts.chronon.setPosition(statsX, statsY);
    this.statsTexts.fish.setPosition(statsX, statsY + lineHeight);
    this.statsTexts.sharks.setPosition(statsX, statsY + lineHeight * 2);
    this.statsTexts.status.setPosition(statsX, statsY + lineHeight * 3);
  }
}
