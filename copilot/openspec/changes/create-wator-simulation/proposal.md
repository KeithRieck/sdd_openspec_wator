# Proposal: Create Wa-Tor Simulation Web App

What: Implement a browser-based Wa-Tor predator-prey simulation as a static ES2020 JavaScript web app that runs entirely in the browser using Phaser for rendering and input. The simulation engine will be framework-independent and implemented as plain JS classes. The deliverable is a static-site-ready app with a service worker and manifest for lightweight PWA support.

Why: The project codifies the Wa-Tor model from `spec-v001.md` into a maintainable, programmer-friendly codebase that emphasizes simulation correctness, programmatic tweakability of model constants, and a Phaser-native UI for consistent cross-platform rendering.

Scope (in):
- Pure client-side implementation; no backend or build step.
- Engine implemented as framework-independent ES2020 modules.
- Phaser 4.x used for full-window rendering via `Graphics`.
- UI: play/pause, step, reset, speed buttons, stats, and rolling history chart.
- PWA: `manifest.webmanifest` and `sw.js` for app shell caching (best-effort).

Scope (out):
- No user-facing controls for grid size/densities/seeded RNG.
- No movement animation or per-cell sprite system.

Acceptance criteria
- Follow acceptance criteria from `spec-v001.md` exactly; primary files to be created include `index.html`, `src/main.js`, `src/config.js`, `src/simulation/WatorSimulation.js`, `src/scenes/BootScene.js`, `src/scenes/SimulationScene.js`, `sw.js`, `manifest.webmanifest`, and `assets/`.

Risks
- Phaser CDN dependency affects offline reliability.
- Chart drawing performance may need an offscreen-canvas optimization for tablets.

Outcome
- Ready for implementation: design and task artifacts (in this change) provide sufficient detail to implement the app in small, testable increments.
