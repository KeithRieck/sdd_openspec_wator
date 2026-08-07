## 1. Project Scaffolding

- [x] 1.1 Create directory structure: `src/simulation`, `src/scenes`, `src/ui`, `assets/`
- [x] 1.2 Create `index.html` with Phaser 4 CDN script and ES2020 module entry point
- [x] 1.3 Create `src/config.js` with all simulation and UI constants
- [x] 1.4 Implement `manifest.webmanifest` and `sw.js` for PWA support

## 2. Simulation Engine (Core Logic)

- [x] 2.1 Implement `Entity` base class and `Fish`/`Shark` subclasses
- [x] 2.2 Implement `WatorSimulation` class with toroidal grid and entity map
- [x] 2.3 Implement `getWrappedCoords` helper for toroidal wrapping
- [x] 2.4 Implement the chronon loop: entity randomization and turn execution
- [x] 2.5 Implement Fish movement and breeding logic
- [x] 2.6 Implement Shark energy, hunting, and breeding logic
- [x] 2.7 Implement extinction detection and terminal status logic
- [x] 2.8 Implement `getState()` method for renderer snapshots

## 3. Rendering Layer (Phaser 4)

- [x] 3.1 Implement `BootScene` for initial setup
- [x] 3.2 Implement `SimulationScene` with the main update loop
- [x] 3.3 Implement the "Pull" architecture to fetch state from `WatorSimulation`
- [x] 3.4 Implement world rendering using `Phaser.Graphics` (circles for entities)
- [x] 3.5 Implement the responsive UI layout (Wide vs. Narrow)
- [x] 3.6 Implement the Stats panel (Left) and Controls panel (Right)
- [x] 3.7 Implement the rolling population history chart (Bottom) using `Phaser.Graphics`
- [x] 3.8 Implement control button logic (Play/Pause, Step, Reset, Speed)

## 4. Integration and Validation

- [x] 4.1 Connect UI controls to simulation methods (`advanceChronon`, `reset`)
- [x] 4.2 Verify correct Wa-Tor behavior (predator-prey dynamics)
- [x] 4.3 Validate responsive reflow on narrow window sizes
- [x] 4.4 Test PWA installation and offline loading
