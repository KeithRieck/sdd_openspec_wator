## 1. Static Application Foundation

- [x] 1.1 Create `index.html` with repository-subpath-safe relative asset references, Phaser 4.1.0 CDN loading, ES2020 module loading, manifest metadata, and service-worker registration.
- [x] 1.2 Create `src/config.js` containing editable grid, density, breeding, energy, color, history, and speed constants with the PRD defaults.
- [x] 1.3 Create `src/main.js` to configure the Phaser game, responsive canvas sizing, and scene registration.

## 2. Framework-Independent Simulation Model

- [x] 2.1 Create documented `Entity` base class in `src/simulation/Entity.js` with ID, type, position, breed age, lifecycle state, and model-only behavior.
- [x] 2.2 Create documented `Fish` subclass in `src/simulation/Fish.js`.
- [x] 2.3 Create documented `Shark` subclass in `src/simulation/Shark.js` with energy state.
- [x] 2.4 Create documented `WatorSimulation` in `src/simulation/WatorSimulation.js` with flat grid storage, entity registry, ID allocation, toroidal neighbor queries, and configurable random initialization.
- [x] 2.5 Implement randomized chronon orchestration with at-most-once turns, newborn exclusion, dead-entity skipping, fish movement/reproduction, and breed-age handling.
- [x] 2.6 Implement shark energy decrement, starvation, prey preference, eating energy gain, fallback movement, and shark reproduction with newborn energy initialization.
- [x] 2.7 Implement query methods, population counts, rolling 500-sample history, reset behavior, and exact terminal extinction statuses.

## 3. Phaser Scenes and World Rendering

- [x] 3.1 Create documented `BootScene` in `src/scenes/BootScene.js` and transition into the simulation scene.
- [x] 3.2 Create documented `SimulationScene` in `src/scenes/SimulationScene.js` with simulation ownership, 1/5/10/30/60 chronons-per-second accumulation, running/paused/terminal state, and update scheduling.
- [x] 3.3 Implement batched Phaser `Graphics` world rendering for water, green fish circles, and larger blue shark circles without grid lines, sprites, or movement animation.
- [x] 3.4 Implement browser resize handling that recalculates layout and world scale without changing model dimensions.

## 4. Phaser-Native UI Helpers

- [x] 4.1 Create pure `LayoutManager` geometry calculations under `src/ui/LayoutManager.js` for wide and narrow/tablet layouts while preserving world aspect ratio.
- [x] 4.2 Create `StatsPanel` under `src/ui/StatsPanel.js` to render Chronon, Fish, Sharks, and Status on the statistics region.
- [x] 4.3 Create `ControlsPanel` under `src/ui/ControlsPanel.js` with speed buttons in one row and Play/Pause, Step, and Reset on separate rows, including disabled-state and callback behavior.
- [x] 4.4 Create `PopulationChart` under `src/ui/PopulationChart.js` to render unlabeled fish and shark lines across the bottom using configured colors.
- [x] 4.5 Integrate UI helpers with `SimulationScene` through simulation query methods and enforce auto-pause and terminal Play disabling.

## 5. PWA and Static Deployment

- [x] 5.1 Create relative-path-safe `manifest.webmanifest` with app metadata, display settings, start URL, scope, and icon references.
- [x] 5.2 Create `sw.js` to install and serve a same-origin app-shell cache without assuming Phaser CDN availability.
- [x] 5.3 Add `assets/` PWA icons whose designs suggest fish and shark circles.

## 6. Manual Verification

- [ ] 6.1 Verify direct 10x startup, rendering, statistics, controls, speed changes, pause, single-step, reset, and terminal behavior in a browser. *(Pending manual browser verification.)*
- [x] 6.2 Verify toroidal movement, randomized turn constraints, reproduction, shark starvation/eating, extinction statuses, and 500-sample chart behavior through observable runs. *(Model smoke tests and edge-case checks completed; full browser observation remains pending.)*
- [ ] 6.3 Verify wide and iPad-mini-sized/narrow layouts, resize behavior, repository-subpath loading, manifest registration, and best-effort service-worker caching. *(Pending manual browser verification.)*
