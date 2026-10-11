// Phaser game configuration and entry point
// R14: Phaser integration - loads Phaser 4.x from CDN

import Phaser from 'phaser';
import { BootScene } from './src/scenes/BootScene.js';
import { SimulationScene } from './src/scenes/SimulationScene.js';

export class PhaserGame extends Phaser.Game {
    constructor() {
        const config = {
            type: Phaser.AUTO,
            width: window.innerWidth,
            height: window.innerHeight,
            parent: 'game-container',
            backgroundColor: '#1e4976',
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
                width: window.innerWidth,
                height: window.innerHeight
            },
            scene: [BootScene, SimulationScene],
            render: {
                antialias: false
            }
        };

        super(config);
    }
}
