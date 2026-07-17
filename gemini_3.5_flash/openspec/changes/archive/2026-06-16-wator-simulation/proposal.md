## Why

The project needs a browser-based Wa-Tor simulation implemented using Phaser 4.x, running as a static web application and structured as a Progressive Web App (PWA) that is completely offline-capable. This simulation allows users to configure and observe predator-prey cellular automaton dynamics in real time across different viewports (desktop, tablet, and mobile).

## What Changes

- **NEW**: Create `index.html` to bootstrap the application and load Phaser 4.x from a CDN.
- **NEW**: Create `src/main.js` to configure the Phaser game and register the service worker.
- **NEW**: Create `src/config.js` to store all simulation and UI constants (colors, densities, breed ages, speeds).
- **NEW**: Create `src/simulation/WatorSimulation.js` containing the framework-independent Wa-Tor cellular automaton engine.
- **NEW**: Create `src/scenes/BootScene.js` to handle startup and transition to the main simulation scene.
- **NEW**: Create `src/scenes/SimulationScene.js` to render the grid (using Phaser Graphics only, without Phaser Sprites), stats panel, native control buttons, and the rolling population history chart.
- **NEW**: Create `sw.js` and `manifest.webmanifest` to cache the app shell and external Phaser CDN script for offline PWA behavior.
- **NEW**: Create `assets/` directory with circles-themed PWA icons.

## Capabilities

### New Capabilities
- `wator-simulation`: Complete Phaser 4.x browser application running the Wa-Tor predator-prey cellular automaton simulation using native Graphics and a responsive PWA structure.

### Modified Capabilities
<!-- None -->

## Impact

This is a greenfield implementation. It adds static files, assets, and service workers to the workspace, creating a fully functioning offline-capable PWA web application under the root directory.
