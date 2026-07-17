/**
 * Central configuration for the Wa-Tor simulation and its Phaser presentation.
 *
 * Every tunable model parameter lives here so a programmer can change grid
 * dimensions, densities, breeding times, shark energy values, colors, and speed
 * options in one place without touching engine or rendering logic. The
 * simulation engine reads only the model values; the scenes read the display
 * values as well.
 */
export const CONFIG = {
  // --- Grid dimensions (toroidal world) ---
  gridWidth: 100,
  gridHeight: 70,

  // --- Initial population densities (fraction of cells) ---
  fishDensity: 0.3,
  sharkDensity: 0.05,

  // --- Breeding ---
  fishBreedTime: 3,
  sharkBreedTime: 25,

  // --- Shark energy ---
  initialSharkEnergy: 5,
  sharkEnergyGain: 3,
  sharkEnergyCostPerChronon: 1,

  // --- Speed (chronons per second) ---
  defaultSpeed: 10,
  speedOptions: [1, 5, 10, 30, 60],

  // --- Population history ---
  historyWindow: 500,

  // --- World colors ---
  waterColor: 0x081c2c,
  fishColor: 0x3ddc84,
  sharkColor: 0x4aa8ff,

  // --- UI colors ---
  panelColor: 0x0b2030,
  worldBorderColor: 0x12384f,
  buttonColor: 0x163a52,
  buttonActiveColor: 0x2e7cb0,
  buttonDisabledColor: 0x0e2230,
  textColor: '#e6f0f7',
  mutedTextColor: '#84a7bd',
};
