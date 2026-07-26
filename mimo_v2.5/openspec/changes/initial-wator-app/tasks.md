## 1. Project Setup

- [x] 1.1 Create index.html with Phaser 4 CDN script tag and ES module entry point
- [x] 1.2 Create src/config.js with all simulation constants (grid dimensions, densities, breed times, energy values, colors, speed options)
- [x] 1.3 Create src/main.js as the Phaser.Game bootstrap entry point

## 2. Simulation Engine — Data Model

- [x] 2.1 Create src/simulation/Entity.js base class with id, type, x, y, breedAge, alive, bornThisChronon, and abstract act(grid), age(), canBreed(), die(), createBaby() methods
- [x] 2.2 Create src/simulation/Grid.js with flat cell array, entity map, toroidal wrapping, get/set/move/remove/spawn, neighbor queries, and allEntityIds()

## 3. Simulation Engine — Entity Behavior

- [x] 3.1 Create src/simulation/Fish.js extending Entity with act(grid): find empty neighbors, move, breed, age
- [x] 3.2 Create src/simulation/Shark.js extending Entity with act(grid): energy decrement, starvation death, hunt fish, move, breed, age

## 4. Simulation Engine — Orchestration

- [x] 4.1 Create src/simulation/WatorSimulation.js with tick() (shuffle IDs, process entities), fishCount(), sharkCount(), status() (Running/Paused/extinction states), reset()
- [x] 4.2 Wire random initial population: populate grid with fish at 30% density and sharks at 5% density

## 5. Phaser Rendering — Scene Structure

- [x] 5.1 Create src/scenes/BootScene.js that transitions immediately to SimulationScene
- [x] 5.2 Create src/scenes/SimulationScene.js that owns WatorSimulation, runs the update loop (advance chronons based on speed), and redraws each frame

## 6. Phaser Rendering — World Display

- [x] 6.1 Implement world rendering: draw green circles for fish, slightly larger blue circles for sharks, background for empty cells, using Phaser Graphics
- [x] 6.2 Implement responsive layout: compute world display area from window size, preserve grid aspect ratio, center the world

## 7. Phaser Rendering — UI Elements

- [x] 7.1 Implement stats panel (left side): display Chronon count, Fish count, Sharks count, and Status text
- [x] 7.2 Implement controls panel (right side): Play/Pause toggle, Step button, Reset button, and speed buttons (1x, 5x, 10x, 30x, 60x) in one horizontal row
- [x] 7.3 Implement button interaction via Phaser input (pointerdown events on Graphics zones)
- [x] 7.4 Implement Step disabled while running, Play disabled in terminal state, speed change behavior

## 8. Simulation Controls Logic

- [x] 8.1 Implement Play/Pause: toggle simulation running state
- [x] 8.2 Implement Step: advance exactly one chronon when paused, remain paused
- [x] 8.3 Implement Reset: create new random world, set chronon to 0, clear history, resume running at selected speed
- [x] 8.4 Implement extinction detection: auto-pause on fish/shark extinction, display terminal status ("Sharks extinct", "Fish extinct", "Ecosystem collapsed"), require Reset

## 9. Population History Chart

- [x] 9.1 Implement rolling 500-chronon population data store (one fish/shark sample per chronon, discard oldest beyond 500)
- [x] 9.2 Implement chart rendering at bottom of window: green fish line, blue shark line, no text labels, using Phaser Graphics

## 10. Responsive Layout and Resize

- [x] 10.1 Implement wide-window layout: stats left, world center, controls right, chart bottom
- [x] 10.2 Implement narrow-window/tablet reflow: preserve world aspect ratio, keep controls usable
- [x] 10.3 Implement browser resize handler: recompute layout and scale without changing grid dimensions

## 11. PWA Support

- [x] 11.1 Create manifest.webmanifest with app name, icons, display mode, and start URL
- [x] 11.2 Create sw.js service worker to cache app shell and same-origin assets
- [x] 11.3 Create assets/ directory with PWA icons (circles suggesting shark and fish)
- [x] 11.4 Register service worker in index.html
