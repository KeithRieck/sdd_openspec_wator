/**
 * Population history chart for the Wa-Tor simulation.
 * Renders fish and shark population lines using Phaser Graphics at the bottom of the window.
 * @module ui/HistoryChart
 */
import Config from '../config.js';

/**
 * Renders population history as a line chart using Phaser Graphics.
 */
export class HistoryChart {
    /**
     * Create a new history chart.
     * @param {Phaser.Scene} scene - The Phaser scene
     * @param {WatorSimulation} simulation - The simulation instance
     */
    constructor(scene, simulation) {
        this._scene = scene;
        this._simulation = simulation;
        this._graphics = scene.add.graphics();
        this._graphics.setDepth(5);

        // Layout properties
        this._x = 0;
        this._y = 0;
        this._width = 0;
        this._height = 0;
        this._maxSamples = simulation.getConfig().HISTORY_WINDOW;
    }

    /**
     * Resize and reposition the chart.
     * @param {number} x - Left position
     * @param {number} y - Top position
     * @param {number} width - Available width
     * @param {number} height - Available height
     */
    resize(x, y, width, height) {
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
    }

    /**
     * Render the population history chart.
     */
    render() {
        const history = this._simulation.getHistory();
        const fishHistory = history.getFishHistory();
        const sharkHistory = history.getSharkHistory();

        if (fishHistory.length === 0 && sharkHistory.length === 0) {
            return;
        }

        this._graphics.clear();

        // Find max population for scaling
        let maxPop = 1;
        for (const count of fishHistory) {
            if (count > maxPop) maxPop = count;
        }
        for (const count of sharkHistory) {
            if (count > maxPop) maxPop = count;
        }

        // Add some padding
        maxPop *= 1.1;

        const padding = 10;
        const chartWidth = this._width - padding * 2;
        const chartHeight = this._height - padding * 2;
        const chartX = this._x + padding;
        const chartY = this._y + padding;

        // Draw background
        this._graphics.fillStyle(0x000000, 0.3);
        this._graphics.fillRect(chartX, chartY, chartWidth, chartHeight);

        // Draw fish line (green)
        this._drawLine(fishHistory, chartX, chartY, chartWidth, chartHeight, maxPop, Config.COLORS.FISH);

        // Draw shark line (blue)
        this._drawLine(sharkHistory, chartX, chartY, chartWidth, chartHeight, maxPop, Config.COLORS.SHARK);
    }

    /**
     * Draw a population line.
     * @param {number[]} history - Population history array
     * @param {number} chartX - Chart left position
     * @param {number} chartY - Chart top position
     * @param {number} chartWidth - Chart width
     * @param {number} chartHeight - Chart height
     * @param {number} maxPop - Maximum population for scaling
     * @param {number} color - Line color
     * @private
     */
    _drawLine(history, chartX, chartY, chartWidth, chartHeight, maxPop, color) {
        if (history.length < 2) return;

        this._graphics.lineStyle(2, color, 1);
        this._graphics.beginPath();

        const samplesToShow = Math.min(history.length, this._maxSamples);
        const startIndex = history.length - samplesToShow;

        for (let i = 0; i < samplesToShow; i++) {
            const index = startIndex + i;
            const value = history[index];
            const x = chartX + (i / (samplesToShow - 1)) * chartWidth;
            const y = chartY + chartHeight - (value / maxPop) * chartHeight;

            if (i === 0) {
                this._graphics.moveTo(x, y);
            } else {
                this._graphics.lineTo(x, y);
            }
        }

        this._graphics.strokePath();
    }

    /**
     * Get the required height for the chart.
     * @returns {number}
     */
    getRequiredHeight() {
        return 100; // Fixed height for chart
    }
}