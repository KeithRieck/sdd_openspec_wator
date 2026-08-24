/**
 * First Phaser scene. Loads same-origin icons, then starts the simulation.
 * wator-app requirement 1.
 */
export default class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    /**
     * Load PWA icons so they are same-origin cached if the scene needs them.
     */
    preload() {
        this.load.image('icon-192', 'assets/icon-192.png');
        this.load.image('icon-512', 'assets/icon-512.png');
    }

    /**
     * Jump straight into the running world. No landing page.
     */
    create() {
        this.scene.start('SimulationScene');
    }
}
