/**
 * @fileoverview Configuration constants for the Wa-Tor simulation and user interface.
 */

/**
 * Global configuration object for the Wa-Tor application.
 * Contains simulation parameters, colors, and layout settings.
 * @type {Object}
 */
export const Config = Object.freeze({
  // Grid settings
  GRID_WIDTH: 100,
  GRID_HEIGHT: 70,

  // Simulation parameters
  FISH_DENSITY: 0.30,
  SHARK_DENSITY: 0.05,
  
  FISH_BREED_TIME: 3,
  SHARK_BREED_TIME: 25,
  
  INITIAL_SHARK_ENERGY: 5,
  SHARK_ENERGY_GAIN: 3,
  SHARK_ENERGY_COST: 1,

  // Speed options (chronons per second)
  SPEED_DEFAULT: '10x',
  SPEED_OPTIONS: Object.freeze({
    '1x': 1,
    '5x': 5,
    '10x': 10,
    '30x': 30,
    '60x': 60
  }),

  // Premium HSL-aligned color palette
  COLORS: Object.freeze({
    WATER_BG: 0x1e2a38,      // Dark Ocean Slate
    FISH: 0x2ecc71,          // Vibrant Emerald Green
    SHARK: 0x3498db,         // Premium Dodger Blue
    
    // UI elements
    PANEL_BG: 0x111b27,      // Extra Dark Slate
    TEXT: 0xecf0f1,          // Muted White
    TEXT_MUTED: 0x95a5a6,    // Grey text
    
    // Buttons
    BTN_NORMAL: 0x2c3e50,    // Midnight Blue
    BTN_HOVER: 0x34495e,     // Wet Asphalt
    BTN_ACTIVE: 0x16a085,    // Dark Turquoise
    BTN_DISABLED: 0x272727,  // Disabled grey
    BTN_TEXT_DISABLED: 0x7f8c8d,
    
    // Extinction statuses
    COLLAPSE: 0xe74c3c,      // Red
    EXTINCT_SHARK: 0xe67e22, // Orange
    EXTINCT_FISH: 0xf1c40f   // Yellow
  }),

  // Chart configuration
  CHART: Object.freeze({
    MAX_SAMPLES: 500,
    BG_COLOR: 0x111b27,
    LINE_THICKNESS: 2
  })
});
