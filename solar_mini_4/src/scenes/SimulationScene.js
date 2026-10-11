/**
 * SimulationScene - World render, controls, stats, chart.
 * R5: Phaser-native rendering and input
 * R8: Rendering rules
 * R11: Population statistics
 * R12: Layout and responsive design
 */
import Phaser from 'phaser';
import {
    GRID_WIDTH,
    GRID_HEIGHT,
    COLOR_WATER,
    COLOR_FISH,
    COLOR_SHARK,
    DEFAULT_SPEED,
    STATUS_RUNNING,
    STATUS_PAUSED,
    STATUS_SHARKS_EXTINCT,
    STATUS_FISH_EXTINCT,
    STATUS_ECOSYSTEM_COLLAPSED
} from '../config.js';
import WatorSimulation from '../simulation/WatorSimulation.js';
import PhaserButton from '../ui/PhaserButton.js';

export class SimulationScene extends Phaser.Scene {
    /**
     * Create the SimulationScene.
     * @param {string} key - Scene key
     */
    constructor(key) {
        super(key);
        this.simulation = null;
        this.worldGraphics = null;
        this.statsGraphics = null;
        this.chartGraphics = null;
        this.buttons = [];
        this.layout = null;
        this.resizeObserver = null;
    }

    /**
     * Initialize the scene.
     */
    create() {
        this.simulation = new WatorSimulation();
        this.simulation.speed = DEFAULT_SPEED;
        this.simulation.initialize();
        this.simulation.running = true;

        // Set up layout
        this.setupLayout();

        // Render initial state
        this.renderWorld();
        this.updateStats();
        this.renderChart();

        // Start the simulation loop
        this.time.addEvent({
            delay: 1000 / this.simulation.speed,
            loop: true,
            callback: () => {
                if (this.simulation.running && !this.simulation.terminal) {
                    this.simulation.step();
                    this.renderWorld();
                    this.updateStats();
                    this.renderChart();
                }
            }
        });
    }

    /**
     * Set up the layout (stats left, world center, controls right, chart bottom).
     */
    setupLayout() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Stats panel (left)
        const statsWidth = Math.min(200, width * 0.25);
        const statsHeight = height * 0.6;

        // World (center)
        const worldWidth = width - statsWidth - 20;
        const worldHeight = worldWidth * (GRID_HEIGHT / GRID_WIDTH);
        const worldX = statsWidth + 10;
        const worldY = (height - worldHeight) / 2;

        // Controls (right)
        const controlsWidth = Math.min(250, width * 0.3);
        const controlsX = width - controlsWidth - 10;

        // Chart (bottom)
        const chartHeight = 80;
        const chartY = height - chartHeight - 20;

        this.layout = {
            stats: { x: 10, y: 10, width: statsWidth, height: statsHeight },
            world: { x: worldX, y: worldY, width: worldWidth, height: worldHeight },
            controls: { x: controlsX, y: 10, width: controlsWidth, height: height - 20 },
            chart: { x: 10, y: height - chartHeight - 10, width: width - 20, height: chartHeight }
        };

        // Create world graphics
        this.worldGraphics = this.add.graphics();
        this.worldGraphics.setPosition(this.layout.world.x, this.layout.world.y);

        // Create stats graphics
        this.statsGraphics = this.add.graphics();
        this.statsGraphics.setPosition(this.layout.stats.x, this.layout.stats.y);

        // Create chart graphics
        this.chartGraphics = this.add.graphics();
        this.chartGraphics.setPosition(this.layout.chart.x, this.layout.chart.y);

        // Create buttons
        this.createButtons();

