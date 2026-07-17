/**
 * First scene loaded by the game.
 *
 * The world is drawn entirely with Phaser `Graphics`, so there are no image
 * assets to preload before gameplay. The boot scene therefore exists only to
 * establish the required boot-first flow and immediately start the simulation.
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  /** Loads assets needed before gameplay. None are required for this game. */
  preload() {
    // Intentionally empty: the simulation renders procedurally via Graphics.
  }

  /** Starts the simulation scene as the final boot step. */
  create() {
    this.scene.start('SimulationScene');
  }
}
