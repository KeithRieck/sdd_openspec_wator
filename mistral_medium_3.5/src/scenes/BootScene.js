/**
 * BootScene - Preloads assets and initializes the Phaser game.
 * This scene handles the initial loading before transitioning to the main simulation.
 */
export class BootScene extends Phaser.Scene {
    /**
     * Creates a new BootScene.
     */
    constructor() {
        super({ key: 'BootScene' });
    }

    /**
     * Preloads any necessary assets.
     * Currently minimal since we use Graphics for all rendering.
     */
    preload() {
        // No assets to preload - using Graphics for all rendering
    }

    /**
     * Creates the scene and transitions to the simulation.
     */
    create() {
        // Transition to the main simulation scene
        this.scene.start('SimulationScene');
    }
}
