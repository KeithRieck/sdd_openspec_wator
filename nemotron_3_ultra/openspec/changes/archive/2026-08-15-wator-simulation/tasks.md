## 1. Project Structure and Configuration

- [x] 1.1 Create directory structure: src/, src/simulation/, src/scenes/, src/ui/, assets/
- [x] 1.2 Create src/config.js with all configuration constants (frozen object)
- [x] 1.3 Create index.html with Phaser CDN script and ES2020 module entry point
- [x] 1.4 Create src/main.js as the application entry point
- [x] 1.5 Create manifest.webmanifest for PWA support
- [x] 1.6 Create sw.js service worker for app shell caching
- [x] 1.7 Create placeholder assets for PWA icons

## 2. Entity Model Implementation

- [x] 2.1 Create src/simulation/Entity.js - abstract base class with ID, position, breed age, and common methods
- [x] 2.2 Create src/simulation/Fish.js - Fish subclass with movement and breeding logic
- [x] 2.3 Create src/simulation/Shark.js - Shark subclass with energy management, eating, movement, and breeding logic

## 3. Simulation Engine Implementation

- [x] 3.1 Create src/simulation/WatorSimulation.js - main simulation class with grid management
- [x] 3.2 Implement toroidal grid with flat array storage
- [x] 3.3 Implement random initial population with configurable densities
- [x] 3.4 Implement chronon stepping with randomized entity action order
- [x] 3.5 Implement fish movement and breeding rules
- [x] 3.6 Implement shark movement, eating, energy, and breeding rules
- [x] 3.7 Implement extinction detection and terminal status
- [x] 3.8 Implement population history recording (rolling 500 chronons)
- [x] 3.9 Implement reset functionality

## 4. Phaser UI Implementation

- [x] 4.1 Create src/scenes/BootScene.js - initializes game and registers service worker
- [x] 4.2 Create src/scenes/SimulationScene.js - main game loop with UI components
- [x] 4.3 Create src/ui/WorldRenderer.js - draws grid using Phaser Graphics
- [x] 4.4 Create src/ui/StatsPanel.js - displays Chronon, Fish, Sharks, Status on left
- [x] 4.5 Create src/ui/ControlPanel.js - speed buttons (1x,5x,10x,30x,60x) and action buttons (Play/Pause, Step, Reset) on right
- [x] 4.6 Create src/ui/HistoryChart.js - renders population history at bottom
- [x] 4.7 Create src/ui/Button.js - reusable button component for ControlPanel
- [x] 4.8 Implement responsive layout for wide and narrow viewports

## 5. Integration and Testing

- [x] 5.1 Wire all components together in SimulationScene
- [x] 5.2 Test simulation runs correctly in browser
- [x] 5.3 Verify all acceptance criteria from PRD are met
- [x] 5.4 Test PWA installation and offline behavior
- [x] 5.5 Test responsive layout at different viewport sizes