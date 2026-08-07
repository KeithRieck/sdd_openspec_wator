/**
 * SimulationScene - Main scene for the Wa-Tor simulation.
 * Handles rendering, controls, and simulation updates.
 */
import { WatorSimulation } from '../simulation/WatorSimulation.js';
import {
    GRID_WIDTH,
    GRID_HEIGHT,
    DEFAULT_SPEED,
    SPEED_OPTIONS,
    WATER_COLOR,
    FISH_COLOR,
    SHARK_COLOR,
    STATS_TEXT_COLOR,
    CONTROLS_TEXT_COLOR,
    CHART_FISH_COLOR,
    CHART_SHARK_COLOR,
    FISH_RADIUS,
    SHARK_RADIUS,
    STATS_MARGIN,
    CONTROLS_MARGIN,
    CHART_HEIGHT,
    CHART_MARGIN,
    BUTTON_WIDTH,
    BUTTON_HEIGHT,
    BUTTON_SPACING,
    TEXT_FONT,
    STATS_FONT_SIZE,
    CONTROLS_FONT_SIZE
} from '../config.js';

/**
 * SimulationScene class.
 * Main Phaser scene that manages the Wa-Tor simulation rendering and controls.
 */
export class SimulationScene extends Phaser.Scene {
    /**
     * Creates a new SimulationScene.
     */
    constructor() {
        super({ key: 'SimulationScene' });

        this.simulation = null;
        this.speed = DEFAULT_SPEED;
        this.isRunning = true;
        this.accumulator = 0;
        this.chrononInterval = 1000 / (DEFAULT_SPEED * 60); // Target 60 FPS base

        // Graphics objects
        this.worldGraphics = null;
        this.statsGraphics = null;
        this.controlsGraphics = null;
        this.chartGraphics = null;

        // Button rectangles for hit detection
        this.buttons = {};

        // Text objects for UI
        this.statsTexts = [];
        this.speedTexts = [];
        this.actionTexts = {};
    }

    /**
     * Creates the scene, initializes simulation and UI.
     */
    create() {
        // Initialize simulation
        this.simulation = new WatorSimulation(GRID_WIDTH, GRID_HEIGHT);

        // Create graphics objects
        this.worldGraphics = this.add.graphics();
        this.statsGraphics = this.add.graphics();
        this.controlsGraphics = this.add.graphics();
        this.chartGraphics = this.add.graphics();

        // Set up resize handler
        this.setupResizeHandler();

        // Set up input
        this.setupInput();

        // Initial render
        this.resize();
    }

    /**
     * Sets up the resize handler for the game window.
     */
    setupResizeHandler() {
        this.scale.on('resize', this.resize, this);
    }

    /**
     * Sets up input handling for controls.
     */
    setupInput() {
        this.input.on('pointerdown', (pointer) => {
            this.handlePointerDown(pointer.x, pointer.y);
        });
    }

    /**
     * Handles pointer down events for button clicks.
     * @param {number} x - X coordinate of the pointer
     * @param {number} y - Y coordinate of the pointer
     */
    handlePointerDown(x, y) {
        // Check if any button was clicked
        for (const [name, button] of Object.entries(this.buttons)) {
            if (this.isPointInRect(x, y, button)) {
                this.handleButtonClick(name);
                return;
            }
        }
    }

    /**
     * Checks if a point is inside a rectangle.
     * @param {number} px - Point X coordinate
     * @param {number} py - Point Y coordinate
     * @param {Object} rect - Rectangle with x, y, width, height
     * @returns {boolean} True if point is inside rectangle
     */
    isPointInRect(px, py, rect) {
        return px >= rect.x && px <= rect.x + rect.width &&
               py >= rect.y && py <= rect.y + rect.height;
    }

    /**
     * Handles button click events.
     * @param {string} buttonName - Name of the button clicked
     */
    handleButtonClick(buttonName) {
        switch (buttonName) {
            case 'play-pause':
                this.handlePlayPause();
                break;
            case 'step':
                this.handleStep();
                break;
            case 'reset':
                this.handleReset();
                break;
            default:
                if (buttonName.startsWith('speed-')) {
                    const speed = parseInt(buttonName.substring(6));
                    this.handleSpeedChange(speed);
                }
                break;
        }

        // Re-render controls after any button click
        this.drawControls();
    }

    /**
     * Toggles play/pause state.
     */
    handlePlayPause() {
        this.isRunning = !this.isRunning;
    }

    /**
     * Advances the simulation by one chronon.
     */
    handleStep() {
        if (!this.isRunning) {
            this.simulation.step();
        }
    }

    /**
     * Resets the simulation.
     */
    handleReset() {
        this.simulation = new WatorSimulation(GRID_WIDTH, GRID_HEIGHT);
        this.isRunning = true;
    }

    /**
     * Changes the simulation speed.
     * @param {number} speed - New speed value
     */
    handleSpeedChange(speed) {
        this.speed = speed;
        this.chrononInterval = 1000 / (speed * 60);
    }

