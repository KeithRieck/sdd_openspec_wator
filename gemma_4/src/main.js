import { BootScene } from './BootScene.js';
import { SimulationScene } from './SimulationScene.js';
import { WatorSimulation } from '../simulation/WatorSimulation.js';
import { CONFIG } from '../config.js';

/**
 * Main entry point for the Wa-Tor Phaser application.
 */
const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    parent: 'phaser-app',
    backgroundColor: '#000000',
    scene: [BootScene, SimulationScene],
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    }
};

// Initialize the Phaser Game
window.game = new Phaser.Game(config);
