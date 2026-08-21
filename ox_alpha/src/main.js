/**
 * @file Application entry point. Bootstraps the Phaser game that owns
 * the entire browser window (prd-v001.md AC 3, 5) and registers the
 * service worker for PWA support (AC 56).
 */

import { BootScene } from './scenes/BootScene.js';
import { SimulationScene } from './scenes/SimulationScene.js';

/**
 * Creates the Phaser game configuration and starts the app.
 *
 * The Scale manager RESIZE mode keeps the canvas matching the window so
 * the SimulationScene can recompute layout on every resize event
 * (prd-v001.md AC 9).
 */
function startGame() {
  const config = {
    type: Phaser.AUTO,
    parent: 'app',
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: '#0a2a4a',
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.NO_CENTER,
    },
    scene: [BootScene, SimulationScene],
  };
  return new Phaser.Game(config);
}

startGame();

// Register the service worker for lightweight PWA support (AC 56).
// Failure is non-fatal: the app still runs when service workers are
// unavailable (e.g. file:// or unsupported browsers).
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {
      /* best-effort only */
    });
  });
}
