import {
  COLORS,
  DEFAULT_SPEED,
  HISTORY_LIMIT,
  SIMULATION_CONFIG,
  SPEEDS,
  UI
} from "../config.js";
import { ENTITY_TYPES, WatorSimulation } from "../simulation/WatorSimulation.js";

/**
 * Owns Phaser-native rendering, layout, controls, and simulation timing.
 */
export class SimulationScene extends Phaser.Scene {
  constructor() {
    super("SimulationScene");
    this.simulation = null;
    this.isRunning = true;
    this.selectedSpeed = DEFAULT_SPEED;
    this.accumulatorMs = 0;
    this.history = [];
    this.buttons = [];
    this.layout = null;
  }

  /**
   * Creates graphics layers, text, controls, and the initial simulation world.
   */
  create() {
    this.simulation = new WatorSimulation(SIMULATION_CONFIG);
    this.worldGraphics = this.add.graphics();
    this.chartGraphics = this.add.graphics();
    this.uiGraphics = this.add.graphics();
    this.statTexts = {
      chronon: this.addText(),
      fish: this.addText(),
      sharks: this.addText(),
      status: this.addText()
    };
    this.buttonTexts = [];
    this.recordHistory();
    this.handleResize();
    this.scale.on("resize", this.handleResize, this);
  }

  /**
   * Advances the simulation according to selected chronons per second.
   *
   * @param {number} time Phaser frame time.
   * @param {number} delta Elapsed milliseconds since the previous frame.
   */
  update(time, delta) {
    if (!this.isRunning || this.simulation.terminalStatus) {
      this.render();
      return;
    }

    const stepMs = 1000 / this.selectedSpeed;
    this.accumulatorMs += Math.min(delta, 250);
    let didAdvance = false;

    while (this.accumulatorMs >= stepMs && !this.simulation.terminalStatus) {
      this.simulation.step();
      this.recordHistory();
      this.accumulatorMs -= stepMs;
      didAdvance = true;
    }

    if (this.simulation.terminalStatus) {
      this.isRunning = false;
    }

    if (didAdvance) {
      this.render();
    }
  }

  /**
   * Replaces the world with a new random simulation and resumes at the selected speed.
   */
  resetSimulation() {
    this.simulation.reset();
    this.history = [];
    this.accumulatorMs = 0;
    this.isRunning = true;
    this.recordHistory();
    this.render();
  }

  togglePlayPause() {
    if (this.simulation.terminalStatus) {
      return;
    }

    this.isRunning = !this.isRunning;
    this.accumulatorMs = 0;
    this.render();
  }

  stepOnce() {
    if (this.isRunning || this.simulation.terminalStatus) {
      return;
    }

    this.simulation.step();
    this.recordHistory();
    if (this.simulation.terminalStatus) {
      this.isRunning = false;
    }
    this.render();
  }

  setSpeed(speed) {
    this.selectedSpeed = speed;
    this.accumulatorMs = 0;
    this.render();
  }

  /**
   * Computes responsive rectangles for the world, side panels, controls, and chart.
   */
  handleResize() {
    const width = this.scale.width;
    const height = this.scale.height;
    const margin = UI.margin;
    const gap = UI.gap;
    const chartHeight = Math.min(UI.chartHeight, Math.max(72, height * 0.18));
    const bodyHeight = height - chartHeight - margin * 3;
    const isWide = width >= 880;

    if (isWide) {
      const sideWidth = Math.min(UI.sidePanelWidth, Math.max(132, width * 0.18));
      const worldArea = {
        x: margin + sideWidth + gap,
        y: margin,
        width: width - margin * 2 - sideWidth * 2 - gap * 2,
        height: bodyHeight
      };
      this.layout = {
        isWide,
        stats: { x: margin, y: margin, width: sideWidth, height: bodyHeight },
        controls: {
          x: width - margin - sideWidth,
          y: margin,
          width: sideWidth,
          height: bodyHeight
        },
        world: this.fitWorld(worldArea),
        chart: {
          x: margin,
          y: height - margin - chartHeight,
          width: width - margin * 2,
          height: chartHeight
        }
      };
    } else {
      const panelHeight = Math.min(UI.narrowPanelHeight, Math.max(96, bodyHeight * 0.24));
      const worldArea = {
        x: margin,
        y: margin + panelHeight + gap,
        width: width - margin * 2,
        height: bodyHeight - panelHeight - gap
      };
      this.layout = {
        isWide,
        stats: {
          x: margin,
          y: margin,
          width: Math.floor((width - margin * 2 - gap) * 0.42),
          height: panelHeight
        },
        controls: {
          x: margin + Math.floor((width - margin * 2 - gap) * 0.42) + gap,
          y: margin,
          width: width - margin * 2 - gap - Math.floor((width - margin * 2 - gap) * 0.42),
          height: panelHeight
        },
        world: this.fitWorld(worldArea),
        chart: {
          x: margin,
          y: height - margin - chartHeight,
          width: width - margin * 2,
          height: chartHeight
        }
      };
    }

    this.rebuildButtons();
    this.render();
  }

