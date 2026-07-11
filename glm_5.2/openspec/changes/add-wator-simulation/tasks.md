## 1. Project scaffolding and config

- [ ] 1.1 Create `index.html` with Phaser 4.x CDN script tag, ES2020 module entry, manifest link, and service worker registration
- [ ] 1.2 Create `src/config.js` exporting all tunable constants: grid dimensions (100x70), fish density (0.30), shark density (0.05), `fishBreedTime` (3), `sharkBreedTime` (25), `initialSharkEnergy` (5), `sharkEnergyGain` (3), `sharkEnergyCostPerChronon` (1), default speed (10), speed options [1,5,10,30,60], colors (fish green, shark blue, water background), history window (500), and panel layout constants
- [ ] 1.3 Create `manifest.webmanifest` declaring app name, start URL, display mode, and icon references
- [ ] 1.4 Create `assets/` directory with PWA icon files depicting circles suggesting shark and fish symbols

## 2. Simulation engine — entity classes

- [ ] 2.1 Create `src/simulation/Entity.js` with abstract `Entity` base class: `id`, `x`, `y`, `breedAge`, `birthChronon` fields; abstract `act(grid, sim)`; `canBreed()` method; JSDoc class and method comments
- [ ] 2.2 Create `src/simulation/Fish.js` extending `Entity`: implement `act(grid, sim)` — find random empty orthogonal neighbor (toroidal), move, breed if ready and moved (leave new Fish with fresh ID and `birthChronon`), reset/increment breed timer per rules; JSDoc
- [ ] 2.3 Create `src/simulation/Shark.js` extending `Entity`: add `energy` field; implement `act(grid, sim)` — decrement energy, starve if zero, else eat adjacent fish (move, remove fish, gain energy) or move to empty, breed if ready and moved (newborn shark gets `initialSharkEnergy`); JSDoc

## 3. Simulation engine — WatorSimulation

- [ ] 3.1 Create `src/simulation/WatorSimulation.js` with grid (`Array<Entity|null>`), `entities` Map, `chronon`, `nextId`, `fishCount`, `sharkCount`, `status`, `history` array; JSDoc
- [ ] 3.2 Implement `init()` — build flat grid, populate randomly per densities using `Math.random()`, assign stable IDs, set initial counts, reset chronon and history
- [ ] 3.3 Implement toroidal `neighbors(x, y)` returning the four orthogonal neighbor coordinates with wrapping
- [ ] 3.4 Implement `randomEmptyNeighbor(x, y)` and `randomFishNeighbor(x, y)` helpers using `Math.random()` for selection
- [ ] 3.5 Implement `step()` — snapshot entity IDs, Fisher-Yates shuffle, iterate skipping dead (not in map) and newborns (`birthChronon === chronon`), call `entity.act(grid, this)`; then increment chronon, sample history, check extinction and set status
- [ ] 3.6 Implement `reset()` — clear grid/entities/history, reinitialize random world, set chronon 0, clear status, resume running
- [ ] 3.7 Implement extinction detection — set status to `Sharks extinct`, `Fish extinct`, or `Ecosystem collapsed` per counts
- [ ] 3.8 Verify no `src/simulation/*.js` file imports or references Phaser

## 4. UI helpers

- [ ] 4.1 Create `src/ui/PhaserButton.js` — rounded-rect `Graphics` background + `Text` label; states: normal, hover, active/pressed, disabled, selected; `setEnabled()`, `setSelected()`, `setLabel()`, `setPosition()`; pointer events for hover/click; JSDoc
- [ ] 4.2 Create `src/ui/HistoryChart.js` — stores `{fish, sharks}` samples capped at 500; `push(fish, sharks)`; `draw(x, y, w, h)` auto-scaling vertical axis to window max, drawing green and blue polylines via `Graphics`, no labels; JSDoc

## 5. Phaser scenes

- [ ] 5.1 Create `src/scenes/BootScene.js` — `create()` transitions to `SimulationScene`; JSDoc
- [ ] 5.2 Create `src/scenes/SimulationScene.js` skeleton — holds `WatorSimulation` instance, `worldGraphics`, stats `Text` objects, `PhaserButton` instances, `HistoryChart`, speed, running flag, accumulator; JSDoc
- [ ] 5.3 Implement `create()` — instantiate simulation, call `init()`, create world Graphics, stats texts, action buttons (Play/Pause, Step, Reset), speed segmented control buttons, history chart; wire button callbacks; set initial speed 10x and running true
- [ ] 5.4 Implement `update(time, delta)` — accumulator pattern (`stepMs = 1000 / speed`); when running and accumulator >= stepMs, call `sim.step()` and redraw; update stats and chart; handle terminal status (disable Play, keep Step disabled)
- [ ] 5.5 Implement `drawWorld()` — clear world Graphics, fill background, draw fish as green circles and sharks as larger blue circles at scaled positions; no grid lines
- [ ] 5.6 Implement `drawStats()` — update Chronon, Fish, Sharks, Status text objects from simulation state
- [ ] 5.7 Implement `onPlayPause()` — toggle running, update button label, enable/disable Step per state
- [ ] 5.8 Implement `onStep()` — if paused and not terminal, advance exactly one chronon and redraw; do not resume running
- [ ] 5.9 Implement `onReset()` — call `sim.reset()`, clear chart, re-enable controls, resume running at selected speed
- [ ] 5.10 Implement `onSpeed(newSpeed)` — update speed, update segmented control selected state; do not resume if paused
- [ ] 5.11 Implement `layout()` — compute stats panel (left), world (center, preserve 100:70 aspect, letterboxed), controls panel (right), chart (bottom) regions; reflow for narrow/tablet widths; call on resize event

## 6. App entry

- [ ] 6.1 Create `src/main.js` — import config and scenes, create `Phaser.Game` instance with scene list, scale mode covering full window; JSDoc

## 7. PWA service worker

- [ ] 7.1 Create `sw.js` — install handler caching app shell and same-origin assets, activate handler, fetch handler serving cache-then-network; cache Phaser CDN script after first successful load
- [ ] 7.2 Register service worker from `index.html` (already referenced in 1.1)

## 8. Verification

- [ ] 8.1 Manually verify app launches directly into a running 10x simulation with no landing screen
- [ ] 8.2 Verify Play/Pause, Step (paused only), Reset, and all five speed buttons behave per specs
- [ ] 8.3 Verify extinction auto-pauses and displays correct status; Reset required to continue
- [ ] 8.4 Verify world renders as green fish circles and larger blue shark circles with no grid lines
- [ ] 8.5 Verify stats panel (left), controls (right), chart (bottom) layout on a wide window
- [ ] 8.6 Verify layout reflows on a narrow/tablet viewport while preserving world aspect ratio
- [ ] 8.7 Verify browser resize recomputes layout without changing grid dimensions
- [ ] 8.8 Verify chart shows green and blue lines, auto-scales, has no labels, rolls over 500 samples
- [ ] 8.9 Verify offline load works after a successful first load (app shell from cache)
- [ ] 8.10 Verify all classes have JSDoc class comments and all qualifying methods have JSDoc
