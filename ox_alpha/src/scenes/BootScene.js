/**
 * @file Boot scene that hands off to the SimulationScene.
 */

import { SimulationScene } from './SimulationScene.js';

/**
 * Minimal boot scene (design D4).
 *
 * There are no textures or assets to preload because all rendering uses
 * Phaser Graphics (AC 50), so this scene exists to satisfy the file
 * plan (AC 2) and immediately starts {@link SimulationScene}, which in
 * turn starts the simulation running at the default speed with no
 * landing page (AC 1).
 */
export class BootScene extends Phaser.Scene {
  /**
   * Creates the boot scene with its Phaser scene key.
   */
  constructor() {
    super('BootScene');
  }

  /**
   * Starts the simulation scene immediately.
   *
   * @returns {void}
   */
  create() {
    this.scene.start(SimulationScene.sceneKey);
  }
}
