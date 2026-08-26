## 1. Configuration & App Shell

- [ ] 1.1 Create `src/config.js` exporting all model constants (grid 100×70, fish density 0.30, shark density 0.05, fishBreedTime 3, sharkBreedTime 25, initialSharkEnergy 5, sharkEnergyGain 3, sharkEnergyCostPerChronon 1, colors, speed options [1,5,10,30,60], default speed 10, history window 500, layout breakpoint) and verify the module imports cleanly in the browser console (wator-simulation R12, simulation-app R2)
- [ ] 1.2 Create `index.html` that loads Phaser 4.x from a CDN script tag, loads `src/main.js` as an ES2020 module, registers `sw.js`, and links `manifest.webmanifest`, using relative paths for subpath deployment; verify the page loads Phaser and the module with no console errors (simulation-app R2, pwa R1)
- [ ] 1.3 Create `src/main.js` that boots the Phaser game with `BootScene` and `SimulationScene` and a full-window canvas; verify the canvas fills the browser window on load (simulation-app R1, R3)

## 2. Simulation Engine (pure JS, no Phaser)

- [ ] 2.1 Create `src/simulation/Entity.js` with a base `Entity` class (id, type, x, y, breedAge, alive, bornThisChronon, abstract `act(sim)`) and a JSDoc class comment; verify the class instantiates and exposes the fields (wator-simulation R8)
- [ ] 2.2 Create `src/simulation/Fish.js` extending `Entity` implementing `act(sim)`: move to a random adjacent empty cell; if breeding-ready leave a new fish in the old cell and reset breedAge to 0, else if blocked reset to 0 when ready / age when not; verify against wator-simulation R3 scenarios with a manual engine run
- [ ] 2.3 Create `src/simulation/Shark.js` extending `Entity` implementing `act(sim)`: decrement energy first, die at 0, else eat a random adjacent fish (+energy gain) or move to a random adjacent empty cell, with breeding leaving a newborn shark (initialSharkEnergy) and the same breed-timer reset/age rules; verify against wator-simulation R4–R7 scenarios with a manual engine run
- [ ] 2.4 Create `src/simulation/WatorSimulation.js` with the flat grid array + entity Map, toroidal `emptyNeighbors`/`fishNeighbors`, `moveEntity`/`spawnFish`/`spawnShark`/`kill` primitives, randomized-sequential `step()` (skip dead and born-this-chronon), chronon increment, rolling 500-sample history (including the initial sample), extinction detection with terminal status, and `reset()`; verify a scripted run produces correct counts, a terminal status on extinction, and a 500-capped history (wator-simulation R1–R11)
- [ ] 2.5 Verify the engine has no Phaser imports and runs standalone (e.g., a throwaway `node`/console harness stepping 1000 chronons) confirming framework independence (wator-simulation R1–R12, design D1)

## 3. Scenes & World Rendering

- [ ] 3.1 Create `src/scenes/BootScene.js` that starts `SimulationScene` and a JSDoc class comment; verify the boot transitions to the simulation scene (simulation-app R1)
- [ ] 3.2 Create `src/scenes/SimulationScene.js` `create()` that owns a `WatorSimulation`, a single world `Graphics`, and the stats/controls/chart UI, starting the sim running at 10x; verify the app launches directly into a running simulation with no landing page (simulation-app R1, ui-controls R1)
- [ ] 3.3 Implement world rendering in `SimulationScene`: fill water background, draw each fish as a green circle and each shark as a slightly larger blue circle via `Graphics`, no grid lines, redrawn immediately on state change; verify circles render correctly and update per chronon with no movement animation (simulation-app R4)
- [ ] 3.4 Implement speed-based scheduling in `SimulationScene.update()` using a time accumulator (step while `acc >= 1000/cps`) with a per-frame step cap and no catch-up compensation; verify the sim advances at the selected rate and a speed change takes effect on subsequent updates (simulation-app R5)

## 4. UI Controls & Stats

- [ ] 4.1 Create `src/ui/StatsPanel.js` rendering Chronon, Fish, Sharks, and Status on the left using `PhaserButton`-style `Graphics`/`Text` (no DOM), with an `update()` method; verify values track the live simulation (ui-controls R1)
- [ ] 4.2 Create `src/ui/ControlPanel.js` composing `PhaserButton`s: Play/Pause, Step, Reset each on its own row, plus a horizontal speed row of 1x/5x/10x/30x/60x with the active speed selected; verify the button set and layout render correctly (ui-controls R2, R3)
- [ ] 4.3 Wire control behavior: Play/Pause toggles running, Step advances exactly one chronon while paused and is disabled while running, speed changes apply without resuming when paused, Reset creates a new world (chronon 0, cleared status/history) and resumes at the selected speed; verify each behavior in the browser (ui-controls R2–R5)
- [ ] 4.4 Wire status + terminal behavior: display Running/Paused/terminal messages, auto-pause on extinction, keep Play disabled while terminal and require Reset; verify all status strings and the disabled-Play terminal state (ui-controls R6, R7)

## 5. Population History Chart

- [ ] 5.1 Create `src/ui/PopulationChart.js` that draws the rolling history across the bottom of the window as a green fish line and blue shark line (matching world/stats colors), no titles or text labels, over the 500-chronon window; verify the chart renders both lines and updates as the sim runs (population-chart R1–R3)

## 6. Responsive Layout

- [ ] 6.1 Implement `SimulationScene.layout()` computing regions from canvas size: wide → stats left / world center / controls right / chart bottom; narrow (below the config breakpoint) → world top with stats and controls stacked below and chart at the bottom, preserving the world aspect ratio via `cellSize = min(regionW/gridW, regionH/gridH)` and centering; verify the layout reflows correctly when resizing between wide and narrow and that grid constant changes scale/center without UI edits (simulation-app R6)

## 7. PWA

- [ ] 7.1 Create `manifest.webmanifest` declaring the app name and referencing `assets/icon-192.png` and `assets/icon-512.png`; verify the manifest is valid and the icons resolve (pwa R1)
- [ ] 7.2 Create `sw.js` that precaches the app shell and same-origin assets (cache-first) and leaves the CDN Phaser script to the network; verify the shell is cached on first load and repeat visits work offline once Phaser has loaded (pwa R2, R3)

## 8. Integration Verification

- [ ] 8.1 Run the full app in a browser and verify end-to-end: launch at 10x, play/pause/step/reset, speed changes, live stats, terminal auto-pause with correct status, chart updating, and reflow on resize; confirm no console errors and no DOM overlay (simulation-app R1–R6, ui-controls R1–R7, population-chart R1–R3)
- [ ] 8.2 Verify JSDoc coverage: every class has a class-level doc comment and every static/public method over 8 lines has a doc comment; confirm by reviewing each new source file (prd-v001 AC 54, AC 55)
