import { COLORS } from '../config.js';

/**
 * Left-side Chronon, Fish, Sharks, and Status labels.
 * wator-app requirement 10.
 */
export default class StatsPanel {
    /**
     * @param {Phaser.Scene} scene - Owning scene.
     */
    constructor(scene) {
        this.scene = scene;
        this.background = scene.add.graphics();
        this.chrononText = this._makeText();
        this.fishText = this._makeText(COLORS.fish);
        this.sharkText = this._makeText(COLORS.shark);
        this.statusText = this._makeText();
        this.bounds = { x: 0, y: 0, width: 0, height: 0 };
        this.horizontal = false;
    }

    /**
     * @param {number|string} [color] - Optional hex fill converted to CSS.
     * @returns {Phaser.GameObjects.Text}
     * @private
     */
    _makeText(color) {
        const css = typeof color === 'number'
            ? `#${color.toString(16).padStart(6, '0')}`
            : COLORS.text;
        return this.scene.add.text(0, 0, '', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px',
            color: css
        });
    }

    /**
     * @param {{x: number, y: number, width: number, height: number}} bounds - Panel box.
     * @param {boolean} horizontal - True for the stacked narrow header row.
     */
    resize(bounds, horizontal = false) {
        this.bounds = bounds;
        this.horizontal = horizontal;
        this.background.clear();
        this.background.fillStyle(COLORS.panel, 1);
        this.background.fillRoundedRect(bounds.x, bounds.y, bounds.width, bounds.height, 8);

        if (horizontal) {
            const y = bounds.y + bounds.height / 2;
            const slot = bounds.width / 4;
            this.chrononText.setPosition(bounds.x + 10, y).setOrigin(0, 0.5);
            this.fishText.setPosition(bounds.x + slot + 10, y).setOrigin(0, 0.5);
            this.sharkText.setPosition(bounds.x + slot * 2 + 10, y).setOrigin(0, 0.5);
            this.statusText.setPosition(bounds.x + slot * 3 + 10, y).setOrigin(0, 0.5);
            return;
        }

        const left = bounds.x + 12;
        const top = bounds.y + 16;
        this.chrononText.setPosition(left, top).setOrigin(0, 0);
        this.fishText.setPosition(left, top + 36).setOrigin(0, 0);
        this.sharkText.setPosition(left, top + 72).setOrigin(0, 0);
        this.statusText.setPosition(left, top + 108).setOrigin(0, 0);
    }

    /**
     * @param {object} snapshot - Engine snapshot.
     * @param {boolean} running - Scene playback flag.
     */
    draw(snapshot, running) {
        let status = snapshot.status;
        if (!snapshot.terminal) {
            status = running ? 'Running' : 'Paused';
        }
        this.chrononText.setText(`Chronon ${snapshot.chronon}`);
        this.fishText.setText(`Fish ${snapshot.fishCount}`);
        this.sharkText.setText(`Sharks ${snapshot.sharkCount}`);
        this.statusText.setText(`Status ${status}`);
    }
}
