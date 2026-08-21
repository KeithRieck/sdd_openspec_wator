/**
 * @file Central configuration constants for the Wa-Tor app.
 *
 * All model parameters are defined here so programmers can tune the
 * simulation and appearance by editing this single file
 * (prd-v001.md AC 53).
 */

/**
 * Simulation model constants (prd-v001.md AC 6, 7, defaults in Assumptions).
 */
export const SIM = {
  /** Grid width in cells (columns). */
  gridWidth: 100,
  /** Grid height in cells (rows). */
  gridHeight: 70,
  /** Initial fish density as a fraction of all cells (0..1). */
  fishDensity: 0.30,
  /** Initial shark density as a fraction of all cells (0..1). */
  sharkDensity: 0.05,
  /** Chronons a fish must survive before it may reproduce. */
  fishBreedTime: 3,
  /** Chronons a shark must survive before it may reproduce. */
  sharkBreedTime: 25,
  /** Energy granted to a newborn shark. */
  initialSharkEnergy: 5,
  /** Energy a shark gains per fish eaten. */
  sharkEnergyGain: 3,
  /** Energy a shark loses each chronon. */
  sharkEnergyCostPerChronon: 1,
};

/**
 * Rendering constants (prd-v001.md AC 28, 46; fish green circles,
 * sharks blue circles slightly larger than fish).
 */
export const RENDER = {
  /** Background water color (hex number for Phaser). */
  waterColor: 0x0a2a4a,
  /** Fish circle color. */
  fishColor: 0x2ecc71,
  /** Shark circle color. */
  sharkColor: 0x3498db,
  /** Fish radius as a fraction of cell size. */
  fishRadiusFactor: 0.32,
  /** Shark radius as a fraction of cell size (larger than fish). */
  sharkRadiusFactor: 0.44,
};

/**
 * Speed control constants (prd-v001.md AC 48; Nx means N chronons per
 * second). Default speed is 10x.
 */
export const SPEED = {
  /** Supported speed multipliers shown as buttons. */
  options: [1, 5, 10, 30, 60],
  /** Default speed multiplier at launch and after reset. */
  default: 10,
  /**
   * Maximum chronons advanced in a single animation frame to avoid a
   * spiral of death after tab stalls (no catch-up compensation, AC 49).
   */
  maxChrononsPerFrame: 5,
};

/**
 * Population history constants (prd-v001.md AC 45).
 */
export const HISTORY = {
  /** Rolling window size in chronons. */
  windowSize: 500,
};

/**
 * UI layout constants (prd-v001.md AC 51, 52; minimum tablet viewport
 * is iPad mini portrait 744 x 1133 CSS pixels).
 */
export const UI = {
  /** Minimum supported CSS viewport width in pixels. */
  minViewportWidth: 744,
  /** Minimum supported CSS viewport height in pixels. */
  minViewportHeight: 1133,
  /** Fraction of viewport width reserved for the stats panel (wide layout). */
  sidePanelWidthFraction: 0.16,
  /** Minimum side panel width in pixels (wide layout). */
  minSidePanelWidth: 150,
  /** Fraction of viewport height reserved for the history chart. */
  chartHeightFraction: 0.18,
  /** Minimum chart height in pixels. */
  minChartHeight: 90,
  /** Base font size in pixels for panel text. */
  fontSize: 16,
  /** Small font size in pixels for secondary text such as speed labels. */
  smallFontSize: 13,
  /** Padding inside panels in pixels. */
  padding: 12,
  /** Button height in pixels. */
  buttonHeight: 36,
  /** Vertical gap between rows in pixels. */
  rowGap: 10,
  /** Panel background color. */
  panelColor: 0x0e3557,
  /** Panel border color. */
  panelBorderColor: 0x1c5a8c,
  /** Button fill color when enabled. */
  buttonColor: 0x155d8f,
  /** Button fill color when disabled. */
  buttonDisabledColor: 0x0b2f4a,
  /** Button fill color when selected (speed buttons). */
  buttonSelectedColor: 0x2e86c1,
  /** Button text color when enabled. */
  buttonTextEnabled: '#ecf6fc',
  /** Button text color when disabled. */
  buttonTextDisabled: '#5d7f96',
};
