/**
 * Stats panel for the Wa-Tor simulation.
 * Displays Chronon, Fish count, Shark count, and Status on the left side of the world display.
 * @module ui/StatsPanel
 */
import Config from '../config.js';

/**
 * Renders simulation statistics as Phaser Text objects.
 */
export class StatsPanel {
    /**
     * Create a new stats panel.
     * @param {Phaser.Scene} scene - The Phaser scene
     * @param {WatorSimulation} simulation - The simulation instance
     */
    constructor(scene, simulation) {
        this._scene = scene;
        this._simulation = simulation;
        this._textObjects = [];

        // Create text objects
        this._chrononText = scene.add.text(0, 0, 'Chronon: 0', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px',
            color: '#ffffff',
        }).setDepth(10);

        this._fishText = scene.add.text(0, 0, 'Fish: 0', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px',
            color: '#00ff00',
        }).setDepth(10);

        this._sharkText = scene.add.text(0, 0, 'Sharks: 0', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px',
            color: '#0080ff',
        }).setDepth(10);

        this._statusText = scene.add.text(0, 0, 'Status: Running', {
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px',
            color: '#ffffff',
        }).setDepth(10);

        this._textObjects = [
            this._chrononText,
            this._fishText,
            this._sharkText,
            this._statusText,
        ];
    }

    /**
     * Update the stats panel with current simulation data.
     */
    update() {
        this._chrononText.setText(`Chronon: ${this._simulation.getChronon()}`);
        this._fishText.setText(`Fish: ${this._simulation.getFishCount()}`);
        this._sharkText.setText(`Sharks: ${this._simulation.getSharkCount()}`);
        this._statusText.setText(`Status: ${this._simulation.getStatus()}`);

        // Color status text based on state
        const status = this._simulation.getStatus();
        let statusColor = '#ffffff';
        if (status === 'Sharks extinct') statusColor = '#ff8800';
        else if (status === 'Fish extinct') statusColor = '#ff4444';
        else if (status === 'Ecosystem collapsed') statusColor = '#ff0000';
        else if (status === 'Paused') statusColor = '#ffff00';
        this._statusText.setColor(statusColor);
    }

    /**
     * Resize and reposition the stats panel.
     * @param {number} x - Left position
     * @param {number} y - Top position
     * @param {number} width - Available width
     * @param {number} height - Available height
     */
    resize(x, y, width, height) {
        const lineHeight = 24;
        const padding = 10;

        this._chrononText.setPosition(x + padding, y + padding);
        this._fishText.setPosition(x + padding, y + padding + lineHeight);
        this._sharkText.setPosition(x + padding, y + padding + lineHeight * 2);
        this._statusText.setPosition(x + padding, y + padding + lineHeight * 3);
    }

    /**
     * Get the required width for the stats panel.
     * @returns {number}
     */
    getRequiredWidth() {
        return 140; // Approximate width needed for text
    }

    /**
     * Get the required height for the stats panel.
     * @returns {number}
     */
    getRequiredHeight() {
        return 100; // 4 lines * 24px + padding
    }
}