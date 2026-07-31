/**
 * @fileoverview Phaser scene that renders and controls the Wa-Tor simulation
 */

import { WatorSimulation } from '../WatorSimulation.js';
import { Fish } from '../Fish.js';
import { Shark } from '../Shark.js';
import { 
  GRID_WIDTH, 
  GRID_HEIGHT,
  FISH_RADIUS,
  SHARK_RADIUS,
  FISH_COLOR,
  SHARK_COLOR,
  WATER_COLOR
} from '../config.js';

/**
 * Phaser scene for Wa-Tor simulation
 */
export class SimulationScene extends Phaser.Scene {
  /**
   * Create the scene
   */
  create() {
    // Create simulation
    this.simulation = new WatorSimulation();
    
    // Create graphics for rendering
    this.graphics = this.add.graphics();
    
    // Set up controls
    this.setupControls();
    
    // Set up stats display
    this.setupStats();
    
    // Set up population chart
    this.setupPopulationChart();
    
    // Start game loop
    this.gameLoop();
  }
  
  /**
   * Set up UI controls
   */
  setupControls() {
    // Create control buttons in right column
    const rightColumnX = this.sys.game.config.width - 200;
    
    // Title
    this.add.text(rightColumnX, 20, 'Controls:', { color: '#ffffff' });
    
    // Pause/Resume button
    this.pauseButton = this.add.text(rightColumnX, 50, 'Pause', { color: '#ff0000' })
      .setInteractive()
      .on('pointerdown', () => this.togglePause());
    
    // Single step button
    this.stepButton = this.add.text(rightColumnX, 80, 'Step', { color: '#00ff00' })
      .setInteractive()
      .on('pointerdown', () => this.simulation.singleStep());
    
    // Reset button
    this.resetButton = this.add.text(rightColumnX, 110, 'Reset', { color: '#ffff00' })
      .setInteractive()
      .on('pointerdown', () => this.simulation.reset());
    
    // Speed controls
    this.speedText = this.add.text(rightColumnX, 140, `Speed: ${this.simulation.speed}x`, { color: '#ffffff' });
    
    const speedOptions = [1, 5, 10, 30, 60];
    speedOptions.forEach((speed, index) => {
      this.add.text(
        rightColumnX + (index * 40), 
        170, 
        `${speed}x`, 
        { color: '#ffffff' }
      )
      .setInteractive()
      .on('pointerdown', () => {
        this.simulation.setSpeed(speed);
        this.speedText.setText(`Speed: ${speed}x`);
      });
    });
  }
  
  /**
   * Set up population statistics display
   */
  setupStats() {
    // Left column stats
    this.fishText = this.add.text(20, 20, 'Fish: 0', { color: '#00ff00' });
    this.sharkText = this.add.text(20, 50, 'Sharks: 0', { color: '#0000ff' });
    this.chrononText = this.add.text(20, 80, 'Chronon: 0', { color: '#ffffff' });
  }
  
  /**
   * Set up population history chart
   */
  setupPopulationChart() {
    // Create a simple line chart using Phaser graphics
    this.chartGraphics = this.add.graphics();
    this.chartGraphics.lineStyle(2, 0xffffff);
    
    // Draw axes
    this.chartGraphics.strokeLineShape(new Phaser.Geom.Line(50, this.sys.game.config.height - 150, 50, this.sys.game.config.height - 50));
    this.chartGraphics.strokeLineShape(new Phaser.Geom.Line(50, this.sys.game.config.height - 50, this.sys.game.config.width - 250, this.sys.game.config.height - 50));
  }
  
  /**
   * Toggle pause/resume
   */
  togglePause() {
    if (this.simulation.isRunning) {
      this.simulation.pause();
      this.pauseButton.setText('Resume').setColor('#00ff00');
    } else {
      this.simulation.resume();
      this.pauseButton.setText('Pause').setColor('#ff0000');
    }
  }
  
  /**
   * Main game loop
   */
  gameLoop() {
    // Process simulation based on speed
    if (this.simulation.isRunning) {
      const chrononsToProcess = this.simulation.speed;
      
      for (let i = 0; i < chrononsToProcess; i++) {
        this.simulation.step();
      }
    }
    
    // Render
    this.renderSimulation();
    this.updateStats();
    this.renderPopulationChart();
    
    // Continue loop
    this.time.addEvent({
      delay: 16, // ~60fps
      loop: true,
      callback: () => this.gameLoop()
    });
  }
  
