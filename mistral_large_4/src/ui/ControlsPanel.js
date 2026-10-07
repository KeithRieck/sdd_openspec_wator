/**
 * Controls panel with Play/Pause, Step, and Reset buttons.
 *
 * Displays action buttons stacked vertically on the right side of the
 * main world display using the PhaserButton component.
 *
 * @see prd-v001.md requirements #31, #33-36, #43
 */
import { Config } from '../config.js';
import PhaserButton from './PhaserButton.js';

/**
 * Phaser-native controls panel component.
 * Manages Play/Pause, Step, and Reset buttons with proper enable/disable logic.
 */
export class ControlsPanel {
    /**
     * Create a controls panel.
     * @param {Phaser.Scene} scene - The Phaser scene owning this panel
     * @param {number} x - Left position
     * @param {number} y - Top position
     * @param {object} callbacks - Callback functions for button actions
     * @param {Function} callbacks.onPlayPause - Called when Play/Pause is clicked
     * @param {Function} callbacks.onStep - Called when Step is clicked
     * @param {Function} callbacks.onReset - Called when Reset is clicked
     */
    constructor(scene, x, y, callbacks) {
        /** @type {Phaser.Scene} */
        this.scene = scene;

        /** @type {number} */
        this.x = x;

        /** @type {number} */
        this.y = y;

        /** @type {object} */
        this.callbacks = callbacks;

        /** @type {PhaserButton} */
        this.playPauseButton = new PhaserButton(
            scene,
            x,
            y,
            Config.BUTTON_WIDTH,
            Config.BUTTON_HEIGHT,
            'Pause',
            () => this.callbacks.onPlayPause()
        );

        /** @type {PhaserButton} */
        this.stepButton = new PhaserButton(
            scene,
            x,
            y + Config.BUTTON_HEIGHT + Config.BUTTON_SPACING,
            Config.BUTTON_WIDTH,
            Config.BUTTON_HEIGHT,
            'Step',
            () => this.callbacks.onStep()
        );

        /** @type {PhaserButton} */
        this.resetButton = new PhaserButton(
            scene,
            x,
            y + (Config.BUTTON_HEIGHT + Config.BUTTON_SPACING) * 2,
            Config.BUTTON_WIDTH,
            Config.BUTTON_HEIGHT,
            'Reset',
            () => this.callbacks.onReset()
        );
    }

    /**
     * Update button states based on simulation status.
     * @param {boolean} isRunning - True if simulation is running
     * @param {boolean} isTerminal - True if simulation is in terminal state
     */
    updateState(isRunning, isTerminal) {
        // Play/Pause button (PRD #34, #43)
        if (isTerminal) {
            this.playPauseButton.setEnabled(false);
            this.playPauseButton.setLabel('Play');
        } else {
            this.playPauseButton.setEnabled(true);
            this.playPauseButton.setLabel(isRunning ? 'Pause' : 'Play');
        }

        // Step button (PRD #34-35)
        // Enabled only when paused and not terminal
        this.stepButton.setEnabled(!isRunning && !isTerminal);

        // Reset button is always enabled
        this.resetButton.setEnabled(true);
    }

    /**
     * Set the position of the controls panel.
     * @param {number} x - New left position
     * @param {number} y - New top position
     */
    setPosition(x, y) {
        this.x = x;
        this.y = y;
        this.playPauseButton.setPosition(x, y);
        this.stepButton.setPosition(x, y + Config.BUTTON_HEIGHT + Config.BUTTON_SPACING);
        this.resetButton.setPosition(x, y + (Config.BUTTON_HEIGHT + Config.BUTTON_SPACING) * 2);
    }

    /**
     * Destroy the controls panel and its buttons.
     */
    destroy() {
        this.playPauseButton.bg.destroy();
        this.playPauseButton.text.destroy();
        this.stepButton.bg.destroy();
        this.stepButton.text.destroy();
        this.resetButton.bg.destroy();
        this.resetButton.text.destroy();
    }
}

export default ControlsPanel;
