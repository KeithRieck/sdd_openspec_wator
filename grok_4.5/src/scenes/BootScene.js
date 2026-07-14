/**
 * First Phaser scene. Performs minimal setup then starts the simulation.
 * Spec: app-shell R2–R3.
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  /**
   * Boot has no asset pack beyond CDN Phaser; jump straight into the sim.
   */
  create() {
    this.cameras.main.setBackgroundColor('#0b1c2c');
    this.scene.start('SimulationScene');
  }
}
