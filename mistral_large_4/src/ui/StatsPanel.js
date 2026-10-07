/**
 * Stats panel displaying simulation statistics.
 *
 * Shows Chronon, Fish count, Sharks count, and Status on the left side
 * of the main world display using Phaser Text objects.
 *
 * @see prd-v001.md requirements #30, #41-43
 */
import { Config } from '../config.js';

/**
 * Phaser-native stats panel component.
 * Displays real-time simulation statistics.
 */
export class StatsPanel {
    /**
     * Create a stats panel.
     * @param {Phaser.Scene} scene - The Phaser scene owning this panel
     * @param {number} x - Left position
     * @param {number} y - Top position
     * @param {number} width - Panel width
     */
    constructor(scene, x, y, width) {
        /** @type {Phaser.Scene} */
        this.scene = scene;

        /** @type {number} */
        this.x = x;

        /** @type {number} */
        this.y = y;

        /** @type {number} */
        this.width = width;

        /** @type {Phaser.GameObjects.Text} */
        this.chrononText = scene.add.text(x, y, 'Chronon: 0', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px',
            color: Config.TEXT_COLOR
        });

        /** @type {Phaser.GameObjects.Text} */
        this.fishText = scene.add.text(x, y + 30, 'Fish: 0', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px',
            color: '#4caf50' // Green for fish
        });

        /** @type {Phaser.GameObjects.Text} */
        this.sharkText = scene.add.text(x, y + 60, 'Sharks: 0', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px',
            color: '#2196f3' // Blue for sharks
        });

        /** @type {Phaser.GameObjects.Text} */
        this.statusText = scene.add.text(x, y + 90, 'Status: Running', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px',
            color: Config.TEXT_COLOR
        });
    }

    /**
     * Update the stats display with current simulation state.
     * @param {object} stats - Stats object from WatorSimulation.getStats()
     * @param {number} stats.chronon - Current chronon count
     * @param {number} stats.fish - Current fish count
     * @param {number} stats.sharks - Current shark count
     * @param {string} stats.status - Current status string
     */
    update(stats) {
        this.chrononText.setText(`Chronon: ${stats.chronon}`);
        this.fishText.setText(`Fish: ${stats.fish}`);
        this.sharkText.setText(`Sharks: ${stats.sharks}`);
        this.statusText.setText(`Status: ${stats.status}`);

        // Color-code the status
        if (stats.isTerminal) {
            this.statusText.setColor('#ff5252'); // Red for terminal states
        } else if (stats.status === 'Paused') {
            this.statusText.setColor('#ffc107'); // Yellow for paused
        } else {
            this.statusText.setColor(Config.TEXT_COLOR); // Default for running
        }
    }

    /**
     * Set the position of the stats panel.
     * @param {number} x - New left position
     * @param {number} y - New top position
     */
    setPosition(x, y) {
        this.x = x;
        this.y = y;
        this.chrononText.setPosition(x, y);
        this.fishText.setPosition(x, y + 30);
        this.sharkText.setPosition(x, y + 60);
        this.statusText.setPosition(x, y + 90);
    }

    /**
     * Destroy the stats panel and its text objects.
     */
    destroy() {
        this.chrononText.destroy();
        this.fishText.destroy();
        this.sharkText.destroy();
        this.statusText.destroy();
    }
}

export default StatsPanel;
