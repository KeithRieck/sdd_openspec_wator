/**
 * Application-wide configuration constants for the Wa-Tor simulation.
 *
 * Every constant in this file is intentionally a plain value that a programmer
 * can edit directly. There is no UI for tuning these values, per the PRD's
 * Non-Goals. Phaser and the engine both read from this module so changes
 * propagate everywhere on next page load.
 */

/** Grid dimensions (columns x rows) used to construct the toroidal world. */
export const GRID_WIDTH = 100;
export const GRID_HEIGHT = 70;

/** Initial population densities applied during world generation. */
export const FISH_DENSITY = 0.30;
export const SHARK_DENSITY = 0.05;

/** Number of chronons an entity must survive before it reproduces. */
export const FISH_BREED_TIME = 3;
export const SHARK_BREED_TIME = 25;

/** Shark energy model. */
export const INITIAL_SHARK_ENERGY = 5;
export const SHARK_ENERGY_GAIN = 3;
export const SHARK_ENERGY_COST_PER_CHRONON = 1;

/** Speed choices offered in the speed row, and the default selected speed. */
export const SPEED_OPTIONS = [1, 5, 10, 30, 60];
export const DEFAULT_SPEED = 10;

/**
 * Phaser numeric color values used for rendering.
 *
 * Fish are green, sharks are blue (and slightly larger visually), and the water
 * background fills the world rectangle.
 */
export const FISH_COLOR = 0x4caf50;
export const SHARK_COLOR = 0x2196f3;
export const WATER_COLOR = 0x0d2a4a;

/** Radius (in world pixels) for drawing fish and sharks at scale=1. */
export const FISH_RADIUS = 4;
export const SHARK_RADIUS = 6;

/** Number of chronon samples retained in the rolling history ring buffer. */
export const HISTORY_WINDOW = 500;

/** Phaser CDN URL pinned for the lifetime of v1. */
export const PHASER_CDN_URL =
    'https://cdn.jsdelivr.net/npm/phaser@4.1.0/dist/phaser.min.js';
