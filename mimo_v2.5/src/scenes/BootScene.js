/**
 * Boot scene that transitions immediately to the simulation.
 *
 * Exists to satisfy the Phaser scene lifecycle. Could hold future
 * asset preloading if needed.
 *
 * @extends Phaser.Scene
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  create() {
    this.scene.start('SimulationScene');
  }
}
