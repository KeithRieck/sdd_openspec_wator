import BootScene from './scenes/BootScene.js';
import SimulationScene from './scenes/SimulationScene.js';

/**
 * Create the full-window Phaser game and register the service worker.
 * wator-app requirements 2 and 14.
 */
const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: document.body,
    backgroundColor: '#071422',
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: window.innerWidth,
        height: window.innerHeight
    },
    scene: [BootScene, SimulationScene]
});

if ('serviceWorker' in navigator) {
    const workerUrl = new URL('../sw.js', import.meta.url);
    navigator.serviceWorker.register(workerUrl).catch(() => {
        // Best-effort PWA registration; first load still depends on the CDN.
    });
}

export default game;
