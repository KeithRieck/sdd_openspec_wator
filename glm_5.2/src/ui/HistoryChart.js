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
     */
    constructor(scene) {
        this.scene = scene;
        this.graphics = scene.add.graphics();
        this.samples = [];
        this.maxSamples = HISTORY_WINDOW;
    }

    /**
     * Append a population sample, trimming to the rolling window.
     *
     * @param {number} fish - Current fish count.
     * @param {number} sharks - Current shark count.
     */
    push(fish, sharks) {
        this.samples.push({ fish, sharks });
        if (this.samples.length > this.maxSamples) {
            this.samples.shift();
        }
    }

    /**
     * Clear all samples (used on reset).
     */
    clear() {
        this.samples = [];
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

        if (this.samples.length < 2) {
            return;
        }

        // Auto-scale to max population in window.
        let maxPop = 0;
        for (const s of this.samples) {
            if (s.fish > maxPop) maxPop = s.fish;
            if (s.sharks > maxPop) maxPop = s.sharks;
        }
        if (maxPop === 0) {
            return;
        }

        const n = this.samples.length;
        const dx = w / (this.maxSamples - 1);
        const offsetX = w - (n - 1) * dx; // right-align most recent samples

        // Draw fish polyline (green).
        this.graphics.lineStyle(2, COLORS.fish, 1);
        this.graphics.beginPath();
        this.graphics.moveTo(x + offsetX, y + h - (this.samples[0].fish / maxPop) * h);
        for (let i = 1; i < n; i++) {
            this.graphics.lineTo(
                x + offsetX + i * dx,
                y + h - (this.samples[i].fish / maxPop) * h
            );
        }
        this.graphics.strokePath();

        // Draw sharks polyline (blue).
        this.graphics.lineStyle(2, COLORS.shark, 1);
        this.graphics.beginPath();
        this.graphics.moveTo(x + offsetX, y + h - (this.samples[0].sharks / maxPop) * h);
        for (let i = 1; i < n; i++) {
            this.graphics.lineTo(
                x + offsetX + i * dx,
                y + h - (this.samples[i].sharks / maxPop) * h
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
