/**
 * Left-side live statistics panel (spec Req 22.1).
 *
 * Shows the Chronon, Fish, Sharks, and Status values as Phaser-native text
 * objects (no DOM, spec Req 2.3). Fish and shark values use the same green
 * and blue palette as the world and history chart (spec Req 27.1).
 */
import { COLORS } from '../config.js';

export default class StatsPanel {
    /**
     * Create the four stat text objects.
     *
     * @param {Phaser.Scene} scene - The scene that owns this panel.
     */
    constructor(scene) {
        this.scene = scene;
        const base = { fontFamily: 'Arial, sans-serif', fontSize: '18px', color: COLORS.panelText };
        this.chrononText = scene.add.text(0, 0, 'Chronon: 0', base);
        this.fishText = scene.add.text(0, 0, 'Fish: 0', { ...base, color: COLORS.fishText });
        this.sharkText = scene.add.text(0, 0, 'Sharks: 0', { ...base, color: COLORS.sharkText });
        this.statusText = scene.add.text(0, 0, 'Status: Running', base);
        this.lines = [this.chrononText, this.fishText, this.sharkText, this.statusText];
    }

    /**
     * Position the panel within a rectangle, stacking the four lines
     * vertically (called on every layout pass, spec Req 5.1).
     *
     * @param {number} x - Left edge.
     * @param {number} y - Top edge.
     * @param {number} w - Available width.
     * @param {number} h - Available height.
     */
    setBounds(x, y, w, h) {
        const pad = 12;
        const lineStep = 30;
        this.lines.forEach((line, i) => {
            line.setPosition(x + pad, y + pad + i * lineStep);
        });
    }

    /**
     * Refresh the displayed values (spec Req 22.1).
     *
     * @param {number} chronon - Current chronon.
     * @param {number} fish - Live fish count.
     * @param {number} sharks - Live shark count.
     * @param {string} status - Status text (spec Req 26.1-26.4).
     */
    update(chronon, fish, sharks, status) {
        this.chrononText.setText(`Chronon: ${chronon}`);
        this.fishText.setText(`Fish: ${fish}`);
        this.sharkText.setText(`Sharks: ${sharks}`);
        this.statusText.setText(`Status: ${status}`);
    }

    /** Destroy the panel's Phaser objects. */
    destroy() {
        this.lines.forEach((line) => line.destroy());
    }
}
