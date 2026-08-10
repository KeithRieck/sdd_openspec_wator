/**
 * Boot scene — initial scene that transitions to the simulation.
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  /**
   * Preload assets if needed.
   */
  preload() {
    // No external assets to preload; transition immediately in create
  }

  /**
   * Create and start the simulation scene.
   */
  create() {
    this.scene.start('SimulationScene');
  }
}
