import { LAYOUT, STATUS } from '../config.js';

/**
 * The per-chronon stats text panel for the Wa-Tor simulation.
 *
 * Owns four Phaser `Text` objects (Chronon, Fish, Sharks, Status) and updates
 * their strings each frame from simulation state. Positioning is handled by
 * `layout()`, called on resize; content updates are handled by `draw()`,
 * called per-chronon.
 */
export default class StatsPanel {
    /**
     * Create the stats panel.
     *
     * @param {Phaser.Scene} scene - The owning scene.
     * @param {WatorSimulation} sim - The simulation instance to read state from.
     */
    constructor(scene, sim) {
        this.scene = scene;
        this.sim = sim;
        const style = StatsPanel._textStyle();
        this.texts = {
            chronon: scene.add.text(0, 0, '', style),
            fish: scene.add.text(0, 0, '', style),
            sharks: scene.add.text(0, 0, '', style),
            status: scene.add.text(0, 0, '', style)
        };
    }

    /**
     * Return the Phaser text style object for stats text.
     *
     * @returns {object} Phaser text style config.
     * @private
     */
    static _textStyle() {
        return {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${LAYOUT.statsFontSize}px`,
            color: '#e0e0e0'
        };
    }

    /**
     * Update the four stats text strings from simulation state.
     *
     * For non-terminal states, the displayed status reflects the running flag
     * (Running or Paused) rather than relying on status being set elsewhere.
     */
    draw() {
        this.texts.chronon.setText(`Chronon: ${this.sim.chronon}`);
        this.texts.fish.setText(`Fish: ${this.sim.fishCount}`);
        this.texts.sharks.setText(`Sharks: ${this.sim.sharkCount}`);
        const displayStatus = this.sim.isTerminal()
            ? this.sim.status
            : (this.sim.running ? STATUS.RUNNING : STATUS.PAUSED);
        this.texts.status.setText(`Status: ${displayStatus}`);
    }

    /**
     * Position the four stats text objects within a panel region.
     *
     * @param {number} x - Panel left.
     * @param {number} y - Panel top.
     * @param {number} w - Panel width.
     * @param {number} h - Panel height.
     */
    layout(x, y, w, h) {
        const pad = LAYOUT.panelPadding;
        const lh = LAYOUT.statsLineHeight;
        const tx = x + pad;
        let ty = y + pad;
        this.texts.chronon.setPosition(tx, ty); ty += lh;
        this.texts.fish.setPosition(tx, ty); ty += lh;
        this.texts.sharks.setPosition(tx, ty); ty += lh;
        this.texts.status.setPosition(tx, ty);
    }

    /**
     * Destroy all four stats text objects.
     */
    destroy() {
        this.texts.chronon.destroy();
        this.texts.fish.destroy();
        this.texts.sharks.destroy();
        this.texts.status.destroy();
    }
}
