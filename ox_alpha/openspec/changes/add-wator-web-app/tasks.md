# Tasks: add-wator-web-app

## 1. Project scaffold

- [x] 1.1 Create `index.html` loading Phaser 4.1.0 from the jsdelivr CDN script tag and `src/main.js` as an ES2020 module, with relative paths for subpath deployment
- [x] 1.2 Create `src/config.js` with all model constants: grid dimensions (100x70), densities (30%/5%), breed times (3/25), shark energy values (5/3/1), colors (green fish, blue sharks), speed options (1x/5x/10x/30x/60x), default speed 10x, history window 500
- [x] 1.3 Create `src/main.js` bootstrapping a full-window Phaser.Game with scale mode suited to resize handling

## 2. Simulation engine (Phaser-free)

- [x] 2.1 Create `src/simulation/Entity.js`: abstract base class with id, pos, breedAge, bornThisChronon, alive; template-method `act(sim)` with `preAct`, `selectDestination`, `afterMove` hooks and shared breeding bookkeeping; JSDoc class comment
- [x] 2.2 Create `src/simulation/Fish.js`: subclass overriding `selectDestination` to pick a random adjacent empty cell
- [x] 2.3 Create `src/simulation/Shark.js`: subclass with energy field; `preAct` drains `sharkEnergyCostPerChronon` and dies at zero before moving/eating; `selectDestination` prefers adjacent fish then empty cells; `afterMove` eats via simulation and gains `sharkEnergyGain`
- [x] 2.4 Create `src/simulation/WatorSimulation.js`: Int32Array grid + entity Map, toroidal orthogonal neighbor helpers, random initialization at configured densities, Fisher-Yates shuffled chronon loop honoring newborn deferral and mid-chronon death skipping, `consumeAt(pos)`, population snapshot API
- [x] 2.5 Verify engine runs headless in browser console with no Phaser import and manually spot-check chronon rules against specs/simulation-engine scenarios

## 3. Layout and rendering

- [x] 3.1 Create `src/ui/LayoutSolver.js`: pure function of viewport width/height and grid aspect returning rects for stats, world, controls, chart; wide layout per AC 51 and stacked/narrow reflow usable at 744x1133
- [x] 3.2 Create `src/scenes/BootScene.js` that immediately starts SimulationScene
- [x] 3.3 Create `src/scenes/SimulationScene.js`: owns world Graphics layer, scales/centers grid into world rect preserving aspect ratio, redraws on state or scale change, frame-time accumulator advancing N chronons/sec for selected speed with per-frame cap
- [x] 3.4 Draw water background, green fish circles, larger blue shark circles using Phaser Graphics only — no sprites, no grid lines, no interpolation

## 4. UI panels and controls

- [x] 4.1 Create `src/ui/UiButton.js`: Graphics-drawn button with label, enabled/disabled and selected visual states, pointer input handling
- [x] 4.2 Create `src/ui/StatsPanel.js`: Chronon, Fish, Sharks, Status readouts in left rect, updated per chronon
- [x] 4.3 Create `src/ui/ControlPanel.js`: Play/Pause, Step, Reset rows plus horizontal 1x/5x/10x/30x/60x row in right rect; disable Step while running; disable Play when terminal; speed selection never resumes a paused sim
- [x] 4.4 Wire lifecycle behavior in SimulationScene: auto-start running at 10x, pause/play toggle, single-step when paused, reset creating fresh world with chronon 0, cleared history and status, resume at selected speed
- [x] 4.5 Implement extinction detection and statuses: auto-pause with `Sharks extinct`, `Fish extinct`, or `Ecosystem collapsed`; non-terminal `Running`/`Paused`; Play locked out until Reset

## 5. Population history chart

- [x] 5.1 Record one fish/shark sample per chronon into a rolling 500-entry buffer inside the simulation or scene adapter
- [x] 5.2 Create `src/ui/HistoryChart.js`: draws green/blue population polylines across bottom rect using shared color constants, no titles or labels

## 6. PWA and static deployment

- [x] 6.1 Create `manifest.webmanifest` with app metadata and icon references
- [x] 6.2 Generate PWA icons in `assets/` showing overlapping blue/green circles suggesting shark and fish
- [x] 6.3 Create `sw.js` precaching same-origin app shell assets and opportunistically caching the CDN Phaser script without failing on cross-origin errors
- [x] 6.4 Register the service worker from `main.js`

## 7. Verification

- [x] 7.1 Verify launch behavior: starts running at 10x immediately, no landing page
- [x] 7.2 Verify controls: step disabled while running, single-step while paused, speed change semantics while running and paused, reset from terminal state
- [x] 7.3 Verify extinction statuses by observing or temporarily tuning constants, restoring constants afterward
- [x] 7.4 Verify responsive layout at wide desktop size and 744x1133 including live resize during a run
- [x] 7.5 Verify subpath static hosting (GitHub Pages style) loads all assets and service worker registers
- [x] 7.6 Review all classes for JSDoc coverage: every class documented, public/static methods over 8 lines documented
