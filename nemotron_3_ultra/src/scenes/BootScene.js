/**
 * Boot scene for the Wa-Tor simulation.
 * Initializes the Phaser game and registers the service worker for PWA support.
 * @module scenes/BootScene
 */
import SimulationScene from './SimulationScene.js';

/**
 * Boot scene - loads assets and transitions to SimulationScene.
 */
export default class BootScene extends Phaser.Scene {
    /**
     * Create the boot scene.
     */
    constructor() {
        super({ key: 'BootScene' });
    }

    /**
     * Preload assets (none needed for this simulation - all rendering is via Graphics).
     */
    preload() {
        // No assets to preload - all rendering uses Phaser Graphics
    }

    /**
     * Create the boot scene - register service worker and start simulation scene.
     */
    create() {
        // Register service worker for PWA support
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('./sw.js')
                .then(registration => {
                    console.log('Service Worker registered:', registration.scope);
                })
                .catch(error => {
                    console.log('Service Worker registration failed:', error);
                });
        }

        // Start the main simulation scene
        this.scene.start('SimulationScene');
    }
}