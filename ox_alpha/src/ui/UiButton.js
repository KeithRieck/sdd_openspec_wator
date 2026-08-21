/**
 * @file UiButton: a Phaser Graphics-drawn button widget.
 */

import { UI } from '../config.js';

/**
 * A simple button rendered entirely with Phaser Graphics and Text — no
 * DOM elements (AC 5). Supports enabled/disabled and selected visual
 * states with pointer input (design D7).
 *
 * Used for Play/Pause, Step, Reset, and the speed selection row. State
 * changes trigger a redraw; the click callback is only invoked while
 * enabled.
 */
export class UiButton {
  /**
   * Creates a button inside the given scene.
   *
   * @param {Phaser.Scene} scene Owning Phaser scene.
   * @param {number} x Left edge in pixels.
   * @param {number} y Top edge in pixels.
   * @param {number} w Width in pixels.
   * @param {number} h Height in pixels.
   * @param {string} label Button label text.
   * @param {() => void} onClick Click handler invoked when enabled.
   */
  constructor(scene, x, y, w, h, label, onClick) {
    /** @type {() => void} Click handler. */
    this.onClick = onClick;
    /** @type {boolean} Whether clicks are accepted and drawn active. */
    this.enabled = true;
    /** @type {boolean} Visual selected state (speed buttons). */
    this.selected = false;
    /** @type {string} Current label text. */
    this.label = label;

    /** @type {Phaser.GameObjects.Graphics} Button fill/border drawing. */
    this.gfx = scene.add.graphics();
    /** @type {Phaser.GameObjects.Text} Centered label text. */
    this.text = scene.add.text(0, 0, label, {
      fontSize: `${UI.smallFontSize}px`,
      color: UI.buttonTextEnabled,
      fontFamily: 'sans-serif',
    });
    this.text.setOrigin(0.5, 0.5);

    this.rect = { x, y, w, h };
    // Dedicated input zone sized to the button. A Zone's hit area is
    // its own local rectangle, so clicks register regardless of the
    // label text's origin or position.
    this.zone = scene.add.zone(x + w / 2, y + h / 2, w, h).setOrigin(0.5);
    this.zone.setInteractive();
    this.zone.on('pointerdown', () => {
      if (this.enabled) {
        this.onClick();
      }
    });
    this.redraw();
  }

  /**
   * Repositions and resizes the button (used on layout recompute).
   *
   * @param {number} x Left edge in pixels.
   * @param {number} y Top edge in pixels.
   * @param {number} w Width in pixels.
   * @param {number} h Height in pixels.
   * @returns {void}
   */
  setRect(x, y, w, h) {
    this.rect = { x, y, w, h };
    this.zone.setPosition(x + w / 2, y + h / 2);
    this.zone.setSize(w, h);
    // Re-apply the input hit area after resizing the zone.
    this.zone.setInteractive();
    this.redraw();
  }

  /**
   * Sets the label text and redraws.
   *
   * @param {string} label New label text.
   * @returns {void}
   */
  setLabel(label) {
    this.label = label;
    this.redraw();
  }

  /**
   * Sets the enabled state and redraws. Disabled buttons ignore clicks
   * (AC 34, 43).
   *
   * @param {boolean} enabled Whether the button accepts clicks.
   * @returns {void}
   */
  setEnabled(enabled) {
    if (this.enabled !== enabled) {
      this.enabled = enabled;
      this.redraw();
    }
  }

  /**
   * Sets the selected visual state and redraws (speed buttons).
   *
   * @param {boolean} selected Whether the button is highlighted.
   * @returns {void}
   */
  setSelected(selected) {
    if (this.selected !== selected) {
      this.selected = selected;
      this.redraw();
    }
  }

  /**
   * Redraws fill, border, and label to reflect the current state.
   *
   * @returns {void}
   */
  redraw() {
    const { x, y, w, h } = this.rect;
    const fill = !this.enabled
      ? UI.buttonDisabledColor
      : this.selected
        ? UI.buttonSelectedColor
        : UI.buttonColor;
    const textColor = this.enabled ? UI.buttonTextEnabled : UI.buttonTextDisabled;
    this.gfx.clear();
    this.gfx.fillStyle(fill, 1);
    this.gfx.fillRect(x, y, w, h);
    this.gfx.lineStyle(1, UI.panelBorderColor, 1);
    this.gfx.strokeRect(x, y, w, h);
    this.text.setPosition(x + w / 2, y + h / 2);
    this.text.setText(this.label);
    this.text.setColor(textColor);
  }

  /**
   * Removes the button from the scene.
   *
   * @returns {void}
   */
  destroy() {
    this.gfx.destroy();
    this.text.destroy();
    this.zone.destroy();
  }
}
