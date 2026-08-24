import { COLORS } from '../config.js';

/**
 * Unlabeled rolling fish and shark population chart.
 * wator-app requirement 11.
 */
export default class HistoryChart {
    /**
     * @param {Phaser.Scene} scene - Owning scene.
     */
    constructor(scene) {
        this.scene = scene;
        this.graphics = scene.add.graphics();
        this.bounds = { x: 0, y: 0, width: 0, height: 0 };
    }

    /**
     * @param {{x: number, y: number, width: number, height: number}} bounds - Chart box.
     */
    resize(bounds) {
        this.bounds = bounds;
    }

    /**
     * Draw both series against a shared visible-window maximum.
     *
     * @param {{fish: number, sharks: number}[]} history - Rolling samples.
     */
    draw(history) {
        const { x, y, width, height } = this.bounds;
        const graphics = this.graphics;
        graphics.clear();
        graphics.fillStyle(COLORS.chartBackground, 1);
        graphics.fillRoundedRect(x, y, width, height, 8);

        if (!history || history.length === 0 || width < 2 || height < 2) {
            return;
        }

        let maxValue = 1;
        for (const sample of history) {
            if (sample.fish > maxValue) {
                maxValue = sample.fish;
            }
            if (sample.sharks > maxValue) {
                maxValue = sample.sharks;
            }
        }

        this._strokeSeries(history, 'fish', COLORS.fish, maxValue);
        this._strokeSeries(history, 'sharks', COLORS.shark, maxValue);
    }

    /**
     * @param {{fish: number, sharks: number}[]} history - Samples.
     * @param {string} key - Series field.
     * @param {number} color - Stroke color.
     * @param {number} maxValue - Shared Y max.
     * @private
     */
    _strokeSeries(history, key, color, maxValue) {
        const { x, y, width, height } = this.bounds;
        const pad = 8;
        const innerWidth = width - pad * 2;
        const innerHeight = height - pad * 2;
        const last = history.length - 1;
        const graphics = this.graphics;
        graphics.lineStyle(2, color, 1);
        graphics.beginPath();
        history.forEach((sample, index) => {
            const px = x + pad + (last === 0 ? innerWidth / 2 : (index / last) * innerWidth);
            const py = y + pad + innerHeight - (sample[key] / maxValue) * innerHeight;
            if (index === 0) {
                graphics.moveTo(px, py);
            } else {
                graphics.lineTo(px, py);
            }
        });
        graphics.strokePath();
    }
}
