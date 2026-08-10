import { COLORS } from '../config.js';

/**
 * Phaser-native button helper.
 * Renders a rectangle with centered text and handles selected/disabled states.
 */
export class Button {
  /**
   * @param {Phaser.Scene} scene - Parent scene
   * @param {number} x - Center x
   * @param {number} y - Center y
   * @param {number} w - Width
   * @param {number} h - Height
   * @param {string} label - Button text
   * @param {Function} onClick - Click handler
   */
  constructor(scene, x, y, w, h, label, onClick) {
    /** @type {Phaser.Scene} */
    this.scene = scene;
    /** @type {number} */
    this.w = w;
    /** @type {number} */
    this.h = h;
    /** @type {string} */
    this.label = label;
    /** @type {Function} */
    this.onClick = onClick;
    /** @type {boolean} */
    this.enabled = true;
    /** @type {boolean} */
    this.selected = false;

    /** @type {Phaser.GameObjects.Rectangle} */
    this.bg = scene.add.rectangle(x, y, w, h, COLORS.buttonBg);
    this.bg.setStrokeStyle(1, 0x2a4a6a);
    this.bg.setInteractive({ useHandCursor: true });
    this.bg.on('pointerdown', () => {
      if (this.enabled && this.onClick) this.onClick();
    });
    this.bg.on('pointerover', () => {
      if (this.enabled && !this.selected) this.bg.setFillStyle(0x234a6a);
    });
    this.bg.on('pointerout', () => {
      this._applyStyle();
    });

    /** @type {Phaser.GameObjects.Text} */
    this.text = scene.add.text(x, y, label, {
      fontSize: '13px',
      fontFamily: 'monospace',
      color: COLORS.text
    });
    this.text.setOrigin(0.5);

    this._applyStyle();
  }

  /**
   * Apply visual style based on enabled/selected.
   */
  _applyStyle() {
    if (!this.enabled) {
      this.bg.setFillStyle(COLORS.buttonDisabled);
      this.bg.setAlpha(0.5);
      this.text.setAlpha(0.4);
      this.bg.disableInteractive();
    } else if (this.selected) {
      this.bg.setFillStyle(COLORS.buttonSelected);
      this.bg.setAlpha(1);
      this.text.setAlpha(1);
      this.bg.setInteractive({ useHandCursor: true });
    } else {
      this.bg.setFillStyle(COLORS.buttonBg);
      this.bg.setAlpha(1);
      this.text.setAlpha(1);
      this.bg.setInteractive({ useHandCursor: true });
    }
  }

  /**
   * Set selected state.
   * @param {boolean} v
   */
  setSelected(v) {
    this.selected = v;
    this._applyStyle();
  }

  /**
   * Set enabled state.
   * @param {boolean} v
   */
  setEnabled(v) {
    this.enabled = v;
    this._applyStyle();
  }

  /**
   * Set position.
   * @param {number} x
   * @param {number} y
   */
  setPosition(x, y) {
    this.bg.setPosition(x, y);
    this.text.setPosition(x, y);
  }

  /**
   * Destroy button objects.
   */
  destroy() {
    this.bg.destroy();
    this.text.destroy();
  }
}
