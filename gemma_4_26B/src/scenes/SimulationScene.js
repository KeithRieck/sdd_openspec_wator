import { CONFIG } from '../config.js';
import { WatorSimulation } from '../simulation/WatorSimulation.js';

/**
 * SimulationScene is the main scene for the Wa-Tor simulation.
 * It handles the simulation loop, rendering, and user interaction.
 */
export default class SimulationScene extends Phaser.Scene {
    constructor() {
        super('SimulationScene');
    }

    create() {
        // Initialize the simulation engine
        this.simulation = new WatorSimulation();
        
        // Simulation state
        this.isRunning = true;
        this.currentSpeed = CONFIG.speed.default;
        this.lastUpdate = 0;

        // UI Graphics objects
        this.worldGraphics = this.add.graphics();
        this.uiGraphics = this.add.graphics();
        this.chartGraphics = this.add.graphics();

        // Initialize UI layout
        this.updateLayout();

        // Setup input listeners for window resize
        this.scale.on('resize', () => {
            this.updateLayout();
        });

        // Initial render
        this.render();
    }

    /**
     * The main update loop called by Phaser.
     * @param {number} time - The current time.
     * @param {number} delta - The delta time since last frame.
     */
    update(time, delta) {
        if (!this.isRunning) return;

        // Calculate how many chronons to advance based on speed
        // Speed is in chronons per second.
        // delta is in milliseconds.
        const chrononsPerFrame = (this.currentSpeed / 1000) * delta;
        
        // We use an accumulator to handle fractional chronons
        if (!this.updateAccumulator) this.updateAccumulator = 0;
        this.updateAccumulator += chrononsPerFrame;

        while (this.updateAccumulator >= 1) {
            this.simulation.advanceChronon();
            this.updateAccumulator -= 1;
            
            // If simulation reached a terminal state, auto-pause
            const state = this.simulation.getState();
            if (state.stats.status !== 'Running' && state.stats.status !== 'Paused') {
                this.isRunning = false;
                break;
            }
        }

        // Redraw the scene
        this.render();
    }

    /**
     * Updates the UI layout based on current screen dimensions.
     */
    updateLayout() {
        const { width, height } = this.scale;
        this.layout = {
            screenWidth: width,
            screenHeight: height,
            isWide: width >= 1024, // Threshold for wide vs narrow
            statsWidth: CONFIG.ui.statsPanelWidth,
            controlsWidth: CONFIG.ui.controlsPanelWidth,
            chartHeight: CONFIG.ui.chartHeight,
            worldArea: {
                x: 0,
                y: 0,
                width: 0,
                height: 0
            }
        };

        if (this.layout.isWide) {
            // Wide Layout: Stats(L), World(C), Controls(R), Chart(B)
            this.layout.worldArea.x = this.layout.statsWidth;
            this.layout.worldArea.y = 0;
            this.layout.worldArea.width = width - this.layout.statsWidth - this.layout.controlsWidth;
            this.layout.worldArea.height = height - this.layout.chartHeight;
        } else {
            // Narrow Layout: World(T), Stats/Controls(M), Chart(B)
            // World takes top half, preserving aspect ratio
            const worldAspect = CONFIG.grid.width / CONFIG.grid.height;
            const availableWidth = width;
            const worldHeight = availableWidth / worldAspect;
            
            this.layout.worldArea.x = 0;
            this.layout.worldArea.y = 0;
            this.layout.worldArea.width = availableWidth;
            this.layout.worldArea.height = worldHeight;
            
            // Stats and Controls share the space between world and chart
            this.layout.midAreaHeight = height - worldHeight - this.layout.chartHeight;
        }
    }

    /**
     * Renders the current state of the simulation.
     * Implements the "Pull" architecture.
     */
    render() {
        const state = this.simulation.getState();
        
        this.uiGraphics.clear(); // Clear UI backgrounds once per frame
        
        this.renderWorld(state);
        this.renderStats(state);
        this.renderControls(state);
        this.renderChart(state);
    }

    renderWorld(state) {
        const { width, height } = state.dimensions;
        const { x, y, width: areaW, height: areaH } = this.layout.worldArea;

        // Calculate scale to fit the grid in the world area while preserving aspect ratio
        const scale = Math.min(areaW / width, areaH / height);
        const offsetX = x + (areaW - width * scale) / 2;
        const offsetY = y + (areaH - height * scale) / 2;

        this.worldGraphics.clear();

        // Draw water background
        this.worldGraphics.setFillStyle(CONFIG.visuals.waterColor);
        this.worldGraphics.fillRect(offsetX, offsetY, width * scale, height * scale);

        // Draw entities
        state.entities.forEach(entity => {
            const posX = offsetX + entity.x * scale + scale / 2;
            const posY = offsetY + entity.y * scale + scale / 2;

            if (entity instanceof Fish) {
                this.worldGraphics.setFillStyle(CONFIG.visuals.fishColor);
                this.worldGraphics.fillCircle(posX, posY, CONFIG.visuals.fishRadius);
            } else {
                this.worldGraphics.setFillStyle(CONFIG.visuals.sharkColor);
                this.worldGraphics.fillCircle(posX, posY, CONFIG.visuals.sharkRadius);
            }
        });
    }

