# Tasks: Wa-Tor Phaser Web App

## Phase 1: Project Setup

- [x] 1.1 Create `index.html` with Phaser CDN script tag, ES2020 module loader, PWA manifest link, and service worker registration
- [x] 1.2 Create `src/main.js` as the entry point with Phaser game configuration
- [x] 1.3 Create `src/config.js` with all tunable constants (grid dimensions, densities, breed times, shark energy values, colors, speed options)
- [x] 1.4 Create `manifest.webmanifest` with app metadata and icons
- [x] 1.5 Create `sw.js` service worker for PWA app shell caching
- [x] 1.6 Use existing `assets/icon-192.png` and `assets/icon-512.png` (circles suggesting shark and fish symbols)

## Phase 2: Simulation Engine

- [x] 2.1 Create `src/simulation/Entity.js` — Base class with position, breed age, breeding readiness
- [x] 2.2 Create `src/simulation/Fish.js` — Fish behavior (movement, breeding, aging)
- [x] 2.3 Create `src/simulation/Shark.js` — Shark behavior (energy, movement, eating, breeding, starvation)
- [x] 2.4 Create `src/simulation/Grid.js` — Toroidal grid with flat array, neighbor lookup, cell access
- [x] 2.5 Create `src/simulation/RandomGenerator.js` — Single RNG for all random choices
- [x] 2.6 Create `src/simulation/WatorSimulation.js` — Orchestrates chronons, stats, history, extinction checks

## Phase 3: Phaser Scenes and Rendering

- [x] 3.1 Create `src/scenes/BootScene.js` — Preload, layout setup, Phaser game initialization
- [x] 3.2 Create `src/scenes/SimulationScene.js` — World render, controls, stats, chart
- [x] 3.3 Implement world rendering with Phaser Graphics (water background, fish circles, shark circles, no grid lines)
- [x] 3.4 Implement immediate state updates per chronon (no movement animation)

## Phase 4: UI Components

- [x] 4.1 Use existing `src/ui/PhaserButton.js` — Reusable button with normal/hover/active/disabled/selected states
- [x] 4.2 Implement speed buttons (1x, 5x, 10x, 30x, 60x) in one horizontal row
- [x] 4.3 Implement action buttons (Play/Pause, Step, Reset) on separate rows
- [x] 4.4 Implement stats display (Chronon, Fish, Sharks, Status) on the left side

## Phase 5: History Chart

- [x] 5.1 Implement population history recording (one sample per chronon, rolling window of 500)
- [x] 5.2 Implement history chart rendering (horizontal, bottom of window, fish and shark lines in green and blue, no titles or text labels)

## Phase 6: Integration and Polish

- [x] 6.1 Wire up all controls (speed, play/pause, step, reset) to simulation
- [x] 6.2 Implement responsive layout (wide window: stats left, world center, controls right, chart bottom; narrow window: reflow, preserve world aspect ratio)
- [x] 6.3 Implement browser resize handling (recompute layout and rendering scale without changing grid dimensions)
- [x] 6.4 Implement extinction detection and terminal status display (Sharks extinct, Fish extinct, Ecosystem collapsed)
- [x] 6.5 Implement Reset functionality (new random world, chronon 0, clear extinction, clear history, resume at selected speed)
- [x] 6.6 Add JSDoc documentation comments to all classes, static methods, and public methods over 8 lines
- [x] 6.7 Verify all 61 acceptance criteria from `prd-v001.md`

## Verification Checklist

- [ ] App launches directly in running simulation at 10x speed
- [ ] No landing page or instruction screen
- [ ] Grid defaults to 100x70
- [ ] Fish density 30%, shark density 5%
- [ ] All 5 speed options available
- [ ] Play/Pause, Step, Reset controls functional
- [ ] Stats display correct
- [ ] History chart renders correctly
- [ ] Extinction detection works
- [ ] Responsive layout works on narrow windows
- [ ] Browser resize handled correctly
- [ ] JSDoc comments present on all classes and qualifying methods
- [ ] Simulation engine independent of Phaser
- [ ] All rendering uses Phaser Graphics
- [ ] Single RNG used for all random choices
- [ ] Simultaneous chronon updates correct
- [ ] PWA manifest and service worker present
