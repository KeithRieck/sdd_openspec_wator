import { COLORS } from '../config.js';

/**
 * A Phaser-native population history chart.
 *
 * Draws the rolling population history as a green fish line and a blue shark
 * line across the bottom of the window, using the same colors as the world
 * and stats (population-chart R1, R2). No titles or text labels are drawn
 * (population-chart R3).
 */
export default class PopulationChart {
    /**
     * Create the chart.
     *
     * @param {Phaser.Scene} scene - The owning scene.
     * @param {number} x - Left position.
     * @param {number} y - Top position.
     * @param {number} width - Chart width in pixels.
     * @param {number} height - Chart height in pixels.
     */
    constructor(scene, x, y, width, height) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.graphics = scene.add.graphics();
        this.setPosition(x, y, width, height);
    }

    /**
     * Move and size the chart region.
     *
     * @param {number} x - Left position.
     * @param {number} y - Top position.
     * @param {number} width - Chart width in pixels.
     * @param {number} height - Chart height in pixels.
     */
    setPosition(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    /**
     * Draw the fish and shark population lines for the given history.
     *
     * The y-axis auto-scales to the maximum population in the window so the
     * lines always use the full chart height.
     *
     * @param {Array<{fish:number,sharks:number}>} history - Rolling samples.
     */
    draw(history) {
        const g = this.graphics;
        g.clear();

        // Panel background.
        g.fillStyle(COLORS.panelBg, 0.85);
        g.fillRoundedRect(this.x, this.y, this.width, this.height, 8);

        if (!history || history.length < 2) {
            return;
        }

        let maxPop = 1;
        for (const sample of history) {
            if (sample.fish > maxPop) maxPop = sample.fish;
            if (sample.sharks > maxPop) maxPop = sample.sharks;
        }

        const pad = 6;
        const plotW = this.width - pad * 2;
        const plotH = this.height - pad * 2;
        const stepX = plotW / (history.length - 1);

        const drawLine = (key, color) => {
            g.lineStyle(2, color, 1);
            g.beginPath();
            for (let i = 0; i < history.length; i++) {
                const px = this.x + pad + i * stepX;
                const py = this.y + pad + plotH - (history[i][key] / maxPop) * plotH;
                if (i === 0) {
                    g.moveTo(px, py);
                } else {
                    g.lineTo(px, py);
                }
            }
            g.strokePath();
        };

        drawLine('fish', COLORS.fish);
        drawLine('sharks', COLORS.shark);
    }

    /**
     * Destroy the chart's Phaser objects.
     */
    destroy() {
        this.graphics.destroy();
    }
}
