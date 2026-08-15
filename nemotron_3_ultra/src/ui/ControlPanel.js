/**
 * Control panel for the Wa-Tor simulation.
 * Displays speed buttons (1x, 5x, 10x, 30x, 60x) and action buttons (Play/Pause, Step, Reset) on the right side.
 * @module ui/ControlPanel
 */
import Config from '../config.js';
import { Button } from './Button.js';

/**
 * Control panel with speed and action buttons.
 */
export class ControlPanel {
    /**
     * Create a new control panel.
     * @param {Phaser.Scene} scene - The Phaser scene
     * @param {WatorSimulation} simulation - The simulation instance
     * @param {Object} callbacks - Callback functions for button actions
     * @param {Function} callbacks.onSpeedChange - Called when speed changes (index)
     * @param {Function} callbacks.onPlayPause - Called when play/pause toggled
     * @param {Function} callbacks.onStep - Called when step pressed
     * @param {Function} callbacks.onReset - Called when reset pressed
     */
    constructor(scene, simulation, callbacks) {
        this._scene = scene;
        this._simulation = simulation;
        this._callbacks = callbacks;
        this._speedButtons = [];
        this._actionButtons = {};
        this._speedIndex = simulation.getConfig().DEFAULT_SPEED_INDEX;
        this._isRunning = true;

        this._createButtons();
    }

    /**
     * Create all buttons.
     * @private
     */
    _createButtons() {
        const colors = Config.COLORS;
        const speeds = this._simulation.getConfig().SPEED_OPTIONS;

        // Speed buttons (horizontal row)
        const speedButtonWidth = 50;
        const speedButtonHeight = 30;
        const speedSpacing = 5;

        for (let i = 0; i < speeds.length; i++) {
            const btn = new Button(
                this._scene,
                0, 0, // Position set in resize
                speedButtonWidth,
                speedButtonHeight,
                `${speeds[i]}x`,
                () => this._onSpeedButtonClick(i),
                colors
            );
            btn.setSelected(i === this._speedIndex);
            this._speedButtons.push(btn);
        }

        // Action buttons (vertical stack)
        const actionButtonWidth = 100;
        const actionButtonHeight = 35;
        const actionSpacing = 8;

        this._actionButtons.playPause = new Button(
            this._scene,
            0, 0,
            actionButtonWidth,
            actionButtonHeight,
            'Pause',
            () => this._callbacks.onPlayPause(),
            colors
        );

        this._actionButtons.step = new Button(
            this._scene,
            0, 0,
            actionButtonWidth,
            actionButtonHeight,
            'Step',
            () => this._callbacks.onStep(),
            colors
        );

        this._actionButtons.reset = new Button(
            this._scene,
            0, 0,
            actionButtonWidth,
            actionButtonHeight,
            'Reset',
            () => this._callbacks.onReset(),
            colors
        );
    }

    /**
     * Handle speed button click.
     * @param {number} index - Speed index
     * @private
     */
    _onSpeedButtonClick(index) {
        this._speedIndex = index;
        this._updateSpeedButtonSelection();
        if (this._callbacks.onSpeedChange) {
            this._callbacks.onSpeedChange(index);
        }
    }

    /**
     * Update speed button selection visual state.
     * @private
     */
    _updateSpeedButtonSelection() {
        this._speedButtons.forEach((btn, i) => {
            btn.setSelected(i === this._speedIndex);
        });
    }

    /**
     * Update the control panel state.
     */
    update() {
        const status = this._simulation.getStatus();
        const isTerminal = status !== 'Running' && status !== 'Paused';

        // Update play/pause button
        if (isTerminal) {
            this._actionButtons.playPause.setEnabled(false);
            this._actionButtons.playPause._text.setText('Play');
        } else {
            this._actionButtons.playPause.setEnabled(true);
            this._actionButtons.playPause._text.setText(this._isRunning ? 'Pause' : 'Play');
        }

        // Update step button
        this._actionButtons.step.setEnabled(!this._isRunning && !isTerminal);

        // Reset always enabled
        this._actionButtons.reset.setEnabled(true);
    }

    /**
     * Set the running state (called from SimulationScene).
     * @param {boolean} running - True if running
     */
    setRunning(running) {
        this._isRunning = running;
    }

    /**
     * Get the current speed index.
     * @returns {number}
     */
    getSpeedIndex() {
        return this._speedIndex;
    }

    /**
     * Resize and reposition all buttons.
     * @param {number} x - Left position
     * @param {number} y - Top position
     * @param {number} width - Available width
     * @param {number} height - Available height
     */
    resize(x, y, width, height) {
        const speeds = this._simulation.getConfig().SPEED_OPTIONS;
        const speedButtonWidth = 50;
        const speedButtonHeight = 30;
        const speedSpacing = 5;

        // Speed buttons: horizontal row at top
        const totalSpeedWidth = speeds.length * speedButtonWidth + (speeds.length - 1) * speedSpacing;
        const speedStartX = x + (width - totalSpeedWidth) / 2;
        const speedY = y + 20;

        this._speedButtons.forEach((btn, i) => {
            const btnX = speedStartX + i * (speedButtonWidth + speedSpacing) + speedButtonWidth / 2;
            btn.setPosition(btnX, speedY + speedButtonHeight / 2);
        });

        // Action buttons: vertical stack below speed buttons
        const actionButtonWidth = 100;
        const actionButtonHeight = 35;
        const actionSpacing = 8;
        const actionStartY = speedY + speedButtonHeight + 20;
        const actionCenterX = x + width / 2;

        this._actionButtons.playPause.setPosition(
            actionCenterX,
            actionStartY + actionButtonHeight / 2
        );
        this._actionButtons.step.setPosition(
            actionCenterX,
            actionStartY + actionButtonHeight + actionSpacing + actionButtonHeight / 2
        );
        this._actionButtons.reset.setPosition(
            actionCenterX,
            actionStartY + 2 * (actionButtonHeight + actionSpacing) + actionButtonHeight / 2
        );
    }

    /**
     * Get the required width for the control panel.
     * @returns {number}
     */
    getRequiredWidth() {
        const speeds = this._simulation.getConfig().SPEED_OPTIONS;
        const speedButtonWidth = 50;
        const speedSpacing = 5;
        const totalSpeedWidth = speeds.length * speedButtonWidth + (speeds.length - 1) * speedSpacing;
        return Math.max(totalSpeedWidth, 120); // At least wide enough for action buttons
    }

    /**
     * Get the required height for the control panel.
     * @returns {number}
     */
    getRequiredHeight() {
        return 200; // Approximate height for speed row + 3 action buttons
    }

    /**
     * Destroy all buttons.
     */
    destroy() {
        this._speedButtons.forEach(btn => btn.destroy());
        Object.values(this._actionButtons).forEach(btn => btn.destroy());
    }
}