    /**
     * Updates the simulation based on elapsed time.
     * @param {number} time - Current timestamp
     * @param {number} delta - Time elapsed since last frame in ms
     */
    update(time, delta) {
        if (!this.isRunning) return;

        // Accumulator pattern for consistent chronon timing
        this.accumulator += delta;

        while (this.accumulator >= this.chrononInterval) {
            this.simulation.step();
            this.accumulator -= this.chrononInterval;
        }
    }

    /**
     * Handles window resize events.
     */
    resize() {
        const width = this.scale.width;
        const height = this.scale.height;

        // Clear all graphics
        this.worldGraphics.clear();
        this.statsGraphics.clear();
        this.controlsGraphics.clear();
        this.chartGraphics.clear();

        // Calculate layout
        const chartHeight = CHART_HEIGHT;
        const availableHeight = height - chartHeight - CHART_MARGIN * 2;

        // Calculate stats width (left side)
        const statsWidth = 150;
        // Calculate controls width (right side)
        const controlsWidth = 120;
        // World takes remaining space
        const worldWidth = width - statsWidth - controlsWidth;
        const worldHeight = availableHeight;

        // Calculate positions
        const statsX = 0;
        const statsY = 0;

        const worldX = statsWidth;
        const worldY = 0;

        const controlsX = statsWidth + worldWidth;
        const controlsY = 0;

        const chartY = availableHeight + CHART_MARGIN;

        // Draw everything
        this.drawWorld(worldX, worldY, worldWidth, worldHeight);
        this.drawStats(statsX, statsY, statsWidth, availableHeight);
        this.drawControls(controlsX, controlsY, controlsWidth, availableHeight);
        this.drawChart(0, chartY, width, chartHeight);
    }

    /**
     * Draws the world grid with fish and sharks.
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Width of the drawing area
     * @param {number} height - Height of the drawing area
     */
    drawWorld(x, y, width, height) {
        const sim = this.simulation;
        const cellWidth = width / sim.width;
        const cellHeight = height / sim.height;

        // Draw water background
        this.worldGraphics.fillStyle(WATER_COLOR);
        this.worldGraphics.fillRect(x, y, width, height);

        // Draw entities
        for (let gridY = 0; gridY < sim.height; gridY++) {
            for (let gridX = 0; gridX < sim.width; gridX++) {
                const entityId = sim.grid[gridY * sim.width + gridX];
                if (entityId !== null) {
                    const entity = sim.entities.get(entityId);
                    if (entity) {
                        const centerX = x + gridX * cellWidth + cellWidth / 2;
                        const centerY = y + gridY * cellHeight + cellHeight / 2;
                        const radius = entity.type === 'fish' ? FISH_RADIUS : SHARK_RADIUS;
                        const color = entity.type === 'fish' ? FISH_COLOR : SHARK_COLOR;

                        this.worldGraphics.fillStyle(color);
                        this.worldGraphics.fillCircle(centerX, centerY, radius);
                    }
                }
            }
        }
    }

    /**
     * Draws the statistics display.
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Width of the drawing area
     * @param {number} height - Height of the drawing area
     */
    drawStats(x, y, width, height) {
        const state = this.simulation.getState();
        const status = state.extinctStatus || (this.isRunning ? 'Running' : 'Paused');

        this.statsGraphics.fillStyle(WATER_COLOR);
        this.statsGraphics.fillRect(x, y, width, height);

        this.statsGraphics.fillStyle(STATS_TEXT_COLOR);
        this.statsGraphics.font = `${STATS_FONT_SIZE}px ${TEXT_FONT}`;
        this.statsGraphics.fontStyle = 'bold';

        const lines = [
            `Chronon: ${state.chronon}`,
            `Fish: ${state.fishCount}`,
            `Sharks: ${state.sharkCount}`,
            `Status: ${status}`
        ];

        let lineY = y + STATS_MARGIN + STATS_FONT_SIZE;
        
        // Clear existing stats texts
        for (const text of this.statsTexts) {
            text.destroy();
        }
        this.statsTexts = [];
        
        for (const line of lines) {
            const text = this.add.text(x + STATS_MARGIN, lineY, line, {
                font: `${STATS_FONT_SIZE}px ${TEXT_FONT}`,
                fill: STATS_TEXT_COLOR.toString(16),
                fontStyle: 'bold'
            });
            this.statsTexts.push(text);
            lineY += STATS_FONT_SIZE + 5;
        }
    }

