## Why

The repository has a detailed PRD (`prd-v001.md`) describing a browser-based Wa-Tor predator-prey simulation but no implementation. We need to build the complete static web app so the simulation is observable and controllable, with a clean separation between the framework-independent simulation engine and the Phaser-driven rendering/UI layer.

## What Changes

- Add a static ES2020 JavaScript web app that runs a Wa-Tor cellular automaton in the browser.
- Add a framework-independent simulation engine (`src/simulation/`) implementing toroidal grid, fish/shark entities, chronon loop, breeding, eating, and extinction detection.
- Add a Phaser 4.x rendering and control layer (`src/scenes/`, `src/ui/`) that owns the full browser window: world display, stats panel, controls, and rolling population history chart.
- Add PWA support (`manifest.webmanifest`, `sw.js`, `assets/`) for app-shell caching.
- Add `index.html` loading Phaser from a CDN script tag and bootstrapping the app via ES2020 modules.
- All rendering uses Phaser `Graphics` drawing (no sprites, no DOM overlays).
- All classes documented with JSDoc; static methods and public methods over 8 lines documented with JSDoc.

## Capabilities

### New Capabilities
- `simulation-engine`: Toroidal grid, entity lifecycle (fish/shark), chronon stepping loop with randomized turn order, breeding, eating, starvation, extinction detection, and population tracking. Independent of Phaser.
- `rendering-ui`: Phaser 4.x scenes owning the full window — world rendering via `Graphics`, stats panel, control buttons (play/pause/step/reset/speed), and rolling population history chart. Responsive layout for wide and tablet/narrow viewports.
- `pwa-shell`: Lightweight PWA support via web manifest and service worker caching the app shell and same-origin assets.

### Modified Capabilities
<!-- None — this is a greenfield implementation with no existing specs. -->

## Impact

- **New files**: `index.html`, `sw.js`, `manifest.webmanifest`, `src/main.js`, `src/config.js`, `src/simulation/{WatorSimulation,Entity,Fish,Shark}.js`, `src/scenes/{BootScene,SimulationScene}.js`, `src/ui/{PhaserButton,HistoryChart}.js`, `assets/` directory.
- **Dependencies**: Phaser 4.x loaded from CDN (`https://cdn.jsdelivr.net/npm/phaser@4.1.0/dist/phaser.min.js`); no build step, no npm runtime dependency.
- **Deployment**: Static site, deployable from a repository subpath; hosted at `https://keithrieck.github.io/sdd_openspec_wator/glm_5.2/index.html`.
- **No existing code affected**: Greenfield project; no prior implementation to migrate.
