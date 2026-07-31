/**
 * @fileoverview Phaser boot scene that loads assets and starts main scene
 */

/**
 * Phaser scene for booting the application
 */
export class BootScene extends Phaser.Scene {

  /**
   * Create the BootScene with unique key
   */
  constructor() {
    super({ key: 'BootScene' });
  }

  /**
   * Preload assets
   */
  preload() {
    // No assets to preload in this implementation
    // All rendering is done with Phaser Graphics
  }
  
  /**
   * Create the boot scene
   */
  create() {
    // Start the main simulation scene
    this.scene.start('SimulationScene');
  }
}