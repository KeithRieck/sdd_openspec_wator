# Tasks: Add Wa-Tor Simulation Web App

## 1. App Shell & Config

- [x] 1.1 Create `index.html` with Phaser 4.1.0 CDN script tag, ES2020 module entry (`src/main.js`), manifest link, and service worker registration (AS-R1, AS-R2, AS-R3; AC 2, 3)
- [x] 1.2 Create `src/config.js` exporting all constants: grid 100x70, densities 30%/5%, breed times 3/25, shark energy 5/3/1, speeds [1,5,10,30,60] with default 10x, colors, history length 500, min world width breakpoint (AS-R4; AC 53)
- [x] 1.3 Create `src/main.js` Phaser game config (resize-aware Scale Manager) and register `BootScene` + `SimulationScene` (AS-R2; AC 3, 5)

## 2. Simulation Engine

- [x] 2.1 Create `src/simulation/Entity.js` abstract base class: id, pos, breedAge, bornChronon, shared movement/breeding plumbing (SE-R1, SE-R3, SE-R3a; AC 4, 27)
- [x] 2.2 Create `src/simulation/Fish.js` extending `Entity` with fish act/spawn behavior (SE-R3a, SE-R6)
- [x] 2.3 Create `src/simulation/Shark.js` extending `Entity` with energy, eating, and shark act/spawn behavior (SE-R3a, SE-R7, SE-R8)
- [x] 2.4 Create `src/simulation/WatorSimulation.js` with entity registry (Map by id), flat grid array of entity references, position indexing, and shared helpers (`neighbors`, `moveEntity`, `addEntity`, `removeEntity`) (SE-R1, SE-R3; AC 4, 27)
- [x] 2.5 Implement `reset()` / constructor initialization: random non-overlapping placement at configured densities (SE-R2; AC 6, 7)
- [x] 2.6 Implement toroidal orthogonal `neighbors()` helper (SE-R4; AC 10)
- [x] 2.7 Implement `stepChronon()`: snapshot IDs, Fisher–Yates shuffle, skip dead/eaten/newborn entities, polymorphic `entity.act(sim)` dispatch (SE-R5, SE-R3a; AC 11–13)
- [x] 2.8 Implement `Fish.act()`: random empty-cell move, breeding on move, blocked-reset and aging rules (SE-R6; AC 14–17)
- [x] 2.9 Implement `Shark.act()` in fixed order: energy decrement → starvation removal → eat/move → breeding with `initialSharkEnergy` newborn (SE-R7, SE-R8; AC 18–26)
- [x] 2.10 Implement extinction detection and terminal status reporting including same-chronon collapse (SE-R9; AC 37–40)

## 3. Scenes & Rendering

- [x] 3.1 Create `src/scenes/BootScene.js` to preload icon assets and start `SimulationScene` (design D3)
- [x] 3.2 Create `src/scenes/SimulationScene.js` owning the simulation, history, running/speed/terminal state (design D3)
- [x] 3.3 Implement `renderWorld()` with a single `Graphics` object: water background, green fish circles, larger blue shark circles, no grid lines (RE-R1, RE-R2; AC 28, 50)
- [x] 3.4 Implement immediate redraw on state change with no animation (RE-R3; AC 29)
- [x] 3.5 Implement world scaling/centering from grid constants and recompute on resize without changing grid dims (RE-R4, RE-R5; AC 8, 9)

## 4. Controls & Status UI

- [x] 4.1 Create `src/ui/Button.js` Phaser-native button helper (rectangle + text + pointer events, enabled/disabled states) (RE-R6; AC 5)
- [x] 4.2 Implement stats panel (Chronon, Fish, Sharks, Status) positioned left of world in wide mode (CS-R2; AC 30)
- [x] 4.3 Implement controls panel: speed row [1x,5x,10x,30x,60x] + Play/Pause, Step, Reset each on own row, right of world in wide mode (CS-R1; AC 31–33)
- [x] 4.4 Implement launch state: running at 10x immediately, no landing screen (CS-R3; AC 1)
- [x] 4.5 Implement time accumulator in `update()` honoring speed, disabling Step while running, live speed changes (CS-R4; AC 34, 48, 49)
- [x] 4.6 Implement paused behavior: Step advances exactly one chronon with render + chart sample; paused speed changes don't resume (CS-R5; AC 35)
- [x] 4.7 Implement Reset: new world, chronon 0, cleared status and history, resume at selected speed (CS-R6, PC-R4; AC 36)
- [x] 4.8 Implement status display (Running/Paused/terminal), auto-pause on extinction, Play lockout until Reset (CS-R7; AC 37–43)

## 5. Population Chart

- [x] 5.1 Implement 500-sample rolling history buffer updated once per chronon including manual steps (PC-R2; AC 45)
- [x] 5.2 Implement `renderChart()` across the window bottom with green fish line and blue shark line, no titles or labels (PC-R1, PC-R3; AC 44, 46, 47)

## 6. Responsive Layout

- [x] 6.1 Implement `layout()` with wide mode (stats | world | controls, chart bottom) when available world width >= breakpoint (AS-R5; AC 51)
- [x] 6.2 Implement narrow mode: world full-width top (aspect preserved), stats left / controls right below, chart full-width bottom; verify at 744x1133 (AS-R5; AC 52)
- [x] 6.3 Wire Scale Manager resize events to `layout()` recompute (RE-R5; AC 9)

## 7. PWA

- [x] 7.1 Create `manifest.webmanifest` with name, colors, and circle-motif icons (AS-R7; AC 56)
- [x] 7.2 Create circle-motif icon assets (fish/shark circles) in `assets/` at required sizes (AS-R7)
- [x] 7.3 Create `sw.js` with cache-first strategy for app shell and same-origin assets, network fall-through for CDN (AS-R8; AC 56, 57)

## 8. Documentation & Verification

- [x] 8.1 Add JSDoc to every class, all static methods, and public methods over 8 lines with AC traceability comments (AS-R6, design D7; AC 54, 55)
- [x] 8.2 Manual browser verification: run through all 57 PRD acceptance criteria; verify long-run stability, extinction auto-pause, and both layout modes
- [x] 8.3 Verify static deployment from repo subpath (relative paths, no build step) (AS-R3)