    create() {
        // Initialize the simulation engine
        this.simulation = new WatorSimulation();
        
        // Simulation state
        this.isRunning = true;
        this.currentSpeed = CONFIG.speed.default;
        this.lastUpdate = 0;

        // UI Graphics objects
        this.worldGraphics = this.add.graphics();
        this.uiGraphics = this.add.graphics();
        this.chartGraphics = this.add.graphics();

        // UI Text objects
        this.uiText = this.add.text(0, 0, '', {
            fontFamily: 'Arial',
            fontSize: '16px',
            color: '#ffffff'
        });

        // Button hit areas
        this.buttons = [];

        // Initialize UI layout
        this.updateLayout();

        // Setup input listeners for window resize
        this.scale.on('resize', () => {
            this.updateLayout();
        });

        // Setup input listener for buttons
        this.input.on('pointerdown', (pointer) => {
            this.handleButtonClick(pointer);
        });

        // Initial render
        this.render();
    }

    /**
     * Handles clicks on the UI buttons.
     * @param {Phaser.Input.Pointer} pointer 
     */
    handleButtonClick(pointer) {
        for (const btn of this.buttons) {
            if (pointer.x >= btn.x && pointer.x <= btn.x + btn.w &&
                pointer.y >= btn.y && pointer.y <= btn.y + btn.h) {
                
                if (btn.disabled) return;
                
                btn.callback();
                this.render();
                break;
            }
        }
    }
// ...existing code...
    renderStats(state) {
        const { stats } = state;
        const { statsWidth, isWide, worldArea } = this.layout;
        
        const x = 20;
        const y = isWide ? 20 : worldArea.height + 20;

        // Draw stats background
        this.uiGraphics.setFillStyle(0x222222, 0.5);
        this.uiGraphics.fillRect(x - 10, y - 10, statsWidth, 120);

        const text = `Chronon: ${stats.chronon}\nFish: ${stats.fishCount}\nSharks: ${stats.sharkCount}\nStatus: ${stats.status}`;
        this.uiText.setPosition(x, y);
        this.uiText.setText(text);
    }

    renderControls(state) {
        const { isWide, screenWidth, controlsWidth, worldArea } = this.layout;
        const x = isWide ? screenWidth - controlsWidth + 20 : 20 + this.layout.statsWidth;
        const y = isWide ? 20 : worldArea.height + 20;

        this.buttons = [];

        // Action Buttons (Vertical Stack)
        const actionButtons = [
            { label: this.isRunning ? 'Pause' : 'Play', action: () => { this.isRunning = !this.isRunning; } },
            { label: 'Step', action: () => { this.simulation.advanceChronon(); this.render(); }, disabled: this.isRunning },
            { label: 'Reset', action: () => { this.simulation.reset(); this.isRunning = true; } }
        ];

        actionButtons.forEach((btn, i) => {
            const bx = x;
            const by = y + i * 40;
            const bw = 100;
            const bh = 30;

            this.uiGraphics.setFillStyle(btn.disabled ? 0x555555 : 0x888888);
            this.uiGraphics.fillRect(bx, by, bw, bh);
            
            // We'll use a separate text object or just draw labels if we had a text-graphics tool.
            // For now, I'll add temporary text objects for buttons.
            const label = this.add.text(bx + 5, by + 5, btn.label, { fontSize: '14px', color: '#000' });
            label.setDepth(1);

            this.buttons.push({ x: bx, y: by, w: bw, h: bh, callback: btn.action });
        });

        // Speed Buttons (Horizontal Row)
        const speedOptions = CONFIG.speed.options;
        const speedY = y + actionButtons.length * 40 + 20;
        
        speedOptions.forEach((speed, i) => {
            const bx = x + i * 60;
            const by = speedY;
            const bw = 50;
            const bh = 30;

            this.uiGraphics.setFillStyle(this.currentSpeed === speed ? 0xaaaaaa : 0x666666);
            this.uiGraphics.fillRect(bx, by, bw, bh);
            
            const label = this.add.text(bx + 5, by + 5, `${speed}x`, { fontSize: '14px', color: '#000' });
            label.setDepth(1);

            this.buttons.push({ x: bx, y: by, w: bw, h: bh, callback: () => { this.currentSpeed = speed; } });
        });
    }


    renderChart(state) {
        const { stats } = state;
        const history = stats.history;
        const { screenWidth, screenHeight, chartHeight } = this.layout;

        this.chartGraphics.clear();

        if (history.length === 0) return;

        const chartX = 0;
        const chartY = screenHeight - chartHeight;
        const chartW = screenWidth;
        const chartH = chartHeight;

        // Draw chart background
        this.chartGraphics.setFillStyle(0x111111, 0.8);
        this.chartGraphics.fillRect(chartX, chartY, chartW, chartH);

        // Find max population for scaling
        let maxPop = 0;
        for (const sample of history) {
            maxPop = Math.max(maxPop, sample.fish, sample.sharks);
        }
        if (maxPop === 0) maxPop = 1;

        const stepX = chartW / (CONFIG.ui.historyWindow - 1);
        const scaleY = chartH / maxPop;

        const drawLine = (type, color) => {
            this.chartGraphics.setLineStyle(2, color);
            this.chartGraphics.beginPath();

            for (let i = 0; i < history.length; i++) {
                const val = type === 'fish' ? history[i].fish : history[i].sharks;
                const px = chartX + i * stepX;
                const py = chartY + chartH - (val * scaleY);

                if (i === 0) {
                    this.chartGraphics.moveTo(px, py);
                } else {
                    this.chartGraphics.lineTo(px, py);
                }
            }
            this.chartGraphics.strokePath();
        };

        drawLine('fish', CONFIG.visuals.fishColor);
        drawLine('sharks', CONFIG.visuals.sharkColor);
    }
}
