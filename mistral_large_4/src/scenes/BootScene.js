/**
 * Boot scene for the Wa-Tor simulation.
 *
 * This scene handles any preloading (currently none needed since Phaser
 * loads from CDN) and immediately transitions to the SimulationScene.
 *
 * @see prd-v001.md requirement #1 (app starts directly in simulation)
 */

/**
 * Phaser Boot Scene - transitions immediately to the simulation.
 */
export class BootScene extends Phaser.Scene {
    /**
     * Create the boot scene.
     */
    constructor() {
        super({ key: 'BootScene' });
    }

    /**
     * Preload any assets (currently none - Phaser loads from CDN).
     */
    preload() {
        // No assets to preload - Phaser is loaded via CDN script tag
        // All rendering uses Graphics objects, no image assets needed
    }

    /**
     * Create the scene and transition to SimulationScene.
     */
    create() {
        // Immediately start the simulation scene (PRD #1)
        this.scene.start('SimulationScene');
    }
}

export default BootScene;
