import { COLORS, LAYOUT } from '../config.js';

/**
 * A Phaser-native button rendered as a rounded rectangle with a text label.
 *
 * Provides familiar OS-style visual states: normal, hover, active/pressed,
 * disabled, and selected (for segmented controls like the speed buttons).
 * All drawing uses Phaser Graphics and Text; no DOM elements.
 */
export default class PhaserButton {
    /**
     * Create a button in a scene.
     *
     * @param {Phaser.Scene} scene - The Phaser scene owning this button.
     * @param {number} x - Left position.
     * @param {number} y - Top position.
     * @param {number} width - Button width.
     * @param {number} height - Button height.
     * @param {string} label - Button label text.
     * @param {Function} onClick - Callback invoked on click (no args).
     */
    constructor(scene, x, y, width, height, label, onClick) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.label = label;
        this.onClick = onClick;
        this.enabled = true;
        this.selected = false;
        this.hovered = false;
        this.pressed = false;

        this.bg = scene.add.graphics();
        this.bg.setPosition(x, y);
        this.text = scene.add.text(x + width / 2, y + height / 2, label, {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${LAYOUT.fontSize}px`,
            color: '#e0e0e0'
        });
        this.text.setOrigin(0.5, 0.5);

        this._setupInput();
        this.draw();
    }

    /**
     * Wire up Phaser pointer events for hover, press, and click.
     *
     * @private
     */
    _setupInput() {
        const hitArea = new Phaser.Geom.Rectangle(0, 0, this.width, this.height);
        this.bg.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

        this.bg.on('pointerover', () => {
            this.hovered = true;
            this.draw();
        });
        this.bg.on('pointerout', () => {
            this.hovered = false;
            this.pressed = false;
            this.draw();
        });
        this.bg.on('pointerdown', () => {
            if (!this.enabled) return;
            this.pressed = true;
            this.draw();
        });
        this.bg.on('pointerup', () => {
            this.pressed = false;
            this.draw();
            if (this.enabled && this.onClick) {
                this.onClick();
            }
        });
    }

    /**
     * Render the button background and label according to current state.
     */
    draw() {
        this.bg.clear();
        let fill = COLORS.buttonBg;
        if (!this.enabled) {
            fill = COLORS.buttonDisabled;
        } else if (this.selected) {
            fill = COLORS.buttonSelected;
        } else if (this.pressed) {
            fill = COLORS.buttonActive;
        } else if (this.hovered) {
            fill = COLORS.buttonHover;
        }

        const alpha = this.enabled ? 1.0 : 0.5;
        this.bg.fillStyle(fill, alpha);
        this.bg.fillRoundedRect(0, 0, this.width, this.height, LAYOUT.cornerRadius);

        // Border: stronger for selected, subtle otherwise.
        const borderColor = this.selected ? COLORS.buttonSelectedBorder : COLORS.panelBorder;
        this.bg.lineStyle(2, borderColor, alpha);
        this.bg.strokeRoundedRect(0, 0, this.width, this.height, LAYOUT.cornerRadius);

        this.text.setText(this.label);
        this.text.setAlpha(this.enabled ? 1.0 : 0.5);
    }

    /**
     * Enable or disable the button.
     *
     * @param {boolean} value - True to enable, false to disable.
     */
    setEnabled(value) {
        this.enabled = value;
        this.draw();
    }

    /**
     * Set the selected state (for segmented controls).
     *
     * @param {boolean} value - True if selected.
     */
    setSelected(value) {
        this.selected = value;
        this.draw();
    }

    /**
     * Update the button label text.
     *
     * @param {string} label - New label.
     */
    setLabel(label) {
        this.label = label;
        this.draw();
    }

    /**
     * Resize the button and refresh its interactive hit area.
     *
     * @param {number} width - New width.
     * @param {number} height - New height.
     */
    setSize(width, height) {
        this.width = width;
        this.height = height;
        this.bg.removeInteractive();
        const hitArea = new Phaser.Geom.Rectangle(0, 0, width, height);
        this.bg.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);
        this.draw();
    }

    /**
     * Move the button to a new position.
     *
     * @param {number} x - New left position.
     * @param {number} y - New top position.
     */
    setPosition(x, y) {
        this.x = x;
        this.y = y;
        this.bg.setPosition(x, y);
        this.text.setPosition(x + this.width / 2, y + this.height / 2);
        this.draw();
    }

    /**
     * Destroy the button's Phaser objects.
     */
    destroy() {
        this.bg.destroy();
        this.text.destroy();
    }
}
