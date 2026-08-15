## 1. Project Structure and Configuration

- [ ] 1.1 Create directory structure: src/, src/simulation/, src/scenes/, src/ui/, assets/
- [ ] 1.2 Create src/config.js with all configuration constants (frozen object)
- [ ] 1.3 Create index.html with Phaser CDN script and ES2020 module entry point
- [ ] 1.4 Create src/main.js as the application entry point
- [ ] 1.5 Create manifest.webmanifest for PWA support
- [ ] 1.6 Create sw.js service worker for app shell caching
- [ ] 1.7 Create placeholder assets for PWA icons

## 2. Entity Model Implementation

- [ ] 2.1 Create src/simulation/Entity.js - abstract base class with ID, position, breed age, and common methods
- [ ] 2.2 Create src/simulation/Fish.js - Fish subclass with movement and breeding logic
- [ ] 2.3 Create src/simulation/Shark.js - Shark subclass with energy management, eating, movement, and breeding logic

## 3. Simulation Engine Implementation

- [ ] 3.1 Create src/simulation/WatorSimulation.js - main simulation class with grid management
- [ ] 3.2 Implement toroidal grid with flat array storage
- [ ] 3.3 Implement random initial population with configurable densities
- [ ] 3.4 Implement chronon stepping with randomized entity action order
- [ ] 3.5 Implement fish movement and breeding rules
- [ ] 3.6 Implement shark movement, eating, energy, and breeding rules
- [ ] 3.7 Implement extinction detection and terminal status
- [ ] 3.8 Implement population history recording (rolling 500 chronons)
- [ ] 3.9 Implement reset functionality

## 4. Phaser UI Implementation

- [ ] 4.1 Create src/scenes/BootScene.js - initializes game and registers service worker
- [ ] 4.2 Create src/scenes/SimulationScene.js - main game loop with UI components
- [ ] 4.3 Create src/ui/WorldRenderer.js - draws grid using Phaser Graphics
- [ ] 4.4 Create src/ui/StatsPanel.js - displays Chronon, Fish, Sharks, Status on left
- [ ] 4.5 Create src/ui/ControlPanel.js - speed buttons (1x,5x,10x,30x,60x) and action buttons (Play/Pause, Step, Reset) on right
- [ ] 4.6 Create src/ui/HistoryChart.js - renders population history at bottom
- [ ] 4.7 Create src/ui/Button.js - reusable button component for ControlPanel
- [ ] 4.8 Implement responsive layout for wide and narrow viewports

## 5. Integration and Testing

- [ ] 5.1 Wire all components together in SimulationScene
- [ ] 5.2 Test simulation runs correctly in browser
- [ ] 5.3 Verify all acceptance criteria from PRD are met
- [ ] 5.4 Test PWA installation and offline behavior
- [ ] 5.5 Test responsive layout at different viewport sizes