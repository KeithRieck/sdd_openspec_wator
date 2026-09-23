/**
 * Boot scene for the Wa-Tor app.
 *
 * Configures full-window Phaser scale handling and hands off immediately to
 * the simulation scene, so the app lands directly in a running simulation at
 * `10x` with no landing or instruction screen (spec Req 1.1, 2.3).
 */
export default class BootScene extends Phaser.Scene {
    /** Create the boot scene under the key `BootScene`. */
    constructor() {
        super('BootScene');
    }

    /**
     * Set the canvas to track the browser window (RESIZE scale mode) and
     * start the simulation scene (spec Req 2.3, 5.1).
     */
    create() {
        this.scale.scaleMode = Phaser.Scale.RESIZE;
        this.scene.start('SimulationScene');
    }
}
