/**
 * Configuration constants for the Wa-Tor simulation.
 * All values are frozen to prevent accidental mutation.
 * @module config
 */

/**
 * @typedef {Object} Config
 * @property {number} GRID_WIDTH - Number of columns in the grid (default: 100)
 * @property {number} GRID_HEIGHT - Number of rows in the grid (default: 70)
 * @property {number} FISH_DENSITY - Initial fish population density (default: 0.30)
 * @property {number} SHARK_DENSITY - Initial shark population density (default: 0.05)
 * @property {number} FISH_BREED_TIME - Chronons before fish can breed (default: 3)
 * @property {number} SHARK_BREED_TIME - Chronons before shark can breed (default: 25)
 * @property {number} INITIAL_SHARK_ENERGY - Starting energy for new sharks (default: 5)
 * @property {number} SHARK_ENERGY_GAIN - Energy gained when shark eats fish (default: 3)
 * @property {number} SHARK_ENERGY_COST_PER_CHRONON - Energy cost per chronon for sharks (default: 1)
 * @property {number[]} SPEED_OPTIONS - Available simulation speeds in chronons per second
 * @property {number} DEFAULT_SPEED_INDEX - Index into SPEED_OPTIONS for default speed (default: 2 = 10x)
 * @property {Object} COLORS - Color constants for rendering
 * @property {number} COLORS.FISH - Fish color (green)
 * @property {number} COLORS.SHARK - Shark color (blue)
 * @property {number} COLORS.WATER - Water background color
 * @property {number} COLORS.TEXT - Text color
 * @property {number} COLORS.BUTTON_BG - Button background color
 * @property {number} COLORS.BUTTON_HOVER - Button hover color
 * @property {number} COLORS.BUTTON_DISABLED - Button disabled color
 * @property {number} COLORS.BUTTON_SELECTED - Button selected color
 * @property {number} HISTORY_WINDOW - Maximum population history samples (default: 500)
 */

const Config = Object.freeze({
    /** Grid dimensions */
    GRID_WIDTH: 100,
    GRID_HEIGHT: 70,

    /** Initial population densities (0.0 to 1.0) */
    FISH_DENSITY: 0.30,
    SHARK_DENSITY: 0.05,

    /** Breeding thresholds (chronons) */
    FISH_BREED_TIME: 3,
    SHARK_BREED_TIME: 25,

    /** Shark energy parameters */
    INITIAL_SHARK_ENERGY: 5,
    SHARK_ENERGY_GAIN: 3,
    SHARK_ENERGY_COST_PER_CHRONON: 1,

    /** Simulation speed options (chronons per second) */
    SPEED_OPTIONS: [1, 5, 10, 30, 60],
    DEFAULT_SPEED_INDEX: 2, // 10x

    /** Rendering colors (hex) */
    COLORS: {
        FISH: 0x00ff00,       // Green
        SHARK: 0x0080ff,      // Blue
        WATER: 0x001133,      // Dark blue water
        TEXT: 0xffffff,       // White
        BUTTON_BG: 0x333333,  // Dark gray
        BUTTON_HOVER: 0x555555, // Medium gray
        BUTTON_DISABLED: 0x1a1a1a, // Very dark gray
        BUTTON_SELECTED: 0x00aa00, // Bright green
    },

    /** Population history rolling window */
    HISTORY_WINDOW: 500,
});

export default Config;