# Wa-Tor Phaser Web App Specification

## Purpose

This spec defines the requirements for a browser-based Wa-Tor predator-prey cellular automaton simulation. It covers the simulation engine, Phaser-native rendering, controls, statistics, population history chart, and PWA support.

## Requirements

### R1: Simulation Engine Independence

**Scenario 1:** WHEN the simulation engine is implemented, THEN all Wa-Tor rules SHALL be independent from Phaser APIs and Phaser scene objects.

**Scenario 2:** WHEN the simulation engine is used in a test environment without Phaser, THEN it SHALL function correctly.

### R2: Toroidal Grid

**Scenario 1:** WHEN the simulation initializes, THEN it SHALL create a rectangular toroidal grid using code constants for width and height with defaults of 100 columns and 70 rows.

**Scenario 2:** WHEN an entity moves off the right edge of the grid, THEN it SHALL wrap to the left edge.

**Scenario 3:** WHEN an entity moves off the bottom edge of the grid, THEN it SHALL wrap to the top edge.

**Scenario 4:** WHEN an entity moves off the left edge of the grid, THEN it SHALL wrap to the right edge.

**Scenario 5:** WHEN an entity moves off the top edge of the grid, THEN it SHALL wrap to the bottom edge.

### R3: Entity Model

**Scenario 1:** WHEN the simulation initializes, THEN it SHALL use a flat grid array plus entity objects that are instances of classes extending a common `Entity` base class.

**Scenario 2:** WHEN the `Entity` base class is defined, THEN it SHALL expose shared behavior including position, breed age, and breeding readiness.

**Scenario 3:** WHEN a shark entity is created, THEN it SHALL additionally carry energy.

**Scenario 4:** WHEN an entity is created, THEN it SHALL carry an ID, a position, and a breed age.

**Scenario 5:** WHERE the flat grid array is defined, THEN it SHALL store one slot per cell, containing the occupying entity ID or an `empty` marker.

**Scenario 6:** WHERE entity position is stored, THEN it SHALL store the flat grid array index of the entity's cell.

**Scenario 7:** WHERE the grid array and the entity objects are related, THEN they SHALL be kept consistent so that the entity ID stored in a cell matches the entity occupying that cell.

### R4: Fish Behavior

**Scenario 1:** WHEN a fish acts and at least one adjacent empty cell exists, THEN the system SHALL move the fish to a randomly selected adjacent empty cell.

**Scenario 2:** IF a fish is breeding-ready and successfully moves, THEN the system SHALL leave a new fish in the old cell and reset the parent fish breed timer to 0.

**Scenario 3:** IF a fish is breeding-ready and cannot move, THEN the system SHALL reset the fish breed timer to 0.

**Scenario 4:** IF a fish is not breeding-ready and cannot move, THEN the system SHALL continue aging the fish breed timer.

**Scenario 5:** WHEN a fish moves, THEN it SHALL move only to an adjacent unoccupied square (orthogonal neighbors only).

**Scenario 6:** WHEN a fish has no free adjacent squares, THEN no movement SHALL take place.

### R5: Shark Behavior

**Scenario 1:** WHEN a shark acts, THEN the system SHALL decrement shark energy by `sharkEnergyCostPerChronon` before movement or eating.

**Scenario 2:** IF a shark energy value reaches 0 after the start-of-action decrement, THEN the system SHALL remove the shark immediately without moving or eating.

**Scenario 3:** IF a shark has adjacent fish after surviving the energy decrement, THEN the system SHALL move the shark to a randomly selected adjacent fish cell and remove the eaten fish.

**Scenario 4:** WHEN a shark eats a fish, THEN the system SHALL add `sharkEnergyGain` to the shark energy.

**Scenario 5:** IF a shark has no adjacent fish and has at least one adjacent empty cell, THEN the system SHALL move the shark to a randomly selected adjacent empty cell.

**Scenario 6:** IF a shark is breeding-ready and successfully moves, THEN the system SHALL leave a newborn shark in the old cell and reset the parent shark breed timer to 0. A shark that eats a fish counts as having successfully moved.

