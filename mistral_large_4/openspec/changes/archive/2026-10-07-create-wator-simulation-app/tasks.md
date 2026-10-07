# Tasks

## 1. Project Setup and Configuration

- [x] 1.1 Create `src/config.js` with Config class containing all simulation constants (grid dimensions, densities, breed times, energy values, colors, speed options) and verify the file exports correctly with all required constants
- [x] 1.2 Create `index.html` with Phaser 4 CDN script tag, ES2020 module loading, viewport meta tag, and manifest link, and verify the HTML structure is valid
- [x] 1.3 Create `manifest.webmanifest` with app name, icons (192px and 512px), display mode standalone, and theme colors, and verify the manifest is valid JSON
- [x] 1.4 Create `sw.js` service worker with install event caching app shell (index.html, src/**, assets/**) and fetch event with cache-first strategy, and verify the service worker syntax is valid

## 2. Simulation Engine - Core Classes

- [x] 2.1 Create `src/simulation/RandomNumberGenerator.js` with class wrapping Math.random() providing next(), nextInt(), shuffle(), and pickRandom() methods, and verify all methods return expected value ranges
- [x] 2.2 Create `src/simulation/Entity.js` abstract base class with id, position, breedAge, breedTime, bornThisChronon, isAlive properties and act(), canBreed(), resetBreedAge(), age(), markBorn(), clearBornFlag() methods, and verify the class has proper JSDoc documentation
- [x] 2.3 Create `src/simulation/Fish.js` extending Entity with type='fish' and act() method implementing fish movement and breeding logic per PRD requirements #14-17, and verify fish move to empty cells and breed correctly
- [x] 2.4 Create `src/simulation/Shark.js` extending Entity with energy, initialEnergy, energyGain, energyCostPerChronon properties and act(), eat(), loseEnergy() methods implementing shark energy management, hunting, and breeding per PRD requirements #18-26, and verify sharks eat fish, lose energy, die at 0 energy, and breed correctly

## 3. Simulation Engine - WatorSimulation

- [x] 3.1 Create `src/simulation/WatorSimulation.js` with constructor accepting config, grid array initialization, entity map, chronon counter, and status tracking, and verify the simulation initializes with correct grid dimensions and population
- [x] 3.2 Implement `step()` method in WatorSimulation that collects living entity IDs, shuffles them with RNG, processes each entity with skip logic for dead/newborn entities, records population history, and checks for extinction, and verify one chronon advances correctly with randomized turn order
- [x] 3.3 Implement `reset()` method in WatorSimulation that creates a new random world, resets chronon to 0, clears terminal status, and clears population history, and verify reset produces a fresh simulation state
- [x] 3.4 Implement helper methods in WatorSimulation: getNeighbors() with toroidal wrapping, getEmptyNeighbors(), getFishNeighbors(), moveEntity(), createEntity(), removeEntity(), and verify neighbor calculations wrap correctly at edges
- [x] 3.5 Implement `getStats()` method returning chronon, fishCount, sharkCount, and status, and `getHistory()` returning the rolling 500-sample population history, and verify stats and history are accurate
- [x] 3.6 Implement extinction detection in WatorSimulation that sets terminal status to "Sharks extinct", "Fish extinct", or "Ecosystem collapsed" when appropriate, and verify terminal states are detected correctly

## 4. Phaser Scenes

- [x] 4.1 Create `src/scenes/BootScene.js` with preload() and create() methods that transition to SimulationScene, and verify the scene loads without errors
- [x] 4.2 Create `src/scenes/SimulationScene.js` with create() method that initializes WatorSimulation, creates world graphics, UI panels, and sets up resize handling, and verify the scene displays the simulation
- [x] 4.3 Implement `update(time, delta)` method in SimulationScene with time accumulator that advances simulation at selected speed (1x, 5x, 10x, 30x, 60x chronons/sec), and verify simulation advances at correct rate for each speed
- [x] 4.4 Implement world rendering in SimulationScene that draws water background, fish as green circles, and sharks as larger blue circles using Phaser Graphics with no grid lines, and verify all entities are rendered at correct positions
- [x] 4.5 Implement responsive layout in SimulationScene that positions stats on left, world in center, controls on right, and chart at bottom for wide windows, and reflows for narrow windows (minimum 744px width), and verify layout adapts on browser resize

## 5. UI Components

- [x] 5.1 Create `src/ui/StatsPanel.js` that displays Chronon, Fish, Sharks, and Status text on the left side using Phaser Text objects, and verify stats update in real-time as simulation advances
- [x] 5.2 Create `src/ui/ControlsPanel.js` using PhaserButton for Play/Pause, Step, and Reset buttons stacked vertically on the right side, with proper enable/disable logic based on simulation state, and verify buttons respond to clicks and update simulation state
- [x] 5.3 Create `src/ui/SpeedControls.js` using PhaserButton for 1x, 5x, 10x, 30x, 60x buttons in a horizontal row with selected state highlighting, and verify speed changes take effect during running and are remembered when paused
- [x] 5.4 Create `src/ui/HistoryChart.js` that renders a rolling 500-sample population history chart across the bottom using Phaser Graphics with green fish line and blue shark line and no text labels, and verify chart updates each chronon and maintains rolling window

## 6. Main Entry Point

- [x] 6.1 Create `src/main.js` with Phaser game configuration (type: Phaser.AUTO, parent container, scale mode, scenes: [BootScene, SimulationScene]) and game instantiation, and verify the game boots and displays the simulation
- [x] 6.2 Register service worker in `src/main.js` or `index.html` and verify the service worker registers successfully in browser console

## 7. Integration and Verification

- [x] 7.1 Verify the app launches directly into a running simulation at 10x speed with no landing page, and confirm initial population matches 30% fish and 5% shark density
- [x] 7.2 Test all controls: Play/Pause toggles correctly, Step advances exactly one chronon when paused and is disabled when running, Reset creates new world and resumes at selected speed
- [x] 7.3 Test speed controls: all five speeds (1x, 5x, 10x, 30x, 60x) work correctly, selected speed is highlighted, and speed changes work during running and paused states
- [x] 7.4 Test extinction detection: verify "Sharks extinct", "Fish extinct", and "Ecosystem collapsed" statuses appear correctly and auto-pause the simulation with Play disabled
- [x] 7.5 Test responsive layout: verify wide window shows stats left, world center, controls right, chart bottom; verify narrow window (744px) reflows while preserving world aspect ratio and control usability
- [x] 7.6 Test PWA: verify manifest loads correctly, service worker caches assets, app is installable, and app works offline after first load (if Phaser was cached)
- [x] 7.7 Verify all JSDoc documentation requirements: every class has documentation, static methods and public methods over 8 lines have documentation
- [x] 7.8 Verify simulation correctness: fish move only to empty cells, sharks eat adjacent fish before moving to empty cells, energy decrements before movement, breeding leaves newborn in old cell, newborns don't act in birth chronon
