/**
 * @fileoverview Configuration constants for Wa-Tor simulation
 * All simulation parameters are defined here for easy modification by programmers
 */

/**
 * Grid dimensions
 * @constant {number}
 */
export const GRID_WIDTH = 100;
export const GRID_HEIGHT = 70;

/**
 * Entity densities
 * @constant {number}
 */
export const FISH_DENSITY = 0.30;  // 30%
export const SHARK_DENSITY = 0.05; // 5%

/**
 * Breeding times
 * @constant {number}
 */
export const FISH_BREED_TIME = 3;
export const SHARK_BREED_TIME = 25;

/**
 * Shark energy parameters
 * @constant {number}
 */
export const INITIAL_SHARK_ENERGY = 5;
export const SHARK_ENERGY_GAIN = 3;
export const SHARK_ENERGY_COST_PER_CHRONON = 1;

/**
 * Simulation speed options
 * @constant {Array<number>}
 */
export const SPEED_OPTIONS = [1, 5, 10, 30, 60];

export const DEFAULT_SPEED = 10;

/**
 * Rendering parameters
 * @constant {number}
 */
export const FISH_RADIUS = 4;
export const SHARK_RADIUS = 6;
export const FISH_COLOR = 0x00ff00;  // Green
export const SHARK_COLOR = 0x0000ff; // Blue
export const WATER_COLOR = 0x87ceeb; // Sky blue