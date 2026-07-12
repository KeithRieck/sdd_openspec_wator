/**
 * Boot scene — minimal entry scene that immediately starts the SimulationScene.
 *
 * Phaser requires at least one scene in the game config; this scene exists
 * only to transition into the main simulation scene.
 */
export default class BootScene extends Phaser.Scene {
    /**
     * Construct the boot scene with its scene key.
     */
    constructor() {
        super('BootScene');
    }

    /**
     * Phaser create lifecycle: immediately start the simulation scene.
     */
    create() {
        this.scene.start('SimulationScene');
    }
}
