/**
 * Simulation configuration constants
 * @module config
 */

/**
 * Grid dimensions
 * @type {number}
 */
export const GRID_WIDTH = 100;

/**
 * Grid dimensions
 * @type {number}
 */
export const GRID_HEIGHT = 70;

/**
 * Initial fish density percentage
 * @type {number}
 */
export const FISH_DENSITY = 0.30;

/**
 * Initial shark density percentage
 * @type {number}
 */
export const SHARK_DENSITY = 0.05;

/**
 * Fish breeding time in chronons
 * @type {number}
 */
export const FISH_BREED_TIME = 3;

/**
 * Shark breeding time in chronons
 * @type {number}
 */
export const SHARK_BREED_TIME = 25;

/**
 * Initial shark energy
 * @type {number}
 */
export const INITIAL_SHARK_ENERGY = 5;

/**
 * Energy gained when shark eats fish
 * @type {number}
 */
export const SHARK_ENERGY_GAIN = 3;

/**
 * Energy cost per chronon for sharks
 * @type {number}
 */
export const SHARK_ENERGY_COST_PER_CHRONON = 1;

/**
 * Default simulation speed in chronons per second
 * @type {number}
 */
export const DEFAULT_SPEED = 10;

/**
 * Supported speed options
 * @type {number[]}
 */
export const SPEED_OPTIONS = [1, 5, 10, 30, 60];

/**
 * Fish color
 * @type {number}
 */
export const FISH_COLOR = 0x00ff00;

/**
 * Shark color
 * @type {number}
 */
export const SHARK_COLOR = 0x0088ff;

/**
 * History window size in chronons
 * @type {number}
 */
export const HISTORY_WINDOW = 500;
