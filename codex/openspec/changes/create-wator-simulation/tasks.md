## 1. Static App Shell

- [ ] 1.1 Create `index.html` with a Phaser 4.x CDN script tag and ES2020 module entrypoint.
- [ ] 1.2 Create `src/main.js` to configure Phaser for the full browser window.
- [ ] 1.3 Create `src/config.js` with programmer-editable grid, density, breeding, shark energy, color, speed, and history constants.
- [ ] 1.4 Add `src/scenes/BootScene.js` and register it before the simulation scene.

## 2. Simulation Engine

- [ ] 2.1 Create `src/simulation/WatorSimulation.js` with a flat grid array, stable entity records, and framework-independent state APIs.
- [ ] 2.2 Implement toroidal orthogonal neighbor lookup and random choice helpers using `Math.random()`.
- [ ] 2.3 Implement randomized chronon turn snapshots so each current surviving entity acts at most once and newborn entities wait until the next chronon.
- [ ] 2.4 Implement fish movement, breeding, breed timer aging, and blocked breeding-ready timer reset behavior.
- [ ] 2.5 Implement shark energy decrement, immediate starvation death, fish eating, energy gain, empty-cell movement, breeding, newborn energy, and blocked breeding-ready timer reset behavior.
- [ ] 2.6 Implement population counts, chronon tracking, reset state, history sampling inputs, and extinction status detection.

## 3. Phaser Simulation Scene

- [ ] 3.1 Create `src/scenes/SimulationScene.js` to own Phaser-native rendering, layout, input, and simulation update timing.
- [ ] 3.2 Render the water background and fish/shark abstract circles with Phaser `Graphics`, using no sprites, grid lines, or movement animation.
- [ ] 3.3 Implement responsive layout that places stats left, world center, controls right, and history chart bottom on wide screens.
- [ ] 3.4 Implement tablet/narrow layout reflow that preserves world aspect ratio and keeps controls usable at `744 x 1133` CSS pixels.
- [ ] 3.5 Recompute rendering scale, centering, and UI positions on browser resize without changing simulation grid dimensions.
- [ ] 3.6 Draw Chronon, Fish, Sharks, and Status stats with correct status strings.

## 4. Controls and Timing

- [ ] 4.1 Add Phaser-native speed buttons for `1x`, `5x`, `10x`, `30x`, and `60x` in one horizontal row.
- [ ] 4.2 Add Play/Pause, Step, and Reset controls with each action on its own row.
- [ ] 4.3 Disable Step while running and allow speed changes to affect subsequent updates.
- [ ] 4.4 Allow Step while paused to advance exactly one chronon without resuming.
- [ ] 4.5 Reset to a new random world at chronon `0`, clear terminal status and population history, and resume at the selected speed.
- [ ] 4.6 Advance chronons from Phaser update timing according to the selected chronons-per-second speed without hidden-tab catch-up compensation.
- [ ] 4.7 Auto-pause on fish, shark, or combined extinction; display `Fish extinct`, `Sharks extinct`, or `Ecosystem collapsed`; disable Play while terminal.

## 5. Population History and PWA

- [ ] 5.1 Store one population history sample per chronon for a rolling window of `500` chronons.
- [ ] 5.2 Render the history chart across the bottom of the window using fish green and shark blue lines with no chart titles or labels.
- [ ] 5.3 Add `manifest.webmanifest` with app metadata and icon references.
- [ ] 5.4 Add `sw.js` to cache the app shell and same-origin assets while leaving first-load Phaser CDN availability network-dependent.
- [ ] 5.5 Add PWA icon assets under `assets/` using circle artwork that suggests fish and shark symbols.

## 6. Documentation and Verification

- [ ] 6.1 Add JSDoc comments for every class.
- [ ] 6.2 Add JSDoc comments for every static method and public method longer than 8 lines.
- [ ] 6.3 Manually verify launch, pause/play, step, reset, speed changes, terminal states, resize behavior, and population history in a browser.
- [ ] 6.4 Manually inspect simulation behavior for orthogonal wrapping, randomized turns, newborn deferral, fish breeding, shark eating, shark starvation, and extinction status correctness.
