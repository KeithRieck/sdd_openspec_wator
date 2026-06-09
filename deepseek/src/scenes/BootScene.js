/**
 * Minimal boot scene that transitions immediately to the SimulationScene.
 * No assets to preload since all rendering is procedural Graphics.
 */
export class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
    }

    create() {
        this.scene.start('SimulationScene');
    }
}
