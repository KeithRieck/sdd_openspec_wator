/**
 * Configuration constants for the Wa-Tor simulation.
 *
 * All simulation parameters, colors, and UI settings are defined here
 * to make them easy for programmers to modify.
 *
 * @see prd-v001.md for requirement details
 */

/**
 * Configuration class containing all constants for the Wa-Tor simulation.
 * All values are static and can be modified directly in code.
 */
export class Config {
    // =========================================================================
    // Grid Dimensions (PRD #6)
    // =========================================================================

    /** Default grid width in cells */
    static GRID_WIDTH = 100;

    /** Default grid height in cells */
    static GRID_HEIGHT = 70;

    // =========================================================================
    // Population Densities (PRD #7)
    // =========================================================================

    /** Initial fish density as a fraction (0.0 to 1.0) */
    static FISH_DENSITY = 0.30;

    /** Initial shark density as a fraction (0.0 to 1.0) */
    static SHARK_DENSITY = 0.05;

    // =========================================================================
    // Breeding Times (PRD #15, #23)
    // =========================================================================

    /** Number of chronons before a fish can breed */
    static FISH_BREED_TIME = 3;

    /** Number of chronons before a shark can breed */
    static SHARK_BREED_TIME = 25;

    // =========================================================================
    // Shark Energy (PRD #18-24)
    // =========================================================================

    /** Initial energy for newborn sharks */
    static INITIAL_SHARK_ENERGY = 5;

    /** Energy gained when a shark eats a fish */
    static SHARK_ENERGY_GAIN = 3;

    /** Energy lost per chronon */
    static SHARK_ENERGY_COST_PER_CHRONON = 1;

    // =========================================================================
    // Speed Settings (PRD #48)
    // =========================================================================

    /** Default simulation speed in chronons per second */
    static DEFAULT_SPEED = 10;

    /** Available speed options in chronons per second */
    static SPEED_OPTIONS = [1, 5, 10, 30, 60];

    // =========================================================================
    // Colors (PRD #28, #46)
    // =========================================================================

    /** Water/background color (dark blue) */
    static WATER_COLOR = 0x0a2a4a;

    /** Fish color (green) */
    static FISH_COLOR = 0x4caf50;

    /** Shark color (blue) */
    static SHARK_COLOR = 0x2196f3;

    /** Stats text color */
    static TEXT_COLOR = '#e0e0e0';

    // =========================================================================
    // Rendering Sizes (PRD #28)
    // =========================================================================

    /** Fish circle radius in pixels (relative to cell size) */
    static FISH_RADIUS_RATIO = 0.35;

    /** Shark circle radius in pixels (relative to cell size) */
    static SHARK_RADIUS_RATIO = 0.45;

    // =========================================================================
    // History Chart (PRD #45)
    // =========================================================================

    /** Maximum number of chronons to keep in population history */
    static HISTORY_WINDOW_SIZE = 500;

    /** Height of the history chart in pixels */
    static HISTORY_CHART_HEIGHT = 100;

    // =========================================================================
    // UI Layout (PRD #30-33, #51-52)
    // =========================================================================

    /** Minimum width for wide layout (below this, use narrow layout) */
    static NARROW_LAYOUT_THRESHOLD = 744;

    /** Stats panel width in pixels */
    static STATS_PANEL_WIDTH = 150;

    /** Controls panel width in pixels */
    static CONTROLS_PANEL_WIDTH = 120;

    /** Padding around UI elements in pixels */
    static UI_PADDING = 10;

    /** Button height in pixels */
    static BUTTON_HEIGHT = 36;

    /** Button width in pixels */
    static BUTTON_WIDTH = 100;

    /** Speed button width in pixels */
    static SPEED_BUTTON_WIDTH = 50;

    /** Spacing between buttons in pixels */
    static BUTTON_SPACING = 8;

    // =========================================================================
    // Phaser Configuration (PRD #3, #5)
    // =========================================================================

    /** Phaser CDN URL */
    static PHASER_CDN_URL = 'https://cdn.jsdelivr.net/npm/phaser@4.1.0/dist/phaser.min.js';

    /** Background color for the Phaser game */
    static PHASER_BACKGROUND_COLOR = '#0a2a4a';

    // =========================================================================
    // PWA Configuration (PRD #56-57)
    // =========================================================================

    /** App name for PWA manifest */
    static APP_NAME = 'Wa-Tor Simulation';

    /** Short app name for PWA manifest */
    static APP_SHORT_NAME = 'Wa-Tor';

    /** Theme color for PWA manifest */
    static THEME_COLOR = '#0a2a4a';

    /** Background color for PWA manifest */
    static BACKGROUND_COLOR = '#0a2a4a';

    /**
     * Get the total number of cells in the grid.
     * @returns {number} Total cell count (width * height)
     */
    static getTotalCells() {
        return Config.GRID_WIDTH * Config.GRID_HEIGHT;
    }

    /**
     * Get the interval in milliseconds between chronons for a given speed.
     * @param {number} speed - Speed in chronons per second
     * @returns {number} Interval in milliseconds
     */
    static getSpeedInterval(speed) {
        return 1000 / speed;
    }
}

export default Config;
