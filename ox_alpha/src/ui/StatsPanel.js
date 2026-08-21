/**
 * @file StatsPanel: Chronon / Fish / Sharks / Status readouts.
 */

import { UI } from '../config.js';

/**
 * Renders the population statistics panel on the left side of the world
 * display (AC 30): current chronon count, fish population, shark
 * population, and status text. All drawing is Phaser Graphics/Text.
 */
export class StatsPanel {
  /**
   * Creates the stats panel in the given scene.
   *
   * @param {Phaser.Scene} scene Owning Phaser scene.
   * @param {Rect} rect Panel rectangle from the layout solver.
   */
  constructor(scene, rect) {
    /** @type {Phaser.Scene} Owning scene. */
    this.scene = scene;
    /** @type {Phaser.GameObjects.Graphics} Panel background drawing. */
    this.gfx = scene.add.graphics();
    /** @type {Phaser.GameObjects.Text[]} One text object per stat row. */
    this.rows = ['Chronon', 'Fish', 'Sharks', 'Status'].map((label) =>
      scene.add.text(0, 0, label, {
        fontSize: `${UI.fontSize}px`,
        color: UI.buttonTextEnabled,
        fontFamily: 'sans-serif',
        wordWrap: { width: rect.w - UI.padding * 2 },
      })
    );
    this.layout(rect);
  }

  /**
   * Repositions the panel and its rows for a new layout rectangle.
   *
   * @param {Rect} rect New panel rectangle.
   * @returns {void}
   */
  layout(rect) {
    this.rect = rect;
    const g = this.gfx;
    g.clear();
    g.fillStyle(UI.panelColor, 1);
    g.fillRect(rect.x, rect.y, rect.w, rect.h);
    g.lineStyle(1, UI.panelBorderColor, 1);
    g.strokeRect(rect.x, rect.y, rect.w, rect.h);
    const rowH = Math.max(UI.fontSize + 8, Math.floor((rect.h - UI.padding * 2) / this.rows.length));
    this.rows.forEach((text, i) => {
      text.setPosition(rect.x + UI.padding, rect.y + UI.padding + i * rowH);
    });
  }

  /**
   * Updates the displayed values (called once per chronon, AC 30).
   *
   * @param {{chronon: number, fish: number, sharks: number, status: string}} s
   *   Current simulation readouts.
   * @returns {void}
   */
  update(s) {
    this.rows[0].setText(`Chronon: ${s.chronon}`);
    this.rows[1].setText(`Fish: ${s.fish}`);
    this.rows[2].setText(`Sharks: ${s.sharks}`);
    this.rows[3].setText(`Status: ${s.status}`);
  }

  /**
   * Removes the panel from the scene.
   *
   * @returns {void}
   */
  destroy() {
    this.gfx.destroy();
    this.rows.forEach((t) => t.destroy());
  }
}

/**
 * @typedef {Object} Rect
 * @property {number} x Left edge in pixels.
 * @property {number} y Top edge in pixels.
 * @property {number} w Width in pixels.
 * @property {number} h Height in pixels.
 */
