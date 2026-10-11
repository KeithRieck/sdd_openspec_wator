/**
 * BootScene - Preload, layout setup, Phaser game initialization.
 * R14: Phaser integration
 */
import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
    /**
     * Create the BootScene.
     * @param {string} key - Scene key
     */
    constructor(key) {
        super(key);
    }

    /**
     * Preload assets and set up layout.
     */
    create() {
        // Preload any assets here (icons, etc.)
        // This scene sets up the game layout and transitions to SimulationScene

        // Set up the game container
        const container = document.getElementById('game-container');
        if (container) {
            container.style.position = 'fixed';
            container.style.top = '0';
            container.style.left = '0';
            container.style.width = '100%';
            container.style.height = '100%';
            container.style.overflow = 'hidden';
        }

        // Transition to SimulationScene
        this.scene.start('SimulationScene');
    }
}
