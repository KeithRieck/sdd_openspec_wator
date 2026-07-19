# Proposal: Add Wa-Tor Simulation Web App

## Why

The project needs its first working deliverable: a browser-based Wa-Tor predator-prey simulation implementing the full rule set defined in `prd-v001.md` (57 acceptance criteria). There is currently no application code at all — only requirements. Building it as a static, no-build-step ES2020 web app keeps it deployable to GitHub Pages from a repository subpath.

## What Changes

- New static web app: `index.html`, `src/main.js`, `src/config.js`, `sw.js`, `manifest.webmanifest`, `assets/` (PRD AC #2).
- Framework-independent, object-oriented Wa-Tor simulation engine (`src/simulation/`) implementing toroidal grid, fish/shark movement, breeding, starvation, and per-chronon randomized turn order, with behavior delegated to `Fish` and `Shark` classes extending an `Entity` base class (PRD AC #4, #6–#27).
- Phaser 4 (CDN) rendering layer using `Graphics` drawing only — no sprites, no grid lines, no movement animation (PRD AC #3, #28–#29, #50).
- Phaser-native UI: stats panel (left), controls (right), speed row (`1x/5x/10x/30x/60x`), Play/Pause, Step, Reset, status display with auto-pause on extinction (PRD AC #30–#43).
- Rolling 500-chronon population history chart across the bottom (PRD AC #44–#47).
- Responsive layout: wide mode (stats | world | controls) and narrow mode (world on top, stats left / controls right below, chart bottom) with a width-based breakpoint (PRD AC #51–#52; narrow-mode arrangement decided during exploration — Option B).
- Time model: accumulator in Phaser `update`, advancing chronons at the selected speed with no throttling catch-up (PRD AC #48–#49).
- Lightweight PWA: manifest + service worker caching app shell and same-origin assets; CDN Phaser availability governs first-load/offline behavior (PRD AC #56–#57).
- Data model decision (from exploration): entity records are the single source of truth in a `Map<id, record>`; the flat grid array stores direct entity references (or `null`), not IDs.
- Step-while-pause decision (from exploration): Step advances exactly one chronon, renders immediately, and records a chart sample.

## Capabilities

### New Capabilities
- `simulation-engine`: Pure JS Wa-Tor rules — grid, entities, chronon lifecycle, movement, breeding, starvation, extinction detection. No Phaser dependency.
- `rendering`: Phaser `Graphics`-based world rendering, scaling, centering, and resize handling.
- `controls-and-status`: Play/Pause/Step/Reset, speed selection, stats panel, terminal status handling.
- `population-chart`: Rolling 500-sample history chart rendered across the bottom.
- `app-shell`: Entry point, scenes, config constants, PWA manifest/service worker, responsive layout shell.

### Modified Capabilities

(none — no existing specs)

## Impact

- **New code**: entire `index.html`, `src/`, `sw.js`, `manifest.webmanifest`, `assets/` tree.
- **Dependencies**: Phaser 4.1.0 from jsDelivr CDN (runtime, no npm). No build tooling, no backend.
- **Deployment**: static-site friendly; works from repo subpath (GitHub Pages).
- **Constraints honored**: ES2020 modules, `Math.random()` only, JSDoc on all classes and on public/static methods over 8 lines, programmer-editable constants in `src/config.js`.
