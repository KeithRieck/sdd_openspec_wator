/**
 * Main entry point for the Wa-Tor simulation app.
 * Initializes Phaser and starts the game.
 */
import { BootScene } from './scenes/BootScene.js';
import { SimulationScene } from './scenes/SimulationScene.js';

// Phaser configuration
const config = {
    type: Phaser.AUTO,
    width: '100%',
    height: '100%',
    backgroundColor: 0x000000,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [BootScene, SimulationScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    }
};

// Create and start the Phaser game
const game = new Phaser.Game(config);

// Export for potential debugging
window.watorGame = game;
