import { COLORS } from '../config.js';

/**
 * The per-chronon world renderer for the Wa-Tor simulation.
 *
 * Owns a Phaser `Graphics` object and renders the water background plus one
 * circle per entity each frame. Entity appearance (color, radius factor) is
 * read polymorphically from each entity, so this renderer has no knowledge
 * of entity subtypes (fish, shark) and requires no type checks.
 */
export default class WatorWorld {
    /**
     * Create the world renderer.
     *
     * @param {Phaser.Scene} scene - The owning scene.
     * @param {WatorSimulation} sim - The simulation instance to read entities from.
     */
    constructor(scene, sim) {
        this.scene = scene;
        this.sim = sim;
        this.graphics = scene.add.graphics();
    }

    /**
     * Draw the world into a rectangular region.
     *
     * Clears the graphics, fills the region with the water color, then draws
     * one circle per entity. Each entity's color and radius are read from
     * the entity's polymorphic `color` and `radiusFactor` properties.
     *
     * @param {number} x - Left position of the world region.
     * @param {number} y - Top position of the world region.
     * @param {number} w - Width of the world region.
     * @param {number} h - Height of the world region.
     */
    draw(x, y, w, h) {
        const g = this.graphics;
        g.clear();

        // Water background.
        g.fillStyle(COLORS.water, 1);
        g.fillRect(x, y, w, h);

        const cellW = w / this.sim.width;
        const cellH = h / this.sim.height;
        const cellSize = Math.min(cellW, cellH);

        for (const entity of this.sim.entities.values()) {
            const cx = x + (entity.x + 0.5) * cellW;
            const cy = y + (entity.y + 0.5) * cellH;
            g.fillStyle(entity.color, 1);
            g.fillCircle(cx, cy, cellSize * entity.radiusFactor);
        }
    }

    /**
     * Destroy the world renderer's Phaser graphics object.
     */
    destroy() {
        this.graphics.destroy();
    }
}
