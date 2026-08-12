## Why

Create a browser-based Wa-Tor predator-prey simulation that emphasizes correct cellular automaton behavior with a user-friendly Phaser 4 UI. The PRD-v001 defines requirements for a static ES2020 web app with live stats, controls, and population history.

## What Changes

- Add new web app project with Phaser 4 rendering the entire window
- Implement framework-independent Wa-Tor simulation engine with Entity class hierarchy
- Create BootScene and SimulationScene for app lifecycle
- Add Phaser Graphics rendering for world grid, stats, controls, and history chart
- Implement pause/play, step, reset, and speed controls 1x/5x/10x/30x/60x
- Add PWA support with manifest and service worker
- No build step, static site deployable

## Capabilities

### New Capabilities
- `wa-tor-simulation`: Core predator-prey cellular automaton with fish and sharks, toroidal grid, chronon stepping, breeding and energy rules
- `phaser-rendering`: Phaser 4 scene management, Graphics drawing, responsive layout, resize handling
- `ui-controls`: Play/Pause, Step, Reset, speed selection, live stats display
- `population-history`: Rolling 500 chronon chart with green fish and blue shark lines
- `pwa-support`: Manifest and service worker for app shell caching

### Modified Capabilities

## Impact

- New files: `index.html`, `src/main.js`, `src/config.js`, `src/simulation/WatorSimulation.js`, `src/scenes/BootScene.js`, `src/scenes/SimulationScene.js`, `sw.js`, `manifest.webmanifest`, `assets/`
- New dependencies: Phaser 4.x loaded from CDN
- No backend, static site only
