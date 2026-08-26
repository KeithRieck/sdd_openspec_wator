/**
 * Boot scene.
 *
 * The app has no landing or instruction screen (simulation-app R1): the boot
 * scene immediately transitions to the SimulationScene, which starts the
 * simulation running.
 */
export default class BootScene extends Phaser.Scene {
    /**
     * Create the boot scene.
     */
    constructor() {
        super('BootScene');
    }

    /**
     * Transition straight into the simulation.
     */
    create() {
        this.scene.start('SimulationScene');
    }
}
