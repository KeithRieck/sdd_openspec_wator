## Why

The project needs a browser-based Wa-Tor predator-prey cellular automaton that is correct first and pleasant to watch second. The requirements are fully specified in `prd-v001.md` (57 acceptance criteria), but no implementation, OpenSpec proposal, design, or task artifacts exist yet. This change turns that PRD into a buildable, spec-driven plan for a static, Phaser 4 web app.

## What Changes

- Add a framework-independent Wa-Tor simulation engine (toroidal grid, entity records, randomized-sequential chronon stepping, extinction detection, rolling population history).
- Add an object-oriented entity model: a common `Entity` base class with `Fish` and `Shark` subclasses, each owning its chronon behavior.
- Add a Phaser 4 app shell that owns the full window: a `BootScene` and a `SimulationScene` that render the world with `Graphics` (no sprites, no grid lines) and schedule chronons by selected speed.
- Add Phaser-native UI: a left stats panel (Chronon / Fish / Sharks / Status), a right control panel (Play/Pause, Step, Reset rows plus a horizontal speed row of `1x/5x/10x/30x/60x`), and a bottom rolling population history chart.
- Add responsive layout that reflows on narrow/tablet viewports while preserving the world aspect ratio.
- Add lightweight PWA support (manifest + service worker caching the app shell and same-origin assets), with CDN Phaser load behavior left to the network.
- Keep all model parameters as code constants in a single config module.

## Capabilities

### New Capabilities
- `wator-simulation`: The pure, Phaser-independent simulation engine — toroidal grid, entity records, chronon stepping rules for fish and sharks, energy/starvation, breeding, extinction status, and rolling population history.
- `simulation-app`: The Phaser 4 application shell — scene lifecycle, `Graphics`-based world rendering, speed-based chronon scheduling, and responsive layout/reflow.
- `ui-controls`: The Phaser-native on-screen controls and readouts — stats panel, action buttons, speed segmented control, and status display with their enable/disable and terminal-state behavior.
- `population-chart`: The bottom rolling population history chart — one sample per chronon over a 500-chronon window, drawn with the world's fish/shark colors and no text labels.
- `pwa`: Lightweight progressive web app support — web manifest, icons, and a service worker that caches the app shell and same-origin assets.

### Modified Capabilities
<!-- None. This is a greenfield app; no existing specs are modified. -->

## Impact

- **New files**: `index.html`, `src/main.js`, `src/config.js`, `src/simulation/WatorSimulation.js`, `src/simulation/Entity.js`, `src/simulation/Fish.js`, `src/simulation/Shark.js`, `src/scenes/BootScene.js`, `src/scenes/SimulationScene.js`, `src/ui/StatsPanel.js`, `src/ui/ControlPanel.js`, `src/ui/PopulationChart.js`, `sw.js`, `manifest.webmanifest`.
- **Existing files**: `src/ui/PhaserButton.js` (already present, reused by the control panel); `assets/icon-192.png` and `assets/icon-512.png` (already present, referenced by the manifest).
- **Dependencies**: Phaser 4.x loaded from a CDN script tag in `index.html`; ES2020 modules; no build step, no backend, no Node.js runtime requirement.
- **Systems**: Static-site deployable, including from a repository subpath (relative asset paths).
