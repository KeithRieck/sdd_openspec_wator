/**
 * Starts the simulation scene after Phaser has initialized the app shell.
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {}

  create() {
    this.scene.start("SimulationScene");
  }
}
