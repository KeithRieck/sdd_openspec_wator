/**
 * Simulation and application configuration constants.
 * 
 * All tunable parameters for the Wa-Tor simulation are defined here.
 * Programmers may modify these values to experiment with different
 * simulation behaviors. Changing values requires editing this file.
 *
 * @module config
 */
export const CONFIG = Object.freeze({
  // Grid dimensions
  gridWidth: 100,
  gridHeight: 70,

  // Initial population densities (0.0 - 1.0)
  fishDensity: 0.30,
  sharkDensity: 0.05,

  // Breeding thresholds (chronons)
  fishBreedTime: 3,
  sharkBreedTime: 25,

  // Shark energy parameters
  initialSharkEnergy: 5,
  sharkEnergyGain: 3,
  sharkEnergyCostPerChronon: 1,

  // Speed options (chronons per update cycle)
  defaultSpeed: 10,
  speedOptions: [1, 5, 10, 30, 60],

  // Rendering colors
  waterColor: 0x006699,
  fishColor: 0x33cc33,
  sharkColor: 0x3399ff,

  // Entity sizes (radius in pixels, before scaling)
  fishRadius: 3,
  sharkRadius: 4,

  // Population history chart
  historyWindowSize: 500,

  // UI layout proportions (fraction of available space)
  sidePanelFraction: 0.12,
  chartHeightFraction: 0.12,

  // Narrow viewport breakpoint (CSS pixels)
  narrowBreakpoint: 744,
});
