import { COLORS } from '../config.js';

/**
 * Population history chart renderer.
 * Draws fish and shark lines using Graphics.
 */
export class Chart {
  /**
   * Render history onto a Graphics object.
   * @param {Phaser.GameObjects.Graphics} gfx - Graphics to draw on
   * @param {{fish:number, sharks:number}[]} history - Population history
   * @param {number} x - Chart left
   * @param {number} y - Chart top
   * @param {number} w - Chart width
   * @param {number} h - Chart height
   */
  static render(gfx, history, x, y, w, h) {
    gfx.clear();
    // Background
    gfx.fillStyle(COLORS.chartBackground, 1);
    gfx.fillRect(x, y, w, h);
    // Border
    gfx.lineStyle(1, COLORS.chartGrid, 0.5);
    gfx.strokeRect(x, y, w, h);

    if (history.length < 2) return;

    let maxVal = 1;
    for (const s of history) {
      maxVal = Math.max(maxVal, s.fish, s.sharks);
    }

    const n = history.length;
    const stepX = w / Math.max(n - 1, 1);

    // Fish line (green)
    gfx.lineStyle(1.5, COLORS.fish, 1);
    gfx.beginPath();
    for (let i = 0; i < n; i++) {
      const px = x + i * stepX;
      const py = y + h - (history[i].fish / maxVal) * h;
      if (i === 0) gfx.moveTo(px, py);
      else gfx.lineTo(px, py);
    }
    gfx.strokePath();

    // Shark line (blue)
    gfx.lineStyle(1.5, COLORS.shark, 1);
    gfx.beginPath();
    for (let i = 0; i < n; i++) {
      const px = x + i * stepX;
      const py = y + h - (history[i].sharks / maxVal) * h;
      if (i === 0) gfx.moveTo(px, py);
      else gfx.lineTo(px, py);
    }
    gfx.strokePath();
  }
}
