## Why

Implement a browser-based Wa-Tor simulation as defined in `prd-v001.md` to demonstrate a correct predator-prey cellular automaton using an object-oriented approach in JavaScript.

## What Changes

- Create a framework-independent simulation engine implementing Wa-Tor rules.
- Implement a Phaser 4 rendering layer for the world, stats, controls, and population history.
- Establish a "Pull" architecture where the renderer observes the simulation state.
- Implement a responsive UI layout that adapts between wide and narrow (tablet) views.
- Add PWA support for static site deployment.

## Capabilities

### New Capabilities
- `simulation-engine`: The core Wa-Tor logic, including toroidal grid management, entity lifecycle (Fish/Shark), and chronon advancement.
- `rendering-layer`: Phaser 4 implementation of the world display, stats panel, control interface, and rolling history chart.
- `pwa-support`: Manifest and service worker configuration for offline-capable static deployment.

### Modified Capabilities
None.

## Impact

- New project structure including `src/simulation`, `src/scenes`, and `src/ui`.
- Dependency on Phaser 4 via CDN.
- No backend or build step required.
