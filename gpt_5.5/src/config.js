export const GRID = {
  width: 100,
  height: 70
};

export const POPULATION = {
  fishDensity: 0.3,
  sharkDensity: 0.05
};

export const MODEL = {
  fishBreedTime: 3,
  sharkBreedTime: 25,
  initialSharkEnergy: 5,
  sharkEnergyGain: 3,
  sharkEnergyCostPerChronon: 1
};

export const COLORS = {
  water: 0x063b55,
  waterDeep: 0x042432,
  fish: 0x55d66b,
  shark: 0x4a9dff,
  text: 0xeaf7ff,
  mutedText: 0x91b9c7,
  panel: 0x0b4b63,
  panelActive: 0x14708c,
  panelDisabled: 0x40545c,
  buttonStroke: 0x96cfe0,
  chartGrid: 0x245f73
};

export const SPEEDS = [1, 5, 10, 30, 60];
export const DEFAULT_SPEED = 10;
export const HISTORY_LIMIT = 500;

export const UI = {
  minTabletWidth: 744,
  minTabletHeight: 1133,
  margin: 18,
  gap: 14,
  sidePanelWidth: 170,
  narrowPanelHeight: 118,
  chartHeight: 104,
  buttonHeight: 34,
  fontFamily: "Arial, Helvetica, sans-serif"
};

export const SIMULATION_CONFIG = {
  grid: GRID,
  population: POPULATION,
  model: MODEL
};
