/**
 * Boot scene: minimal pass-through that immediately starts the simulation
 * scene. The two-scene structure follows Phaser convention while keeping the
 * boot scene trivial.
 */
export default class BootScene extends Phaser.Scene {
    /**
     * Construct the boot scene with a stable key so the main scene can
     * reference it.
     */
    constructor() {
        super('BootScene');
    }

    /**
     * Phaser lifecycle: called once when the scene is created. Starts the
     * simulation scene immediately.
     */
    create() {
        this.scene.start('SimulationScene');
    }
}
