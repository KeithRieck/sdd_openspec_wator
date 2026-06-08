import { CONFIG } from './config.js';
import { BootScene } from './scenes/BootScene.js';
import { SimulationScene } from './scenes/SimulationScene.js';

/**
 * Application entry point.
 *
 * Creates the Phaser game that fills the browser window, registers the boot and
 * simulation scenes, and registers the service worker for lightweight PWA
 * support. Phaser itself is loaded as a global from the CDN script tag in
 * index.html, so it is referenced here as `window.Phaser`.
 */
const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#04121d',
  scale: {
    mode: Phaser.Scale.RESIZE,
    width: '100%',
    height: '100%',
  },
  scene: [BootScene, SimulationScene],
});

// Expose for debugging in the browser console without affecting gameplay.
window.__wator = { game, CONFIG };

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Relative URL so registration works when served from a repository subpath.
    navigator.serviceWorker.register('./sw.js').catch(() => {
      /* Offline support is best-effort; ignore registration failures. */
    });
  });
}
