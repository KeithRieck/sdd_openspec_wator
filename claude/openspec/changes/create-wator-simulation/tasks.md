## 1. Project scaffolding & config

- [ ] 1.1 Create `index.html` that loads Phaser `4.1.0` from the CDN `<script>` tag and bootstraps `src/main.js` as an ES2020 module
- [ ] 1.2 Create `src/config.js` exporting all tunable constants: `gridWidth=100`, `gridHeight=70`, `fishDensity=0.30`, `sharkDensity=0.05`, `fishBreedTime=3`, `sharkBreedTime=10`, `initialSharkEnergy=5`, `sharkEnergyGain=4`, `sharkEnergyCostPerChronon=1`, `defaultSpeed=10`, `speedOptions=[1,5,10,30,60]`, `historyWindow=500`, and fish/shark/water colors
- [ ] 1.3 Create `src/main.js` that constructs the Phaser game (scale/resize config), registers `BootScene` and `SimulationScene`, and registers `sw.js` using a relative URL

## 2. Simulation engine (Phaser-free)

- [ ] 2.1 Implement `WatorSimulation` constructor and flat-array state (occupancy grid + entity records `{id,type,x,y,breedAge,energy?}`) with JSDoc, importing only `config.js` (no Phaser)
- [ ] 2.2 Implement `reset()`/`populate()` to build the toroidal grid and randomly place fish (~30%) and sharks (~5%), one entity per cell
- [ ] 2.3 Implement orthogonal toroidal neighbor helpers (`neighbors`, `emptyNeighbors`, `fishNeighbors`) with edge wrapping
- [ ] 2.4 Implement `step()`: snapshot entity IDs, shuffle order, mark newborns to skip until next chronon, skip dead/eaten entities, act each survivor once, increment `chronon`
- [ ] 2.5 Implement fish behavior: move to random empty neighbor; breeding-ready leaves a new fish and resets timer on move; reset/age timer when blocked
- [ ] 2.6 Implement shark behavior: decrement energy first; die at `0`; else eat a random adjacent fish (gain `sharkEnergyGain`) or move to a random empty neighbor; breeding leaves a newborn at `initialSharkEnergy` and resets timer; reset/age timer when blocked
- [ ] 2.7 Implement `fishCount()`, `sharkCount()`, and `forEachEntity()` accessors for rendering and extinction checks

## 3. Boot scene

- [ ] 3.1 Implement `BootScene.preload()`/`create()` with JSDoc; load any needed assets and start `SimulationScene` as the final create step

## 4. Layout & rendering helpers

- [ ] 4.1 Implement a `Layout` helper that partitions the canvas into stats (left), world (center, aspect-preserving), controls (right), and chart (bottom), deriving `cellSize` and centering the world from the grid constants
- [ ] 4.2 Implement a `PopulationHistory` ring buffer storing one `{fish,sharks}` sample per chronon over the most recent `500` chronons, with `record`/`clear`/`forEach`

## 5. Simulation scene — render

- [ ] 5.1 Draw the world with one `Graphics` pass: water background, fish as green circles, sharks as slightly larger blue circles, no grid lines, no sprites
- [ ] 5.2 Draw the left stats panel (Chronon, Fish, Sharks, Status) using Phaser text
- [ ] 5.3 Draw the bottom population-history chart: fish line green, shark line blue, no titles or labels
- [ ] 5.4 Recompute layout and rendering scale on browser `resize` without changing grid dimensions; preserve world aspect ratio on narrow/tablet viewports down to `744x1133`

## 6. Simulation scene — controls & run loop

- [ ] 6.1 Build Phaser-native controls (no DOM): speed row `1x/5x/10x/30x/60x`, and Play/Pause, Step, Reset each on its own row, on the right side
- [ ] 6.2 Implement the `update(time, delta)` chronon accumulator that advances at the selected chronons-per-second with no catch-up when throttled; start running at `10x`
- [ ] 6.3 Wire run state: disable Step while running; Step advances exactly one chronon while paused; speed changes never resume a paused run
- [ ] 6.4 Wire Reset: new random world, chronon `0`, clear status, clear history, resume running at the selected speed
- [ ] 6.5 Implement extinction handling: auto-pause and show `Sharks extinct` / `Fish extinct` / `Ecosystem collapsed`; keep Play disabled until Reset; show `Running`/`Paused` otherwise

## 7. PWA packaging

- [ ] 7.1 Create `manifest.webmanifest` declaring app metadata and icons that suggest shark and fish circles
- [ ] 7.2 Create `assets/` icon(s) (e.g. `icon.svg`) showing fish/shark circles, referenced by the manifest
- [ ] 7.3 Create `sw.js` that caches the app shell and same-origin assets using relative URLs for subpath hosting

## 8. Documentation & verification

- [ ] 8.1 Confirm every class has a JSDoc class comment and every static/public method over 8 lines is documented
- [ ] 8.2 Manually verify in a browser: launches running at `10x`, controls and speed work, chart populates, resize reflows, and extinction auto-pauses with the correct terminal status
