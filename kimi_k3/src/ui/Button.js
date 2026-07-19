import {
  COLOR_BUTTON,
  COLOR_BUTTON_HOVER,
  COLOR_BUTTON_DISABLED,
  COLOR_BUTTON_ACTIVE,
  COLOR_TEXT,
} from '../config.js';

/**
 * Phaser-native button: rectangle + text + pointer events (RE-R6 / AC 5).
 * No DOM elements are used.
 */
export class Button {
  /**
   * @param {Phaser.Scene} scene
   * @param {string} label
   * @param {() => void} onClick
   */
  constructor(scene, label, onClick) {
    this.scene = scene;
    this.label = label;
    this.onClick = onClick;
    /** @type {boolean} */
    this.enabled = true;
    /** @type {boolean} */
    this.active = false;
    this.bg = scene.add.graphics();
    this.text = scene.add
      .text(0, 0, label, { fontFamily: 'sans-serif', fontSize: '18px', color: COLOR_TEXT })
      .setOrigin(0.5);
    this.zone = scene.add
      .zone(0, 0, 10, 10)
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => { this.hover = true; this.draw(); })
      .on('pointerout', () => { this.hover = false; this.draw(); })
      .on('pointerdown', () => {
        if (this.enabled) this.onClick();
      });
    this.hover = false;
  }

  /**
   * Positions and sizes the button.
   * @param {number} x left edge
   * @param {number} y top edge
   * @param {number} w width in px
   * @param {number} h height in px
   */
  setBounds(x, y, w, h) {
    this.bounds = { x, y, w, h };
    this.zone.setPosition(x + w / 2, y + h / 2).setSize(w, h);
    this.text.setPosition(x + w / 2, y + h / 2);
    this.draw();
  }

  /**
   * Sets the enabled state and redraws (CS-R4, CS-R7).
   * @param {boolean} enabled
   */
  setEnabled(enabled) {
    this.enabled = enabled;
    this.draw();
  }

  /**
   * Marks the button as selected (used by speed buttons).
   * @param {boolean} active
   */
  setActive(active) {
    this.active = active;
    this.draw();
  }

  /**
   * Updates the label text (used by Play/Pause).
   * @param {string} label
   */
  setLabel(label) {
    this.label = label;
    this.text.setText(label);
  }

  /** Redraws the button background for its current state. */
  draw() {
    if (!this.bounds) return;
    const { x, y, w, h } = this.bounds;
    let color = COLOR_BUTTON;
    if (!this.enabled) color = COLOR_BUTTON_DISABLED;
    else if (this.active) color = COLOR_BUTTON_ACTIVE;
    else if (this.hover) color = COLOR_BUTTON_HOVER;
    this.bg.clear();
    this.bg.fillStyle(color, 1);
    this.bg.fillRoundedRect(x, y, w, h, 6);
    this.text.setAlpha(this.enabled ? 1 : 0.45);
  }
}
