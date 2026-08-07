/**
 * BootScene handles the initial loading and setup of the application.
 */
export class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // No external assets to load as we use Phaser.Graphics for everything.
        // This scene primarily serves as a transition to the SimulationScene.
    }

    create() {
        // Transition immediately to the SimulationScene
        this.scene.start('SimulationScene');
    }
}
