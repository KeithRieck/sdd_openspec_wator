# Tasks: Implementation Plan for Wa-Tor Web App

This tasks list is ordered for incremental implementation and verification. Each task is intentionally small and testable.

- [x] Scaffold project files
   - Create `index.html` with Phaser CDN script tag and module `src/main.js` import.
   - Add `manifest.webmanifest` and placeholder icons in `assets/`.
   - Add `sw.js` skeleton for app-shell caching.

- [x] Add `src/config.js` constants

- [ ] Implement pure engine (simulation)
   - Create `src/simulation/Entity.js` (abstract), `Fish.js`, `Shark.js`, `Grid.js`, `WatorSimulation.js`.
   - Implement `bornChronon` semantics, `act(sim)` APIs for species, and chronon loop with shuffle.
   - Add a small Node-less test harness HTML page that uses the engine APIs to step and log stats in the console.

- [ ] Implement Phaser scenes & renderer
   - `BootScene.js` and `SimulationScene.js`.
   - `WorldRenderer.js` to draw water, fish, and sharks using `Graphics`.
   - `UIControls.js` to draw buttons and handle clicks.
   - `HistoryChart.js` to render rolling history across bottom.

- [ ] Integrate UI and engine
   - Wire play/pause, step, reset, speed controls.
   - Implement auto-pause on extinction and status display.

- [ ] Accessibility, layout, and resize
   - Implement responsive layout behavior for wide and narrow viewports.

- [ ] Manual verification checklist
   - Verify acceptance criteria in `spec-v001.md` (chronon behavior, breeding, energy, history samples, UI layout).

- [ ] PWA polish
   - Finalize `manifest.webmanifest`, icons, and `sw.js` caching rules.

- [ ] Prepare PR
   - Add README, usage instructions, and short implementation notes.

Notes
- Keep all code ES2020 modules and avoid build tools.
- Use JSDoc comments per spec requirements.
