## 1. Project Setup

- [ ] 1.1 Create index.html with Phaser 4.x CDN script tag
- [ ] 1.2 Set up ES2020 module loading in index.html
- [ ] 1.3 Create src/ directory structure
- [ ] 1.4 Create assets/ directory for PWA assets

## 2. Configuration

- [ ] 2.1 Create src/config.js with all constants (grid dimensions, densities, breed times, energy values, colors, speeds)

## 3. Entity Classes

- [ ] 3.1 Create src/simulation/Entity.js base class with id, x, y, breedAge, type
- [ ] 3.2 Create src/simulation/Fish.js extending Entity
- [ ] 3.3 Create src/simulation/Shark.js extending Entity with energy property

## 4. Simulation Engine

- [ ] 4.1 Create src/simulation/WatorSimulation.js class
- [ ] 4.2 Implement grid as flat array with toroidal wrapping
- [ ] 4.3 Implement entities Map for entity storage
- [ ] 4.4 Implement wrap(coord, max) helper method
- [ ] 4.5 Implement getEmptyNeighbors(x, y) method
- [ ] 4.6 Implement getFishNeighbors(x, y) method
- [ ] 4.7 Implement addEntity(entity) method
- [ ] 4.8 Implement removeEntity(entityId) method
- [ ] 4.9 Implement createNewborn(parent, x, y) method
- [ ] 4.10 Implement step() method for chronon processing
- [ ] 4.11 Implement random entity ordering with deadSet and newbornSet tracking
- [ ] 4.12 Implement fish movement logic
- [ ] 4.13 Implement fish breeding logic
- [ ] 4.14 Implement shark energy decrement and death
- [ ] 4.15 Implement shark eating logic with immediate fish removal
- [ ] 4.16 Implement shark breeding logic
- [ ] 4.17 Implement population counting (fishCount, sharkCount)
- [ ] 4.18 Implement extinction detection
- [ ] 4.19 Implement population history storage (rolling 500 chronons)

## 5. Phaser Scenes

- [ ] 5.1 Create src/scenes/BootScene.js with preload and create methods
- [ ] 5.2 Create src/scenes/SimulationScene.js class
- [ ] 5.3 Initialize WatorSimulation in SimulationScene
- [ ] 5.4 Implement Phaser game configuration in main.js

## 6. Rendering

- [ ] 6.1 Implement drawWorld() in SimulationScene using Phaser Graphics
- [ ] 6.2 Draw water background for empty cells
- [ ] 6.3 Draw green circles for fish
- [ ] 6.4 Draw larger blue circles for sharks
- [ ] 6.5 Implement responsive scaling and centering
- [ ] 6.6 Handle browser resize events

## 7. Stats Display

- [ ] 7.1 Implement drawStats() in SimulationScene
- [ ] 7.2 Display Chronon count
- [ ] 7.3 Display Fish count
- [ ] 7.4 Display Sharks count
- [ ] 7.5 Display Status (Running, Paused, Sharks extinct, Fish extinct, Ecosystem collapsed)

## 8. Controls

- [ ] 8.1 Implement drawControls() in SimulationScene
- [ ] 8.2 Create speed control buttons (1x, 5x, 10x, 30x, 60x) in horizontal row
- [ ] 8.3 Create Play/Pause button
- [ ] 8.4 Create Step button
- [ ] 8.5 Create Reset button
- [ ] 8.6 Implement handlePlayPause() method
- [ ] 8.7 Implement handleStep() method
- [ ] 8.8 Implement handleReset() method
- [ ] 8.9 Implement handleSpeedChange(speed) method
- [ ] 8.10 Disable Step when running
- [ ] 8.11 Disable Play when terminal

## 9. Population History Chart

- [ ] 9.1 Implement drawChart() in SimulationScene
- [ ] 9.2 Draw fish population line in green
- [ ] 9.3 Draw shark population line in blue
- [ ] 9.4 Render chart horizontally across bottom
- [ ] 9.5 Omit chart titles and text labels

## 10. Update Loop

- [ ] 10.1 Implement update(time, delta) in SimulationScene
- [ ] 10.2 Implement accumulator pattern for chronons-per-second speed
- [ ] 10.3 Advance simulation based on selected speed
- [ ] 10.4 Trigger re-render after each chronon advance

## 11. PWA Support

- [ ] 11.1 Create manifest.webmanifest with icon and app details
- [ ] 11.2 Create sw.js service worker
- [ ] 11.3 Implement service worker caching for app shell
- [ ] 11.4 Register service worker in index.html
- [ ] 11.5 Create PWA icon showing shark and fish circles

## 12. Main Entry Point

- [ ] 12.1 Create src/main.js
- [ ] 12.2 Initialize Phaser game with BootScene and SimulationScene
- [ ] 12.3 Set up game configuration (width, height, scale mode)

## 13. JSDoc Documentation

- [ ] 13.1 Add JSDoc comments to all classes
- [ ] 13.2 Add JSDoc comments to all static methods
- [ ] 13.3 Add JSDoc comments to all public methods longer than 8 lines
