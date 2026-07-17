## Why

The repository contains a complete specification (`spec-v001.md`) for a browser-based Wa-Tor predator-prey simulation but no implementation. This change delivers the first working app: a static, no-build, Phaser-rendered Wa-Tor world that a user can watch and control directly in the browser.

## What Changes

- Introduce a framework-independent simulation engine (`WatorSimulation`) that owns all Wa-Tor rules on a toroidal grid — fish/shark movement, breeding, shark energy and starvation — with **no dependency on Phaser**.
- Add a Phaser 4.x app (loaded from CDN, ES2020 modules) that renders the world and all UI **natively** via Phaser `Graphics` (no DOM overlay, no per-cell sprites, no creature sprite art).
- Provide a `BootScene` (asset load → start) and a `SimulationScene` that lays out stats (left), world (center), controls (right), and a rolling population-history chart (bottom).
- Add controls: Play/Pause, Step, Reset, and a speed row (`1x`, `5x`, `10x`, `30x`, `60x`), starting in a running simulation at `10x`.
- Centralize all tunable model constants (grid size, densities, breed times, shark energy values, colors, speed options) in `src/config.js` for easy programmer edits.
- Add lightweight, best-effort PWA support: `manifest.webmanifest`, `sw.js` caching the app shell and same-origin assets, and an `assets/` icon suggesting fish and shark circles.
- Auto-pause with a terminal status on extinction (`Sharks extinct`, `Fish extinct`, `Ecosystem collapsed`).

## Capabilities

### New Capabilities
- `wator-simulation`: The Wa-Tor predator-prey engine and rules — toroidal grid, chronon stepping order, fish/shark movement, breeding, shark energy/starvation, and population accounting, independent of any rendering framework.
- `wator-app`: The Phaser-rendered application shell — boot/scene flow, world rendering via Graphics, responsive stats/controls/chart layout, run/step/reset and speed controls, extinction status, and PWA packaging.

### Modified Capabilities
<!-- None — this is the first change; no existing specs to modify. -->

## Impact

- **New code** (no existing code to modify): `index.html`, `src/main.js`, `src/config.js`, `src/simulation/WatorSimulation.js`, `src/scenes/BootScene.js`, `src/scenes/SimulationScene.js`, `sw.js`, `manifest.webmanifest`, `assets/`.
- **Dependency**: Phaser `4.1.0` loaded from `https://cdn.jsdelivr.net/npm/phaser@4.1.0/dist/phaser.min.js` (CDN `<script>` tag). No Node.js runtime dependency; no build step; no backend.
- **Deployment**: Static-site friendly, including from a repository subpath — app assets and service-worker registration use relative URLs.
- **Constraints**: Per `AGENTS.md`, `design.md` includes Mermaid class diagrams for all classes; every class and every static/public method longer than 8 lines carries JSDoc.
