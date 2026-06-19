/**
 * Handles Phaser rendering of the Wa-Tor world.
 */
export default class WorldRenderer {
  /**
   * @param {Phaser.Scene} scene
   */
  constructor(scene) {
    this.scene = scene;
    this.graphics = scene.add.graphics();
    this.worldBounds = new Phaser.Geom.Rectangle(0, 0, 0, 0);
    this.cellSize = 1;
  }

  layout(worldX, worldY, worldWidth, worldHeight, gridWidth, gridHeight) {
    this.worldBounds.setTo(worldX, worldY, worldWidth, worldHeight);
    this.cellSize = Math.min(worldWidth / gridWidth, worldHeight / gridHeight);
  }

  render(state) {
    const { gridWidth, gridHeight, entities } = state;
    const { x, y, width, height } = this.worldBounds;
    this.graphics.clear();
    this.graphics.fillStyle(0x001a33, 1);
    this.graphics.fillRect(x, y, width, height);

    for (const entity of entities) {
      const px = x + entity.x * this.cellSize + this.cellSize / 2;
      const py = y + entity.y * this.cellSize + this.cellSize / 2;
      if (entity.type === 'fish') {
        this.graphics.fillStyle(0x00ff00, 1);
        this.graphics.fillCircle(px, py, this.cellSize * 0.35);
      } else if (entity.type === 'shark') {
        this.graphics.fillStyle(0x0000ff, 1);
        this.graphics.fillCircle(px, py, this.cellSize * 0.45);
      }
    }
  }
}
