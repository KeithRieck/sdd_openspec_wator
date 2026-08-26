import { COLORS } from '../config.js';

/**
 * A Phaser-native stats readout showing Chronon, Fish, Sharks, and Status.
 *
 * Rendered with Graphics and Text only (no DOM), placed on the left side of
 * the world display (ui-controls R1). The scene calls {@link StatsPanel#update}
 * each frame to reflect the live simulation.
 */
export default class StatsPanel {
    /**
     * Create the stats panel.
     *
     * @param {Phaser.Scene} scene - The owning scene.
     * @param {number} x - Left position.
     * @param {number} y - Top position.
     * @param {number} width - Panel width in pixels.
     */
    constructor(scene, x, y, width) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.width = width;
        this.rowHeight = 26;
        this.padding = 12;
        this.height = this.padding * 2 + this.rowHeight * 4;

        this.bg = scene.add.graphics();
        this._buildTexts();
        this.setPosition(x, y);
    }

    /**
     * Build the label and value text objects for the four rows.
     *
     * @private
     */
    _buildTexts() {
        const style = {
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px',
            color: COLORS.text
        };
        const labels = ['Chronon', 'Fish', 'Sharks', 'Status'];
        this.labels = [];
        this.values = [];
        for (let i = 0; i < labels.length; i++) {
            const label = this.scene.add.text(0, 0, labels[i], style);
            const value = this.scene.add.text(0, 0, '', { ...style, align: 'right' });
            this.labels.push(label);
            this.values.push(value);
        }
    }

    /**
     * Update the displayed values.
     *
     * @param {number} chronon - Current chronon count.
     * @param {number} fish - Current fish count.
     * @param {number} sharks - Current shark count.
     * @param {string} status - Current status string.
     */
    update(chronon, fish, sharks, status) {
        this.values[0].setText(String(chronon));
        this.values[1].setText(String(fish));
        this.values[2].setText(String(sharks));
        this.values[3].setText(status);
    }

    /**
     * Move and size the panel, repositioning its background and text.
     *
     * @param {number} x - Left position.
     * @param {number} y - Top position.
     */
    setPosition(x, y) {
        this.x = x;
        this.y = y;
        this.bg.clear();
        this.bg.fillStyle(COLORS.panelBg, 0.85);
        this.bg.fillRoundedRect(x, y, this.width, this.height, 8);

        for (let i = 0; i < 4; i++) {
            const rowY = y + this.padding + i * this.rowHeight;
            this.labels[i].setPosition(x + this.padding, rowY);
            this.values[i].setPosition(x + this.width - this.padding, rowY);
            this.values[i].setOrigin(1, 0);
        }
    }

    /**
     * Destroy the panel's Phaser objects.
     */
    destroy() {
        this.bg.destroy();
        for (const t of this.labels) t.destroy();
        for (const t of this.values) t.destroy();
    }
}
