/**
 * World renderer for the Wa-Tor simulation.
 * Draws the grid using Phaser Graphics - water background, fish as green circles, sharks as blue circles.
 * @module ui/WorldRenderer
 */
import Config from '../config.js';

/**
 * Renders the simulation world using Phaser Graphics.
 */
export class WorldRenderer {
    /**
     * Create a new world renderer.
     * @param {Phaser.Scene} scene - The Phaser scene
     * @param {WatorSimulation} simulation - The simulation instance
     */
    constructor(scene, simulation) {
        this._scene = scene;
        this._simulation = simulation;
        this._graphics = scene.add.graphics();
        this._graphics.setDepth(1);

        // Layout properties
        this._cellSize = 1;
        this._offsetX = 0;
        this._offsetY = 0;
        this._worldWidth = 0;
        this._worldHeight = 0;

        // Entity radius as fraction of cell size
        this._fishRadiusFactor = 0.35;
        this._sharkRadiusFactor = 0.45;
    }

    /**
     * Resize the renderer to fit the available area.
     * @param {number} availableWidth - Available width for the world
     * @param {number} availableHeight - Available height for the world
     * @param {number} offsetX - X offset for centering
     * @param {number} offsetY - Y offset for centering
     */
    resize(availableWidth, availableHeight, offsetX, offsetY) {
        const simWidth = this._simulation.getWidth();
        const simHeight = this._simulation.getHeight();

        // Calculate cell size to fit grid in available area while preserving aspect ratio
        const cellSizeX = availableWidth / simWidth;
        const cellSizeY = availableHeight / simHeight;
        this._cellSize = Math.min(cellSizeX, cellSizeY);

        this._worldWidth = simWidth * this._cellSize;
        this._worldHeight = simHeight * this._cellSize;

        // Center the world in the available area
        this._offsetX = offsetX + (availableWidth - this._worldWidth) / 2;
        this._offsetY = offsetY + (availableHeight - this._worldHeight) / 2;
    }

    /**
     * Render the current simulation state.
     */
    render() {
        const gridData = this._simulation.getGridData();
        const entities = this._simulation.getEntities();
        const width = this._simulation.getWidth();
        const height = this._simulation.getHeight();

        this._graphics.clear();

        // Draw water background
        this._graphics.fillStyle(Config.COLORS.WATER, 1);
        this._graphics.fillRect(
            this._offsetX,
            this._offsetY,
            this._worldWidth,
            this._worldHeight
        );

        // Draw entities
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = y * width + x;
                const entityId = gridData[index];
                if (entityId === 0) continue;

                const entity = entities.get(entityId);
                if (!entity) continue;

                const screenX = this._offsetX + x * this._cellSize + this._cellSize / 2;
                const screenY = this._offsetY + y * this._cellSize + this._cellSize / 2;

                if (entity.getType() === 'fish') {
                    this._drawFish(screenX, screenY);
                } else if (entity.getType() === 'shark') {
                    this._drawShark(screenX, screenY);
                }
            }
        }
    }

    /**
     * Draw a fish as a green circle.
     * @param {number} x - Screen X coordinate (center)
     * @param {number} y - Screen Y coordinate (center)
     * @private
     */
    _drawFish(x, y) {
        const radius = this._cellSize * this._fishRadiusFactor;
        this._graphics.fillStyle(Config.COLORS.FISH, 1);
        this._graphics.fillCircle(x, y, radius);
    }

    /**
     * Draw a shark as a blue circle (slightly larger than fish).
     * @param {number} x - Screen X coordinate (center)
     * @param {number} y - Screen Y coordinate (center)
     * @private
     */
    _drawShark(x, y) {
        const radius = this._cellSize * this._sharkRadiusFactor;
        this._graphics.fillStyle(Config.COLORS.SHARK, 1);
        this._graphics.fillCircle(x, y, radius);
    }

    /**
     * Get the world bounds for layout calculations.
     * @returns {Object} { x, y, width, height }
     */
    getBounds() {
        return {
            x: this._offsetX,
            y: this._offsetY,
            width: this._worldWidth,
            height: this._worldHeight,
        };
    }

    /**
     * Get the cell size.
     * @returns {number}
     */
    getCellSize() {
        return this._cellSize;
    }
}