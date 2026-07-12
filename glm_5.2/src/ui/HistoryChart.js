import { COLORS, HISTORY_WINDOW } from '../config.js';

/**
 * A rolling population history chart drawn with Phaser Graphics.
 *
 * Stores one {fish, sharks} sample per chronon, capped at HISTORY_WINDOW
 * samples. Draws two polylines (green fish, blue sharks) auto-scaled to the
 * maximum population in the current window. No titles, labels, or ticks.
 */
export default class HistoryChart {
    /**
     * Create the chart helper.
     *
     * @param {Phaser.Scene} scene - The owning scene.
     * @param {Array<{fish: number, sharks: number}>} history - The simulation's rolling history array to read from.
     */
    constructor(scene, history) {
        this.scene = scene;
        this.graphics = scene.add.graphics();
        this.history = history;
        this.maxSamples = HISTORY_WINDOW;
    }

    /**
     * Draw the chart into a rectangular region.
     *
     * Auto-scales the vertical axis to the max population value in the
     * current window and draws green (fish) and blue (sharks) polylines.
     *
     * @param {number} x - Left position.
     * @param {number} y - Top position.
     * @param {number} w - Width.
     * @param {number} h - Height.
     */
    draw(x, y, w, h) {
        this.graphics.clear();

        // Background.
        this.graphics.fillStyle(COLORS.chartBackground, 1);
        this.graphics.fillRect(x, y, w, h);

        // Subtle border.
        this.graphics.lineStyle(1, COLORS.panelBorder, 1);
        this.graphics.strokeRect(x, y, w, h);

        const samples = this.history;
        if (samples.length < 2) {
            return;
        }

        // Auto-scale to max population in window.
        let maxPop = 0;
        for (const s of samples) {
            if (s.fish > maxPop) maxPop = s.fish;
            if (s.sharks > maxPop) maxPop = s.sharks;
        }
        if (maxPop === 0) {
            return;
        }

        const n = samples.length;
        const dx = w / (this.maxSamples - 1);
        const offsetX = w - (n - 1) * dx; // right-align most recent samples

        // Draw fish polyline (green).
        this.graphics.lineStyle(2, COLORS.fish, 1);
        this.graphics.beginPath();
        this.graphics.moveTo(x + offsetX, y + h - (samples[0].fish / maxPop) * h);
        for (let i = 1; i < n; i++) {
            this.graphics.lineTo(
                x + offsetX + i * dx,
                y + h - (samples[i].fish / maxPop) * h
            );
        }
        this.graphics.strokePath();

        // Draw sharks polyline (blue).
        this.graphics.lineStyle(2, COLORS.shark, 1);
        this.graphics.beginPath();
        this.graphics.moveTo(x + offsetX, y + h - (samples[0].sharks / maxPop) * h);
        for (let i = 1; i < n; i++) {
            this.graphics.lineTo(
                x + offsetX + i * dx,
                y + h - (samples[i].sharks / maxPop) * h
            );
        }
        this.graphics.strokePath();
    }

    /**
     * Destroy the chart's Phaser graphics object.
     */
    destroy() {
        this.graphics.destroy();
    }
}
