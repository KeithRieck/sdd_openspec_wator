/**
 * @file HistoryChart: rolling population line chart.
 */

import { UI, RENDER, HISTORY } from '../config.js';

/**
 * Renders the population history chart horizontally across the bottom
 * of the window (AC 44): green fish and blue shark lines using the same
 * colors as the world and stats (AC 46), with no titles or text labels
 * (AC 47). Expects the simulation's rolling history buffer of at most
 * HISTORY.windowSize samples.
 */
export class HistoryChart {
  /**
   * Creates the chart in the given scene.
   *
   * @param {Phaser.Scene} scene Owning Phaser scene.
   * @param {Rect} rect Chart rectangle from the layout solver.
   * @param {Array<{fish: number, sharks: number}>} history Shared rolling
   *   history buffer (owned by the simulation).
   */
  constructor(scene, rect, history) {
    /** @type {Phaser.Scene} Owning scene. */
    this.scene = scene;
    /** @type {Array<{fish: number, sharks: number}>} Shared history reference. */
    this.history = history;
    /** @type {Phaser.GameObjects.Graphics} Chart drawing layer. */
    this.gfx = scene.add.graphics();
    this.layout(rect);
  }

  /**
   * Repositions the chart for a new layout rectangle and redraws.
   *
   * @param {Rect} rect New chart rectangle.
   * @returns {void}
   */
  layout(rect) {
    this.rect = rect;
    this.redraw();
  }

  /**
   * Redraws panel background and both population polylines scaled to
   * the largest population seen in the window. Lines are drawn oldest
   * to newest, left to right; when fewer than the full window of
   * samples exists the plot occupies the left portion only.
   *
   * @returns {void}
   */
  redraw() {
    const { x, y, w, h } = this.rect;
    const g = this.gfx;
    g.clear();
    g.fillStyle(UI.panelColor, 1);
    g.fillRect(x, y, w, h);
    g.lineStyle(1, UI.panelBorderColor, 1);
    g.strokeRect(x, y, w, h);

    if (this.history.length < 2) {
      return;
    }
    let maxPop = 1;
    for (const sample of this.history) {
      maxPop = Math.max(maxPop, sample.fish, sample.sharks);
    }
    const pad = 4;
    const plotW = w - pad * 2;
    const plotH = h - pad * 2;
    const stepX = plotW / (HISTORY.windowSize - 1);

    this.drawSeries(this.history.map((s) => s.fish), RENDER.fishColor, x + pad, y + h - pad, stepX, plotH, maxPop);
    this.drawSeries(this.history.map((s) => s.sharks), RENDER.sharkColor, x + pad, y + h - pad, stepX, plotH, maxPop);
  }

  /**
   * Draws one population series as a polyline.
   *
   * @param {number[]} values Population values oldest to newest.
   * @param {number} color Line color as a hex number.
   * @param {number} originX Left pixel of the plot area.
   * @param {number} baseY Bottom pixel of the plot area.
   * @param {number} stepX Horizontal pixels between samples.
   * @param {number} plotH Plot height in pixels for value scaling.
   * @param {number} maxPop Maximum population for scaling.
   * @returns {void}
   */
  drawSeries(values, color, originX, baseY, stepX, plotH, maxPop) {
    const g = this.gfx;
    g.lineStyle(2, color, 1);
    g.beginPath();
    values.forEach((v, i) => {
      const px = originX + i * stepX;
      const py = baseY - Math.round((v / maxPop) * (plotH - 2));
      if (i === 0) {
        g.moveTo(px, py);
      } else {
        g.lineTo(px, py);
      }
    });
    g.strokePath();
  }

  /**
   * Removes the chart from the scene.
   *
   * @returns {void}
   */
  destroy() {
    this.gfx.destroy();
  }
}

/**
 * @typedef {Object} Rect
 * @property {number} x Left edge in pixels.
 * @property {number} y Top edge in pixels.
 * @property {number} w Width in pixels.
 * @property {number} h Height in pixels.
 */
