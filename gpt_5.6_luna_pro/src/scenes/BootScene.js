/** Initial Phaser scene that transfers control to the simulation scene. */
export class BootScene extends Phaser.Scene {
  /** Construct the boot scene. */
  constructor() {
    super('BootScene');
  }

  /** Start the first interactive scene. */
  create() {
    this.scene.start('SimulationScene');
  }
}
