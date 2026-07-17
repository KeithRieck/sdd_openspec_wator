import { Config } from './config.js';
import { BootScene } from './scenes/BootScene.js';
import { SimulationScene } from './scenes/SimulationScene.js';

/**
 * Service Worker registration for offline PWA capabilities.
 */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Register sw.js using a relative path suitable for subpath deployments
    navigator.serviceWorker.register('./sw.js')
      .then((registration) => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch((error) => {
        console.error('ServiceWorker registration failed: ', error);
      });
  });
}

/**
 * Phaser Game Configuration.
 * Sets up a responsive, full-window canvas driven by BootScene and SimulationScene.
 * @type {Object}
 */
const gameConfig = {
  type: Phaser.AUTO,
  width: '100%',
  height: '100%',
  parent: 'game-container',
  backgroundColor: `#${Config.COLORS.WATER_BG.toString(16)}`,
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [BootScene, SimulationScene]
};

// Initialize the Phaser Game instance
new Phaser.Game(gameConfig);
