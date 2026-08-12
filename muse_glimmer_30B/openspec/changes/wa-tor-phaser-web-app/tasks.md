## 1. Project Setup

- [ ] 1.1 Create index.html with Phaser 4 CDN script tag and ES2020 module loading
- [ ] 1.2 Create src/config.js with simulation constants
- [ ] 1.3 Create manifest.webmanifest and sw.js for PWA support
- [ ] 1.4 Create assets directory structure

## 2. Simulation Core

- [ ] 2.1 Implement Entity base class with id, type, position, breedAge, alive flags
- [ ] 2.2 Implement Fish class extending Entity with act logic
- [ ] 2.3 Implement Shark class extending Entity with energy and hunting logic
- [ ] 2.4 Implement WatorSimulation with flat grid, entity map, toroidal neighbors
- [ ] 2.5 Implement chronon step with randomized order and newborn skip

## 3. Phaser Scenes

- [ ] 3.1 Implement BootScene for initialization
- [ ] 3.2 Implement SimulationScene with simulation instance
- [ ] 3.3 Implement resize handling and layout calculation

## 4. Rendering

- [ ] 4.1 Implement world rendering with Graphics circles for fish and sharks
- [ ] 4.2 Implement stats panel rendering left side
- [ ] 4.3 Implement controls panel rendering right side
- [ ] 4.4 Implement population history chart rendering bottom

## 5. Controls

- [ ] 5.1 Implement Play/Pause button logic
- [ ] 5.2 Implement Step button logic
- [ ] 5.3 Implement Reset button logic
- [ ] 5.4 Implement speed buttons 1x/5x/10x/30x/60x

## 6. Integration

- [ ] 6.1 Wire SimulationScene update loop to simulation step based on speed
- [ ] 6.2 Connect UI controls to simulation state
- [ ] 6.3 Verify extinction detection and auto-pause
- [ ] 6.4 Test responsive layout on wide and narrow viewports
