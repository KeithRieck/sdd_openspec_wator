import { Config } from '../config.js';

/**
 * BootScene is the initial startup scene for the game.
 * It handles basic setup and immediately transitions to the main simulation scene.
 * @extends Phaser.Scene
 */
export class BootScene extends Phaser.Scene {
  /**
   * Initialize the BootScene.
   */
  constructor() {
    super({ key: 'BootScene' });
  }

  /**
   * Preload critical startup assets if any.
   */
  preload() {
    // No external image assets are loaded, conforming to the zero-sprites design
  }

  /**
   * Boot Scene creation. Displays a title and transitions to SimulationScene.
   */
  create() {
    const { width, height } = this.scale;

    // Display a simple text-based logo in the center of the screen
    this.add.text(width / 2, height / 2, 'WA-TOR', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '48px',
      fontWeight: 'bold',
      color: `#${Config.COLORS.TEXT.toString(16)}`
    }).setOrigin(0.5);

    // Transition directly to the SimulationScene, as requested
    this.scene.start('SimulationScene');
  }
}
