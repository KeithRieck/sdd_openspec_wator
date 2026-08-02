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

        // Rendering objects
        this.worldGraphics = this.add.graphics();
        this.uiGraphics = this.add.graphics();

        // Initial render
        this.render();
    }

    update(time, delta) {
        if (this.isPaused) return;

        // Calculate interval based on speed (e.g., 10x means 1 step every 100ms if base is 1s)
        // Base speed 1x = 1 step per second.
        const stepInterval = 1000 / this.simulationSpeed;

        if (time > this.lastStepTime + stepInterval) {
            this.sim.step();
            this.render();
            this.lastStepTime = time;
        }
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
                this.worldGraphics.fillCircle(x + scale/2, y + scale/2, CONFIG.fishRadius * (scale/2));
            } else if (entity instanceof Shark) {
                this.worldGraphics.fillStyle(CONFIG.sharkColor, 1);
                this.worldGraphics.fillCircle(x + scale/2, y + scale/2, CONFIG.sharkRadius * (scale/2));
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