**Scenario 7:** WHEN a newborn shark is created, THEN the system SHALL initialize the newborn shark energy to `initialSharkEnergy`.

**Scenario 8:** IF a shark is breeding-ready and cannot move, THEN the system SHALL reset the shark breed timer to 0.

**Scenario 9:** IF a shark is not breeding-ready and cannot move, THEN the system SHALL continue aging the shark breed timer.

**Scenario 10:** WHEN a shark moves to a square occupied by a fish, THEN it SHALL eat the fish and earn `sharkEnergyGain` energy.

### R6: Simultaneous Chronon Updates

**Scenario 1:** WHEN a chronon starts, THEN the system SHALL collect current entity IDs, randomize their order, and allow each surviving entity to act at most once.

**Scenario 2:** IF an entity was born during the current chronon, THEN the system SHALL prevent that entity from acting until the next chronon.

**Scenario 3:** IF an entity dies or is eaten before its randomized turn, THEN the system SHALL skip that entity when its turn is reached.

**Scenario 4:** WHEN a chronon completes, THEN the system SHALL apply all collected actions simultaneously, not incrementally.

### R7: Random Number Generator

**Scenario 1:** WHEN random choices are made, THEN the system SHALL draw every random choice from the single random-number generator rather than calling `Math.random()` in more than one place.

**Scenario 2:** WHEN the simulation initializes, THEN initial randomness SHALL use the single random-number generator.

**Scenario 3:** WHEN movement selection occurs, THEN it SHALL draw from the single random-number generator.

**Scenario 4:** WHEN turn-order shuffling occurs, THEN it SHALL draw from the single random-number generator.

### R8: Rendering

**Scenario 1:** WHEN the world is rendered, THEN the system SHALL draw empty water as the background and draw fish and sharks as abstract circles with no grid lines.

**Scenario 2:** WHEN the world advances by one or more chronons, THEN the system SHALL render immediate state updates without per-cell movement animation.

**Scenario 3:** WHEN rendering is implemented, THEN the system SHALL use Phaser `Graphics` drawing rather than per-cell sprites.

**Scenario 4:** WHEN fish are rendered, THEN they SHALL be green circles.

**Scenario 5:** WHEN sharks are rendered, THEN they SHALL be blue circles and slightly larger than fish.

### R9: Controls

**Scenario 1:** WHEN the app launches, THEN the system SHALL start directly in a running Wa-Tor simulation at 10x speed with no landing page or instruction screen.

**Scenario 2:** WHEN controls appear, THEN the system SHALL place controls on the right side of the main world display.

**Scenario 3:** WHEN speed controls appear, THEN the system SHALL show 1x, 5x, 10x, 30x, and 60x buttons in one horizontal row.

**Scenario 4:** WHEN action controls appear, THEN the system SHALL show only Play/Pause, Step, and Reset with each action button on its own row.

**Scenario 5:** WHILE the simulation is running, THEN the system SHALL disable Step and allow speed changes to take effect during subsequent updates.

**Scenario 6:** WHILE the simulation is paused, THEN the system SHALL allow Step to advance exactly one chronon and SHALL keep selected speed changes from resuming the simulation.

**Scenario 7:** WHEN Reset is activated, THEN the system SHALL create a new random world, set chronon to 0, clear extinction status, clear population history, and resume running at the selected speed.

**Scenario 8:** WHEN the simulation is not terminal and running, THEN the system SHALL display "Running".

**Scenario 9:** WHEN the simulation is not terminal and paused, THEN the system SHALL display "Paused".

**Scenario 10:** WHEN the simulation is terminal, THEN the system SHALL keep Play disabled and SHALL require Reset to start another run.

### R10: Extinction and Terminal States

**Scenario 1:** IF either fish or sharks become extinct, THEN the system SHALL auto-pause the simulation and display a terminal status.

**Scenario 2:** IF sharks reach zero while fish remain, THEN the system SHALL display "Sharks extinct".

**Scenario 3:** IF fish reach zero while sharks remain, THEN the system SHALL display "Fish extinct".

