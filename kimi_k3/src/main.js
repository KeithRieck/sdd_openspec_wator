/**
 * Application entry point. Creates the Phaser game with a resize-aware
 * Scale Manager and registers the app's scenes (AS-R2 / AC 3, 5).
 */
import { BootScene } from './scenes/BootScene.js';
import { SimulationScene } from './scenes/SimulationScene.js';
import { COLOR_WATER } from './config.js';

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: document.body,
  backgroundColor: COLOR_WATER,
  scale: {
    mode: Phaser.Scale.RESIZE,
    width: window.innerWidth,
    height: window.innerHeight,
  },
  scene: [BootScene, SimulationScene],
});

export default game;