  /**
   * Draws the current simulation, chart, stats, and Phaser-native controls.
   */
  render() {
    if (!this.layout || !this.simulation) {
      return;
    }

    this.renderWorld();
    this.renderChart();
    this.renderPanels();
    this.renderStats();
    this.renderButtons();
  }

  addText(size = 16, color = COLORS.text) {
    return this.add.text(0, 0, "", {
      fontFamily: UI.fontFamily,
      fontSize: `${size}px`,
      color: this.hexColor(color)
    });
  }

  /**
   * Fits the fixed simulation grid into a variable rectangular area.
   *
   * @param {object} area Available layout rectangle.
   * @returns {object} Centered world rectangle plus rendered cell size.
   */
  fitWorld(area) {
    const aspect = SIMULATION_CONFIG.grid.width / SIMULATION_CONFIG.grid.height;
    let width = area.width;
    let height = width / aspect;

    if (height > area.height) {
      height = area.height;
      width = height * aspect;
    }

    return {
      x: area.x + (area.width - width) / 2,
      y: area.y + (area.height - height) / 2,
      width,
      height,
      cellSize: Math.min(width / SIMULATION_CONFIG.grid.width, height / SIMULATION_CONFIG.grid.height)
    };
  }

  /**
   * Recreates interactive zones after each layout change.
   */
  rebuildButtons() {
    for (const button of this.buttons) {
      button.zone.destroy();
    }
    for (const text of this.buttonTexts) {
      text.destroy();
    }

    this.buttons = [];
    this.buttonTexts = [];

    const controls = this.layout.controls;
    const rowGap = 9;
    const buttonHeight = UI.buttonHeight;
    const buttonWidth = Math.min(controls.width, 132);
    let y = controls.y + 4;

    const speedButtonWidth = Math.max(34, Math.floor((controls.width - rowGap * 4) / 5));
    SPEEDS.forEach((speed, index) => {
      this.addButton({
        label: `${speed}x`,
        x: controls.x + index * (speedButtonWidth + rowGap),
        y,
        width: speedButtonWidth,
        height: buttonHeight,
        onClick: () => this.setSpeed(speed),
        getState: () => ({
          active: this.selectedSpeed === speed,
          disabled: false
        })
      });
    });

    y += buttonHeight + rowGap * 2;
    this.addButton({
      label: () => (this.isRunning ? "Pause" : "Play"),
      x: controls.x,
      y,
      width: buttonWidth,
      height: buttonHeight,
      onClick: () => this.togglePlayPause(),
      getState: () => ({
        active: this.isRunning,
        disabled: Boolean(this.simulation?.terminalStatus)
      })
    });

    y += buttonHeight + rowGap;
    this.addButton({
      label: "Step",
      x: controls.x,
      y,
      width: buttonWidth,
      height: buttonHeight,
      onClick: () => this.stepOnce(),
      getState: () => ({
        active: false,
        disabled: this.isRunning || Boolean(this.simulation?.terminalStatus)
      })
    });

    y += buttonHeight + rowGap;
    this.addButton({
      label: "Reset",
      x: controls.x,
      y,
      width: buttonWidth,
      height: buttonHeight,
      onClick: () => this.resetSimulation(),
      getState: () => ({
        active: false,
        disabled: false
      })
    });
  }

  /**
   * Adds an interactive Phaser zone and text label for one button descriptor.
   *
   * @param {object} button Button bounds, label, callback, and state provider.
   */
  addButton(button) {
    const zone = this.add.zone(button.x, button.y, button.width, button.height);
    zone.setOrigin(0, 0);
    zone.setInteractive({ useHandCursor: true });
    zone.on("pointerdown", () => {
      if (!button.getState().disabled) {
        button.onClick();
      }
    });

    const text = this.addText(14);
    text.setOrigin(0.5, 0.5);
    this.buttons.push({ ...button, zone, text });
    this.buttonTexts.push(text);
  }

  /**
   * Draws the water and all creature circles.
   */
  renderWorld() {
    const graphics = this.worldGraphics;
    const world = this.layout.world;
    const snapshot = this.simulation.getSnapshot();
    const cell = world.cellSize;
    const fishRadius = Math.max(1, cell * 0.36);
    const sharkRadius = Math.max(1.2, cell * 0.46);

    graphics.clear();
    graphics.fillStyle(COLORS.water, 1);
    graphics.fillRect(world.x, world.y, world.width, world.height);

    for (const entity of snapshot.entities) {
      const radius = entity.type === ENTITY_TYPES.fish ? fishRadius : sharkRadius;
      const color = entity.type === ENTITY_TYPES.fish ? COLORS.fish : COLORS.shark;
      const x = world.x + entity.x * cell + cell / 2;
      const y = world.y + entity.y * cell + cell / 2;
      graphics.fillStyle(color, 1);
      graphics.fillCircle(x, y, radius);
    }
  }

