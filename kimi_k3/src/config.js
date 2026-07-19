/**
 * Central configuration constants for the Wa-Tor web app.
 * Programmers can tune every model parameter, color, and layout
 * breakpoint here without touching other files (AS-R4 / AC 53).
 */

/** Grid dimensions in cells (AC 6). */
export const GRID_WIDTH = 100;
export const GRID_HEIGHT = 70;

/** Initial population densities (AC 7). */
export const FISH_DENSITY = 0.30;
export const SHARK_DENSITY = 0.05;

/** Breeding thresholds in chronons (AC: defaults). */
export const FISH_BREED_TIME = 3;
export const SHARK_BREED_TIME = 25;

/** Shark energy model (AC: defaults). */
export const INITIAL_SHARK_ENERGY = 5;
export const SHARK_ENERGY_GAIN = 3;
export const SHARK_ENERGY_COST = 1;

/** Speed options in chronons per second; default is 10x (AC: speed choices). */
export const SPEEDS = [1, 5, 10, 30, 60];
export const DEFAULT_SPEED_INDEX = 2; // 10x

/** Rolling population history length in chronons (AC 45). */
export const HISTORY_LENGTH = 500;

/** Colors shared by world, stats, and chart (AC 28, 46). */
export const COLOR_WATER = 0x062a4d;
export const COLOR_FISH = 0x33cc55;
export const COLOR_SHARK = 0x3388ff;
export const COLOR_TEXT = '#e8f4ff';
export const COLOR_BUTTON = 0x0e4a7a;
export const COLOR_BUTTON_HOVER = 0x1a6aa8;
export const COLOR_BUTTON_DISABLED = 0x24405c;
export const COLOR_BUTTON_ACTIVE = 0x2a86d0;

/** Layout: minimum world width (px) required for wide mode (design D5). */
export const MIN_WORLD_WIDTH_WIDE = 600;

/** Layout: reserved panel widths (px) and chart height (px). */
export const STATS_PANEL_WIDTH = 220;
export const CONTROLS_PANEL_WIDTH = 260;
export const CHART_HEIGHT = 140;
export const PANEL_MARGIN = 12;
