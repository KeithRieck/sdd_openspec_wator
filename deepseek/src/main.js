import { BootScene } from './scenes/BootScene.js';
import { SimulationScene } from './scenes/SimulationScene.js';

/**
 * Wa-Tor Phaser game entry point.
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
