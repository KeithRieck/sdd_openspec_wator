import { COLORS, FISH_RADIUS_RATIO, SHARK_RADIUS_RATIO } from '../config.js';

/**
 * Draws water and occupants with Phaser Graphics.
 * wator-app requirement 4.
 */
export default class WorldView {
    /**
     * @param {Phaser.Scene} scene - Owning scene.
     */
    constructor(scene) {
        this.scene = scene;
        this.graphics = scene.add.graphics();
        this.bounds = { x: 0, y: 0, width: 0, height: 0 };
        this.cellSize = 1;
        this.offsetX = 0;
        this.offsetY = 0;
    }

    /**
     * Fit the world into a rectangle while preserving aspect ratio.
     *
     * @param {{x: number, y: number, width: number, height: number}} bounds - Available area.
     * @param {number} columns - Grid width.
     * @param {number} rows - Grid height.
     */
    resize(bounds, columns, rows) {
        this.bounds = bounds;
        const cell = Math.max(1, Math.min(bounds.width / columns, bounds.height / rows));
        this.cellSize = cell;
        const drawnWidth = cell * columns;
        const drawnHeight = cell * rows;
        this.offsetX = bounds.x + (bounds.width - drawnWidth) / 2;
        this.offsetY = bounds.y + (bounds.height - drawnHeight) / 2;
    }

    /**
     * Immediate occupancy redraw. No sprites or movement tweens.
     *
     * @param {object} snapshot - Engine snapshot.
     */
    draw(snapshot) {
        const graphics = this.graphics;
        graphics.clear();
        graphics.fillStyle(COLORS.water, 1);
        graphics.fillRect(
            this.offsetX,
            this.offsetY,
            this.cellSize * snapshot.width,
            this.cellSize * snapshot.height
        );

        const fishRadius = this.cellSize * FISH_RADIUS_RATIO;
        const sharkRadius = this.cellSize * SHARK_RADIUS_RATIO;

        for (const occupant of snapshot.occupants) {
            const cx = this.offsetX + (occupant.x + 0.5) * this.cellSize;
            const cy = this.offsetY + (occupant.y + 0.5) * this.cellSize;
            if (occupant.type === 'shark') {
                graphics.fillStyle(COLORS.shark, 1);
                graphics.fillCircle(cx, cy, sharkRadius);
            } else {
                graphics.fillStyle(COLORS.fish, 1);
                graphics.fillCircle(cx, cy, fishRadius);
            }
        }
    }
}
