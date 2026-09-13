/**
 * Central configuration for the Wa-Tor web app.
 *
 * Every model parameter, shared color, and layout dimension lives in this one
 * module so a programmer can retune the simulation or the UI from a single
 * place (requirement `app-shell/static-hosting` §6.1). Nothing here depends on
 * Phaser, which keeps the engine free of rendering concerns
 * (`app-shell/static-hosting` §4.1).
 */

// ---------------------------------------------------------------------------
// Grid and initial population (spec `world-model` §1.1, §2.1)
// ---------------------------------------------------------------------------

/** Grid width in cells. */
export const GRID_WIDTH = 100;

/** Grid height in cells. */
export const GRID_HEIGHT = 70;

/** Fraction of cells seeded with fish. */
export const FISH_DENSITY = 0.3;

/** Fraction of cells seeded with sharks. */
export const SHARK_DENSITY = 0.05;

/** Sentinel stored in a grid slot that holds no entity. */
export const EMPTY_CELL = -1;

/** Entity kind identifiers used when spawning newborns. */
export const FISH = 'fish';
export const SHARK = 'shark';

// ---------------------------------------------------------------------------
// Lifecycle and energy (spec `chronon-rules` §2.3, §3, §4.2, §5)
// ---------------------------------------------------------------------------

/** Chronons a fish must survive before it may reproduce. */
export const FISH_BREED_TIME = 3;

/** Chronons a shark must survive before it may reproduce. */
export const SHARK_BREED_TIME = 25;

/** Energy a newborn shark starts with. */
export const INITIAL_SHARK_ENERGY = 5;

/** Energy a shark gains from eating one fish. */
export const SHARK_ENERGY_GAIN = 3;

/** Energy a shark loses at the start of each of its actions. */
export const SHARK_ENERGY_COST_PER_CHRONON = 1;

// ---------------------------------------------------------------------------
// Playback (spec `simulation-ui/playback-controls` §1)
// ---------------------------------------------------------------------------

/** Selectable speeds in chronons per second. */
export const SPEED_OPTIONS = [1, 5, 10, 30, 60];

/** Speed selected when the app launches. */
export const DEFAULT_SPEED = 10;

/** Number of population samples retained for the history chart. */
export const HISTORY_WINDOW = 500;

// ---------------------------------------------------------------------------
// Terminal and run status text (spec `population-history` §2, `simulation-ui/world-rendering` §3)
// ---------------------------------------------------------------------------

export const STATUS = {
    RUNNING: 'Running',
    PAUSED: 'Paused',
    SHARKS_EXTINCT: 'Sharks extinct',
    FISH_EXTINCT: 'Fish extinct',
    COLLAPSED: 'Ecosystem collapsed'
};

// ---------------------------------------------------------------------------
// Shared colors (spec `simulation-ui/world-rendering` §4.2)
//
// These are taken from the shipped PWA icons in `assets/` so the world, the
// stats readout, and the history chart all agree on one green and one blue.
// ---------------------------------------------------------------------------

export const COLORS = {
    /** Water drawn behind the grid. */
    water: 0x0a2a4a,
    /** Fish circles and the fish population line. */
    fish: 0x2ecc71,
    /** Shark circles and the shark population line. */
    shark: 0x3498db,
    /** Stat label text. */
    statText: '#e0e0e0',
    /** Stat value text. */
    statValue: '#ffffff',
    /** Nearest-neighbor outline drawn around each entity. */
    entityEdge: 0x0a2a4a
};

/**
 * Convert a numeric Phaser color to a CSS hex string for use in Text styles.
 *
 * @param {number} color - Numeric color, for example `0x2ecc71`.
 * @returns {string} CSS color such as `#2ecc71`.
 */
export function toCssColor(color) {
    return `#${color.toString(16).padStart(6, '0')}`;
}

// ---------------------------------------------------------------------------
// Rendering and layout (spec `simulation-ui/world-rendering` §1, §5)
// ---------------------------------------------------------------------------

export const RENDER = {
    /** Shark circles are slightly larger than fish circles (req 28). */
    fishRadiusRatio: 0.34,
    sharkRadiusRatio: 0.44,
    /** Minimum drawn radius so entities stay visible on a small world. */
    minRadius: 1.5,
    /** Chart stroke widths; the shark line is thicker to avoid relying on color alone. */
    fishLineWidth: 1.5,
    sharkLineWidth: 3,
    /** Fraction of the chart height kept clear above the initial population. */
    chartHeadroom: 0.12
};

export const LAYOUT = {
    /** Below this window width the display reflows into stacked regions. */
    narrowBreakpoint: 900,
    /** Outer margin for every arrangement. */
    margin: 12,
    /** Gap between stacked or adjacent regions. */
    gap: 10,
    /** Stats panel width in the wide arrangement. */
    statsWidth: 150,
    /** Controls panel width in the wide arrangement. */
    controlsWidth: 170,
    /** Height of the history chart region. */
    chartHeight: 120,
    /** Height of the stats strip in the narrow arrangement. */
    narrowStatsHeight: 78,
    /** Height reserved for the controls block in the narrow arrangement. */
    narrowControlsHeight: 210,
    /** Button metrics. */
    speedButtonGap: 4,
    actionButtonHeight: 40,
    actionButtonGap: 8,
    /** Font sizes for stat text. */
    statLabelFontSize: 15,
    statValueFontSize: 20
};
