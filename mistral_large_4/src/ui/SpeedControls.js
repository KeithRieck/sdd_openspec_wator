/**
 * Speed controls panel with 1x, 5x, 10x, 30x, and 60x buttons.
 *
 * Displays speed selection buttons in a horizontal row with the selected
 * speed highlighted using the PhaserButton component.
 *
 * @see prd-v001.md requirements #32, #34-35, #48
 */
import { Config } from '../config.js';
import PhaserButton from './PhaserButton.js';

/**
 * Phaser-native speed controls component.
 * Manages speed selection buttons with selected state highlighting.
 */
export class SpeedControls {
    /**
     * Create speed controls.
     * @param {Phaser.Scene} scene - The Phaser scene owning this panel
     * @param {number} x - Left position
     * @param {number} y - Top position
     * @param {Function} onSpeedChange - Callback when speed is changed (receives new speed)
     */
    constructor(scene, x, y, onSpeedChange) {
        /** @type {Phaser.Scene} */
        this.scene = scene;

        /** @type {number} */
        this.x = x;

        /** @type {number} */
        this.y = y;

        /** @type {Function} */
        this.onSpeedChange = onSpeedChange;

        /** @type {number} Currently selected speed */
        this.currentSpeed = Config.DEFAULT_SPEED;

        /** @type {Map<number, PhaserButton>} Map of speed value to button */
        this.buttons = new Map();

        // Create buttons for each speed option (PRD #32)
        let buttonX = x;
        let buttonY = y;
        let buttonNum = 0;
        for (const speed of Config.SPEED_OPTIONS) {
            const button = new PhaserButton(
                scene,
                buttonX,
                buttonY,
                Config.SPEED_BUTTON_WIDTH,
                Config.BUTTON_HEIGHT,
                `${speed}x`,
                () => this.selectSpeed(speed)
            );

            this.buttons.set(speed, button);
            buttonNum += 1;
            if (buttonNum % 2 == 0) {
                buttonX = x;
                buttonY += Config.SPEED_BUTTON_WIDTH
            } else {
                buttonX += Config.SPEED_BUTTON_WIDTH + Config.BUTTON_SPACING;
            }
        }

        // Set initial selection
        this.updateSelection();
    }

    /**
     * Select a new speed.
     * @param {number} speed - The speed to select (chronons per second)
     */
    selectSpeed(speed) {
        if (!Config.SPEED_OPTIONS.includes(speed)) {
            return;
        }

        this.currentSpeed = speed;
        this.updateSelection();
        this.onSpeedChange(speed);
    }

    /**
     * Update button selection states to reflect current speed.
     * @private
     */
    updateSelection() {
        for (const [speed, button] of this.buttons) {
            button.setSelected(speed === this.currentSpeed);
        }
    }

    /**
     * Get the currently selected speed.
     * @returns {number} Current speed in chronons per second
     */
    getSpeed() {
        return this.currentSpeed;
    }

    /**
     * Set the position of the speed controls.
     * @param {number} x - New left position
     * @param {number} y - New top position
     */
    setPosition(x, y) {
        this.x = x;
        this.y = y;

        let buttonX = x;
        for (const speed of Config.SPEED_OPTIONS) {
            const button = this.buttons.get(speed);
            button.setPosition(buttonX, y);
            buttonX += Config.SPEED_BUTTON_WIDTH + Config.BUTTON_SPACING;
        }
    }

    /**
     * Destroy the speed controls and its buttons.
     */
    destroy() {
        for (const button of this.buttons.values()) {
            button.bg.destroy();
            button.text.destroy();
        }
        this.buttons.clear();
    }
}

export default SpeedControls;
