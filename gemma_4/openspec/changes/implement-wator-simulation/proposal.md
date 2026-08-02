## Why

Implement a browser-based Wa-Tor simulation as a static ES2020 JavaScript web app using Phaser 4. This project demonstrates a predator-prey cellular automaton with a strict separation between the simulation engine and the rendering layer.

## What Changes

- Create a framework-independent Wa-Tor simulation engine.
- Implement a Phaser 4 rendering layer for the simulation grid, UI controls, and population statistics.
- Implement a rolling population history chart using Phaser Graphics.
- Add PWA support for lightweight installation and offline access.
- Implement an object-oriented entity system for Fish and Sharks.

## Capabilities

### New Capabilities
- `simulation-engine`: The core Wa-Tor logic, including toroidal grid management, entity movement, hunting, and breeding rules.
- `simulation-renderer`: Phaser 4 scenes for rendering the world, handling window resizing, and drawing entities.
- `simulation-ui`: On-screen controls (Pause/Play, Step, Reset, Speed) and live population statistics.
- `population-chart`: A rolling line graph visualizing population trends over time.
- `pwa-support`: Manifest and service worker for PWA capabilities.

### Modified Capabilities
- None

## Impact

- New project structure including `src/simulation`, `src/scenes`, and `src/ui`.
- Dependency on Phaser 4 via CDN.
- No backend or build step required.
