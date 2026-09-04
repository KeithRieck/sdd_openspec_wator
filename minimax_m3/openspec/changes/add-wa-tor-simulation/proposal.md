## Why

The repository currently contains only a PRD, an OpenSpec scaffold, a single Phaser button helper, and two PWA icon PNGs. There is no running application. This change introduces the Wa-Tor predator-prey cellular automaton as a static, browser-based web app per `prd-v001.md`, so the simulation can be observed and controlled end-to-end in a browser without a build step or backend.

## What Changes

- Add a framework-independent simulation engine (`WatorSimulation`, `Grid`, `Fish`, `Shark`) that implements the Wa-Tor rules from `prd-v001.md` with no Phaser dependencies.
- Add a Phaser 4 application shell (`index.html`, `src/main.js`, `src/config.js`, `src/scenes/BootScene.js`, `src/scenes/SimulationScene.js`) that loads Phaser from a CDN script tag and drives the engine from a single scene.
- Add Phaser-native UI: stats panel (Chronon, Fish, Sharks, Status) on the left, controls (Play/Pause, Step, Reset, speed row `1x`/`5x`/`10x`/`30x`/`60x`) on the right, world in the center, and a rolling 500-chronon population history chart across the bottom — all rendered with Phaser `Graphics` and the existing `PhaserButton` class.
- Add a responsive layout that reflows for narrow viewports while preserving the world's 10:7 aspect ratio.
- Add lightweight PWA support: `manifest.webmanifest` referencing the existing `assets/icon-192.png` and `assets/icon-512.png`, plus a service worker that caches the app shell and same-origin assets (Phaser stays network-only).
- Add accumulator-based timing in the scene's `update()` loop that advances chronons at the selected speed without catch-up compensation.

## Capabilities

### New Capabilities

- `wa-tor`: The Wa-Tor predator-prey simulation, including the framework-independent engine, the Phaser-native UI, the responsive layout, the timing model, and the PWA shell. This single capability covers the full app because the PRD treats the simulation, UI, and PWA shell as one cohesive deliverable.

### Modified Capabilities

None. This is the first capability in the project; no existing specs are present under `openspec/specs/`.

## Impact

- New files: `index.html`, `src/main.js`, `src/config.js`, `src/simulation/WatorSimulation.js`, `src/simulation/Grid.js`, `src/simulation/Fish.js`, `src/simulation/Shark.js`, `src/scenes/BootScene.js`, `src/scenes/SimulationScene.js`, `manifest.webmanifest`, `sw.js`.
- Existing files reused: `src/ui/PhaserButton.js` (no changes), `assets/icon-192.png`, `assets/icon-512.png` (no changes).
- External dependency: Phaser 4.x loaded from `https://cdn.jsdelivr.net/npm/phaser@4.1.0/dist/phaser.min.js` via a `<script>` tag in `index.html`.
- Deployment target: GitHub Pages subpath `https://keithrieck.github.io/sdd_openspec_wator/minimax_m3/index.html`, which constrains the service worker `scope` and manifest `start_url`.
- No build step, no Node.js runtime requirement, no automated tests, no backend.
