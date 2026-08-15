## Why

Create a browser-based Wa-Tor predator-prey cellular automaton simulation that emphasizes correct simulation behavior while providing an interactive, responsive UI. The simulation must be framework-independent (no Phaser dependency in the engine) and render using Phaser 4.x Graphics for the full app window.

## What Changes

- New simulation engine (`WatorSimulation`) implementing Wa-Tor rules with Entity/Fish/Shark class hierarchy
- New Phaser-based UI with BootScene and SimulationScene
- New UI components: WorldRenderer, StatsPanel, ControlPanel, HistoryChart
- Configuration module with all constants for easy modification
- PWA support with service worker and manifest
- Static ES2020 module structure with no build step

## Capabilities

### New Capabilities

- `wator-simulation-engine`: Core simulation logic including grid management, entity lifecycle, chronon stepping, and extinction detection
- `wator-entity-model`: Entity base class with Fish and Shark subclasses implementing movement, breeding, and energy rules
- `wator-phaser-ui`: Phaser 4.x scenes and UI components for rendering, controls, stats, and population history chart
- `wator-config`: Centralized configuration constants for grid, densities, breeding, energy, speeds, colors, and rendering
- `wator-pwa`: Service worker and manifest for offline-capable static deployment

### Modified Capabilities

None - this is a new project with no existing capabilities.

## Impact

- New files: `index.html`, `src/main.js`, `src/config.js`, `src/simulation/WatorSimulation.js`, `src/simulation/Entity.js`, `src/simulation/Fish.js`, `src/simulation/Shark.js`, `src/scenes/BootScene.js`, `src/scenes/SimulationScene.js`, `src/ui/WorldRenderer.js`, `src/ui/StatsPanel.js`, `src/ui/ControlPanel.js`, `src/ui/HistoryChart.js`, `sw.js`, `manifest.webmanifest`
- Phaser 4.x loaded from CDN (https://cdn.jsdelivr.net/npm/phaser@4.1.0/dist/phaser.min.js)
- No Node.js build dependencies - runs as static site
- All simulation logic independent of Phaser APIs