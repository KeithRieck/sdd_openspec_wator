## 1. App shell and configuration

- [ ] 1.1 Create `index.html` with Phaser 4.1.0 CDN script, ES module entry to `src/main.js`, and basic full-viewport styles
- [ ] 1.2 Create `src/config.js` with grid, density, breed, energy, speed, color, history length, and layout-related constants
- [ ] 1.3 Create `src/main.js` to construct the Phaser game (BootScene first), handle resize, and register the service worker with relative URLs
- [ ] 1.4 Create `manifest.webmanifest`, `sw.js`, and `assets/` PWA icons (circle motifs for fish/shark)
- [ ] 1.5 Create stub modules for scenes, simulation, and UI so imports resolve

## 2. Simulation engine entities

- [ ] 2.1 Implement abstract `src/simulation/Entity.js` with shared fields and breed helpers (`isBreedingReady`, reset/age bookkeeping, `canAct`)
- [ ] 2.2 Implement `src/simulation/Fish.js` extending `Entity` with empty-cell movement and fish offspring creation
- [ ] 2.3 Implement `src/simulation/Shark.js` extending `Entity` with energy prelude/death, hunt-or-empty movement, energy gain on eat, and shark offspring creation
- [ ] 2.4 Factor shared act template on `Entity` (prelude → move → breed handling) so fish/shark only specialize species behavior

## 3. WatorSimulation core

- [ ] 3.1 Implement `WatorSimulation` construction/reset: flat grid, entity map, ID allocation, random initial population, chronon 0, history seed
- [ ] 3.2 Implement world-port methods: toroidal orthogonal neighbors, occupancy queries, `move`, `remove`, `spawn`
- [ ] 3.3 Implement `step()`: snapshot IDs, shuffle, act survivors/non-newborns once, increment chronon, record history (max 500), evaluate extinction
- [ ] 3.4 Expose getters for chronon, counts, extinction status, history, and render-facing entity snapshots
- [ ] 3.5 Ensure engine modules have zero Phaser imports and read rules/constants from `config.js`

## 4. Phaser scenes and UI components

- [ ] 4.1 Implement `BootScene` that performs any pre-start setup and starts `SimulationScene`
- [ ] 4.2 Implement `WorldRenderer` (`src/ui/`) using Graphics for water background and fish/shark circles with scale-to-bounds layout
- [ ] 4.3 Implement `StatsPanel` for Chronon, Fish, Sharks, and Status text
- [ ] 4.4 Implement `ControlPanel` with speed row (`1x`–`60x`) and stacked Play/Pause, Step, Reset actions plus enable/disable states
- [ ] 4.5 Implement `PopulationChart` with unlabeled green/blue series and fixed Y max of `gridWidth * gridHeight`
- [ ] 4.6 Implement `SimulationScene` orchestration: wide layout regions, create `WatorSimulation`, wire UI callbacks, default running at `10x`

## 5. Run loop and interaction behavior

- [ ] 5.1 Implement frame delta pacing for selected chronons/second with no tab catch-up compensation
- [ ] 5.2 Implement pause/play, single-step while paused, and disable Step while running
- [ ] 5.3 Implement terminal handling: auto-pause on extinction, disable Play, block Step, require Reset
- [ ] 5.4 Implement Reset to rebuild world, clear terminal state, reseed history, resume at selected speed
- [ ] 5.5 Implement resize path to reflow wide layout and rescale/center world without changing model grid size
- [ ] 5.6 Stop multi-step frames early when a step becomes terminal

## 6. Documentation and manual verification

- [ ] 6.1 Add JSDoc class comments on all classes and JSDoc on static/public methods longer than 8 lines
- [ ] 6.2 Manually verify launch defaults, controls, extinction strings, chart fixed scale, and relative URL/PWA shell behavior in a browser
- [ ] 6.3 Smoke-check that changing grid constants in `config.js` scales the world display without UI rewrites
