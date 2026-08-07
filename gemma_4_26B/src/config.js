/**
 * Simulation and UI configuration constants for the Wa-Tor simulation.
 */
export const CONFIG = {
    // Grid Dimensions
    grid: {
        width: 100,
        height: 70,
    },

    // Initial Population Densities
    density: {
        fish: 0.30,
        shark: 0.05,
    },

    // Breeding Rules
    breeding: {
        fishBreedTime: 3,
        sharkBreedTime: 25,
    },

    // Shark Energy Rules
    sharkEnergy: {
        initial: 5,
        gain: 3,
        costPerChronon: 1,
    },

    // Simulation Speed
    speed: {
        default: 10,
        options: [1, 5, 10, 30, 60],
    },

    // Visuals
    visuals: {
        fishColor: 0x00ff00, // Green
        sharkColor: 0x0000ff, // Blue
        fishRadius: 2,
        sharkRadius: 3,
        waterColor: 0x000033, // Dark Blue
    },

    // UI Layout
    ui: {
        statsPanelWidth: 200,
        controlsPanelWidth: 200,
        chartHeight: 150,
        historyWindow: 500,
    }
};
