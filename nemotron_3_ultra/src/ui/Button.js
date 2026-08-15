/**
 * Reusable button component for Phaser UI.
 * Renders using Phaser Graphics and Text, handles pointer events.
 * @module ui/Button
 */

/**
 * Button states.
 * @readonly
 * @enum {string}
 */
export const ButtonState = {
    NORMAL: 'normal',
    HOVER: 'hover',
    DISABLED: 'disabled',
    SELECTED: 'selected',
};

/**
 * Phaser-based button component.
 */
export class Button {
    /**
     * Create a new button.
     * @param {Phaser.Scene} scene - The Phaser scene
     * @param {number} x - X position (center)
     * @param {number} y - Y position (center)
     * @param {number} width - Button width
     * @param {number} height - Button height
     * @param {string} label - Button text label
     * @param {Function} callback - Click callback function
     * @param {Object} colors - Color configuration
     */
    constructor(scene, x, y, width, height, label, callback, colors) {
        this._scene = scene;
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
        this._label = label;
        this._callback = callback;
        this._colors = colors;
        this._state = ButtonState.NORMAL;
        this._enabled = true;
        this._selected = false;

        // Create graphics for button background
        this._graphics = scene.add.graphics();
        this._graphics.setDepth(10);

        // Create text
        this._text = scene.add.text(x, y, label, {
            fontFamily: 'Arial, sans-serif',
            fontSize: '14px',
            color: '#ffffff',
            align: 'center',
        }).setOrigin(0.5).setDepth(11);

        // Create hit area for input
        this._hitArea = new Phaser.Geom.Rectangle(
            x - width / 2,
            y - height / 2,
            width,
            height
        );

        // Enable interactive
        this._graphics.setInteractive(this._hitArea, Phaser.Geom.Rectangle.Contains);

        // Event handlers
        this._graphics.on('pointerover', () => this._onPointerOver());
        this._graphics.on('pointerout', () => this._onPointerOut());
        this._graphics.on('pointerdown', () => this._onPointerDown());
        this._graphics.on('pointerup', () => this._onPointerUp());

        // Initial render
        this._render();
    }

    /**
     * Handle pointer over event.
     * @private
     */
    _onPointerOver() {
        if (this._enabled && !this._selected) {
            this._state = ButtonState.HOVER;
            this._render();
        }
    }

    /**
     * Handle pointer out event.
     * @private
     */
    _onPointerOut() {
        if (this._enabled) {
            this._state = this._selected ? ButtonState.SELECTED : ButtonState.NORMAL;
            this._render();
        }
    }

    /**
     * Handle pointer down event.
     * @private
     */
    _onPointerDown() {
        if (this._enabled) {
            this._state = ButtonState.SELECTED;
            this._render();
        }
    }

    /**
     * Handle pointer up event (click).
     * @private
     */
    _onPointerUp() {
        if (this._enabled) {
            this._state = ButtonState.HOVER;
            this._render();
            if (this._callback) {
                this._callback();
            }
        }
    }

    /**
     * Render the button based on current state.
     * @private
     */
    _render() {
        this._graphics.clear();

        let bgColor;
        switch (this._state) {
            case ButtonState.HOVER:
                bgColor = this._colors.BUTTON_HOVER;
                break;
            case ButtonState.SELECTED:
                bgColor = this._colors.BUTTON_SELECTED;
                break;
            case ButtonState.DISABLED:
                bgColor = this._colors.BUTTON_DISABLED;
                break;
            default:
                bgColor = this._colors.BUTTON_BG;
        }

        // Draw rounded rectangle background
        const radius = 4;
        this._graphics.fillStyle(bgColor, 1);
        this._graphics.fillRoundedRect(
            this._x - this._width / 2,
            this._y - this._height / 2,
            this._width,
            this._height,
            radius
        );

        // Draw border
        this._graphics.lineStyle(1, this._colors.TEXT, 0.5);
        this._graphics.strokeRoundedRect(
            this._x - this._width / 2,
            this._y - this._height / 2,
            this._width,
            this._height,
            radius
        );

        // Update text color based on state
        const textColor = this._enabled ? '#ffffff' : '#888888';
        this._text.setColor(textColor);
    }

    /**
     * Set button enabled state.
     * @param {boolean} enabled - True to enable, false to disable
     */
    setEnabled(enabled) {
        this._enabled = enabled;
        this._state = enabled ? ButtonState.NORMAL : ButtonState.DISABLED;
        this._render();
        // Disable/enable interactive
        this._graphics.disableInteractive();
        if (enabled) {
            this._graphics.setInteractive(this._hitArea, Phaser.Geom.Rectangle.Contains);
        }
    }

    /**
     * Set button selected state (for toggle buttons like speed selection).
     * @param {boolean} selected - True to select, false to deselect
     */
    setSelected(selected) {
        this._selected = selected;
        if (this._enabled) {
            this._state = selected ? ButtonState.SELECTED : ButtonState.NORMAL;
            this._render();
        }
    }

    /**
     * Update button position and hit area.
     * @param {number} x - New X position (center)
     * @param {number} y - New Y position (center)
     */
    setPosition(x, y) {
        this._x = x;
        this._y = y;
        this._text.setPosition(x, y);
        this._hitArea.setPosition(x - this._width / 2, y - this._height / 2);
        this._render();
    }

    /**
     * Destroy the button and clean up.
     */
    destroy() {
        this._graphics.destroy();
        this._text.destroy();
    }
}