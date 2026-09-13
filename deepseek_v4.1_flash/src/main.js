/**
 * Application entry point.
 *
 * Boots the Phaser game that owns the entire browser window
 * (`app-shell/static-hosting` §4.2). The app starts straight into the running
 * simulation with no landing page or instruction screen
 * (`app-shell/static-hosting` §3.2), so `BootScene` immediately hands control
 * to `SimulationScene`.
 *
 * Phaser is loaded from a CDN script tag in `index.html`, so it is available
 * as a global here rather than as an ES module import
 * (`app-shell/static-hosting` §1.1). Every other module in this project is a
 * standard ES2020 module (§1.2).
 */

import BootScene from './scenes/BootScene.js';
import SimulationScene from './scenes/SimulationScene.js';
import { COLORS } from './config.js';

/**
 * Create and start the Phaser game.
 *
 * The canvas is sized to the whole window and scaled on resize; the world's
 * own scale and layout are recomputed by the active scene, which keeps the
 * simulation grid dimensions untouched when the window changes size
 * (`simulation-ui/world-rendering` §5.5).
 *
 * @returns {object} The running Phaser game instance.
 */
function start() {
    return new Phaser.Game({
        type: Phaser.AUTO,
        parent: 'game',
        backgroundColor: COLORS.water,
        scale: {
            mode: Phaser.Scale.RESIZE,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: '100%',
            height: '100%'
        },
        // Resizing and re-layout are handled by SimulationScene so the scene
        // owns one single layout description.
        scene: [BootScene, SimulationScene]
    });
}

if (typeof Phaser === 'undefined') {
    // A first load with no network and no cached copy cannot start
    // (`app-shell/pwa-support` §2.5). Fail loudly rather than silently.
    throw new Error('Phaser failed to load. A network connection is required for the first visit.');
}

start();
