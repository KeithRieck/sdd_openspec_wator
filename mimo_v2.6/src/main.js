/**
 * Application entry point for the Wa-Tor web app.
 *
 * Constructs the Phaser game owning the entire browser window (spec Req 2.3)
 * with the two application scenes and registers the lightweight service worker
 * for PWA support (spec Req 31.1). All application code loads as ES2020
 * modules (spec Req 2.1); Phaser itself comes from the CDN script tag in
 * index.html and is available as the global `Phaser`.
 */

import BootScene from './scenes/BootScene.js';
import SimulationScene from './scenes/SimulationScene.js';

/**
 * Build the Phaser game configuration and start the game.
 *
 * Scale mode RESIZE makes the canvas track the window size so the scene can
 * recompute layout on every resize (spec Req 5.1). The boot scene immediately
 * hands off to the simulation scene, so the app lands in a running simulation
 * with no landing page (spec Req 1.1).
 */
function startApp() {
    const config = {
        type: Phaser.AUTO,
        backgroundColor: '#0a1c33',
        // Let the browser's own frame delivery gate the loop ("as normally as
        // the browser allows", spec Req 28.1). Phaser's visibility-change
        // sleep/wake is disabled so a throttled or hidden tab simply receives
        // fewer frames; no time is compensated and the scene's clamped frame
        // delta prevents catch-up bursts (spec Req 28.2).
        disableVisibilityChange: true,
        scale: {
            mode: Phaser.Scale.RESIZE,
            width: window.innerWidth,
            height: window.innerHeight
        },
        scene: [BootScene, SimulationScene]
    };
    new Phaser.Game(config);
}

/**
 * Register the service worker with a relative scope so PWA caching works
 * from a repository subpath (spec Req 31.1, design D12). Failures are
 * tolerated: PWA support is lightweight and best-effort (spec Req 31.2).
 */
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').catch(() => {
            // Best-effort only; the app runs fine without a service worker.
        });
    }
}

startApp();
registerServiceWorker();