  /**
   * Draws a rolling unlabeled population chart.
   */
  renderChart() {
    const graphics = this.chartGraphics;
    const chart = this.layout.chart;

    graphics.clear();
    graphics.fillStyle(COLORS.waterDeep, 1);
    graphics.fillRect(chart.x, chart.y, chart.width, chart.height);
    graphics.lineStyle(1, COLORS.chartGrid, 0.55);
    graphics.strokeRect(chart.x, chart.y, chart.width, chart.height);

    this.drawHistoryLine(COLORS.fish, "fish");
    this.drawHistoryLine(COLORS.shark, "sharks");
  }

  /**
   * Draws one population series in the history chart.
   *
   * @param {number} color Phaser color value.
   * @param {string} key Population sample key to draw.
   */
  drawHistoryLine(color, key) {
    if (this.history.length < 2) {
      return;
    }

    const chart = this.layout.chart;
    const maxPopulation = Math.max(
      1,
      ...this.history.map((sample) => Math.max(sample.fish, sample.sharks))
    );
    const lastIndex = this.history.length - 1;

    this.chartGraphics.lineStyle(2, color, 1);
    this.history.forEach((sample, index) => {
      const x = chart.x + (index / lastIndex) * chart.width;
      const y = chart.y + chart.height - (sample[key] / maxPopulation) * chart.height;
      if (index === 0) {
        this.chartGraphics.beginPath();
        this.chartGraphics.moveTo(x, y);
      } else {
        this.chartGraphics.lineTo(x, y);
      }
    });
    this.chartGraphics.strokePath();
  }

  /**
   * Draws opaque backing panels for stats and controls.
   */
  renderPanels() {
    this.uiGraphics.clear();
    this.uiGraphics.fillStyle(COLORS.water, 1);
    this.uiGraphics.fillRect(
      this.layout.stats.x,
      this.layout.stats.y,
      this.layout.stats.width,
      this.layout.stats.height
    );
    this.uiGraphics.fillRect(
      this.layout.controls.x,
      this.layout.controls.y,
      this.layout.controls.width,
      this.layout.controls.height
    );
  }

  /**
   * Updates the live stat text positions, values, and colors.
   */
  renderStats() {
    const snapshot = this.simulation.getSnapshot();
    const label = this.simulation.getStatus(this.isRunning).label;
    const rows = [
      ["chronon", `Chronon ${snapshot.chronon}`],
      ["fish", `Fish ${snapshot.counts.fish}`],
      ["sharks", `Sharks ${snapshot.counts.sharks}`],
      ["status", `Status ${label}`]
    ];
    const lineHeight = this.layout.isWide ? 27 : 23;

    rows.forEach(([key, value], index) => {
      const text = this.statTexts[key];
      text.setText(value);
      text.setFontSize(this.layout.isWide ? 16 : 14);
      text.setColor(this.hexColor(key === "fish" ? COLORS.fish : key === "sharks" ? COLORS.shark : COLORS.text));
      text.setPosition(this.layout.stats.x + 8, this.layout.stats.y + 8 + index * lineHeight);
    });
  }

  /**
   * Draws the current visual state of speed and action buttons.
   */
  renderButtons() {
    for (const button of this.buttons) {
      const state = button.getState();
      const fill = state.disabled
        ? COLORS.panelDisabled
        : state.active
          ? COLORS.panelActive
          : COLORS.panel;
      this.uiGraphics.fillStyle(fill, 1);
      this.uiGraphics.lineStyle(1, COLORS.buttonStroke, state.disabled ? 0.35 : 0.85);
      this.uiGraphics.fillRect(button.x, button.y, button.width, button.height);
      this.uiGraphics.strokeRect(button.x, button.y, button.width, button.height);
      button.text.setText(typeof button.label === "function" ? button.label() : button.label);
      button.text.setColor(this.hexColor(state.disabled ? COLORS.mutedText : COLORS.text));
      button.text.setPosition(button.x + button.width / 2, button.y + button.height / 2);
    }
  }

  recordHistory() {
    const counts = this.simulation.getPopulationCounts();
    this.history.push({ ...counts });

    if (this.history.length > HISTORY_LIMIT) {
      this.history.shift();
    }
  }

  hexColor(color) {
    return `#${color.toString(16).padStart(6, "0")}`;
  }
}