  /**
   * Render the simulation
   */
  renderSimulation() {
    // Clear previous frame
    this.graphics.clear();
    
    // Fill water background
    this.graphics.fillStyle(WATER_COLOR);
    this.graphics.fillRect(0, 0, this.sys.game.config.width, this.sys.game.config.height);
    
    // Draw entities
    this.simulation.entityManager.entities.forEach(entity => {
      const color = entity instanceof Fish ? FISH_COLOR : SHARK_COLOR;
      const radius = entity instanceof Fish ? FISH_RADIUS : SHARK_RADIUS;
      
      // Convert grid coordinates to screen coordinates
      const screenX = this.gridToScreenX(entity.x);
      const screenY = this.gridToScreenY(entity.y);
      
      this.graphics.fillStyle(color);
      this.graphics.fillCircle(screenX, screenY, radius);
    });
  }
  
  /**
   * Convert grid X to screen X
   * @param {number} gridX - Grid X coordinate
   * @returns {number}
   */
  gridToScreenX(gridX) {
    const cellWidth = this.sys.game.config.width / GRID_WIDTH;
    return gridX * cellWidth + cellWidth / 2;
  }
  
  /**
   * Convert grid Y to screen Y
   * @param {number} gridY - Grid Y coordinate
   * @returns {number}
   */
  gridToScreenY(gridY) {
    const cellHeight = this.sys.game.config.height / GRID_HEIGHT;
    return gridY * cellHeight + cellHeight / 2;
  }
  
  /**
   * Update statistics display
   */
  updateStats() {
    this.fishText.setText(`Fish: ${this.simulation.fishCount}`);
    this.sharkText.setText(`Sharks: ${this.simulation.sharkCount}`);
    this.chrononText.setText(`Chronon: ${this.simulation.chronon}`);
  }
  
  /**
   * Render population history chart
   */
  renderPopulationChart() {
    this.chartGraphics.clear();
    
    // Draw axes
    this.chartGraphics.lineStyle(2, 0xffffff);
    this.chartGraphics.strokeLineShape(new Phaser.Geom.Line(
      50, this.sys.game.config.height - 150,
      50, this.sys.game.config.height - 50
    ));
    this.chartGraphics.strokeLineShape(new Phaser.Geom.Line(
      50, this.sys.game.config.height - 50,
      this.sys.game.config.width - 250,
      this.sys.game.config.height - 50
    ));
    
    if (this.simulation.populationHistory.length === 0) return;
    
    // Find max values for scaling
    const maxFish = Math.max(...this.simulation.populationHistory.map(h => h.fish), 1);
    const maxSharks = Math.max(...this.simulation.populationHistory.map(h => h.sharks), 1);
    
    // Draw fish history (green line)
    this.chartGraphics.lineStyle(2, FISH_COLOR);
    this.simulation.populationHistory.forEach((h, i) => {
      const x1 = 50 + (i / (this.simulation.populationHistory.length - 1)) * (this.sys.game.config.width - 300);
      const y1 = (this.sys.game.config.height - 50) - (h.fish / maxFish) * 100;
      const x2 = 50 + ((i + 1) / (this.simulation.populationHistory.length - 1)) * (this.sys.game.config.width - 300);
      const y2 = (this.sys.game.config.height - 50) - (this.simulation.populationHistory[i + 1]?.fish / maxFish) * 100;
      
      if (i < this.simulation.populationHistory.length - 1) {
        this.chartGraphics.strokeLineShape(new Phaser.Geom.Line(x1, y1, x2, y2));
      }
    });
    
    // Draw sharks history (blue line)
    this.chartGraphics.lineStyle(2, SHARK_COLOR);
    this.simulation.populationHistory.forEach((h, i) => {
      const x1 = 50 + (i / (this.simulation.populationHistory.length - 1)) * (this.sys.game.config.width - 300);
      const y1 = (this.sys.game.config.height - 50) - (h.sharks / maxSharks) * 100;
      const x2 = 50 + ((i + 1) / (this.simulation.populationHistory.length - 1)) * (this.sys.game.config.width - 300);
      const y2 = (this.sys.game.config.height - 50) - (this.simulation.populationHistory[i + 1]?.sharks / maxSharks) * 100;
      
      if (i < this.simulation.populationHistory.length - 1) {
        this.chartGraphics.strokeLineShape(new Phaser.Geom.Line(x1, y1, x2, y2));
      }
    });
  }
}