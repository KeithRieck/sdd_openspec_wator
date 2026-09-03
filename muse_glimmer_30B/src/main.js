import { BootScene } from './scenes/BootScene.js';
import { SimulationScene } from './scenes/SimulationScene.js';

/**
 * Phaser game configuration
 */
const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: '#000000',
    scene: [BootScene, SimulationScene],
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

/**
 * Create Phaser game instance
 */
const game = new Phaser.Game(config);

/**
 * Register service worker for PWA support
 */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => {
                console.log('Service Worker registered:', registration.scope);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    });
}
