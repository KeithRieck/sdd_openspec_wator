import PhaserButton from './PhaserButton.js';
import { SPEED_OPTIONS, LAYOUT } from '../config.js';

/**
 * A Phaser-native control panel.
 *
 * Composes {@link PhaserButton}s for the action controls (Play/Pause, Step,
 * Reset — each on its own row) and a horizontal speed row of 1x/5x/10x/30x/60x
 * with the active speed selected (ui-controls R2, R3). The panel invokes the
 * callbacks supplied by the scene; it does not touch the simulation directly.
 */
export default class ControlPanel {
    /**
     * Create the control panel.
     *
     * @param {Phaser.Scene} scene - The owning scene.
     * @param {number} x - Left position.
     * @param {number} y - Top position.
     * @param {number} width - Panel width in pixels.
     * @param {Object} callbacks - Scene callbacks.
     * @param {Function} callbacks.onPlayPause - Invoked when Play/Pause is clicked.
     * @param {Function} callbacks.onStep - Invoked when Step is clicked.
     * @param {Function} callbacks.onReset - Invoked when Reset is clicked.
     * @param {Function} callbacks.onSpeed - Invoked with the chosen speed (chronons/sec).
     */
    constructor(scene, x, y, width, callbacks) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.width = width;
        this.callbacks = callbacks;
        this.buttonHeight = LAYOUT.buttonHeight;
        this.gap = LAYOUT.buttonGap;

        this.playPause = new PhaserButton(
            scene, 0, 0, width, this.buttonHeight, 'Pause',
            () => this.callbacks.onPlayPause()
        );
        this.step = new PhaserButton(
            scene, 0, 0, width, this.buttonHeight, 'Step',
            () => this.callbacks.onStep()
        );
        this.reset = new PhaserButton(
            scene, 0, 0, width, this.buttonHeight, 'Reset',
            () => this.callbacks.onReset()
        );

        // Speed segmented control: one horizontal row (ui-controls R3.1).
        const speedWidth = (width - (SPEED_OPTIONS.length - 1) * this.gap) / SPEED_OPTIONS.length;
        this.speedButtons = SPEED_OPTIONS.map((speed) => {
            const button = new PhaserButton(
                scene, 0, 0, speedWidth, this.buttonHeight, `${speed}x`,
                () => this.callbacks.onSpeed(speed)
            );
            button.speed = speed;
            return button;
        });

        this.setPosition(x, y);
    }

    /**
     * Lay out the action buttons (stacked rows) and the speed row.
     *
     * @param {number} x - Left position.
     * @param {number} y - Top position.
     */
    setPosition(x, y) {
        this.x = x;
        this.y = y;
        const row = this.buttonHeight + this.gap;
        this.playPause.setPosition(x, y);
        this.step.setPosition(x, y + row);
        this.reset.setPosition(x, y + row * 2);

        const speedY = y + row * 3 + this.gap;
        this.speedButtons.forEach((button, i) => {
            button.setPosition(x + i * (button.width + this.gap), speedY);
        });
    }

    /**
     * Total panel height in pixels.
     * @returns {number}
     */
    get height() {
        const row = this.buttonHeight + this.gap;
        return row * 3 + this.gap + this.buttonHeight;
    }

    /**
     * Reflect the running state: Step is disabled while running and the
     * Play/Pause label toggles (ui-controls R2.2, R4.2).
     *
     * @param {boolean} running - True if the simulation is running.
     */
    setRunning(running) {
        this.step.setEnabled(!running);
        this.playPause.setLabel(running ? 'Pause' : 'Play');
    }

    /**
     * Reflect the terminal state: Play is disabled and Reset is required
     * (ui-controls R7.2).
     *
     * @param {boolean} terminal - True if the simulation is terminal.
     */
    setTerminal(terminal) {
        this.playPause.setEnabled(!terminal);
        if (terminal) {
            this.playPause.setLabel('Play');
        }
    }

    /**
     * Mark the selected speed button.
     *
     * @param {number} speed - The selected speed in chronons per second.
     */
    setSpeed(speed) {
        for (const button of this.speedButtons) {
            button.setSelected(button.speed === speed);
        }
    }

    /**
     * Destroy all buttons in the panel.
     */
    destroy() {
        this.playPause.destroy();
        this.step.destroy();
        this.reset.destroy();
        for (const button of this.speedButtons) button.destroy();
    }
}
