import { Config } from '../config.js';
import { WatorSimulation } from '../simulation/WatorSimulation.js';

/**
 * Main gameplay and rendering scene for the Wa-Tor simulation.
 * Handles user interactions, statistics layout, toroidal grid cell drawing,
 * and the rolling population history chart.
 * @extends Phaser.Scene
 */
export class SimulationScene extends Phaser.Scene {
  /**
   * Initialize the SimulationScene.
   */
  constructor() {
    super({ key: 'SimulationScene' });
    
    this.simulation = new WatorSimulation();
    
    // Simulation state controls
    this.isRunning = true;
    this.currentSpeedChoice = Config.SPEED_DEFAULT;
    this.tickAccumulator = 0;
    
    // UI layout reference
    this.layout = null;
    
    // UI elements references
    this.gridGraphics = null;
    this.chartGraphics = null;
    this.statsText = null;
    
    /** @type {Map<string, Object>} */
    this.uiButtons = new Map();
  }

  /**
   * Create the simulation scene: initializes layout, graphics contexts, UI text, and event listeners.
   */
  create() {
    // 1. Initialize simulation engine
    this.simulation.initialize();
    
    // 2. Create Phaser Graphics for world drawing and chart drawing
    this.gridGraphics = this.add.graphics();
    this.chartGraphics = this.add.graphics();
    
    // 3. Create Stats text display
    this.statsText = this.add.text(10, 10, '', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '16px',
      color: `#${Config.COLORS.TEXT.toString(16)}`,
      lineSpacing: 10
    });
    
    // 4. Create all interactive buttons
    this.createUIControls();
    
