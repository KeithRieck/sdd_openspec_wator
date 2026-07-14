import { COLORS } from './config.js';
import { BootScene } from './scenes/BootScene.js';
import { SimulationScene } from './scenes/SimulationScene.js';

/**
 * Application entry: create the Phaser game and register the service worker.
 * Spec: app-shell R1, R3–R4.
 */

const container = document.getElementById('game-container');

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: container ?? undefined,
  backgroundColor: COLORS.background,
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: window.innerWidth,
    height: window.innerHeight
  },
  scene: [BootScene, SimulationScene],
  banner: false
});

/**
 * Register the service worker with a relative URL for subpath deploys.
 */
function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    return;
  }
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch((error) => {
      console.warn('Service worker registration failed:', error);
    });
  });
}

registerServiceWorker();

export { game };
