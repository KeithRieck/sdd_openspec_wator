/** Central configuration for the Wa-Tor model and presentation. */
export const CONFIG = Object.freeze({
  grid: Object.freeze({ width: 100, height: 70 }),
  density: Object.freeze({ fish: 0.30, shark: 0.05 }),
  breeding: Object.freeze({ fishBreedTime: 3, sharkBreedTime: 25 }),
  shark: Object.freeze({
    initialEnergy: 5,
    energyGain: 3,
    energyCostPerChronon: 1,
  }),
  historyLimit: 500,
  speedOptions: Object.freeze([1, 5, 10, 30, 60]),
  defaultSpeed: 10,
  colors: Object.freeze({
    water: 0x071a2b,
    panel: 0x0d2940,
    panelBorder: 0x1d5274,
    text: 0xe6f4ff,
    mutedText: 0x8eb3c9,
    fish: 0x59d66f,
    shark: 0x4fa6ff,
    selected: 0x1f789d,
    disabled: 0x294252,
  }),
});

export const DIRECTIONS = Object.freeze([
  Object.freeze({ x: 0, y: -1 }),
  Object.freeze({ x: 1, y: 0 }),
  Object.freeze({ x: 0, y: 1 }),
  Object.freeze({ x: -1, y: 0 }),
]);