    /**
     * Draws the control buttons.
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Width of the drawing area
     * @param {number} height - Height of the drawing area
     */
    drawControls(x, y, width, height) {
        this.controlsGraphics.fillStyle(WATER_COLOR);
        this.controlsGraphics.fillRect(x, y, width, height);

        // Clear buttons
        this.buttons = {};

        const state = this.simulation.getState();
        const isTerminal = state.extinctStatus !== null;

        // Draw speed buttons in horizontal row
        let buttonX = x + CONTROLS_MARGIN;
        const buttonY = y + CONTROLS_MARGIN;

        for (const speed of SPEED_OPTIONS) {
            const isActive = this.speed === speed;
            const buttonName = `speed-${speed}`;

            // Draw button background
            this.controlsGraphics.fillStyle(isActive ? 0x444444 : 0x222222);
            this.controlsGraphics.fillRect(buttonX, buttonY, BUTTON_WIDTH, BUTTON_HEIGHT);

            // Draw button text
            const speedText = this.add.text(buttonX + BUTTON_WIDTH / 2 - 10, buttonY + BUTTON_HEIGHT / 2 + 5, `${speed}x`, {
                font: `${CONTROLS_FONT_SIZE}px ${TEXT_FONT}`,
                fill: CONTROLS_TEXT_COLOR.toString(16)
            });
            this.speedTexts.push({ name: buttonName, text: speedText });

            // Store button rect for hit detection
            this.buttons[buttonName] = {
                x: buttonX,
                y: buttonY,
                width: BUTTON_WIDTH,
                height: BUTTON_HEIGHT
            };

            buttonX += BUTTON_WIDTH + BUTTON_SPACING;
        }

        // Draw action buttons (each on own row)
        let actionY = buttonY + BUTTON_HEIGHT + BUTTON_SPACING * 2;

        // Play/Pause button
        const playPauseText = this.isRunning ? 'Pause' : 'Play';
        this.drawActionButton(x, actionY, BUTTON_WIDTH * 2, playPauseText, 'play-pause', !isTerminal);
        actionY += BUTTON_HEIGHT + BUTTON_SPACING;

        // Step button
        this.drawActionButton(x, actionY, BUTTON_WIDTH * 2, 'Step', 'step', !this.isRunning);
        actionY += BUTTON_HEIGHT + BUTTON_SPACING;

        // Reset button
        this.drawActionButton(x, actionY, BUTTON_WIDTH * 2, 'Reset', 'reset', true);
    }

    /**
     * Draws an action button.
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Button width
     * @param {string} text - Button text
     * @param {string} name - Button name for identification
     * @param {boolean} enabled - Whether the button is enabled
     */
    drawActionButton(x, y, width, text, name, enabled) {
        // Draw button background
        this.controlsGraphics.fillStyle(enabled ? 0x444444 : 0x111111);
        this.controlsGraphics.fillRect(x + CONTROLS_MARGIN, y, width, BUTTON_HEIGHT);

        // Draw button text
        const actionText = this.add.text(x + CONTROLS_MARGIN + width / 2 - 20, y + BUTTON_HEIGHT / 2 + 5, text, {
            font: `${CONTROLS_FONT_SIZE}px ${TEXT_FONT}`,
            fill: (enabled ? CONTROLS_TEXT_COLOR : 0x333333).toString(16)
        });
        this.actionTexts[name] = actionText;

        // Store button rect for hit detection
        this.buttons[name] = {
            x: x + CONTROLS_MARGIN,
            y: y,
            width: width,
            height: BUTTON_HEIGHT
        };
    }

    /**
     * Draws the population history chart.
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Width of the drawing area
     * @param {number} height - Height of the drawing area
     */
    drawChart(x, y, width, height) {
        const history = this.simulation.history;

        if (history.length === 0) return;

        // Clear chart area
        this.chartGraphics.fillStyle(WATER_COLOR);
        this.chartGraphics.fillRect(x, y, width, height);

        // Find max population for scaling
        let maxFish = 0;
        let maxSharks = 0;

        for (const entry of history) {
            maxFish = Math.max(maxFish, entry.fish);
            maxSharks = Math.max(maxSharks, entry.sharks);
        }

        const maxPop = Math.max(maxFish, maxSharks, 1);

        // Draw chart lines
        const chartWidth = width;
        const chartHeight = height;
        const stepX = chartWidth / (history.length - 1 || 1);

        // Draw fish line (green)
        this.chartGraphics.lineStyle(2, CHART_FISH_COLOR, 1);
        this.chartGraphics.beginPath();

        for (let i = 0; i < history.length; i++) {
            const entry = history[i];
            const px = x + i * stepX;
            const py = y + chartHeight - (entry.fish / maxPop) * chartHeight;

            if (i === 0) {
                this.chartGraphics.moveTo(px, py);
            } else {
                this.chartGraphics.lineTo(px, py);
            }
        }
        this.chartGraphics.strokePath();

        // Draw shark line (blue)
        this.chartGraphics.lineStyle(2, CHART_SHARK_COLOR, 1);
        this.chartGraphics.beginPath();

        for (let i = 0; i < history.length; i++) {
            const entry = history[i];
            const px = x + i * stepX;
            const py = y + chartHeight - (entry.sharks / maxPop) * chartHeight;

            if (i === 0) {
                this.chartGraphics.moveTo(px, py);
            } else {
                this.chartGraphics.lineTo(px, py);
            }
        }
        this.chartGraphics.strokePath();
    }
}
