import BootScene from './scenes/BootScene.js';
import SimulationScene from './scenes/SimulationScene.js';

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: '#001a33',
  scene: [BootScene, SimulationScene],
  parent: 'game-root',
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};

console.log('Wa-Tor main loaded', config);

const game = new Phaser.Game(config);
window.__WATOR_GAME = game;

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(error => {
      console.warn('Service worker registration failed:', error);
    });
  });
}
