/**
 * Central configuration for Wa-Tor simulation.
 * All programmer-facing constants are defined here for easy modification.
 */

export const GRID_WIDTH = 100;
export const GRID_HEIGHT = 70;

export const FISH_DENSITY = 0.3;
export const SHARK_DENSITY = 0.05;

export const FISH_BREED_TIME = 3;
export const SHARK_BREED_TIME = 25;

export const INITIAL_SHARK_ENERGY = 5;
export const SHARK_ENERGY_GAIN = 3;
export const SHARK_ENERGY_COST = 1;

export const SPEEDS = [1, 5, 10, 30, 60];
export const DEFAULT_SPEED = 10;

export const COLORS = {
  fish: 0x2ecc71,
  shark: 0x3498db,
  water: 0x0f3a5f,
  background: 0x0a1a2a,
  chartBackground: 0x0d2136,
  chartGrid: 0x1a3a5a,
  text: '#e0e8f0',
  textDim: '#8a9bb0',
  buttonBg: 0x1a3a5a,
  buttonSelected: 0x2a5a8a,
  buttonDisabled: 0x0f2538
};

export const HISTORY_SIZE = 500;
