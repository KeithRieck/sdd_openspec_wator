## 1. Project Setup

- [ ] 1.1 Create directory structure (`src/simulation`, `src/scenes`, `src/ui`, `assets/`)
- [ ] 1.2 Create `index.html` with Phaser 4 CDN script and ES2020 module entry point
- [ ] 1.3 Create `src/config.js` with simulation constants (grid size, densities, breed times, energy)

## 2. Simulation Engine

- [ ] 2.1 Implement `Entity` base class and `Fish`/`Shark` subclasses
- [ ] 2.2 Implement `WatorSimulation` class with toroidal grid and entity registry
- [ ] 2.3 Implement `WatorSimulation.initialize()` for random population
- [ ] 2.4 Implement `WatorSimulation.step()` for the chronon loop (shuffle, act, update)
- [ ] 2.5 Implement `Fish.act()` logic (move, breed)
- [ ] 2.6 Implement `Shark.act()` logic (energy, hunt, move, breed)
- [ ] 2.7 Verify simulation correctness (headless test or basic logs)

## 3. Phaser Rendering Layer

- [ ] 3.1 Implement `BootScene` for initial setup
- [ ] 3.2 Implement `SimulationScene` for the main loop
- [ ] 3.3 Implement world rendering (grid background, fish/shark circles)
- [ ] 3.4 Implement responsive scaling and centering of the simulation world
- [ ] 3.5 Connect `SimulationScene` to `WatorSimulation.step()`

## 4. User Interface

- [ ] 4.1 Implement UI layout using Phaser Graphics
- [ ] 4.2 Implement Play/Pause, Step, and Reset buttons
- [ ] 4.3 Implement Speed control buttons (1x, 5x, 10x, 30x, 60x)
- [ ] 4.4 Implement live population statistics display
- [ ] 4.5 Implement rolling population history chart (buffer and line drawing)

## 5. PWA and Finalization

- [ ] 5.1 Create `manifest.webmanifest`
- [ ] 5.2 Implement `sw.js` for basic asset caching
- [ ] 5.3 Final polish and verification against PRD acceptance criteria
