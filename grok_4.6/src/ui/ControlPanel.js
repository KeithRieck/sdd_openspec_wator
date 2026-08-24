import { LAYOUT, SPEED_OPTIONS } from '../config.js';
import PhaserButton from './PhaserButton.js';

/**
 * Speed row plus Play/Pause, Step, and Reset.
 * wator-app requirements 8 and 9.
 */
export default class ControlPanel {
    /**
     * @param {Phaser.Scene} scene - Owning scene.
     * @param {{onSpeed: Function, onPlayPause: Function, onStep: Function, onReset: Function}} handlers
     */
    constructor(scene, handlers) {
        this.scene = scene;
        this.handlers = handlers;
        this.background = scene.add.graphics();
        this.speedButtons = SPEED_OPTIONS.map((speed) => new PhaserButton(
            scene,
            0,
            0,
            40,
            LAYOUT.minHit,
            `${speed}x`,
            () => this.handlers.onSpeed(speed)
        ));
        this.playButton = new PhaserButton(scene, 0, 0, 80, LAYOUT.minHit, 'Pause', () => {
            this.handlers.onPlayPause();
        });
        this.stepButton = new PhaserButton(scene, 0, 0, 80, LAYOUT.minHit, 'Step', () => {
            this.handlers.onStep();
        });
        this.resetButton = new PhaserButton(scene, 0, 0, 80, LAYOUT.minHit, 'Reset', () => {
            this.handlers.onReset();
        });
        this.bounds = { x: 0, y: 0, width: 0, height: 0 };
    }

    /**
     * Place the speed row and stacked action buttons.
     *
     * @param {{x: number, y: number, width: number, height: number}} bounds - Panel box.
     */
    resize(bounds) {
        this.bounds = bounds;
        this.background.clear();
        this.background.fillStyle(0x0d2137, 1);
        this.background.fillRoundedRect(bounds.x, bounds.y, bounds.width, bounds.height, 8);

        const pad = 10;
        const gap = 6;
        const innerWidth = bounds.width - pad * 2;
        const speedWidth = (innerWidth - gap * (this.speedButtons.length - 1)) / this.speedButtons.length;
        const speedHeight = Math.max(LAYOUT.minHit, 40);
        let y = bounds.y + pad;

        this.speedButtons.forEach((button, index) => {
            const x = bounds.x + pad + index * (speedWidth + gap);
            button.setSize(speedWidth, speedHeight);
            button.setPosition(x, y);
        });

        y += speedHeight + 12;
        const actionWidth = innerWidth;
        const actionHeight = Math.max(LAYOUT.minHit, 44);
        this.playButton.setSize(actionWidth, actionHeight);
        this.playButton.setPosition(bounds.x + pad, y);
        y += actionHeight + gap;
        this.stepButton.setSize(actionWidth, actionHeight);
        this.stepButton.setPosition(bounds.x + pad, y);
        y += actionHeight + gap;
        this.resetButton.setSize(actionWidth, actionHeight);
        this.resetButton.setPosition(bounds.x + pad, y);
    }

    /**
     * Sync selected speed and enabled states.
     *
     * @param {number} speed - Selected chronons per second.
     * @param {boolean} running - Whether the scene is playing.
     * @param {boolean} terminal - Whether the engine is extinct.
     */
    sync(speed, running, terminal) {
        this.speedButtons.forEach((button, index) => {
            button.setSelected(SPEED_OPTIONS[index] === speed);
        });
        this.playButton.setLabel(running ? 'Pause' : 'Play');
        this.playButton.setEnabled(!terminal);
        this.stepButton.setEnabled(!running && !terminal);
    }
}
