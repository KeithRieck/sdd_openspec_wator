## Why

The repository has no application code — only `prd-v001.md` and a placeholder `README.md`. A browser-based Wa-Tor predator-prey simulation is required that emphasizes correct cellular-automaton behavior (57 acceptance criteria in `prd-v001.md`) while remaining a static, no-build, Phaser-owned web app deployable from a repository subpath and usable offline on a tablet after first load.

## What Changes

- Create static app shell: `index.html` loading Phaser 4.1.0 from CDN via script tag and bootstrapping ES2020 modules (`src/main.js`), plus `sw.js`, `manifest.webmanifest`, and `assets/` for lightweight PWA support that caches the app shell **and** the CDN Phaser script for offline tablet use.
- Add `src/config.js` centralizing all programmer-facing constants: grid `100×70`, densities `30%` fish / `5%` shark, `fishBreedTime=3`, `sharkBreedTime=25`, `initialSharkEnergy=5`, `sharkEnergyGain=3`, `sharkEnergyCostPerChronon=1`, speeds `[1x,5x,10x,30x,60x]` (default `10x`), and green/blue colors.
- Implement framework-independent simulation engine under `src/simulation/` with OO entity hierarchy: abstract `Entity` base, `Fish extends Entity`, `Shark extends Entity` (adds `energy`), and `WatorSimulation` orchestrator owning a flat `grid` array and `Map<id, Entity>`. Engine enforces toroidal orthogonal movement, randomized chronon order, newborn/eaten skip, fish/shark movement/breeding/energy/starvation rules per AC 10-27.
- Implement Phaser-native rendering and layout in `src/scenes/BootScene.js` and `src/scenes/SimulationScene.js` (plus optional `src/ui/` helpers): Phaser owns the entire window, draws world as `Graphics` circles (no sprites, no grid lines, no animation), scales/centers the world on resize without changing grid dimensions, and uses a wide-only layout (stats left, world center, controls right, history chart full-width bottom).
- Add controls and status: speed row `1x/5x/10x/30x/60x`, action column `Play/Pause`, `Step`, `Reset` with correct enable/disable, chronon-accurate stepping, auto-pause on extinction, and status text (`Running`/`Paused`/`Sharks extinct`/`Fish extinct`/`Ecosystem collapsed`).
- Add rolling population history chart (500 chronons, green/blue lines, no titles/labels) and live stats (Chronon, Fish, Sharks, Status).
- Apply JSDoc to every class and every static/public method >8 lines; keep engine free of Phaser imports.

## Capabilities

### New Capabilities
- `simulation`: Wa-Tor engine — toroidal grid, OO entities (`Entity`/`Fish`/`Shark`), chronon ordering, movement/breeding/energy/starvation rules, flat grid + `Map` state, history sampling.
- `rendering`: Phaser `Graphics` world rendering — water background, green fish / blue shark circles (sharks larger), no sprites/grid lines/animation, immediate per-chronon updates.
- `layout`: Wide-only Phaser-native layout — stats left of world, controls right of world, chart across bottom, world scale/center on resize, aspect-ratio preservation.
- `controls`: Simulation controls and status — auto-start at 10x, Play/Pause/Step/Reset, speed selection, chronon timing, terminal extinction handling, status text and button enablement.
- `app-shell`: Static app shell and PWA — required file structure, ES2020 modules, CDN Phaser loading, subpath-safe URLs, manifest/service worker with CDN caching for offline tablet, JSDoc and config constants.

### Modified Capabilities
- None — greenfield change, no existing specs to modify.

## Impact

- **New files**: `index.html`, `src/main.js`, `src/config.js`, `src/simulation/Entity.js`, `src/simulation/Fish.js`, `src/simulation/Shark.js`, `src/simulation/WatorSimulation.js`, `src/scenes/BootScene.js`, `src/scenes/SimulationScene.js`, `src/ui/*` (Chart/Button helpers), `sw.js`, `manifest.webmanifest`, `assets/` icons.
- **Dependencies**: Phaser 4.1.0 via `https://cdn.jsdelivr.net/npm/phaser@4.1.0/dist/phaser.min.js` (runtime CDN, cached by service worker for offline).
- **Breaking**: None (greenfield).
- **Risks**: CDN offline on first load (AC 57 allows network dependency until cached); no automated tests (manual verification required); `Graphics` draw cost at 60x; cross-origin CDN caching in service worker needs verification.
