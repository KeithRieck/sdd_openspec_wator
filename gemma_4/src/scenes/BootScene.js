/**
 * BootScene handles the initial loading and setup of the application.
 */
export class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // No external assets to load as we are using Graphics drawing.
        // This is where we would load images/sounds if needed.
    }

    create() {
        // Transition to the main simulation scene
        this.scene.start('SimulationScene');
    }
}
