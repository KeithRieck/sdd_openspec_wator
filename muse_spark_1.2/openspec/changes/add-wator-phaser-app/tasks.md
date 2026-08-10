## 1. Project Scaffold and Config

- [ ] 1.1 Create `src/config.js` with all constants: `GRID_WIDTH=100`, `GRID_HEIGHT=70`, `FISH_DENSITY=0.3`, `SHARK_DENSITY=0.05`, `FISH_BREED_TIME=3`, `SHARK_BREED_TIME=25`, `INITIAL_SHARK_ENERGY=5`, `SHARK_ENERGY_GAIN=3`, `SHARK_ENERGY_COST=1`, `SPEEDS=[1,5,10,30,60]`, `DEFAULT_SPEED=10`, and green/blue colors
- [ ] 1.2 Create `index.html` loading Phaser 4.1.0 from `https://cdn.jsdelivr.net/npm/phaser@4.1.0/dist/phaser.min.js` via CDN script tag and bootstrapping `src/main.js` as ES2020 module with relative URLs for subpath deploy
- [ ] 1.3 Create `src/main.js` that instantiates `Phaser.Game` with `BootScene` and `SimulationScene`, handling window resize via Phaser Scale

## 2. Simulation Engine — OO Entity Hierarchy

- [ ] 2.1 Implement `src/simulation/Entity.js` abstract base class with `id`, `x`, `y`, `breedAge`, `canBreed(breedTime)`, `ageBreed()`, `resetBreed()`, `getType()` and JSDoc
- [ ] 2.2 Implement `src/simulation/Fish.js` (`extends Entity`) and `src/simulation/Shark.js` (`extends Entity` with `energy`, `spendEnergy(cost)`, `gainEnergy(amount)`, `isStarved()`) with JSDoc
- [ ] 2.3 Implement `src/simulation/WatorSimulation.js` core: flat `grid` array (`W*H`), `Map<id, Entity>`, `nextId`, `chronon`, `history` (500 cap), constructor with random population (30%/5%), toroidal `neighbors(x,y)` (N/E/S/W with wrap), `shuffle` via `Math.random()`, `getCounts()`/`getHistory()`, no Phaser imports
- [ ] 2.4 Implement `WatorSimulation.step()` chronon: snapshot IDs, shuffle, `bornThisChronon` set, skip eaten/born, fish movement/breeding (AC 14-17), shark energy decrement/starvation/eating/movement/breeding (AC 18-26), breed timer semantics (`ageBreed` at end, `canBreed` check), history push

## 3. Phaser Scenes and World Rendering

- [ ] 3.1 Implement `src/scenes/BootScene.js` (preload and transition to `SimulationScene`)
- [ ] 3.2 Implement `src/scenes/SimulationScene.js` layout and rendering: Phaser owns entire window (no DOM), `Graphics` for world (water background, green fish circles, blue shark circles slightly larger, no grid lines/sprites), immediate per-chronon updates, stats `Text` on left (Chronon/Fish/Sharks/Status), controls on right, chart at bottom; wide-only layout
- [ ] 3.3 Implement resize handling: recompute `cellSize = min(availW/W, availH/H)` and `offsetX/Y` to center world, preserve aspect ratio, without changing grid dimensions

## 4. Controls, Status, and Timing

- [ ] 4.1 Implement Phaser-native controls: speed row `1x/5x/10x/30x/60x` (default `10x`) and action column `Play/Pause`, `Step`, `Reset` each on own row, with hit-areas and visual selected/disabled states
- [ ] 4.2 Implement status and terminal logic: `Running`/`Paused` when not terminal, `Sharks extinct`/`Fish extinct`/`Ecosystem collapsed` when terminal, auto-pause on extinction, Play disabled when terminal until Reset
- [ ] 4.3 Implement timing and actions: `update(time, delta)` accumulator advancing `speed` chronons/sec (capped steps/frame, no catch-up when throttled), Step advances exactly one chronon while paused, speed change while paused does not resume, Reset creates new random world / chronon 0 / clears history/status / resumes at selected speed, auto-start at 10x

## 5. Population History Chart

- [ ] 5.1 Implement `src/ui/Chart.js` (or inline in `SimulationScene`) rendering 500-sample rolling history as green (fish) and blue (shark) lines across bottom, no titles/labels, dynamic Y-scale = max of visible window (min 1), and integrate with `SimulationScene` render loop

## 6. PWA and Polish

- [ ] 6.1 Create `manifest.webmanifest` (relative `start_url: "."`, `display: "standalone"`, circle-based icons), `sw.js` (cache-first for app shell + same-origin assets + CDN `phaser.min.js` for tablet offline after first load), and `assets/` icons (192/512)
- [ ] 6.2 Add JSDoc to every class and every static/public method >8 lines, verify no engine Phaser imports, verify subpath-safe relative URLs, and perform manual verification checklist (fish breed after 3, shark breed after 25, shark starves after 5, extinction messages, 500-sample chart, resize scaling, offline reload)
