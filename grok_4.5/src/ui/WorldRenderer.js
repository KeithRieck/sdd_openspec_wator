import { COLORS, RENDER } from '../config.js';

/**
 * Draws the Wa-Tor world with Phaser Graphics circles (no sprites).
 * Spec: simulation-ui R2, R9.
 */
export class WorldRenderer {
  /**
   * @param {Phaser.Scene} scene
   */
  constructor(scene) {
    this.scene = scene;
    this.graphics = scene.add.graphics();
    this.bounds = { x: 0, y: 0, width: 100, height: 100 };
    this.cols = 100;
    this.rows = 70;
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
   * @param {number} cols
   * @param {number} rows
   */
  setGridSize(cols, rows) {
    this.cols = cols;
    this.rows = rows;
  }

  /**
   * @param {Array<{type:string, x:number, y:number}>} entities
   */
  render(entities) {
    const { x, y, width, height } = this.bounds;
    const cellW = width / this.cols;
    const cellH = height / this.rows;
    const minDim = Math.min(cellW, cellH);
    const fishR = minDim * RENDER.fishRadiusFactor;
    const sharkR = minDim * RENDER.sharkRadiusFactor;

    this.graphics.clear();
    this.graphics.fillStyle(COLORS.water, 1);
    this.graphics.fillRect(x, y, width, height);

    for (const entity of entities) {
      const cx = x + (entity.x + 0.5) * cellW;
      const cy = y + (entity.y + 0.5) * cellH;
      if (entity.type === 'shark') {
        this.graphics.fillStyle(COLORS.shark, 1);
        this.graphics.fillCircle(cx, cy, sharkR);
      } else {
        this.graphics.fillStyle(COLORS.fish, 1);
        this.graphics.fillCircle(cx, cy, fishR);
      }
    }
  }

  /** Release display objects. */
  destroy() {
    this.graphics.destroy();
  }
}
