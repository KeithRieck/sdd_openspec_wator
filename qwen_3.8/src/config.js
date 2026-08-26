/**
 * Central configuration for the Wa-Tor simulation app.
 *
 * All model parameters, colors, and layout constants live here so that
 * programmers can tune the simulation and presentation without touching
 * simulation logic or scene code (wator-simulation R12).
 */

/** Grid dimensions in cells. Defaults per prd-v001 (wator-simulation R1). */
export const GRID_WIDTH = 100;
export const GRID_HEIGHT = 70;

/** Initial population densities as fractions of cells (wator-simulation R1). */
export const FISH_DENSITY = 0.30;
export const SHARK_DENSITY = 0.05;

/** Breeding thresholds in chronons (wator-simulation R3, R7). */
export const FISH_BREED_TIME = 3;
export const SHARK_BREED_TIME = 25;

/** Shark energy model (wator-simulation R4, R5, R7). */
export const INITIAL_SHARK_ENERGY = 5;
export const SHARK_ENERGY_GAIN = 3;
export const SHARK_ENERGY_COST_PER_CHRONON = 1;

/** Rolling population history window in chronons (wator-simulation R10). */
export const HISTORY_WINDOW = 500;

/**
 * Speed options in chronons per second, shown as a horizontal segmented
 * control (ui-controls R3).
 */
export const SPEED_OPTIONS = [1, 5, 10, 30, 60];

/** Default speed in chronons per second; the app launches running at this
 * rate (simulation-app R1). */
export const DEFAULT_SPEED = 10;

/**
 * Maximum chronons to advance in a single update frame. Bounds the burst of
 * work after a throttled/hidden tab returns, without implementing special
 * catch-up behavior (simulation-app R5, design D7).
 */
export const MAX_STEPS_PER_FRAME = 60;

/**
 * Colors shared by the world, stats, and history chart (simulation-app R4,
 * population-chart R2). Fish are green, sharks are blue.
 */
export const COLORS = {
    water: 0x0b2545,
    fish: 0x4caf50,
    shark: 0x2196f3,
    text: '#e0e0e0',
    panelBg: 0x101820
};

/**
 * Relative circle radii as a fraction of the cell size. Sharks are slightly
 * larger than fish (simulation-app R4).
 */
export const FISH_RADIUS = 0.32;
export const SHARK_RADIUS = 0.42;

/**
 * Layout breakpoint in CSS pixels. Windows narrower than this use the
 * stacked (narrow) layout: world on top, stats and controls below
 * (simulation-app R6, design D8).
 */
export const NARROW_BREAKPOINT = 900;

/** Layout padding and panel sizing in CSS pixels (design D8). */
export const LAYOUT = {
    padding: 12,
    statsWidth: 170,
    controlsWidth: 190,
    chartHeight: 140,
    buttonHeight: 36,
    buttonGap: 8
};
