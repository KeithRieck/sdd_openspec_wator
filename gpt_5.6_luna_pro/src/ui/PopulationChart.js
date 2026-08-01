import { CONFIG } from '../config.js';

/** Phaser-native unlabeled population history chart. */
export class PopulationChart {
  /** Create the chart graphics object. */
  constructor(scene) {
    this.scene = scene;
    this.graphics = scene.add.graphics();
  }

  /** Draw fish and shark population lines in the chart bounds. */
  render(bounds, history) {
    this.graphics.clear();
    this.graphics.fillStyle(CONFIG.colors.panel, 0.94);
    this.graphics.fillRoundedRect(bounds.x, bounds.y, bounds.width, bounds.height, 12);
    this.graphics.lineStyle(1, CONFIG.colors.panelBorder, 1);
    this.graphics.strokeRoundedRect(bounds.x, bounds.y, bounds.width, bounds.height, 12);
    if (history.length < 2) return;

    const maxPopulation = Math.max(1, ...history.map((sample) => Math.max(sample.fish, sample.sharks)));
    const xStep = (bounds.width - 24) / Math.max(1, history.length - 1);
    this.drawLine(bounds, history, 'fish', CONFIG.colors.fish, maxPopulation, xStep);
    this.drawLine(bounds, history, 'sharks', CONFIG.colors.shark, maxPopulation, xStep);
  }

  /** Draw one population series. */
  drawLine(bounds, history, key, color, maxPopulation, xStep) {
    this.graphics.lineStyle(2, color, 1);
    history.forEach((sample, index) => {
      const x = bounds.x + 12 + index * xStep;
      const y = bounds.y + bounds.height - 12 - (sample[key] / maxPopulation) * (bounds.height - 24);
      if (index === 0) this.graphics.moveTo(x, y);
      else this.graphics.lineTo(x, y);
    });
    this.graphics.strokePath();
  }
}
