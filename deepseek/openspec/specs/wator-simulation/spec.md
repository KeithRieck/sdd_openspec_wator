# Wa-Tor Simulation

Browser-based Wa-Tor predator-prey cellular automaton using Phaser 4, deployed as a static site.

## Simulation Engine

The simulation engine SHALL be framework-agnostic with zero Phaser dependencies.
The grid SHALL be a toroidal `100 x 70` rectangular array with orthogonal edge wrapping.
The system SHALL store entity state in a flat `Int32Array` grid and a `Map` of entity records keyed by ID.
An entity record SHALL contain `{ id, type, x, y, breedAge, energy? }`.

WHEN the simulation initializes, THEN the system SHALL randomly populate `30%` of cells with fish and `5%` with sharks.
WHEN a chronon starts, THEN the system SHALL collect all entity IDs, randomize their order, and process each surviving entity at most once.
IF an entity was born during the current chronon, THEN the system SHALL prevent it from acting until the next chronon.
IF an entity dies or is eaten before its turn, THEN the system SHALL skip it.
WHEN movement is evaluated, THEN the system SHALL consider only orthogonal neighbors with toroidal wrapping.

### Fish Rules

IF a fish has at least one adjacent empty cell, THEN the system SHALL move it to a randomly selected empty cell.
IF a fish is breeding-ready and moves, THEN the system SHALL leave a new fish in the old cell and reset the parent breed timer.
IF a fish is breeding-ready and cannot move, THEN the system SHALL reset its breed timer.
IF a fish is not breeding-ready and cannot move, THEN the system SHALL increment its breed timer.

### Shark Rules

WHEN a shark acts, THEN the system SHALL decrement its energy before movement or eating.
IF shark energy reaches zero after decrement, THEN the system SHALL remove the shark immediately.
IF a shark has adjacent fish after surviving the energy decrement, THEN the system SHALL move to a random adjacent fish cell and eat the fish.
WHEN a shark eats a fish, THEN the system SHALL add energy gain to the shark.
IF a shark has no adjacent fish and has an adjacent empty cell, THEN the system SHALL move to a random empty cell.
WHEN a newborn shark spawns, THEN the system SHALL initialize its energy to the configured starting value.
IF a shark is breeding-ready and moves, THEN the system SHALL leave a newborn shark in the old cell and reset the parent breed timer.
IF a shark is breeding-ready and cannot move, THEN the system SHALL reset its breed timer.
IF a shark is not breeding-ready and cannot move, THEN the system SHALL increment its breed timer.

## Phaser Scenes

The app SHALL contain a `BootScene` that transitions immediately to `SimulationScene`.
The `SimulationScene` SHALL own the simulation engine, render the world, display stats, provide controls, and draw the population chart.

## World Rendering

The system SHALL render entities as abstract filled circles using Phaser `Graphics` — no sprites.
Fish SHALL be green circles; sharks SHALL be blue circles, slightly larger than fish.
The water background SHALL be a dark filled rectangle.
Cell size SHALL scale to fit the world area while maintaining the grid aspect ratio.
The system SHALL omit grid lines and movement animation.

## Stats Panel

WHEN the app is in wide layout, THEN the system SHALL place stats on the left showing Chronon, Fish count, Sharks count, and Status.
WHILE the simulation is running, THEN the status SHALL display `Running`.
WHILE paused, THEN the status SHALL display `Paused`.

## Controls

Speed controls SHALL present `1x`, `5x`, `10x`, `30x`, and `60x` in a single horizontal row.
Action controls SHALL present Play/Pause, Step, and Reset each on its own row.
WHILE running, THEN Step SHALL be disabled and speed changes SHALL take effect during subsequent updates.
WHILE paused, THEN Step SHALL advance exactly one chronon without resuming.
WHEN Reset is activated, THEN the system SHALL create a new random world, zero the chronon, clear history, and resume running.

## Extinction

IF fish and sharks both reach zero, THEN the system SHALL auto-pause and display `Ecosystem collapsed`.
IF only fish reach zero, THEN the system SHALL auto-pause and display `Fish extinct`.
IF only sharks reach zero, THEN the system SHALL auto-pause and display `Sharks extinct`.
WHILE terminal, THEN the system SHALL disable all controls except Reset.
WHEN the simulation reaches extinction during a running tick, THEN the system SHALL evaluate extinction state before rendering, so that the status text displays the correct terminal message in the same frame.
The system SHALL use the same `check-then-render` ordering in both the natural-tick path and the manual-step path.

## Population History Chart

The chart SHALL render horizontally across the bottom of the window.
The system SHALL store one sample per chronon for a rolling window of 500 chronons.
The chart SHALL draw fish and shark population lines using the same green and blue colors as the world.
The system SHALL omit chart titles and text labels.

## Layout

WHEN on a wide viewport, THEN the system SHALL lay out stats-left, world-center, controls-right, chart-bottom.
WHEN on a narrow viewport, THEN the system SHALL reflow to a stacked vertical layout.
WHEN the browser resizes, THEN the system SHALL recompute layout and rendering scale without changing grid dimensions.

## PWA

The system SHALL include a web manifest and service worker.
The service worker SHALL cache same-origin app-shell assets.
IF the Phaser CDN script has not been cached, THEN offline behavior SHALL depend on network availability.

## Constants

The system SHALL expose all model parameters as programmer-editable constants:
- `GRID_W = 100`, `GRID_H = 70`
- `FISH_DENSITY = 0.30`, `SHARK_DENSITY = 0.05`
- `FISH_BREED_TIME = 3`, `SHARK_BREED_TIME = 25`
- `INITIAL_SHARK_ENERGY = 5`, `SHARK_ENERGY_GAIN = 3`, `SHARK_ENERGY_COST = 1`
- Default speed: `10x`
