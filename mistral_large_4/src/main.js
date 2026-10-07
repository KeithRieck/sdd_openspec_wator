/**
 * Main entry point for the Wa-Tor simulation app.
 *
 * Creates the Phaser game instance with BootScene and SimulationScene,
 * configured to own the entire browser window.
 *
 * @see prd-v001.md requirements #1, #3, #5
 */
import { Config } from './config.js';
import { BootScene } from './scenes/BootScene.js';
import { SimulationScene } from './scenes/SimulationScene.js';

/**
 * Phaser game configuration.
 * (PRD #3, #5)
 */
const gameConfig = {
    type: Phaser.AUTO,
    parent: 'game-container',
    backgroundColor: Config.PHASER_BACKGROUND_COLOR,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: '100%',
        height: '100%'
    },
    scene: [BootScene, SimulationScene],
    render: {
        antialias: true,
        pixelArt: false
    }
};

// Create and start the game
// The app starts directly in the simulation at 10x speed (PRD #1)
const game = new Phaser.Game(gameConfig);

// Export for potential debugging (not required by PRD)
export default game;
