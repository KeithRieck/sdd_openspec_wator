## 1. Static shell and configuration

- [ ] 1.1 Add `index.html` that loads Phaser `4.1.0` from the jsDelivr CDN, links `manifest.webmanifest`, and starts `src/main.js` as an ES module; verify the file exists and the script tags match `wator-app` requirement 2
- [ ] 1.2 Add `src/config.js` with grid size, densities, breed times, shark energy values, colors, speed options, history window, and default `10x`; verify every programmer-editable constant from `wator-simulation` requirement 13 and `wator-app` requirement 13 lives in this one module
- [ ] 1.3 Add `src/main.js` that creates a full-window Phaser 4 game with `BootScene` first, then `SimulationScene`, and registers the service worker with a relative URL; verify the game config has no extra scenes and SW registration does not use an absolute site-root path

## 2. Headless simulation engine

- [ ] 2.1 Add `src/simulation/Entity.js` with id, position, breed age, `type` getter, `isBreedingReady()`, `ageOrResetBreed(moved)`, and abstract `act(world)`; verify `Fish` and `Shark` can extend it and the class has JSDoc
- [ ] 2.2 Add `src/simulation/WatorWorld.js` with a flat `Entity|null` grid, toroidal wrap, orthogonal neighbors, `pick()`, `move()`, `spawn()`, and `remove()`; verify west-of-`0` and south-of-last-row wrap (`wator-simulation` requirements 1 and 3) and that the file does not import Phaser
- [ ] 2.3 Add `src/simulation/Fish.js` whose `act(world)` moves to a random empty neighbor and applies fish breeding, including reset-without-child when blocked; verify the method covers `wator-simulation` requirements 5 and 6
- [ ] 2.4 Add `src/simulation/Shark.js` whose `act(world)` spends energy first, dies at `0` before moving, hunts fish before empty water, gains energy on eat, and breeds with `initialSharkEnergy` newborns; verify the method covers `wator-simulation` requirements 7, 8, and 9
- [ ] 2.5 Add `src/simulation/WatorSimulation.js` that `reset()`s via shuffled-cell exact densities, `step()`s by shuffling current IDs, skips dead and newborn IDs, records a 500-sample history, and sets the three extinction statuses; verify default init yields `2100` fish and `350` sharks on `100 x 70` and that `src/simulation/` still has no Phaser imports (`wator-simulation` requirements 2, 4, 10, 11, 12, 14)

## 3. Phaser scenes and UI classes

- [ ] 3.1 Add `src/scenes/BootScene.js` that loads any same-origin PWA icons it needs and starts `SimulationScene` as the last action in `create()` with no landing text; verify launching the game does not stop on a title or help screen (`wator-app` requirement 1)
- [ ] 3.2 Keep `src/ui/PhaserButton.js` as the only on-screen button class and use it for speed, Play/Pause, Step, and Reset; verify no `TextButton` (or other new button class) is added and that selected/disabled/label APIs are used
- [ ] 3.3 Add `src/ui/WorldView.js` that fills water and draws fish as green circles and sharks as larger blue circles with Phaser `Graphics`, no sprites, no grid lines, no movement tweens; verify a snapshot redraws occupancy in place (`wator-app` requirement 4)
- [ ] 3.4 Add `src/ui/StatsPanel.js` that shows Chronon, Fish, Sharks, and Status using the same fish/shark colors; verify labels update from a snapshot and terminal engine text is shown unchanged (`wator-app` requirement 10)
- [ ] 3.5 Add `src/ui/ControlPanel.js` with a single row of `1x` `5x` `10x` `30x` `60x` buttons and Play/Pause, Step, and Reset each on its own row; verify the control geometry matches `wator-app` requirements 8 and 9
- [ ] 3.6 Add `src/ui/HistoryChart.js` that plots the rolling fish and shark series in matching colors with no titles or axis text and a shared Y max of the visible window; verify an empty history and a 500-sample history both render (`wator-app` requirement 11)
- [ ] 3.7 Add `src/scenes/SimulationScene.js` that constructs `WatorSimulation`, lays out wide four-region and stacked narrow views, wires controls, and redraws world/stats/chart after steps; verify a wide window matches `wator-app` requirement 6 and a `744 x 1133` viewport keeps controls tappable (`wator-app` requirements 5 and 7)

## 4. Playback, timing, and resize

- [ ] 4.1 Start the scene running at `10x`, toggle Play/Pause, disable Step while running, and make paused Step apply exactly one chronon; verify status reads `Running` or `Paused` and speed changes do not resume a paused run (`wator-app` requirements 1, 8, 9, 10)
- [ ] 4.2 Implement the clamped-delta accumulator (`min(delta, 1000/30)`, max 4 steps per frame) so selected chronons-per-second apply without hidden-tab catch-up; verify returning to a backgrounded tab does not burst a backlog of chronons (`wator-app` requirement 12)
- [ ] 4.3 On extinction, auto-pause, show the engine terminal status, and disable Play until Reset rebuilds a random world at chronon `0`, clears history, and resumes at the selected speed; verify all three terminal strings from `wator-simulation` requirement 12 lock the UI as in `wator-app` requirement 10
- [ ] 4.4 Recompute layout and world scale on browser resize without changing grid dimensions; verify stretching the window recenters the world and preserves aspect ratio (`wator-app` requirement 5)

## 5. PWA assets and documentation

- [ ] 5.1 Add a relative `manifest.webmanifest` and `sw.js` that cache the app shell and same-origin assets, declaring the existing `assets/icon-192.png` and `assets/icon-512.png` as icons; verify those two files are referenced, no new icon art is created, first-load still depends on the Phaser CDN, and registration works from a repository subpath (`wator-app` requirement 14)
- [ ] 5.2 Add JSDoc to every class and to every static or public method longer than 8 lines, citing spec requirement numbers where a method implements a rule; verify `src/simulation/` remains Phaser-free and the file list in `wator-app` requirement 2 is complete
- [ ] 5.3 Manually verify launch, pause/step/reset, all five speeds, wide and narrow layout, chart drawing, extinction lockout, and static serving from this directory; verify no HTML overlay controls or keyboard shortcuts were added
