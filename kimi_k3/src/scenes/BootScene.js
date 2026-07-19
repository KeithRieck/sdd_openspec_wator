/**
 * Boot scene: preloads PWA icon assets, then starts the simulation
 * scene. The app launches straight into a running simulation (CS-R3 / AC 1).
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super('boot');
  }

  /** Preloads icon assets used by the manifest and install prompt. */
  preload() {
    this.load.image('icon-192', 'assets/icon-192.png');
    this.load.image('icon-512', 'assets/icon-512.png');
  }

  /** Starts the main simulation scene. */
  create() {
    this.scene.start('simulation');
  }
}