**Scenario 4:** IF fish and sharks both reach zero in the same chronon, THEN the system SHALL display "Ecosystem collapsed".

### R11: Population Statistics

**Scenario 1:** WHEN population stats appear, THEN the system SHALL place Chronon, Fish, Sharks, and Status on the left side of the main world display.

**Scenario 2:** WHEN population history is recorded, THEN the system SHALL store one sample per chronon for a rolling window of 500 chronons.

**Scenario 3:** WHEN the population history chart is rendered, THEN the system SHALL draw fish and shark population lines using the same green and blue colors as the world and stats.

**Scenario 4:** WHEN the population history chart is rendered, THEN the system SHALL omit chart titles and text labels.

**Scenario 5:** WHEN the population history chart appears, THEN the system SHALL render it horizontally across the bottom of the window.

### R12: Layout and Responsive Design

**Scenario 1:** WHEN the app is viewed on a wide browser window, THEN the system SHALL lay out stats on the left, world in the center, controls on the right, and the history chart across the bottom.

**Scenario 2:** WHEN the app is viewed on a tablet or narrow browser window, THEN the system SHALL reflow the display while preserving the world aspect ratio and keeping all controls usable.

**Scenario 3:** WHEN a browser resize occurs, THEN the system SHALL recompute layout and rendering scale without changing the simulation grid dimensions.

**Scenario 4:** WHEN a programmer changes grid dimension constants in code, THEN the system SHALL gracefully scale and center the world display without requiring UI changes.

### R13: Simulation Constants

**Scenario 1:** WHERE code constants define model parameters, THEN the system SHALL make grid dimensions, densities, breed times, shark energy values, colors, and speed options easy for programmers to change.

**Scenario 2:** WHEN a programmer changes grid dimension constants in code, THEN the system SHALL gracefully scale and center the world display without requiring UI changes.

**Scenario 3:** WHEN a programmer changes density constants in code, THEN the system SHALL use the new values for population initialization.

**Scenario 4:** WHEN a programmer changes breed time constants in code, THEN the system SHALL use the new values for reproduction timing.

**Scenario 5:** WHEN a programmer changes shark energy constants in code, THEN the system SHALL use the new values for energy management.

**Scenario 6:** WHEN a programmer changes speed constants in code, THEN the system SHALL use the new values for simulation speed.

### R14: Phaser Integration

**Scenario 1:** WHEN index.html loads the app, THEN the system SHALL load Phaser version 4.x from a CDN script tag and SHALL load the app through ES2020 JavaScript modules.

**Scenario 2:** WHEN Phaser update frames occur, THEN the system SHALL advance the simulation according to the selected chronons-per-second speed as normally as the browser allows.

**Scenario 3:** IF the browser tab is hidden or throttled, THEN the system SHALL not implement special real-time preservation or catch-up compensation behavior.

**Scenario 4:** WHERE rendering is implemented, THEN the system SHALL use Phaser `Graphics` drawing rather than per-cell sprites.

### R15: PWA Support

**Scenario 1:** WHERE PWA support is implemented, THEN the system SHALL include a manifest and service worker that cache the app shell and same-origin assets.

**Scenario 2:** IF the CDN Phaser script has not already been successfully loaded and cached, THEN the system SHALL allow first-load or offline behavior to depend on network availability.

### R16: Code Quality

**Scenario 1:** WHEN code documentation is written, THEN the system SHALL use JSDoc-style comments for every class.

**Scenario 2:** WHEN static methods and public methods exceed 8 lines, THEN the system SHALL document them with JSDoc-style comments.

### R17: File Organization

**Scenario 1:** WHERE the project files are organized, THEN the system SHALL include `index.html`, `src/main.js`, `src/config.js`, `src/simulation/WatorSimulation.js`, `src/scenes/BootScene.js`, `src/scenes/SimulationScene.js`, `sw.js`, `manifest.webmanifest`, and an `assets/` directory for PWA assets.

**Scenario 2:** There MAY be a `src/ui` directory for on-screen elements and UI helper classes.

## Acceptance Criteria Summary

All 61 acceptance criteria from `prd-v001.md` are mapped to the requirements above.
