/**
 * Wa-Tor simulation and rendering constants.
 * All tweakable parameters live here for easy programmer adjustment.
 * @module config
 */

/** Grid width in cells */
export const GRID_W = 100;

/** Grid height in cells */
export const GRID_H = 70;

/** Fraction of cells initially populated with fish */
export const FISH_DENSITY = 0.30;

/** Fraction of cells initially populated with sharks */
export const SHARK_DENSITY = 0.05;

/** Chronons a fish must survive before it can reproduce */
export const FISH_BREED_TIME = 3;

/** Chronons a shark must survive before it can reproduce */
export const SHARK_BREED_TIME = 25;

/** Starting energy for a newborn shark */
export const INITIAL_SHARK_ENERGY = 5;

/** Energy a shark gains from eating a fish */
export const SHARK_ENERGY_GAIN = 3;

/** Energy deducted from each shark per chronon */
export const SHARK_ENERGY_COST = 1;

/** Available simulation speeds in chronons per second */
export const SPEEDS = [1, 5, 10, 30, 60];

/** Default speed index (0-based into SPEEDS array) */
export const DEFAULT_SPEED_INDEX = 2;

/** Number of chronons retained in the population history chart */
export const HISTORY_WINDOW = 500;

/** Color for fish (green) */
export const COLOR_FISH = 0x00cc66;

/** Color for sharks (blue) */
export const COLOR_SHARK = 0x3366ff;

/** Background water color (dark) */
export const COLOR_WATER = 0x0a0a2e;

/** UI background color */
export const COLOR_UI_BG = 0x111144;

/** Text color for stats */
export const COLOR_TEXT = 0xcccccc;

/** Button default fill */
export const COLOR_BUTTON = 0x222266;

/** Button hover fill */
export const COLOR_BUTTON_HOVER = 0x333388;

/** Button active (selected) fill */
export const COLOR_BUTTON_ACTIVE = 0x4444aa;

/** Button disabled fill */
export const COLOR_BUTTON_DISABLED = 0x111133;

/** Button disabled text color */
export const COLOR_BUTTON_DISABLED_TEXT = 0x444466;

/** Chart line color for fish (green) */
export const COLOR_CHART_FISH = 0x00cc66;

/** Chart line color for sharks (blue) */
export const COLOR_CHART_SHARK = 0x3366ff;

/** Chart background color */
export const COLOR_CHART_BG = 0x0d0d2a;

/** Font family used throughout the UI */
export const FONT_FAMILY = 'monospace';

/** Font size for stats text in pixels */
export const STATS_FONT_SIZE = 14;

/** Font size for button text in pixels */
export const BUTTON_FONT_SIZE = 13;

/** Radius of fish circles as fraction of cell size */
export const FISH_RADIUS_RATIO = 0.35;

/** Radius of shark circles as fraction of cell size */
export const SHARK_RADIUS_RATIO = 0.45;

/** Padding around the world display in pixels */
export const LAYOUT_PADDING = 10;

/** Gap between UI elements in pixels */
export const LAYOUT_GAP = 6;

/** Width of stats panel in pixels */
export const STATS_PANEL_WIDTH = 130;

/** Width of controls panel in pixels */
export const CONTROLS_PANEL_WIDTH = 230;

/** Height of the chart area as fraction of viewport height */
export const CHART_HEIGHT_RATIO = 0.15;

/** Minimum chart height in pixels */
export const CHART_MIN_HEIGHT = 60;

/** Button width in pixels */
export const BUTTON_WIDTH = 90;

/** Button height in pixels */
export const BUTTON_HEIGHT = 28;

/** Button corner radius in pixels */
export const BUTTON_RADIUS = 4;

/** Max chronons to process per update frame (prevents spiral of death) */
export const MAX_CHRONONS_PER_FRAME = 60;

/** Viewport width below which narrow/stacked layout activates */
export const NARROW_BREAKPOINT = 900;

/** Minimum cell size in pixels after scaling */
export const MIN_CELL_SIZE = 3;
