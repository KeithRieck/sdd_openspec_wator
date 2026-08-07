## Why

Create a browser-based Wa-Tor predator-prey cellular automaton simulation as a static ES2020 JavaScript web app using Phaser 4.x. This implements the classic Wa-Tor ecosystem simulation with correct predator-prey behavior, providing an interactive visualization of emergent population dynamics.

## What Changes

- Create a complete static web application with Phaser 4.x for rendering
- Implement the Wa-Tor simulation engine as framework-independent JavaScript classes
- Add Entity, Fish, and Shark classes with proper inheritance hierarchy
- Create WatorSimulation class to manage the grid, entities, and chronon processing
- Add Phaser scenes (BootScene, SimulationScene) for game lifecycle and rendering
- Implement Phaser-native UI for stats, controls, speed settings, and population history chart
- Add PWA support with service worker and manifest
- Create configuration file with all tunable constants

## Capabilities

### New Capabilities
- `wator-simulation`: Core Wa-Tor cellular automaton simulation engine with Entity/Fish/Shark classes
- `phaser-rendering`: Phaser 4.x rendering system for world, stats, controls, and population chart
- `simulation-controls`: Play/pause, step, reset, and speed controls for simulation
- `population-tracking`: Live population statistics and rolling history chart
- `pwa-support`: Progressive Web App support with service worker and manifest

### Modified Capabilities

## Impact

- New project structure with `index.html`, `src/` directory, `sw.js`, and `manifest.webmanifest`
- Phaser 4.x loaded from CDN (https://cdn.jsdelivr.net/npm/phaser@4.1.0/dist/phaser.min.js)
- No backend, no build step, no dependencies beyond Phaser CDN
- All code in ES2020 JavaScript modules
- Deployable as static site from repository subpath
