// Configuration constants for the Wa-Tor simulation
// R13: Code constants define model parameters - easy for programmers to change

// Grid dimensions
export const GRID_WIDTH = 100;
export const GRID_HEIGHT = 70;

// Population densities
export const FISH_DENSITY = 0.30;  // 30% fish
export const SHARK_DENSITY = 0.05; // 5% sharks

// Breeding times
export const FISH_BREED_TIME = 3;   // chronons
export const SHARK_BREED_TIME = 25; // chronons

// Shark energy values
export const INITIAL_SHARK_ENERGY = 5;
export const SHARK_ENERGY_GAIN = 3;
export const SHARK_ENERGY_COST_PER_CHRONON = 1;

// Colors (used for rendering and chart)
export const COLOR_WATER = 0x1a3a5c;   // deep water blue
export const COLOR_FISH = 0x00ff88;    // green
export const COLOR_SHARK = 0x0066ff;   // blue
export const COLOR_SHARK_BG = 0x0044aa; // darker blue for shark

// Speed options (chronons per second)
export const SPEED_1X = 1;
export const SPEED_5X = 5;
export const SPEED_10X = 10;
export const SPEED_30X = 30;
export const SPEED_60X = 60;

// Speed options list for UI
export const SPEED_OPTIONS = [
    { label: '1x', value: SPEED_1X },
    { label: '5x', value: SPEED_5X },
    { label: '10x', value: SPEED_10X },
    { label: '30x', value: SPEED_30X },
    { label: '60x', value: SPEED_60X }
];

// Default speed
export const DEFAULT_SPEED = SPEED_10X;

// Population history rolling window
export const HISTORY_WINDOW = 500;

// Simulation state strings
export const STATUS_RUNNING = 'Running';
export const STATUS_PAUSED = 'Paused';
export const STATUS_SHARKS_EXTINCT = 'Sharks extinct';
export const STATUS_FISH_EXTINCT = 'Fish extinct';
export const STATUS_ECOSYSTEM_COLLAPSED = 'Ecosystem collapsed';
