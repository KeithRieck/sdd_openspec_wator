/**
 * Simulation constants for the Wa-Tor simulation.
 * These values control the behavior and initial state of the world.
 */
export const CONFIG = {
    // Grid Dimensions
    gridWidth: 100,
    gridHeight: 70,

    // Initial Population Densities (0.0 to 1.0)
    fishDensity: 0.30,
    sharkDensity: 0.05,

    // Breeding Rules
    fishBreedTime: 3,
    sharkBreedTime: 25,

    // Shark Energy Rules
    initialSharkEnergy: 5,
    sharkEnergyGain: 3,
    sharkEnergyCostPerChronon: 1,

    // Simulation Speed
    defaultSpeed: 10,
    supportedSpeeds: [1, 5, 10, 30, 60],

    // Visuals
    fishColor: 0x00FF00, // Green
    sharkColor: 0x0000FF, // Blue
    fishRadius: 2,
    sharkRadius: 3,
};
