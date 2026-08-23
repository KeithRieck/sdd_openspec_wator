/**
 * A Phaser-native button rendered as a rounded rectangle with a text label.
 *
 * Provides familiar OS-style visual states: normal, hover, active/pressed,
 * disabled, and selected (for segmented controls like the speed buttons).
 * All drawing uses Phaser Graphics and Text; no DOM elements.
 *
 * This class is self-contained: all default colors, font size, and corner
 * radius are hard-coded here. An optional `style` object may be passed to
 * override any subset of these values.
 */

/** Default style values used when no style (or a partial style) is given. */
const DEFAULT_STYLE = {
    bg: 0x1e4976,
    hover: 0x2a6a9e,
    active: 0x163a5c,
    disabled: 0x2a2a2a,
    selected: 0x4caf50,
    selectedBorder: 0x66bb6a,
    border: 0x1e4976,
    textColor: '#e0e0e0',
    fontSize: 16,
    cornerRadius: 8
};

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
     * @param {Object|null} [style=null] - Optional style overrides. Unspecified keys fall back to the
     *   defaults above.
     */
    constructor(scene, x, y, width, height, label, onClick, style = null) {
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

        this.style = style ? { ...DEFAULT_STYLE, ...style } : { ...DEFAULT_STYLE };

        this.bg = scene.add.graphics();
        this.bg.setPosition(x, y);
        this.text = scene.add.text(x + width / 2, y + height / 2, label, {
            fontFamily: 'Arial, sans-serif',
            fontSize: `${this.style.fontSize}px`,
            color: this.style.textColor
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
        let fill = this.style.bg;
        if (!this.enabled) {
            fill = this.style.disabled;
        } else if (this.selected) {
            fill = this.style.selected;
        } else if (this.pressed) {
            fill = this.style.active;
        } else if (this.hovered) {
            fill = this.style.hover;
        }

        const alpha = this.enabled ? 1.0 : 0.5;
        this.bg.fillStyle(fill, alpha);
        this.bg.fillRoundedRect(0, 0, this.width, this.height, this.style.cornerRadius);

        // Border: stronger for selected, subtle otherwise.
        const borderColor = this.selected ? this.style.selectedBorder : this.style.border;
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
        // Update the existing hit area geometry in-place to avoid tearing
        // down and re-creating the interactive setup (which would drop all
        // pointer event listeners wired in _setupInput).
        if (this.bg.input) {
            this.bg.input.hitArea.setTo(0, 0, width, height);
        }
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
