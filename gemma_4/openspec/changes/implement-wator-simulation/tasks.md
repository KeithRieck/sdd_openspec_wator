## 1. Project Setup

- [x] 1.1 Create directory structure (`src/simulation`, `src/scenes`, `src/ui`, `assets/`)
- [x] 1.2 Create `index.html` with Phaser 4 CDN script and ES2020 module entry point
- [x] 1.3 Create `src/config.js` with simulation constants (grid size, densities, breed times, energy)

## 2. Simulation Engine

- [x] 2.1 Implement `Entity` base class and `Fish`/`Shark` subclasses
- [x] 2.2 Implement `WatorSimulation` class with toroidal grid and entity registry
- [x] 2.3 Implement `WatorSimulation.initialize()` for random population
- [x] 2.4 Implement `WatorSimulation.step()` for the chronon loop (shuffle, act, update)
- [x] 2.5 Implement `Fish.act()` logic (move, breed)
- [x] 2.6 Implement `Shark.act()` logic (energy, hunt, move, breed)
- [x] 2.7 Verify simulation correctness (headless test or basic logs)

## 3. Phaser Rendering Layer

- [x] 3.1 Implement `BootScene` for initial setup
- [x] 3.2 Implement `SimulationScene` for the main loop
- [x] 3.3 Implement world rendering (grid background, fish/shark circles)
- [x] 3.4 Implement responsive scaling and centering of the simulation world
- [x] 3.5 Connect `SimulationScene` to `WatorSimulation.step()`

## 4. User Interface

- [x] 4.1 Implement UI layout using Phaser Graphics
- [x] 4.2 Implement Play/Pause, Step, and Reset buttons
- [x] 4.3 Implement Speed control buttons (1x, 5x, 10x, 30x, 60x)
- [x] 4.4 Implement live population statistics display
- [x] 4.5 Implement rolling population history chart (buffer and line drawing)

## 5. PWA and Finalization

- [x] 5.1 Create `manifest.webmanifest`
- [x] 5.2 Implement `sw.js` for basic asset caching
- [x] 5.3 Final polish and verification against PRD acceptance criteria
