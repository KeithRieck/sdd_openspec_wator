/**
 * Population history chart component.
 *
 * Renders a rolling 500-sample population history chart across the bottom
 * of the window using Phaser Graphics. Draws fish and shark population
 * lines in green and blue with no text labels.
 *
 * @see prd-v001.md requirements #44-47
 */
import { Config } from '../config.js';

/**
 * Phaser-native history chart component.
 * Renders population history as line chart without labels.
 */
export class HistoryChart {
    /**
     * Create a history chart.
     * @param {Phaser.Scene} scene - The Phaser scene owning this chart
     * @param {number} x - Left position
     * @param {number} y - Top position
     * @param {number} width - Chart width
     * @param {number} height - Chart height
     */
    constructor(scene, x, y, width, height) {
        /** @type {Phaser.Scene} */
        this.scene = scene;

        /** @type {number} */
        this.x = x;

        /** @type {number} */
        this.y = y;

        /** @type {number} */
        this.width = width;

        /** @type {number} */
        this.height = height;

        /** @type {Phaser.GameObjects.Graphics} */
        this.graphics = scene.add.graphics();
        this.graphics.setPosition(x, y);
    }

    /**
     * Update the chart with new population history data.
     * @param {Array<{chronon: number, fish: number, sharks: number}>} history - Population history
     */
    update(history) {
        this.graphics.clear();

        if (!history || history.length < 2) {
            return;
        }

        // Find max population for scaling
        let maxPop = 1;
        for (const sample of history) {
            maxPop = Math.max(maxPop, sample.fish, sample.sharks);
        }

        // Calculate scaling factors
        const xScale = this.width / Math.max(1, history.length - 1);
        const yScale = this.height / maxPop;

        // Draw fish line (green) - PRD #46
        this.graphics.lineStyle(2, Config.FISH_COLOR, 1);
        this.graphics.beginPath();
        for (let i = 0; i < history.length; i++) {
            const x = i * xScale;
            const y = this.height - (history[i].fish * yScale);
            if (i === 0) {
                this.graphics.moveTo(x, y);
            } else {
                this.graphics.lineTo(x, y);
            }
        }
        this.graphics.strokePath();

        // Draw shark line (blue) - PRD #46
        this.graphics.lineStyle(2, Config.SHARK_COLOR, 1);
        this.graphics.beginPath();
        for (let i = 0; i < history.length; i++) {
            const x = i * xScale;
            const y = this.height - (history[i].sharks * yScale);
            if (i === 0) {
                this.graphics.moveTo(x, y);
            } else {
                this.graphics.lineTo(x, y);
            }
        }
        this.graphics.strokePath();
    }

    /**
     * Set the position and size of the chart.
     * @param {number} x - New left position
     * @param {number} y - New top position
     * @param {number} width - New width
     * @param {number} height - New height
     */
    setPosition(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.graphics.setPosition(x, y);
    }

    /**
     * Destroy the chart.
     */
    destroy() {
        this.graphics.destroy();
    }
}

export default HistoryChart;
