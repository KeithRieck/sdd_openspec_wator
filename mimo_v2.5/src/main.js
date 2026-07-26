/**
 * Application entry point.
 *
 * Creates the Phaser game instance with BootScene and SimulationScene.
 * Phaser loads from CDN via index.html script tag; this module bootstraps
 * the game configuration and starts the simulation.
 *
 * @module main
 */
import { CONFIG } from './config.js';
import { BootScene } from './scenes/BootScene.js';
import { SimulationScene } from './scenes/SimulationScene.js';

/**
 * Phaser game configuration.
 * Scales to fill the browser window with a dark water background.
 */
const gameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  backgroundColor: CONFIG.waterColor,
  scale: {
    mode: Phaser.Scale.RESIZE,
    width: '100%',
    height: '100%',
  },
  scene: [BootScene, SimulationScene],
};

const game = new Phaser.Game(gameConfig);