    // 5. Trigger first layout reflow and register resize handler
    this.handleResize();
    this.scale.on('resize', this.handleResize, this);
  }

  /**
   * Phaser scene update loop.
   * Runs the simulation ticks at chronons-per-second matching speed selection.
   * @param {number} time - Current game time in ms.
   * @param {number} delta - Milliseconds elapsed since the last frame update.
   */
  update(time, delta) {
    const isTerminal = this.isTerminalState();

    if (this.isRunning && !isTerminal) {
      this.tickAccumulator += delta;
      const speedCps = Config.SPEED_OPTIONS[this.currentSpeedChoice];
      const msPerChronon = 1000 / speedCps;
      
      // Perform as many steps as required by the speed choice and time delta
      while (this.tickAccumulator >= msPerChronon) {
        this.simulation.tick();
        this.tickAccumulator -= msPerChronon;
        
        // Auto-pause immediately if an extinction state is triggered
        if (this.isTerminalState()) {
          this.isRunning = false;
          this.tickAccumulator = 0;
          break;
        }
      }
      
      this.updateStatsText();
      this.drawWorld();
      this.drawChart();
      this.updateButtonStates();
    }
  }

  /**
   * Dynamic resize listener: calculates responsive layouts and resizes UI zones.
   */
  handleResize() {
    const W = this.scale.width;
    const H = this.scale.height;
    const isLandscape = W >= H;

    if (isLandscape) {
      // Landscape layout: Stats left, Grid middle, Controls right, Chart bottom
      const topH = H * 0.75;
      const bottomH = H * 0.25;
      this.layout = {
        isLandscape: true,
        stats: { x: 0, y: 0, w: W * 0.15, h: topH },
        grid: { x: W * 0.15, y: 0, w: W * 0.70, h: topH },
        controls: { x: W * 0.85, y: 0, w: W * 0.15, h: topH },
        chart: { x: 0, y: topH, w: W, h: bottomH }
      };
    } else {
      // Portrait layout: Stacked vertically
      this.layout = {
        isLandscape: false,
        stats: { x: 0, y: 0, w: W, h: H * 0.08 },
        grid: { x: 0, y: H * 0.08, w: W, h: H * 0.52 },
        controls: { x: 0, y: H * 0.60, w: W, h: H * 0.15 },
        chart: { x: 0, y: H * 0.75, w: W, h: H * 0.25 }
      };
    }

    // Reposition UI text, graphics layouts, and button boxes
    this.layoutUIComponents();
    
    // Refresh visual draws immediately
    this.updateStatsText();
    this.drawWorld();
    this.drawChart();
    this.updateButtonStates();
  }

  /**
   * Places and resizes statistics text labels and interactive buttons on layout changes.
   */
  layoutUIComponents() {
    // 1. Stats Text
    const s = this.layout.stats;
    if (this.layout.isLandscape) {
      this.statsText.setPosition(s.x + 20, s.y + 30);
      this.statsText.setFontSize('18px');
    } else {
      this.statsText.setPosition(s.x + 15, s.y + 10);
      this.statsText.setFontSize('14px');
    }

    // 2. Reposition controls panel buttons
    const c = this.layout.controls;
    const speedKeys = ['1x', '5x', '10x', '30x', '60x'];

    if (this.layout.isLandscape) {
      // Speeds: horizontal row at the top of the right panel
      const speedBtnW = (c.w - 40) / 5;
      const speedBtnH = 30;
      const speedY = c.y + 40;

      speedKeys.forEach((key, index) => {
        const btn = this.uiButtons.get(key);
        const btnX = c.x + 20 + index * speedBtnW;
        this.positionButton(btn, btnX, speedY, speedBtnW - 4, speedBtnH);
      });

      // Actions: individual vertical rows
      const actBtnW = c.w - 40;
      const actBtnH = 40;
      const startActionY = c.y + 110;
      const actionSpacing = 55;

      const actions = ['Play', 'Step', 'Reset'];
      actions.forEach((key, index) => {
        const btn = this.uiButtons.get(key);
        const btnY = startActionY + index * actionSpacing;
        this.positionButton(btn, c.x + 20, btnY, actBtnW, actBtnH);
      });
    } else {
      // Portrait Reflow: speed buttons row left side, action buttons row right side
      const rowY = c.y + (c.h - 40) / 2;
      
      // Speeds occupy the left 55% of the control area width
      const speedSectionW = c.w * 0.55;
      const speedBtnW = (speedSectionW - 20) / 5;
      const speedBtnH = 35;
      speedKeys.forEach((key, index) => {
        const btn = this.uiButtons.get(key);
        const btnX = c.x + 10 + index * speedBtnW;
        this.positionButton(btn, btnX, rowY, speedBtnW - 4, speedBtnH);
      });

      // Actions occupy the right 45% of the control area width
      const actionSectionW = c.w * 0.45;
      const actBtnW = (actionSectionW - 20) / 3;
      const actBtnH = 35;
      const startActionX = c.x + speedSectionW + 10;

      const actions = ['Play', 'Step', 'Reset'];
      actions.forEach((key, index) => {
        const btn = this.uiButtons.get(key);
        const btnX = startActionX + index * actBtnW;
        this.positionButton(btn, btnX, rowY, actBtnW - 5, actBtnH);
      });
    }
  }

  /**
   * Helper that creates an interactive Phaser text/rectangle button pairing.
   * @param {string} key - Unique key for references.
   * @param {string} text - Button display label.
   * @param {Function} onClick - Click callback function.
   */
  createButton(key, text, onClick) {
    const bg = this.add.rectangle(0, 0, 10, 10, Config.COLORS.BTN_NORMAL);
    const label = this.add.text(0, 0, text, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
      fontWeight: 'bold',
      color: `#${Config.COLORS.TEXT.toString(16)}`
    }).setOrigin(0.5);

    // Make the background interactive
    bg.setInteractive({ useHandCursor: true });
    
    bg.on('pointerover', () => {
      if (bg.getData('enabled')) {
        bg.setFillStyle(Config.COLORS.BTN_HOVER);
      }
    });

    bg.on('pointerout', () => {
      if (bg.getData('enabled')) {
        const isSelected = bg.getData('selected');
        bg.setFillStyle(isSelected ? Config.COLORS.BTN_ACTIVE : Config.COLORS.BTN_NORMAL);
      }
    });

    bg.on('pointerdown', () => {
      if (bg.getData('enabled')) {
        bg.setFillStyle(Config.COLORS.BTN_ACTIVE);
        onClick();
      }
    });

    bg.setData('enabled', true);
    bg.setData('selected', false);

    this.uiButtons.set(key, { bg, label });
  }

  /**
   * Sets size and position for button background and label.
   * @param {Object} button - Button ref object.
   * @param {number} x - Horizontal coordinate.
   * @param {number} y - Vertical coordinate.
   * @param {number} w - Width dimension.
   * @param {number} h - Height dimension.
   */
  positionButton(button, x, y, w, h) {
    button.bg.setPosition(x + w / 2, y + h / 2).setSize(w, h);
    button.label.setPosition(x + w / 2, y + h / 2);
    
    // Fit text sizing dynamically
    const maxFontSize = w > 60 ? '14px' : '11px';
    button.label.setFontSize(maxFontSize);
  }

  /**
   * Scaffolds and sets up all interactive UI buttons.
   */
  createUIControls() {
    // Speed buttons
    const speeds = ['1x', '5x', '10x', '30x', '60x'];
    speeds.forEach((s) => {
      this.createButton(s, s, () => {
        this.currentSpeedChoice = s;
        this.updateButtonStates();
      });
    });

    // Play/Pause button
    this.createButton('Play', 'Pause', () => {
      this.isRunning = !this.isRunning;
      this.updateButtonStates();
    });

    // Step button
    this.createButton('Step', 'Step', () => {
      if (!this.isRunning && !this.isTerminalState()) {
        this.simulation.tick();
        this.updateStatsText();
        this.drawWorld();
        this.drawChart();
      }
    });

    // Reset button
    this.createButton('Reset', 'Reset', () => {
      this.simulation.reset();
      this.isRunning = true;
      this.tickAccumulator = 0;
      this.updateButtonStates();
      this.updateStatsText();
      this.drawWorld();
      this.drawChart();
    });
  }

  /**
   * Refreshes hover, selection, and disabled states for all UI buttons.
   */
  updateButtonStates() {
    const isTerminal = this.isTerminalState();

    // 1. Update Speeds buttons: highlight the selected speed choice
    const speedKeys = ['1x', '5x', '10x', '30x', '60x'];
    speedKeys.forEach((key) => {
      const btn = this.uiButtons.get(key);
      const isSelected = this.currentSpeedChoice === key;
      btn.bg.setData('selected', isSelected);
      btn.bg.setFillStyle(isSelected ? Config.COLORS.BTN_ACTIVE : Config.COLORS.BTN_NORMAL);
    });

    // 2. Play/Pause button: change text based on status and disable if simulation ended
    const playBtn = this.uiButtons.get('Play');
    if (isTerminal) {
      playBtn.bg.setData('enabled', false);
      playBtn.bg.setFillStyle(Config.COLORS.BTN_DISABLED);
      playBtn.label.setText('Play');
      playBtn.label.setColor(`#${Config.COLORS.BTN_TEXT_DISABLED.toString(16)}`);
    } else {
      playBtn.bg.setData('enabled', true);
      playBtn.bg.setFillStyle(Config.COLORS.BTN_NORMAL);
      playBtn.label.setText(this.isRunning ? 'Pause' : 'Play');
      playBtn.label.setColor(`#${Config.COLORS.TEXT.toString(16)}`);
    }

    // 3. Step button: enable only if simulation is paused and not terminal
    const stepBtn = this.uiButtons.get('Step');
    const stepEnabled = !this.isRunning && !isTerminal;
    stepBtn.bg.setData('enabled', stepEnabled);
    if (stepEnabled) {
      stepBtn.bg.setFillStyle(Config.COLORS.BTN_NORMAL);
      stepBtn.label.setColor(`#${Config.COLORS.TEXT.toString(16)}`);
    } else {
      stepBtn.bg.setFillStyle(Config.COLORS.BTN_DISABLED);
      stepBtn.label.setColor(`#${Config.COLORS.BTN_TEXT_DISABLED.toString(16)}`);
    }
  }

  /**
   * Determines if the simulation has reached an extinction state.
   * @returns {boolean} True if simulation is terminal.
   */
  isTerminalState() {
    const status = this.simulation.status;
    return status.includes('extinct') || status === 'Ecosystem collapsed';
  }

  /**
   * Refreshes text parameters in the left/top stats panel.
   */
  updateStatsText() {
    let statusText = this.simulation.status;
    
    // Auto-replace with Paused if simulation is paused and not terminal
    if (!this.isRunning && !this.isTerminalState()) {
      statusText = 'Paused';
    }

    // Format HSL color hex styling matching state
    let stateColor = `#${Config.COLORS.TEXT_MUTED.toString(16)}`;
    if (statusText === 'Running') {
      stateColor = '#2ecc71';
    } else if (statusText === 'Paused') {
      stateColor = '#95a5a6';
    } else if (statusText === 'Ecosystem collapsed') {
      stateColor = '#e74c3c';
    } else if (statusText === 'Sharks extinct') {
      stateColor = '#e67e22';
    } else if (statusText === 'Fish extinct') {
      stateColor = '#f1c40f';
    }

    const labelLines = [
      `Chronon:  ${this.simulation.chronon}`,
      `Fish:     ${this.simulation.fishCount}`,
      `Sharks:   ${this.simulation.sharkCount}`,
      `Status:   ${statusText.toUpperCase()}`
    ];

    this.statsText.setText(labelLines.join('\n'));
  }

  /**
   * Clears and draws the Wa-Tor toroidal grid cell configuration using circles.
   */
  drawWorld() {
    this.gridGraphics.clear();
    const gLayout = this.layout.grid;

    // 1. Calculate cell dimensions keeping the 100:70 aspect ratio
    const cellW = gLayout.w / Config.GRID_WIDTH;
    const cellH = gLayout.h / Config.GRID_HEIGHT;
    const cellSize = Math.min(cellW, cellH);

    const actualGridW = Config.GRID_WIDTH * cellSize;
    const actualGridH = Config.GRID_HEIGHT * cellSize;

    // Centered layout coordinates
    const startX = gLayout.x + (gLayout.w - actualGridW) / 2;
    const startY = gLayout.y + (gLayout.h - actualGridH) / 2;

    // 2. Draw background ocean rectangle
    this.gridGraphics.fillStyle(Config.COLORS.WATER_BG, 1.0);
    this.gridGraphics.fillRect(startX, startY, actualGridW, actualGridH);

    // 3. Draw fish (green) and sharks (blue) circles
    const simGrid = this.simulation.grid;
    for (let i = 0; i < this.simulation.size; i++) {
      const entity = simGrid[i];
      if (!entity) continue;

      const cx = startX + (entity.x + 0.5) * cellSize;
      const cy = startY + (entity.y + 0.5) * cellSize;

      if (entity.type === 'fish') {
        this.gridGraphics.fillStyle(Config.COLORS.FISH, 1.0);
        this.gridGraphics.fillCircle(cx, cy, cellSize * 0.35);
      } else if (entity.type === 'shark') {
        this.gridGraphics.fillStyle(Config.COLORS.SHARK, 1.0);
        this.gridGraphics.fillCircle(cx, cy, cellSize * 0.45);
      }
    }
  }

  /**
   * Clears and draws the population history chart lines horizontally.
   */
  drawChart() {
    this.chartGraphics.clear();
    const cLayout = this.layout.chart;
    const margin = 15;

    // Internal dimensions
    const cw = cLayout.w - 2 * margin;
    const ch = cLayout.h - 2 * margin;
    const cx = cLayout.x + margin;
    const cy = cLayout.y + margin;

    // 1. Draw chart panel background
    this.chartGraphics.fillStyle(Config.CHART.BG_COLOR, 1.0);
    this.chartGraphics.fillRect(cx, cy, cw, ch);

    const history = this.simulation.history;
    if (history.length < 2) return;

    // 2. Find maximum values seen in history (min max value is 10 to avoid division by zero)
    let maxVal = 10;
    for (const sample of history) {
      if (sample.fish > maxVal) maxVal = sample.fish;
      if (sample.sharks > maxVal) maxVal = sample.sharks;
    }

    const maxSamples = Config.CHART.MAX_SAMPLES;
    const denom = Math.max(maxSamples - 1, history.length - 1);

    // 3. Draw Fish Population Line (Green)
    this.chartGraphics.lineStyle(Config.CHART.LINE_THICKNESS, Config.COLORS.FISH);
    this.chartGraphics.beginPath();
    for (let i = 0; i < history.length; i++) {
      const px = cx + (i / denom) * cw;
      const py = cy + ch - (history[i].fish / maxVal) * ch;
      if (i === 0) {
        this.chartGraphics.moveTo(px, py);
      } else {
        this.chartGraphics.lineTo(px, py);
      }
    }
    this.chartGraphics.strokePath();

    // 4. Draw Sharks Population Line (Blue)
    this.chartGraphics.lineStyle(Config.CHART.LINE_THICKNESS, Config.COLORS.SHARK);
    this.chartGraphics.beginPath();
    for (let i = 0; i < history.length; i++) {
      const px = cx + (i / denom) * cw;
      const py = cy + ch - (history[i].sharks / maxVal) * ch;
      if (i === 0) {
        this.chartGraphics.moveTo(px, py);
      } else {
        this.chartGraphics.lineTo(px, py);
      }
    }
    this.chartGraphics.strokePath();
  }
}
