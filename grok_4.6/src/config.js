/**
 * Programmer-editable Wa-Tor model and presentation constants.
 *
 * Grid size, densities, breed times, shark energy, colors, and speed options
 * all live here so a maintainer can change behavior without UI work.
 * wator-simulation requirement 13, wator-app requirement 13.
 */

/** Default world width in cells. wator-simulation requirement 1. */
export const GRID_WIDTH = 100;

/** Default world height in cells. wator-simulation requirement 1. */
export const GRID_HEIGHT = 70;

/** Fraction of cells initially occupied by fish. wator-simulation requirement 2. */
export const FISH_DENSITY = 0.30;

/** Fraction of cells initially occupied by sharks. wator-simulation requirement 2. */
export const SHARK_DENSITY = 0.05;

/** Chronons a fish must survive before it is breeding-ready. */
export const FISH_BREED_TIME = 3;

/** Chronons a shark must survive before it is breeding-ready. */
export const SHARK_BREED_TIME = 25;

/** Energy assigned to a newborn shark. wator-simulation requirement 9. */
export const INITIAL_SHARK_ENERGY = 5;

/** Energy a shark gains when it eats a fish. wator-simulation requirement 8. */
export const SHARK_ENERGY_GAIN = 3;

/** Energy subtracted at the start of each shark action. wator-simulation requirement 7. */
export const SHARK_ENERGY_COST = 1;

/** Rolling population-history length in chronons. wator-simulation requirement 11. */
export const HISTORY_WINDOW = 500;

/** Supported chronons-per-second speeds. wator-app requirement 8. */
export const SPEED_OPTIONS = [1, 5, 10, 30, 60];

/** Launch speed in chronons per second. wator-app requirement 1. */
export const DEFAULT_SPEED = 10;

/** Shared drawing colors for world, stats, and chart. wator-app requirements 4 and 11. */
export const COLORS = {
    background: 0x071422,
    panel: 0x0d2137,
    water: 0x0b3d5c,
    fish: 0x4caf50,
    shark: 0x2196f3,
    text: '#e8eef4',
    mutedText: '#9bb0c3',
    chartBackground: 0x081828
};

/** Fish circle radius as a fraction of cell size. */
export const FISH_RADIUS_RATIO = 0.32;

/** Shark circle radius as a fraction of cell size (about 1.25× fish). */
export const SHARK_RADIUS_RATIO = 0.40;

/** Layout strips used by SimulationScene. wator-app requirements 6 and 7. */
export const LAYOUT = {
    wideBreakpoint: 900,
    statsWidth: 168,
    controlsWidth: 228,
    chartHeight: 120,
    padding: 12,
    minHit: 44
};

/** Maximum simulation steps applied in one Phaser frame. */
export const MAX_STEPS_PER_FRAME = 4;

/** Hidden-tab delta clamp in milliseconds. wator-app requirement 12. */
export const MAX_DELTA_MS = 1000 / 30;
