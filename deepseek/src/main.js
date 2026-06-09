import { BootScene } from './scenes/BootScene.js';
import { SimulationScene } from './scenes/SimulationScene.js';

/**
 * Wa-Tor Phaser game entry point.
 * Configures the Phaser 4 game instance with auto-detected renderer,
 * responsive scaling, and the two scenes.
 */
const config = {
    type: Phaser.AUTO,
    parent: document.body,
    backgroundColor: '#0a0a2e',
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [BootScene, SimulationScene],
};

new Phaser.Game(config);
