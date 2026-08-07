import { CONFIG } from './config.js';
import { BootScene } from './scenes/BootScene.js';
import { SimulationScene } from './scenes/SimulationScene.js';

/**
 * Main entry point for the Wa-Tor simulation web app.
 */
const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    mode: Phaser.Scale.RESIZE,
    backgroundColor: '#000000',
    scene: [
        BootScene,
        SimulationScene
    ],
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    }
};

// Initialize the Phaser game
new Phaser.Game(config);
