## Why

The repository currently contains product requirements and planning guidance for a Wa-Tor simulation, but no runnable application. This change will turn the requirements in `prd-v001.md` into a static, browser-based Phaser web app that makes the predator-prey rules observable and controllable while keeping the simulation engine framework-independent.

## What Changes

- Add a static ES2020 web application loaded from `index.html`.
- Load Phaser 4.x from a CDN and use Phaser-native scenes, graphics, text, and pointer input for the full application window.
- Implement a framework-independent Wa-Tor engine with a flat toroidal grid and class-based entity records using separate `Entity`, `Fish`, and `Shark` files.
- Implement randomized chronon turns, movement, reproduction, shark hunting, energy loss, starvation, extinction, reset, and rolling population history according to the PRD.
- Add Phaser scenes for bootstrapping and simulation presentation.
- Add UI helpers under `src/ui` for layout, statistics, controls, and the population history chart.
- Add responsive layout behavior for wide and narrow/tablet viewports without changing the simulation dimensions.
- Add lightweight PWA metadata, same-origin app-shell caching, and circle-based application icons.
- Keep model constants easy to change in code and expose simulation state through query methods rather than Phaser-dependent state access.

## Capabilities

### New Capabilities

- `wator-simulation`: Framework-independent Wa-Tor world state, entity lifecycle, chronon rules, population history, and query-oriented simulation state.
- `wator-web-app`: Phaser-based rendering, responsive layout, controls, statistics, chart, startup behavior, and PWA shell.

### Modified Capabilities

- None.

## Impact

- Adds the application files described in `prd-v001.md`, including `index.html`, `src/main.js`, `src/config.js`, simulation classes, scenes, UI helpers, `sw.js`, `manifest.webmanifest`, and `assets/`.
- Introduces no backend, build tool, package dependency, TypeScript, React, or automated test framework.
- Runtime depends on the Phaser 4 CDN script on first load unless it has already been cached.
- Static hosting must preserve relative/subpath-safe module, manifest, and service-worker URLs.
