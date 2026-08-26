/**
 * Application entry point.
 *
 * Boots the Phaser game with a full-window canvas and registers the
 * BootScene (which transitions to the SimulationScene). All rendering and
 * input is Phaser-native; there is no DOM overlay (simulation-app R1, R3).
 */
import BootScene from './scenes/BootScene.js';
import SimulationScene from './scenes/SimulationScene.js';

/**
 * Create and start the Phaser game.
 *
 * The canvas fills the browser window and resizes with it so the scene can
 * recompute its layout on resize (simulation-app R6).
 */
function bootGame() {
    const config = {
        type: Phaser.AUTO,
        parent: document.body,
        backgroundColor: '#0b2545',
        scale: {
            mode: Phaser.Scale.RESIZE,
            autoCenter: Phaser.Scale.CENTER_BOTH
        },
        scene: [BootScene, SimulationScene]
    };

    // eslint-disable-next-line no-new
    const game = new Phaser.Game(config);
    window.__game = game;
}

bootGame();
