/**
 * Bottom population history chart (spec Req 27.1).
 *
 * Draws the fish and shark population lines over the rolling `500`-chronon
 * window as Phaser `Graphics` polylines in the same green and blue as the
 * world and stats, with no titles or text labels (spec Req 27.1, 46, 47).
 * The vertical scale auto-adjusts to the population maximum within the
 * window (with a small floor), per design D10.
 */
import { COLORS, HISTORY_LENGTH } from '../config.js';

/** Minimum vertical scale so isolated spikes stay visible (design D10). */
const SCALE_FLOOR = 10;

export default class HistoryChart {
    /**
     * Create the chart graphics object.
     *
     * @param {Phaser.Scene} scene - The scene that owns this chart.
     */
    constructor(scene) {
        this.scene = scene;
        this.gfx = scene.add.graphics();
        this.x = 0;
        this.y = 0;
        this.w = 0;
        this.h = 0;
    }

    /**
     * Set the chart rectangle (called on every layout pass, spec Req 5.1).
     *
     * @param {number} x - Left edge.
     * @param {number} y - Top edge.
     * @param {number} w - Width (the chart spans the window bottom, spec Req 27.1).
     * @param {number} h - Height.
     */
    setBounds(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    /**
     * Redraw both population lines from the rolling history window.
     *
     * Samples map left (oldest) to right (newest) across the full width for
     * the `500`-chronon window, so lines scroll as the window rolls. No text
     * is drawn anywhere in the chart (spec Req 27.1).
     *
     * @param {{fish: number, sharks: number}[]} history - Rolling samples, one per chronon.
     */
    draw(history) {
        this.gfx.clear();
        this.gfx.fillStyle(COLORS.chartBg, 1);
        this.gfx.fillRect(this.x, this.y, this.w, this.h);
        if (history.length === 0) {
            return;
        }
        let max = SCALE_FLOOR;
        for (const s of history) {
            if (s.fish > max) max = s.fish;
            if (s.sharks > max) max = s.sharks;
        }
        this._drawLine(history, max, 'fish', COLORS.fish);
        this._drawLine(history, max, 'sharks', COLORS.shark);
    }

    /**
     * Stroke one population polyline.
     *
     * @private
     * @param {{fish: number, sharks: number}[]} history - Rolling samples.
     * @param {number} max - Vertical scale maximum in individuals.
     * @param {'fish'|'sharks'} key - Which population to draw.
     * @param {number} color - Line color.
     */
    _drawLine(history, max, key, color) {
        const padV = 6;
        const usableH = this.h - 2 * padV;
        const stepX = this.w / (HISTORY_LENGTH - 1);
        this.gfx.lineStyle(2, color, 1);
        this.gfx.beginPath();
        history.forEach((s, i) => {
            const x = this.x + i * stepX;
            const y = this.y + padV + usableH * (1 - s[key] / max);
            if (i === 0) {
                this.gfx.moveTo(x, y);
            } else {
                this.gfx.lineTo(x, y);
            }
        });
        this.gfx.strokePath();
    }

    /** Destroy the chart's Phaser objects. */
    destroy() {
        this.gfx.destroy();
    }
}
