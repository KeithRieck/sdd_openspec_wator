/**
 * Central configuration for the Wa-Tor simulation and rendering.
 *
 * All tunable constants live here so programmers can adjust grid dimensions,
 * densities, breed times, shark energy values, colors, and speed options
 * without touching simulation or scene logic.
 */

/** Grid dimensions in cells. Width = columns, Height = rows. */
export const GRID_WIDTH = 100;
export const GRID_HEIGHT = 70;

/** Initial population densities (0..1). Applied independently per cell. */
export const FISH_DENSITY = 0.30;
export const SHARK_DENSITY = 0.05;

/** Breeding thresholds in chronons. */
export const FISH_BREED_TIME = 3;
export const SHARK_BREED_TIME = 25;

/** Shark energy parameters. */
export const INITIAL_SHARK_ENERGY = 5;
export const SHARK_ENERGY_GAIN = 3;
export const SHARK_ENERGY_COST_PER_CHRONON = 1;

/** Speed options in chronons-per-second. */
export const SPEED_OPTIONS = [1, 5, 10, 30, 60];

/** Default speed index into SPEED_OPTIONS (10x). */
export const DEFAULT_SPEED = 10;

/** Rolling population history window length in chronons. */
export const HISTORY_WINDOW = 500;

/** Colors used for world rendering, stats, and chart. */
export const COLORS = {
    water: 0x0a1929,
    fish: 0x4caf50,
    shark: 0x2196f3,
    text: 0xe0e0e0,
    panel: 0x132f4c,
    panelBorder: 0x1e4976,
    buttonBg: 0x1e4976,
    buttonHover: 0x2a6a9e,
    buttonActive: 0x163a5c,
    buttonDisabled: 0x2a2a2a,
    buttonSelected: 0x4caf50,
    buttonSelectedBorder: 0x66bb6a,
    chartBackground: 0x0d2137,
    chartGrid: 0x1a3a5c
};

/** Fish circle radius as a fraction of cell size. */
export const FISH_RADIUS_FACTOR = 0.35;

/** Shark circle radius as a fraction of cell size (larger than fish). */
export const SHARK_RADIUS_FACTOR = 0.45;

/** Layout constants in CSS pixels for wide windows. */
export const LAYOUT = {
    statsPanelWidth: 160,
    controlsPanelWidth: 160,
    chartHeight: 140,
    panelPadding: 12,
    buttonHeight: 44,
    buttonSpacing: 10,
    speedButtonWidth: 52,
    cornerRadius: 8,
    fontSize: 16,
    statsFontSize: 18,
    statsLineHeight: 28
};

/** Status strings used by the simulation and UI. */
export const STATUS = {
    RUNNING: 'Running',
    PAUSED: 'Paused',
    SHARKS_EXTINCT: 'Sharks extinct',
    FISH_EXTINCT: 'Fish extinct',
    ECOSYSTEM_COLLAPSED: 'Ecosystem collapsed'
};

/** Phaser CDN URL (referenced by service worker for caching). */
export const PHASER_CDN_URL = 'https://cdn.jsdelivr.net/npm/phaser@4.1.0/dist/phaser.min.js';
