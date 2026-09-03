import { WatorSimulation } from '../simulation/WatorSimulation.js';
import * as config from '../config.js';

/**
 * Main simulation scene
 * @class SimulationScene
 */
export class SimulationScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SimulationScene' });
        this.simulation = null;
        this.running = true;
        this.speed = config.DEFAULT_SPEED;
        this.lastStepTime = 0;
        this.graphics = null;
        this.statsText = null;
        this.controls = null;
        this.buttons = [];
        this.layout = null;
    }

    create() {
        this.simulation = new WatorSimulation(config);
        this.simulation.init();

        this.graphics = this.add.graphics();
        this.statsText = this.add.text(0, 0, '', { fontSize: '16px', fill: '#ffffff' });
        this.controls = this.add.text(0, 0, '', { fontSize: '16px', fill: '#ffffff' });

        this.input.on('pointerdown', this.handlePointerDown, this);

        this.scale.on('resize', this.handleResize, this);
        this.handleResize();
    }

    update(time, delta) {
        if (!this.running) return;

        const stepsPerSecond = this.speed;
        const stepInterval = 1000 / stepsPerSecond;

        if (time - this.lastStepTime >= stepInterval) {
            this.simulation.step();
            this.lastStepTime = time;
            this.render();
        }
    }

    render() {
        this.graphics.clear();
        this.calculateLayout();
        this.renderWorld();
        this.renderStats();
        this.renderControls();
        this.renderHistory();
    }

    calculateLayout() {
        const width = this.scale.width;
        const height = this.scale.height;
        
        // Determine if wide or narrow layout
        const isWide = width > height * 1.2;
        
        if (isWide) {
            // Wide layout: stats left, world center, controls right, history bottom
            const statsWidth = width * 0.15;
            const controlsWidth = width * 0.15;
            const worldWidth = width * 0.7;
            const worldHeight = height * 0.7;
            const historyHeight = height * 0.3;
            
            const aspectRatio = this.simulation.width / this.simulation.height;
            let worldDisplayWidth = worldWidth;
            let worldDisplayHeight = worldHeight;
            
            if (worldWidth / worldHeight > aspectRatio) {
                worldDisplayWidth = worldHeight * aspectRatio;
            } else {
                worldDisplayHeight = worldWidth / aspectRatio;
            }
            
            this.layout = {
                stats: {
                    x: 20,
                    y: height * 0.15,
                    width: statsWidth,
                    height: worldDisplayHeight
                },
                world: {
                    x: width * 0.15 + statsWidth * 0.5,
                    y: height * 0.15,
                    width: worldDisplayWidth,
                    height: worldDisplayHeight
                },
                controls: {
                    x: width * 0.85,
                    y: height * 0.15,
                    width: controlsWidth,
                    height: worldDisplayHeight
                },
                history: {
                    x: 0,
                    y: height * 0.85,
                    width: width,
                    height: historyHeight
                }
            };
        } else {
            // Narrow layout: stack vertically
            const worldHeight = height * 0.5;
            const aspectRatio = this.simulation.width / this.simulation.height;
            const worldDisplayWidth = Math.min(width * 0.9, worldHeight * aspectRatio);
            const worldDisplayHeight = worldHeight;
            
            this.layout = {
                stats: {
                    x: 20,
                    y: 20,
                    width: width * 0.4,
                    height: 100
                },
                world: {
                    x: (width - worldDisplayWidth) / 2,
                    y: 140,
                    width: worldDisplayWidth,
                    height: worldDisplayHeight
                },
                controls: {
                    x: width * 0.6,
                    y: 20,
                    width: width * 0.35,
                    height: 100
                },
                history: {
                    x: 0,
                    y: height * 0.65,
                    width: width,
                    height: height * 0.3
                }
            };
        }
    }

    renderWorld() {
        const bounds = this.layout.world;
        const cellWidth = bounds.width / this.simulation.width;
        const cellHeight = bounds.height / this.simulation.height;

        for (let y = 0; y < this.simulation.height; y++) {
            for (let x = 0; x < this.simulation.width; x++) {
                const entity = this.simulation.getEntityAt(x, y);
                if (entity && entity.isAlive()) {
                    const cx = bounds.x + x * cellWidth + cellWidth / 2;
                    const cy = bounds.y + y * cellHeight + cellHeight / 2;
                    const radius = entity.getType() === 'shark' ? cellWidth * 0.35 : cellWidth * 0.25;
                    const color = entity.getType() === 'shark' ? config.SHARK_COLOR : config.FISH_COLOR;
                    this.graphics.fillStyle(color, 1);
                    this.graphics.fillCircle(cx, cy, radius);
                }
            }
        }
    }

    renderStats() {
        const pop = this.simulation.getPopulation();
        const status = this.simulation.isTerminal() ? 'Terminal' : this.running ? 'Running' : 'Paused';
        
        let statusText = status;
        if (this.simulation.isTerminal()) {
            if (pop.fish === 0 && pop.sharks === 0) {
                statusText = 'Ecosystem collapsed';
            } else if (pop.fish === 0) {
                statusText = 'Fish extinct';
            } else if (pop.sharks === 0) {
                statusText = 'Sharks extinct';
            }
        }
        
        this.statsText.setText([
            `Chronon: ${this.simulation.chronon}`,
            `Fish: ${pop.fish}`,
            `Sharks: ${pop.sharks}`,
            `Status: ${statusText}`
        ].join('\n'));
        
        this.statsText.setPosition(this.layout.stats.x, this.layout.stats.y);
    }

    renderControls() {
        // Clear previous buttons
        this.buttons.forEach(btn => btn.destroy());
        this.buttons = [];
        
        const controlsBounds = this.layout.controls;
        const buttonWidth = 80;
        const buttonHeight = 30;
        const buttonSpacing = 10;
        const startX = controlsBounds.x;
        const startY = controlsBounds.y;
        
        // Play/Pause button
        const playPauseText = this.running ? 'Pause' : 'Play';
        const playPauseBtn = this.add.rectangle(
            startX + buttonWidth / 2,
            startY + buttonHeight / 2,
            buttonWidth,
            buttonHeight,
            0x333333
        );
        const playPauseLabel = this.add.text(
            startX + buttonWidth / 2,
            startY + buttonHeight / 2,
            playPauseText,
            { fontSize: '14px', fill: '#ffffff' }
        );
        playPauseLabel.setOrigin(0.5);
        playPauseBtn.setInteractive();
        playPauseBtn.on('pointerdown', () => this.togglePlayPause());
        this.buttons.push(playPauseBtn, playPauseLabel);
        
        // Step button
        const stepY = startY + buttonHeight + buttonSpacing + buttonHeight / 2;
        const stepBtn = this.add.rectangle(
            startX + buttonWidth / 2,
            stepY,
            buttonWidth,
            buttonHeight,
            0x333333
        );
        const stepLabel = this.add.text(
            startX + buttonWidth / 2,
            stepY,
            'Step',
            { fontSize: '14px', fill: '#ffffff' }
        );
        stepLabel.setOrigin(0.5);
        stepBtn.setInteractive();
        stepBtn.on('pointerdown', () => this.stepSimulation());
        this.buttons.push(stepBtn, stepLabel);
        
        // Reset button
        const resetY = stepY + buttonHeight + buttonSpacing + buttonHeight / 2;
        const resetBtn = this.add.rectangle(
            startX + buttonWidth / 2,
            resetY,
            buttonWidth,
            buttonHeight,
            0x333333
        );
        const resetLabel = this.add.text(
            startX + buttonWidth / 2,
            resetY,
            'Reset',
            { fontSize: '14px', fill: '#ffffff' }
        );
        resetLabel.setOrigin(0.5);
        resetBtn.setInteractive();
        resetBtn.on('pointerdown', () => this.resetSimulation());
        this.buttons.push(resetBtn, resetLabel);
        
        // Speed buttons
        const speedStartY = resetY + buttonHeight + buttonSpacing * 2;
        config.SPEED_OPTIONS.forEach((speed, index) => {
            const speedY = speedStartY + index * (buttonHeight + buttonSpacing) + buttonHeight / 2;
            const speedBtn = this.add.rectangle(
                startX + buttonWidth / 2,
                speedY,
                buttonWidth,
                buttonHeight,
                this.speed === speed ? 0x555555 : 0x333333
            );
            const speedLabel = this.add.text(
                startX + buttonWidth / 2,
                speedY,
                `${speed}x`,
                { fontSize: '14px', fill: '#ffffff' }
            );
            speedLabel.setOrigin(0.5);
            speedBtn.setInteractive();
            speedBtn.on('pointerdown', () => this.setSpeed(speed));
            this.buttons.push(speedBtn, speedLabel);
        });
    }

    renderHistory() {
        const bounds = this.layout.history;
        const history = this.simulation.history;
        
        if (history.length < 2) return;
        
        const padding = 20;
        const chartWidth = bounds.width - padding * 2;
        const chartHeight = bounds.height - padding * 2;
        
        // Find max population for scaling
        let maxPop = 0;
        history.forEach(h => {
            maxPop = Math.max(maxPop, h.fish, h.sharks);
        });
        
        if (maxPop === 0) return;
        
        const xStep = chartWidth / (history.length - 1);
        
        // Draw fish line
        this.graphics.lineStyle(2, config.FISH_COLOR, 1);
        for (let i = 1; i < history.length; i++) {
            const x1 = bounds.x + padding + (i - 1) * xStep;
            const y1 = bounds.y + padding + chartHeight - (history[i - 1].fish / maxPop) * chartHeight;
            const x2 = bounds.x + padding + i * xStep;
            const y2 = bounds.y + padding + chartHeight - (history[i].fish / maxPop) * chartHeight;
            this.graphics.beginPath();
            this.graphics.moveTo(x1, y1);
            this.graphics.lineTo(x2, y2);
            this.graphics.strokePath();
        }
        
        // Draw shark line
        this.graphics.lineStyle(2, config.SHARK_COLOR, 1);
        for (let i = 1; i < history.length; i++) {
            const x1 = bounds.x + padding + (i - 1) * xStep;
            const y1 = bounds.y + padding + chartHeight - (history[i - 1].sharks / maxPop) * chartHeight;
            const x2 = bounds.x + padding + i * xStep;
            const y2 = bounds.y + padding + chartHeight - (history[i].sharks / maxPop) * chartHeight;
            this.graphics.beginPath();
            this.graphics.moveTo(x1, y1);
            this.graphics.lineTo(x2, y2);
            this.graphics.strokePath();
        }
    }

    getWorldBounds() {
        return this.layout.world;
    }

    handleResize() {
        this.render();
    }

    handlePointerDown(pointer) {
        // Handle UI controls
    }

    /**
     * Toggle play/pause state
     */
    togglePlayPause() {
        if (this.simulation.isTerminal()) {
            return;
        }
        this.running = !this.running;
        if (this.running) {
            this.lastStepTime = this.time.now;
        }
        this.render();
    }

    /**
     * Step simulation one chronon when paused
     */
    stepSimulation() {
        if (!this.running && !this.simulation.isTerminal()) {
            this.simulation.step();
            this.render();
        }
    }

    /**
     * Reset simulation to initial state
     */
    resetSimulation() {
        this.simulation.reset();
        this.running = true;
        this.speed = config.DEFAULT_SPEED;
        this.lastStepTime = this.time.now;
        this.render();
    }

    /**
     * Set simulation speed
     * @param {number} speed - Chronons per second
     */
    setSpeed(speed) {
        this.speed = speed;
        this.render();
    }
}
