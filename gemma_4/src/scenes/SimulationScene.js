import { WatorSimulation } from '../simulation/WatorSimulation.js';
import { Fish, Shark } from '../simulation/Entities.js';
import { CONFIG } from '../config.js';

/**
 * SimulationScene handles the main simulation loop, rendering, and user interaction.
 */
export class SimulationScene extends Phaser.Scene {
    constructor() {
        super('SimulationScene');
    }

    create() {
        // Initialize the simulation engine
        this.sim = new WatorSimulation();
        this.sim.initialize();

        // Simulation state
        this.isPaused = false;
        this.simulationSpeed = CONFIG.defaultSpeed;
        this.lastStepTime = 0;

        // Population history for the chart
        this.history = [];
        this.maxHistory = 200;

        // Rendering objects
        this.worldGraphics = this.add.graphics();
        this.uiGraphics = this.add.graphics();

        this.setupUI();

        // Initial render
        this.render();
    }

    setupUI() {
        const { width: screenWidth, height: screenHeight } = this.cameras.main;
        const panelWidth = 200;
        const panelHeight = screenHeight;

        // UI Panel Background
        this.uiGraphics.fillStyle(0x222222, 0.8);
        this.uiGraphics.fillRect(screenWidth - panelWidth, 0, panelWidth, panelHeight);
        this.uiGraphics.lineStyle(2, 0x444444, 1);
        this.uiGraphics.strokeRect(screenWidth - panelWidth, 0, panelWidth, panelHeight);

        const startX = screenWidth - panelWidth + 20;
        let startY = 20;

        // Title
        this.add.text(startX, startY, 'Wa-Tor Sim', { fontSize: '20px', fontWeight: 'bold', color: '#fff' });
        startY += 40;

        // Stats
        this.statsText = this.add.text(startX, startY, '', { fontSize: '16px', color: '#fff' });
        startY += 60;

        // Controls
        const createButton = (label, y, callback) => {
            const btn = this.add.text(startX, y, label, { 
                fontSize: '16px', 
                color: '#fff', 
                backgroundColor: '#444',
                padding: { x: 10, y: 5 }
            })
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', callback);
            return btn;
        };

        createButton('Play/Pause', startY, () => this.togglePause());
        startY += 35;
        createButton('Step', startY, () => this.stepOnce());
        startY += 35;
        createButton('Reset', startY, () => this.reset());
        startY += 60;

        // Speed
        this.add.text(startX, startY, 'Speed:', { fontSize: '16px', color: '#fff' });
        startY += 30;
        
        const speedXStart = startX;
        const speedY = startY;
        const speedGap = 35;

        CONFIG.supportedSpeeds.forEach((speed, index) => {
            const x = speedXStart + (index % 3) * 40;
            const y = speedY + Math.floor(index / 3) * speedGap;
            
            const btn = this.add.text(x, y, `${speed}x`, { 
                fontSize: '14px', 
                color: '#fff', 
                backgroundColor: this.simulationSpeed === speed ? '#666' : '#444',
                padding: { x: 5, y: 2 }
            })
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.setSpeed(speed);
                this.updateSpeedButtons();
            });
            
            // Store buttons to update their style
            if (!this.speedButtons) this.speedButtons = [];
            this.speedButtons.push(btn);
        });

        // Chart Area
        this.chartGraphics = this.add.graphics();
        this.chartX = screenWidth - panelWidth + 20;
        this.chartY = screenHeight - 150;
        this.chartW = panelWidth - 40;
        this.chartH = 100;
        
        this.uiGraphics.lineStyle(1, 0x666666, 1);
        this.uiGraphics.strokeRect(this.chartX, this.chartY, this.chartW, this.chartH);
        this.add.text(this.chartX, this.chartY - 20, 'Population History', { fontSize: '14px', color: '#aaa' });
    }

    updateSpeedButtons() {
        this.speedButtons.forEach(btn => {
            const speed = parseInt(btn.text.replace('x', ''));
            btn.setBackgroundColor(this.simulationSpeed === speed ? '#666' : '#444');
        });
    }

    update(time, delta) {
        if (this.isPaused) return;

        // Calculate interval based on speed (e.g., 10x means 1 step every 100ms if base is 1s)
        // Base speed 1x = 1 step per second.
        const stepInterval = 1000 / this.simulationSpeed;

        if (time > this.lastStepTime + stepInterval) {
            this.sim.step();
            this.render();
            this.updateStats();
            this.updateChart();
            this.lastStepTime = time;
        }
    }

    updateStats() {
        const { fish, sharks } = this.sim.getPopulation();
        this.statsText.setText(`Fish: ${fish}\nSharks: ${sharks}`);
    }

    updateChart() {
        const { fish, sharks } = this.sim.getPopulation();
        this.history.push({ fish, sharks });
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        }

        this.chartGraphics.clear();
        
        if (this.history.length < 2) return;

        const maxPop = Math.max(...this.history.map(h => Math.max(h.fish, h.sharks)), 10);
        const scaleX = this.chartW / this.maxHistory;
        const scaleY = this.chartH / maxPop;

        // Draw Fish line
        this.chartGraphics.lineStyle(2, CONFIG.fishColor, 1);
        this.chartGraphics.beginPath();
        this.history.forEach((h, i) => {
            const x = this.chartX + i * scaleX;
            const y = this.chartY + this.chartH - h.fish * scaleY;
            if (i === 0) this.chartGraphics.moveTo(x, y);
            else this.chartGraphics.lineTo(x, y);
        });
        this.chartGraphics.strokePath();

        // Draw Shark line
        this.chartGraphics.lineStyle(2, CONFIG.sharkColor, 1);
        this.chartGraphics.beginPath();
        this.history.forEach((h, i) => {
            const x = this.chartX + i * scaleX;
            const y = this.chartY + this.chartH - h.sharks * scaleY;
            if (i === 0) this.chartGraphics.moveTo(x, y);
            else this.chartGraphics.lineTo(x, y);
        });
        this.chartGraphics.strokePath();
    }

    /**
     * Renders the current state of the simulation.
     */
    render() {
        this.worldGraphics.clear();
        
        const { width, height } = this.sim;
        const screenWidth = this.cameras.main.width;
        const screenHeight = this.cameras.main.height;

        // Calculate scale to fit the grid in the screen
        const scale = Math.min(screenWidth / width, screenHeight / height);
        const offsetX = (screenWidth - width * scale) / 2;
        const offsetY = (screenHeight - height * scale) / 2;

        // Draw background (water)
        this.worldGraphics.fillStyle(0x000033, 1);
        this.worldGraphics.fillRect(offsetX, offsetY, width * scale, height * scale);

        // Render entities
        for (const entity of this.sim.entities.values()) {
            const x = offsetX + entity.x * scale;
            const y = offsetY + entity.y * scale;
            
            if (entity instanceof Fish) {
                this.worldGraphics.fillStyle(CONFIG.fishColor, 1);
                this.worldGraphics.fillCircle(x + scale/2, y + scale/2, CONFIG.fishRadius * (scale/5));
            } else if (entity instanceof Shark) {
                this.worldGraphics.fillStyle(CONFIG.sharkColor, 1);
                this.worldGraphics.fillCircle(x + scale/2, y + scale/2, CONFIG.sharkRadius * (scale/5));
            }
        }
    }

    togglePause() {
        this.isPaused = !this.isPaused;
    }

    stepOnce() {
        this.sim.step();
        this.render();
    }

    reset() {
        this.sim.initialize();
        this.render();
    }

    setSpeed(speed) {
        this.simulationSpeed = speed;
    }
}
