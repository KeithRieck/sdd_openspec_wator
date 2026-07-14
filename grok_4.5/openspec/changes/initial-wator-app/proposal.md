## Why

There is no Wa-Tor application in this repository yet. We need a browser-based predator-prey simulation that prioritizes correct chronon rules, stays static-site deployable, and gives users immediate visual feedback with simple run controls. Building the first full vertical slice now establishes the engine, Phaser UI, and PWA shell against `prd-v001.md`.

## What Changes

- Add a static ES2020 web app that loads Phaser 4 from CDN and runs a Wa-Tor simulation immediately on launch.
- Add a Phaser-independent simulation engine with OO entities (`Entity`, `Fish`, `Shark`) and a toroidal grid owned by `WatorSimulation`.
- Add Phaser scenes and UI components for world rendering, stats, speed/run controls, and a rolling population history chart.
- Add programmer-facing constants for grid size, densities, breed times, shark energy, colors, and speeds.
- Add lightweight PWA support (`manifest.webmanifest`, `sw.js`, icons) with best-effort offline behavior.
- No user-facing parameter editors, no DOM overlays, no build step, no automated tests, and no tablet-specific reflow work in this change.

## Capabilities

### New Capabilities
- `wator-simulation`: Chronon rules, entity lifecycle, toroidal movement, breeding, shark energy/starvation, extinction detection, and population history sampling.
- `simulation-ui`: Phaser-native layout and controls—world display, stats panel, play/pause/step/reset, speed selection, and unlabeled population chart.
- `app-shell`: Static bootstrap, config constants, Boot/Simulation scenes, CDN Phaser loading, and lightweight PWA assets/service worker.

### Modified Capabilities
- None (greenfield repository; no existing specs).

## Impact

- New project files under repository root: `index.html`, `src/**`, `assets/**`, `sw.js`, `manifest.webmanifest`.
- Runtime dependency: Phaser 4.x via CDN (`phaser@4.1.0` acceptable).
- Deployable as a static site from a repository subpath (e.g. GitHub Pages).
- No backend, package build pipeline, or Node.js runtime requirement for the shipped app.
