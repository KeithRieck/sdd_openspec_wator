/**
 * Wa-Tor Simulation Configuration
 * All tunable constants for the simulation and rendering.
 * Programmers can modify these values to change simulation behavior.
 */

// Grid dimensions
export const GRID_WIDTH = 100;
export const GRID_HEIGHT = 70;

// Population densities (0-1)
export const FISH_DENSITY = 0.30;
export const SHARK_DENSITY = 0.05;

// Breeding times (in chronons)
export const FISH_BREED_TIME = 3;
export const SHARK_BREED_TIME = 25;

// Shark energy values
export const INITIAL_SHARK_ENERGY = 5;
export const SHARK_ENERGY_GAIN = 3;
export const SHARK_ENERGY_COST_PER_CHRONON = 1;

// Simulation speed options (chronons per second multiplier)
export const SPEED_OPTIONS = [1, 5, 10, 30, 60];
export const DEFAULT_SPEED = 10;

// Colors
export const WATER_COLOR = 0x000000;
export const FISH_COLOR = 0x00FF00;
export const SHARK_COLOR = 0x0000FF;
export const STATS_TEXT_COLOR = 0xFFFFFF;
export const CONTROLS_TEXT_COLOR = 0xFFFFFF;
export const CHART_FISH_COLOR = 0x00FF00;
export const CHART_SHARK_COLOR = 0x0000FF;

// Entity rendering
export const FISH_RADIUS = 3;
export const SHARK_RADIUS = 4;

// Population history
export const HISTORY_LENGTH = 500;

// Layout margins
export const STATS_MARGIN = 20;
export const CONTROLS_MARGIN = 20;
export const CHART_HEIGHT = 80;
export const CHART_MARGIN = 10;

// Button dimensions
export const BUTTON_WIDTH = 60;
export const BUTTON_HEIGHT = 30;
export const BUTTON_SPACING = 10;

// Text styling
export const TEXT_FONT = 'Arial';
export const STATS_FONT_SIZE = 16;
export const CONTROLS_FONT_SIZE = 14;

// Minimum viewport dimensions (iPad mini)
export const MIN_VIEWPORT_WIDTH = 744;
export const MIN_VIEWPORT_HEIGHT = 1133;
