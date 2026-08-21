/**
 * @file ControlPanel: Play/Pause, Step, Reset rows plus speed row.
 */

import { UI, SPEED } from '../config.js';
import { UiButton } from './UiButton.js';

/**
 * Renders the action controls on the right side of the world display
 * (AC 31-33): Play/Pause, Step, and Reset each on their own row, and
 * the five speed buttons (1x/5x/10x/30x/60x) in one horizontal row.
 *
 * Enforces control semantics:
 * - Step is disabled while running (AC 34);
 * - Play is disabled while terminal (AC 43);
 * - speed selection never resumes a paused simulation (AC 35).
 */
export class ControlPanel {
  /**
   * Creates the control panel in the given scene.
   *
   * @param {Phaser.Scene} scene Owning Phaser scene.
   * @param {Rect} rect Panel rectangle from the layout solver.
   * @param {object} handlers Action callbacks from the scene.
   * @param {() => void} handlers.onTogglePlay Play/Pause pressed.
   * @param {() => void} handlers.onStep Step pressed.
   * @param {() => void} handlers.onReset Reset pressed.
   * @param {(speed: number) => void} handlers.onSpeed Speed selected.
   * @param {number} initialSpeed Initially selected speed multiplier.
   */
  constructor(scene, rect, handlers, initialSpeed) {
    /** @type {UiButton[]} Action buttons in row order: play, step, reset. */
    this.actionButtons = [
      new UiButton(scene, 0, 0, 0, 0, 'Pause', handlers.onTogglePlay),
      new UiButton(scene, 0, 0, 0, 0, 'Step', handlers.onStep),
      new UiButton(scene, 0, 0, 0, 0, 'Reset', handlers.onReset),
    ];
    /** @type {UiButton[]} Speed buttons matching SPEED.options order. */
    this.speedButtons = SPEED.options.map(
      (speed) =>
        new UiButton(scene, 0, 0, 0, 0, `${speed}x`, () => {
          handlers.onSpeed(speed);
          this.setSelectedSpeed(speed);
        })
    );
    /** @type {number} Currently selected speed multiplier. */
    this.selectedSpeed = initialSpeed;
    this.layout(rect);
    this.setSelectedSpeed(initialSpeed);
  }

  /**
   * Repositions all buttons for a new layout rectangle (AC 9, 52).
   *
   * @param {Rect} rect New panel rectangle.
   * @returns {void}
   */
  layout(rect) {
    this.rect = rect;
    const innerW = rect.w - UI.padding * 2;
    let y = rect.y + UI.padding;
    const actionH = Math.min(UI.buttonHeight, Math.floor((rect.h - UI.padding * 2 - UI.rowGap * 4) / 4));
    for (const button of this.actionButtons) {
      button.setRect(rect.x + UI.padding, y, innerW, actionH);
      y += actionH + UI.rowGap;
    }
    // Speed row: five buttons share one horizontal row (AC 32).
    const gap = 4;
    const speedW = Math.floor((innerW - gap * (SPEED.options.length - 1)) / SPEED.options.length);
    for (let i = 0; i < this.speedButtons.length; i++) {
      this.speedButtons[i].setRect(
        rect.x + UI.padding + i * (speedW + gap),
        y,
        speedW,
        Math.max(24, actionH - 6)
      );
    }
  }

  /**
   * Highlights the selected speed button without affecting run state
   * (AC 35).
   *
   * @param {number} speed Selected speed multiplier.
   * @returns {void}
   */
  setSelectedSpeed(speed) {
    this.selectedSpeed = speed;
    this.speedButtons.forEach((b, i) => b.setSelected(SPEED.options[i] === speed));
  }

  /**
   * Updates Play/Pause label and per-state enablement (AC 34, 43).
   *
   * @param {{running: boolean, terminal: boolean}} state Current run state.
   * @returns {void}
   */
  updateState(state) {
    this.actionButtons[0].setLabel(state.running ? 'Pause' : 'Play');
    // Step only while paused (AC 34); Play locked out when terminal (AC 43).
    this.actionButtons[1].setEnabled(!state.running);
    this.actionButtons[0].setEnabled(!state.terminal);
  }

  /**
   * Removes the panel from the scene.
   *
   * @returns {void}
   */
  destroy() {
    [...this.actionButtons, ...this.speedButtons].forEach((b) => b.destroy());
  }
}

/**
 * @typedef {Object} Rect
 * @property {number} x Left edge in pixels.
 * @property {number} y Top edge in pixels.
 * @property {number} w Width in pixels.
 * @property {number} h Height in pixels.
 */
