/**
 * Main entry point for the Wa-Tor simulation.
 * Creates the Phaser game instance with BootScene and SimulationScene.
 * @module main
 */
import BootScene from './scenes/BootScene.js';
import SimulationScene from './scenes/SimulationScene.js';

/**
 * Game configuration.
 * @type {Phaser.Types.Core.GameConfig}
 */
const gameConfig = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'game-container',
    backgroundColor: '#001133',
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [BootScene, SimulationScene],
    render: {
        antialias: true,
        pixelArt: false,
    },
};

/**
 * Initialize the game when DOM is ready.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Create game container if it doesn't exist
    let container = document.getElementById('game-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'game-container';
        document.body.appendChild(container);
    }

    // Create Phaser game instance
    window.game = new Phaser.Game(gameConfig);
});