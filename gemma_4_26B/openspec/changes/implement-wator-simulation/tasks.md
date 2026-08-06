## 1. Project Scaffolding

- [ ] 1.1 Create directory structure: `src/simulation`, `src/scenes`, `src/ui`, `assets/`
- [ ] 1.2 Create `index.html` with Phaser 4 CDN script and ES2020 module entry point
- [ ] 1.3 Create `src/config.js` with all simulation and UI constants
- [ ] 1.4 Implement `manifest.webmanifest` and `sw.js` for PWA support

## 2. Simulation Engine (Core Logic)

- [ ] 2.1 Implement `Entity` base class and `Fish`/`Shark` subclasses
- [ ] 2.2 Implement `WatorSimulation` class with toroidal grid and entity map
- [ ] 2.3 Implement `getWrappedCoords` helper for toroidal wrapping
- [ ] 2.4 Implement the chronon loop: entity randomization and turn execution
- [ ] 2.5 Implement Fish movement and breeding logic
- [ ] 2.6 Implement Shark energy, hunting, and breeding logic
- [ ] 2.7 Implement extinction detection and terminal status logic
- [ ] 2.8 Implement `getState()` method for renderer snapshots

## 3. Rendering Layer (Phaser 4)

- [ ] 3.1 Implement `BootScene` for initial setup
- [ ] 3.2 Implement `SimulationScene` with the main update loop
- [ ] 3.3 Implement the "Pull" architecture to fetch state from `WatorSimulation`
- [ ] 3.4 Implement world rendering using `Phaser.Graphics` (circles for entities)
- [ ] 3.5 Implement the responsive UI layout (Wide vs. Narrow)
- [ ] 3.6 Implement the Stats panel (Left) and Controls panel (Right)
- [ ] 3.7 Implement the rolling population history chart (Bottom) using `Phaser.Graphics`
- [ ] 3.8 Implement control button logic (Play/Pause, Step, Reset, Speed)

## 4. Integration and Validation

- [ ] 4.1 Connect UI controls to simulation methods (`advanceChronon`, `reset`)
- [ ] 4.2 Verify correct Wa-Tor behavior (predator-prey dynamics)
- [ ] 4.3 Validate responsive reflow on narrow window sizes
- [ ] 4.4 Test PWA installation and offline loading
