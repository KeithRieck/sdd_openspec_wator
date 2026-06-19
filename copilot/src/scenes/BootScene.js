/**
 * Boot scene loads the simulation scene immediately.
 */
import SimulationScene from './SimulationScene.js';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create() {
    this.scene.start('SimulationScene');
  }
}
