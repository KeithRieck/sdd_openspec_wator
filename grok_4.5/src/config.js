/**
 * Shared programmer-facing constants for the Wa-Tor simulation and UI.
 * Change values here to retune the model or presentation without hunting through scenes.
 */

/** @type {number} Grid width in cells (columns). */
export const GRID_WIDTH = 100;

/** @type {number} Grid height in cells (rows). */
export const GRID_HEIGHT = 70;

/** @type {number} Initial fish occupancy fraction (0–1). */
export const FISH_DENSITY = 0.3;

/** @type {number} Initial shark occupancy fraction (0–1). */
export const SHARK_DENSITY = 0.05;

/** @type {number} Chronons a fish must age before it is breeding-ready. */
export const FISH_BREED_TIME = 3;

/** @type {number} Chronons a shark must age before it is breeding-ready. */
export const SHARK_BREED_TIME = 25;

/** @type {number} Energy assigned to sharks at spawn and reset. */
export const INITIAL_SHARK_ENERGY = 5;

/** @type {number} Energy gained when a shark eats a fish. */
export const SHARK_ENERGY_GAIN = 3;

/** @type {number} Energy lost by a shark at the start of its action. */
export const SHARK_ENERGY_COST = 1;

/** Supported chronons-per-second speed options. */
export const SPEEDS = [1, 5, 10, 30, 60];

/** @type {number} Default launch speed in chronons per second. */
export const DEFAULT_SPEED = 10;

/** Rolling population history length in chronons. */
export const HISTORY_LENGTH = 500;

/** Presentation colors (Phaser integer RGB). */
export const COLORS = {
  background: 0x0b1c2c,
  panel: 0x13293d,
  panelBorder: 0x2a4a66,
  water: 0x0a2740,
  fish: 0x3dcc6d,
  shark: 0x3d8bfd,
  text: 0xe8f1ff,
  mutedText: 0x9bb3c9,
  button: 0x1b3a57,
  buttonHover: 0x27557d,
  buttonActive: 0x3d8bfd,
  buttonDisabled: 0x1a2a3a,
  chartBackground: 0x0a1a2a,
  chartGrid: 0x1a3348
};

/** Layout metrics in CSS pixels (wide layout). */
export const LAYOUT = {
  padding: 12,
  statsWidth: 160,
  controlsWidth: 180,
  chartHeight: 120,
  gap: 12,
  buttonHeight: 36,
  buttonGap: 8,
  fontFamily: 'system-ui, -apple-system, Segoe UI, sans-serif',
  titleFontSize: 16,
  bodyFontSize: 14
};

/** World circle radii as fractions of the smaller cell dimension. */
export const RENDER = {
  fishRadiusFactor: 0.32,
  sharkRadiusFactor: 0.42
};
