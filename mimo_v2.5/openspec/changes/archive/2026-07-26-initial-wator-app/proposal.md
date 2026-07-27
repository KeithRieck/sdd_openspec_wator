## Why

The project needs a browser-based Wa-Tor predator-prey cellular automaton simulation. The PRD (`prd-v001.md`) defines 57 acceptance criteria covering simulation rules, rendering, UI controls, and PWA support. No implementation exists yet — this change creates the entire initial application.

## What Changes

- Create the full project structure: `index.html`, ES2020 module entry point, simulation engine, Phaser 4 scenes, PWA assets, service worker, and manifest.
- Implement the Wa-Tor simulation engine as a framework-independent OO design using an `Entity` → `Fish`/`Shark` class hierarchy, a `Grid` class for toroidal world state, and a `WatorSimulation` orchestrator.
- Implement Phaser 4 rendering: a `BootScene` and `SimulationScene` that draw the world using `Graphics` (green circles for fish, blue circles for sharks), render population stats, controls, and a rolling population history chart.
- Implement simulation controls: Play/Pause, Step, Reset, and speed selection (1x, 5x, 10x, 30x, 60x).
- Implement lightweight PWA support with a service worker and manifest.

## Capabilities

### New Capabilities
- `simulation-engine`: Core Wa-Tor rules, entity classes (Entity, Fish, Shark), grid with toroidal wrapping, and chronon processing. Framework-independent — no Phaser dependency.
- `phaser-rendering`: Phaser 4 scene lifecycle, world rendering via Graphics, responsive layout (stats left, world center, controls right, chart bottom), and browser resize handling.
- `simulation-controls`: Play/Pause, Step, Reset, speed selection, and extinction detection with auto-pause and terminal status display.
- `population-history-chart`: Rolling 500-chronon population history chart drawn with Phaser Graphics lines at the bottom of the window.
- `pwa-support`: Service worker caching app shell, web manifest, and PWA icon assets.

### Modified Capabilities

(none — greenfield project)

## Impact

- **New files**: `index.html`, `src/main.js`, `src/config.js`, `src/simulation/Entity.js`, `src/simulation/Fish.js`, `src/simulation/Shark.js`, `src/simulation/Grid.js`, `src/simulation/WatorSimulation.js`, `src/scenes/BootScene.js`, `src/scenes/SimulationScene.js`, `sw.js`, `manifest.webmanifest`, `assets/` directory.
- **Dependencies**: Phaser 4.x loaded from CDN (`https://cdn.jsdelivr.net/npm/phaser@4.1.0/dist/phaser.min.js`). No npm dependencies, no build step.
- **Deployment**: Static site. Can be served from a repository subpath (e.g., GitHub Pages at `/sdd_openspec_wator/mimo_V2.5/`).
