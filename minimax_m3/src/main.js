import BootScene from './scenes/BootScene.js';
import SimulationScene from './scenes/SimulationScene.js';
import { WATER_COLOR } from './config.js';

/**
 * Phaser game configuration. The background color is set to water so the
 * canvas does not flash white before SimulationScene draws its own world
 * background.
 */
const config = {
    type: Phaser.AUTO,
    parent: 'game',
    backgroundColor: WATER_COLOR,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: window.innerWidth,
        height: window.innerHeight
    },
    scene: [BootScene, SimulationScene]
};

/**
 * Bootstrap the application by instantiating the Phaser game.
 */
new Phaser.Game(config);
