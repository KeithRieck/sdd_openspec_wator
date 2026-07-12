import BootScene from './scenes/BootScene.js';
import SimulationScene from './scenes/SimulationScene.js';
import { COLORS } from './config.js';

/**
 * App entry point.
 *
 * Creates the Phaser.Game instance configured to fill the browser window,
 * with the BootScene and SimulationScene registered. Phaser 4.x is loaded
 * globally from the CDN script tag in index.html.
 */

/** Phaser game configuration. */
const config = {
    type: Phaser.AUTO,
    parent: document.body,
    backgroundColor: COLORS.water,
    scale: {
        mode: Phaser.Scale.RESIZE,
        width: window.innerWidth,
        height: window.innerHeight
    },
    scene: [BootScene, SimulationScene]
};

/** The Phaser game instance. */
const game = new Phaser.Game(config);