        // Set up resize observer
        this.resizeObserver = new ResizeObserver(() => {
            this.onResize();
        });
        this.resizeObserver.observe(document.body);
    }

    /**
     * Create UI buttons.
     */
    createButtons() {
        const controls = this.layout.controls;
        const buttonWidth = 80;
        const buttonHeight = 30;
        const spacing = 10;
        let x = controls.x + 10;
        let y = controls.y + 10;

        // Speed buttons (horizontal row)
        const speedLabels = ['1x', '5x', '10x', '30x', '60x'];
        const speedValues = [1, 5, 10, 30, 60];

        for (let i = 0; i < speedLabels.length; i++) {
            const button = new PhaserButton(
                this,
                x,
                y,
                buttonWidth,
                buttonHeight,
                speedLabels[i],
                () => {
                    this.simulation.speed = speedValues[i];
                }
            );
            this.buttons.push(button);
            x += buttonWidth + spacing;
        }

        // Action buttons (separate rows)
        y += buttonHeight + 10;

        // Play/Pause button
        const playPauseButton = new PhaserButton(
            this,
            x,
            y,
            buttonWidth,
            buttonHeight,
            'Play',
            () => {
                this.togglePlayPause();
            }
        );
        this.buttons.push(playPauseButton);

        // Step button
        const stepButton = new PhaserButton(
            this,
            x,
            y + buttonHeight + 5,
            buttonWidth,
            buttonHeight,
            'Step',
            () => {
                this.step();
            }
        );
        this.buttons.push(stepButton);

        // Reset button
        const resetButton = new PhaserButton(
            this,
            x,
            y + 2 * (buttonHeight + 5),
            buttonWidth,
            buttonHeight,
            'Reset',
            () => {
                this.reset();
            }
        );
        this.buttons.push(resetButton);
    }

    /**
     * Toggle play/pause.
     */
    togglePlayPause() {
        if (this.simulation.terminal) {
            return;
        }
        this.simulation.running = !this.simulation.running;
        this.updateButtons();
    }

    /**
     * Step one chronon.
     */
    step() {
        if (this.simulation.terminal) {
            return;
        }
        this.simulation.step();
        this.renderWorld();
        this.updateStats();
        this.renderChart();
    }

    /**
     * Reset the simulation.
     */
    reset() {
        this.simulation.reset();
        this.renderWorld();
        this.updateStats();
        this.renderChart();
        this.updateButtons();
    }

    /**
     * Update button states.
     */
    updateButtons() {
        const playPauseButton = this.buttons[5];
        if (playPauseButton) {
            playPauseButton.setLabel(this.simulation.running ? 'Pause' : 'Play');
        }

        // Disable Step when running
        const stepButton = this.buttons[6];
        if (stepButton) {
            stepButton.setEnabled(!this.simulation.running);
        }
    }

    /**
     * Render the world.
     */
    renderWorld() {
        const w = this.layout.world.width;
        const h = this.layout.world.height;
        const cellWidth = w / this.simulation.width;
        const cellHeight = h / this.simulation.height;

        this.worldGraphics.clear();

        // Draw water background
        this.worldGraphics.fillStyle(COLOR_WATER, 1);

        // Draw cells
        for (let y = 0; y < this.simulation.height; y++) {
            for (let x = 0; x < this.simulation.width; x++) {
                const cell = this.simulation.grid.getCell(x, y);

                if (cell) {
                    if (cell instanceof Fish) {
                        // Fish: green circle
                        this.worldGraphics.fillStyle(COLOR_FISH, 1);
                        this.worldGraphics.fillCircle(
                            x * cellWidth + cellWidth / 2,
                            y * cellHeight + cellHeight / 2,
                            cellWidth * 0.3
                        );
                    } else if (cell instanceof Shark) {
                        // Shark: blue circle (slightly larger)
                        this.worldGraphics.fillStyle(COLOR_SHARK, 1);
                        this.worldGraphics.fillCircle(
                            x * cellWidth + cellWidth / 2,
                            y * cellHeight + cellHeight / 2,
                            cellWidth * 0.35
                        );
                    }
                }
            }
        }
    }

    /**
     * Update stats display.
     */
    updateStats() {
        this.statsGraphics.clear();

        const fishCount = this.simulation.getFishCount();
        const sharkCount = this.simulation.getSharkCount();
        const chronon = this.simulation.getChronon();
        const status = this.simulation.status;

        // Draw stats text
        this.statsGraphics.fillStyle(0xffffff, 1);
        this.statsGraphics.fillText(`Chronon: ${chronon}`, this.layout.stats.x + 10, this.layout.stats.y + 20);
        this.statsGraphics.fillText(`Fish: ${fishCount}`, this.layout.stats.x + 10, this.layout.stats.y + 40);
        this.statsGraphics.fillText(`Sharks: ${sharkCount}`, this.layout.stats.x + 10, this.layout.stats.y + 60);
        this.statsGraphics.fillText(`Status: ${status}`, this.layout.stats.x + 10, this.layout.stats.y + 80);
    }

    /**
     * Render the population history chart.
     */
    renderChart() {
        this.chartGraphics.clear();

        const data = this.simulation.historyFish;
        const sharkData = this.simulation.historySharks;
        const chartWidth = this.layout.chart.width;
        const chartHeight = this.layout.chart.height;
        const chartX = this.layout.chart.x;
        const chartY = this.layout.chart.y;

        if (data.length < 2) {
            return;
        }

        // Find max value for scaling
        let max = 0;
        for (let i = 0; i < data.length; i++) {
            if (data[i] > max) max = data[i];
            if (sharkData[i] > max) max = sharkData[i];
        }
        max = Math.ceil(max * 1.1);

        // Draw fish line
        this.chartGraphics.lineStyle(2, COLOR_FISH, 1);
        for (let i = 1; i < data.length; i++) {
            const x1 = chartX + (i - 1) * (chartWidth / data.length);
            const y1 = chartY + chartHeight - (data[i - 1] / max) * chartHeight;
            const x2 = chartX + i * (chartWidth / data.length);
            const y2 = chartY + chartHeight - (data[i] / max) * chartHeight;
            this.chartGraphics.lineBetween(x1, y1, x2, y2);
        }

        // Draw shark line
        this.chartGraphics.lineStyle(2, COLOR_SHARK, 1);
        for (let i = 1; i < sharkData.length; i++) {
            const x1 = chartX + (i - 1) * (chartWidth / sharkData.length);
            const y1 = chartY + chartHeight - (sharkData[i - 1] / max) * chartHeight;
            const x2 = chartX + i * (chartWidth / data.length);
            const y2 = chartY + chartHeight - (sharkData[i] / max) * chartHeight;
            this.chartGraphics.lineBetween(x1, y1, x2, y2);
        }
    }

    /**
     * Handle window resize.
     */
    onResize() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Recalculate layout
        const statsWidth = Math.min(200, width * 0.25);
        const statsHeight = height * 0.6;

        const worldWidth = width - statsWidth - 20;
        const worldHeight = worldWidth * (GRID_HEIGHT / GRID_WIDTH);
        const worldX = statsWidth + 10;
        const worldY = (height - worldHeight) / 2;

        const controlsWidth = Math.min(250, width * 0.3);
        const controlsX = width - controlsWidth - 10;

        const chartHeight = 80;
        const chartY = height - chartHeight - 20;

        this.layout = {
            stats: { x: 10, y: 10, width: statsWidth, height: statsHeight },
            world: { x: worldX, y: worldY, width: worldWidth, height: worldHeight },
            controls: { x: controlsX, y: 10, width: controlsWidth, height: height - 20 },
            chart: { x: 10, y: height - chartHeight - 10, width: width - 20, height: chartHeight }
        };

        // Update positions
        this.worldGraphics.setPosition(this.layout.world.x, this.layout.world.y);
        this.statsGraphics.setPosition(this.layout.stats.x, this.layout.stats.y);
        this.chartGraphics.setPosition(this.layout.chart.x, this.layout.chart.y);

        // Recreate buttons with new positions
        this.createButtons();

        // Re-render
        this.renderWorld();
        this.updateStats();
        this.renderChart();
    }

    /**
     * Clean up.
     */
    destroy() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
        super.destroy();
    }
}
