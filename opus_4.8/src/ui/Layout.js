/**
 * Computes the responsive screen layout for the simulation scene.
 *
 * Partitions the canvas into a stats panel (left), the world (center, with the
 * grid's aspect ratio preserved and centered), a controls panel (right), and a
 * population-history chart (bottom strip). Panel sizes scale with the window so
 * the display reflows on resize and on tablet/narrow viewports without changing
 * the simulation grid dimensions. All rectangles are plain `{x, y, w, h}`.
 */
export class Layout {
  /**
   * @param {{gridWidth: number, gridHeight: number}} config
   */
  constructor(config) {
    this.gridWidth = config.gridWidth;
    this.gridHeight = config.gridHeight;
    this.stats = { x: 0, y: 0, w: 0, h: 0 };
    this.world = { x: 0, y: 0, w: 0, h: 0 };
    this.controls = { x: 0, y: 0, w: 0, h: 0 };
    this.chart = { x: 0, y: 0, w: 0, h: 0 };
    this.cellSize = 1;
    this.worldOffsetX = 0;
    this.worldOffsetY = 0;
  }

  /**
   * Recomputes all regions for the given canvas size.
   *
   * Panel widths and the chart height scale with the window but are clamped so
   * controls stay usable on small screens. The world cell size is the largest
   * that fits the central region while preserving the grid aspect ratio, and the
   * world is centered within that region.
   * @param {number} width
   * @param {number} height
   */
  recompute(width, height) {
    const statsW = Math.round(clamp(width * 0.16, 116, 200));
    const controlsW = Math.round(clamp(width * 0.18, 150, 230));
    const chartH = Math.round(clamp(height * 0.18, 90, 170));
    const topH = height - chartH;

    this.stats = { x: 0, y: 0, w: statsW, h: topH };
    this.controls = { x: width - controlsW, y: 0, w: controlsW, h: topH };
    this.world = {
      x: statsW,
      y: 0,
      w: Math.max(0, width - statsW - controlsW),
      h: topH,
    };
    this.chart = { x: 0, y: topH, w: width, h: chartH };

    const pad = 10;
    const innerW = this.world.w - pad * 2;
    const innerH = this.world.h - pad * 2;
    this.cellSize = Math.max(
      0.5,
      Math.min(innerW / this.gridWidth, innerH / this.gridHeight)
    );
    const worldPxW = this.cellSize * this.gridWidth;
    const worldPxH = this.cellSize * this.gridHeight;
    this.worldOffsetX = this.world.x + (this.world.w - worldPxW) / 2;
    this.worldOffsetY = this.world.y + (this.world.h - worldPxH) / 2;
  }
}

/**
 * Clamps a value to the inclusive range [min, max].
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
