# Proposal: add-wator-web-app

## Why

The project needs a browser-based Wa-Tor predator-prey simulation per `prd-v001.md`. There is currently no application code — only planning artifacts. Building the app now delivers the core product: a correct, observable cellular automaton rendered and controlled entirely through Phaser 4 in a static, deployable web site.

## What Changes

- Add a static ES2020 JavaScript web app with no build step and no backend.
- Load Phaser 4.x from a CDN script tag; own the entire browser window with Phaser-native rendering and input (no DOM overlays).
- Implement a framework-independent Wa-Tor engine: toroidal 100x70 grid, randomized entity turn order, fish/shark movement, breeding, shark hunting and starvation.
- Model entities object-oriented: `Entity` base class extended by `Fish` and `Shark` classes.
- Render the world with Phaser `Graphics` only — green fish circles, slightly larger blue shark circles, water background, no grid lines, no sprites, no animation interpolation.
- Add Phaser-native UI: stats panel (Chronon / Fish / Sharks / Status) on the left, controls (Play/Pause, Step, Reset rows + horizontal speed row 1x/5x/10x/30x/60x) on the right, rolling 500-chronon population history chart across the bottom.
- Add lifecycle behavior: auto-start running at 10x on launch, pause/play, single-step while paused, reset to a fresh random world, terminal extinction statuses (`Sharks extinct`, `Fish extinct`, `Ecosystem collapsed`) with auto-pause.
- Add responsive layout that scales/centers the world for grid-dimension changes, browser resizes, and tablet/narrow viewports (iPad mini 744x1133 CSS px minimum).
- Add lightweight PWA support: `manifest.webmanifest`, service worker caching same-origin assets, canvas-generated icons showing overlapping shark/fish circles.

## Capabilities

### New Capabilities

- `simulation-engine`: Framework-independent Wa-Tor rules — toroidal orthogonal movement, randomized chronon ordering, newborn deferral, death/eaten skipping, fish movement/breeding, shark hunting/energy/starvation/breeding, flat-grid-plus-entity-object state model.
- `world-rendering`: Phaser Graphics rendering of water background and abstract creature circles, immediate per-chronon updates without animation, scaling/centering for grid dimension changes.
- `app-ui-controls`: Phaser-native stats panel, action controls, speed selection row, and their enable/disable/state semantics including terminal-state handling.
- `population-history`: Rolling 500-chronon population sampling and label-free line chart rendering using world colors.
- `responsive-layout`: Layout solving for wide, narrow/tablet, and resize scenarios preserving world aspect ratio and control usability.
- `pwa-static-deploy`: Manifest, service worker caching of app shell and same-origin assets, CDN-based Phaser loading with best-effort offline behavior, static-site deployability from a repository subpath.

### Modified Capabilities

None — this is the initial implementation; `openspec/specs/` is empty.

## Impact

- **New code**: `index.html`, `src/main.js`, `src/config.js`, `src/simulation/{WatorSimulation,Entity,Fish,Shark}.js`, `src/scenes/{BootScene,SimulationScene}.js`, `src/ui/*` (layout solver, stats panel, control panel, button widget, history chart), `sw.js`, `manifest.webmanifest`, `assets/` (PWA icons).
- **Dependencies**: Phaser 4.1.0 via jsdelivr CDN script tag; no Node.js or package dependencies at runtime.
- **Deployment**: Static hosting (GitHub Pages compatible); repository subpath deployment must work.
- **Documentation**: JSDoc comments required on every class and on public/static methods longer than 8 lines.
