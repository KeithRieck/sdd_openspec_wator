/**
 * Central configuration constants for the Wa-Tor web app.
 *
 * Every tunable named in prd-v001.md lives here so a programmer can change
 * model parameters, colors, or pacing in one place without hunting through
 * logic (spec Req 30.1). Both the simulation engine (src/simulation/) and the
 * Phaser presentation layer (src/scenes/, src/ui/) import from this module.
 */

// --- World dimensions (spec Req 3.1, prd-v001 AC 6) ---

/** Number of grid columns. @type {number} */
export const GRID_COLS = 100;

/** Number of grid rows. @type {number} */
export const GRID_ROWS = 70;

// --- Initial population densities (spec Req 6.1, prd-v001 AC 7) ---

/** Initial fish density as a fraction of all cells (default 30%). @type {number} */
export const FISH_DENSITY = 0.30;

/** Initial shark density as a fraction of all cells (default 5%). @type {number} */
export const SHARK_DENSITY = 0.05;

// --- Breeding and energy parameters (spec Req 12, 17, prd-v001 AC defaults) ---

/** Chronons a fish must survive before it is breeding-ready. @type {number} */
export const FISH_BREED_TIME = 3;

/** Chronons a shark must survive before it is breeding-ready. @type {number} */
export const SHARK_BREED_TIME = 25;

/** Energy a newborn shark (and an initial shark) starts with. @type {number} */
export const INITIAL_SHARK_ENERGY = 5;

/** Energy a shark gains from eating one fish. @type {number} */
export const SHARK_ENERGY_GAIN = 3;

/** Energy a shark loses at the start of each of its actions. @type {number} */
export const SHARK_ENERGY_COST_PER_CHRONON = 1;

// --- Speed control (spec Req 23.1, 28.1, prd-v001 AC 32) ---

/**
 * Supported speed choices in chronons per second (`1x` = 1 chronon/second).
 * Displayed in one horizontal row as `1x`, `5x`, `10x`, `30x`, `60x`.
 * @type {number[]}
 */
export const SPEED_OPTIONS = [1, 5, 10, 30, 60];

/** Speed selected at launch, in chronons per second (default `10x`). @type {number} */
export const DEFAULT_SPEED = 10;

/**
 * Longest frame delta (ms) honored by the chronon pump. Clamping a single
 * frame's gap prevents a catch-up burst when a throttled tab resumes, i.e.
 * no real-time preservation or catch-up compensation (spec Req 28.2).
 * @type {number}
 */
export const FRAME_DELTA_CLAMP_MS = 100;

// --- Population history chart (spec Req 27.1, prd-v001 AC 45) ---

/** Rolling history window: one sample per chronon, kept for 500 chronons. @type {number} */
export const HISTORY_LENGTH = 500;

// --- Colors (spec Req 20.1, 27.1; fish green, sharks blue, prd-v001) ---

/**
 * Rendering colors as a single shared palette so the world, stats, and chart
 * stay visually consistent (spec Req 27.1).
 * @type {{water: number, fish: number, shark: number, chartBg: number, panelText: string, fishText: string, sharkText: string}}
 */
export const COLORS = {
    water: 0x0a1c33,      // empty water world background
    fish: 0x2ecc71,       // fish circles and fish population line
    shark: 0x3498db,      // shark circles and shark population line
    chartBg: 0x081527,    // history chart background
    panelText: '#e0e0e0', // general stats text
    fishText: '#2ecc71',  // fish stat value (matches world/chart green)
    sharkText: '#3498db'  // shark stat value (matches world/chart blue)
};

// --- Rendering sizes (implementation taste; PRD Known Gap leaves these open) ---

/** Fish circle radius as a fraction of one grid cell. @type {number} */
export const FISH_RADIUS_FACTOR = 0.38;

/** Shark circle radius as a fraction of one grid cell (slightly larger than fish). @type {number} */
export const SHARK_RADIUS_FACTOR = 0.52;

// --- Responsive layout (spec Req 29.1, 29.2) ---

/**
 * Window width (CSS px) below which the layout reflows from the wide
 * three-column arrangement to the compact top-bar arrangement.
 * @type {number}
 */
export const LAYOUT_BREAKPOINT = 960;

// --- Status strings (spec Req 26.1-26.4) ---

/** Status text while the simulation is running. @type {string} */
export const STATUS_RUNNING = 'Running';

/** Status text while the simulation is paused. @type {string} */
export const STATUS_PAUSED = 'Paused';

/** Terminal status when sharks reach zero while fish remain. @type {string} */
export const STATUS_SHARKS_EXTINCT = 'Sharks extinct';

/** Terminal status when fish reach zero while sharks remain. @type {string} */
export const STATUS_FISH_EXTINCT = 'Fish extinct';

/** Terminal status when both populations reach zero in the same chronon. @type {string} */
export const STATUS_COLLAPSED = 'Ecosystem collapsed';
