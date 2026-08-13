## 1. Project Setup

- [x] 1.1 Create index.html with Phaser 4 CDN script tag and ES2020 module loading
- [x] 1.2 Create src/config.js with simulation constants
- [x] 1.3 Create manifest.webmanifest and sw.js for PWA support
- [x] 1.4 Create assets directory structure

## 2. Simulation Core

- [x] 2.1 Implement Entity base class with id, type, position, breedAge, alive flags
- [x] 2.2 Implement Fish class extending Entity with act logic
- [x] 2.3 Implement Shark class extending Entity with energy and hunting logic
- [x] 2.4 Implement WatorSimulation with flat grid, entity map, toroidal neighbors
- [x] 2.5 Implement chronon step with randomized order and newborn skip

## 3. Phaser Scenes

- [x] 3.1 Implement BootScene for initialization
- [x] 3.2 Implement SimulationScene with simulation instance
- [x] 3.3 Implement resize handling and layout calculation

## 4. Rendering

- [x] 4.1 Implement world rendering with Graphics circles for fish and sharks
- [x] 4.2 Implement stats panel rendering left side
- [x] 4.3 Implement controls panel rendering right side
- [x] 4.4 Implement population history chart rendering bottom

## 5. Controls

- [x] 5.1 Implement Play/Pause button logic
- [x] 5.2 Implement Step button logic
- [x] 5.3 Implement Reset button logic
- [x] 5.4 Implement speed buttons 1x/5x/10x/30x/60x

## 6. Integration

- [x] 6.1 Wire SimulationScene update loop to simulation step based on speed
- [x] 6.2 Connect UI controls to simulation state
- [x] 6.3 Verify extinction detection and auto-pause
- [x] 6.4 Test responsive layout on wide and narrow viewports
