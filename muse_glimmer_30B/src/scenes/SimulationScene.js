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
    }

    create() {
        this.simulation = new WatorSimulation(config);
        this.simulation.init();

        this.graphics = this.add.graphics();
        this.statsText = this.add.text(20, 20, '', { fontSize: '16px', fill: '#ffffff' });
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
        this.renderWorld();
        this.renderStats();
        this.renderHistory();
    }

    renderWorld() {
        const { width, height } = this.getWorldBounds();
        const cellWidth = width / this.simulation.width;
        const cellHeight = height / this.simulation.height;

        for (let y = 0; y < this.simulation.height; y++) {
            for (let x = 0; x < this.simulation.width; x++) {
                const entity = this.simulation.getEntityAt(x, y);
                if (entity && entity.isAlive()) {
                    const cx = x * cellWidth + cellWidth / 2;
                    const cy = y * cellHeight + cellHeight / 2;
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
        this.statsText.setText([
            `Chronon: ${this.simulation.chronon}`,
            `Fish: ${pop.fish}`,
            `Sharks: ${pop.sharks}`,
            `Status: ${status}`
        ].join('\n'));
    }

    renderHistory() {
        // Simplified history rendering
    }

    getWorldBounds() {
        const width = this.scale.width * 0.6;
        const height = this.scale.height * 0.6;
        return { width, height };
    }

    handleResize() {
        this.render();
    }

    handlePointerDown(pointer) {
        // Handle UI controls
    }
}
