import { COLORS } from '../config.js';

/**
 * Bottom unlabeled population history chart with fixed Y max.
 * Spec: simulation-ui R8.
 */
export class PopulationChart {
  /**
   * @param {Phaser.Scene} scene
   */
  constructor(scene) {
    this.scene = scene;
    this.graphics = scene.add.graphics();
    this.bounds = { x: 0, y: 0, width: 400, height: 120 };
    this.yMax = 1;
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   */
  setBounds(x, y, width, height) {
    this.bounds = { x, y, width, height };
  }

  /**
   * Fixed absolute scale; never rescales mid-run.
   * @param {number} max
   */
  setYMax(max) {
    this.yMax = Math.max(1, max);
  }

  /**
   * @param {Array<{fish:number, sharks:number}>} history
   */
  update(history) {
    const { x, y, width, height } = this.bounds;
    this.graphics.clear();
    this.graphics.fillStyle(COLORS.chartBackground, 1);
    this.graphics.lineStyle(1, COLORS.panelBorder, 1);
    this.graphics.fillRoundedRect(x, y, width, height, 8);
    this.graphics.strokeRoundedRect(x, y, width, height, 8);

    const pad = 8;
    const plotX = x + pad;
    const plotY = y + pad;
    const plotW = Math.max(1, width - pad * 2);
    const plotH = Math.max(1, height - pad * 2);

    this.graphics.lineStyle(1, COLORS.chartGrid, 0.5);
    this.graphics.lineBetween(plotX, plotY + plotH, plotX + plotW, plotY + plotH);
    this.graphics.lineBetween(plotX, plotY, plotX, plotY + plotH);

    if (!history || history.length === 0) {
      return;
    }

    this.#drawSeries(history, 'fish', COLORS.fish, plotX, plotY, plotW, plotH);
    this.#drawSeries(history, 'sharks', COLORS.shark, plotX, plotY, plotW, plotH);
  }

  /**
   * @param {Array<{fish:number, sharks:number}>} history
   * @param {'fish'|'sharks'} key
   * @param {number} color
   * @param {number} plotX
   * @param {number} plotY
   * @param {number} plotW
   * @param {number} plotH
   */
  #drawSeries(history, key, color, plotX, plotY, plotW, plotH) {
    const n = history.length;
    this.graphics.lineStyle(2, color, 1);
    this.graphics.beginPath();

    for (let i = 0; i < n; i += 1) {
      const sample = history[i];
      const value = sample[key];
      const px = n === 1 ? plotX : plotX + (i / (n - 1)) * plotW;
      const ratio = Math.min(1, Math.max(0, value / this.yMax));
      const py = plotY + plotH - ratio * plotH;
      if (i === 0) {
        this.graphics.moveTo(px, py);
      } else {
        this.graphics.lineTo(px, py);
      }
    }

    this.graphics.strokePath();
  }

  /** Release display objects. */
  destroy() {
    this.graphics.destroy();
  }
}
