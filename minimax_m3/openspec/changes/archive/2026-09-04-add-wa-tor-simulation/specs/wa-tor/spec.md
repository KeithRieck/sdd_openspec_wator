## Purpose

Delivers a browser-based Wa-Tor predator-prey cellular automaton simulation as a static Phaser 4 web app with a framework-independent engine, Phaser-native UI, responsive layout, and lightweight PWA support.

## ADDED Requirements

### Requirement: App launches directly into a running simulation

The system SHALL start directly in a running Wa-Tor simulation at `10x` speed with no landing page or instruction screen when the app launches.

#### Scenario: First load shows running simulation
- **WHEN** the app is loaded in a browser
- **THEN** the system SHALL display a running Wa-Tor simulation at `10x` speed with no landing page or instruction screen

### Requirement: Project file organization

The system SHALL include `index.html`, `src/main.js`, `src/config.js`, `src/simulation/WatorSimulation.js`, `src/scenes/BootScene.js`, `src/scenes/SimulationScene.js`, `sw.js`, `manifest.webmanifest`, and an `assets/` directory for PWA assets. The system MAY include a `src/ui` directory for on-screen elements and UI helper classes.

#### Scenario: Required files exist
- **WHEN** the project is inspected
- **THEN** the system SHALL contain `index.html`, `src/main.js`, `src/config.js`, `src/simulation/WatorSimulation.js`, `src/scenes/BootScene.js`, `src/scenes/SimulationScene.js`, `sw.js`, `manifest.webmanifest`, and an `assets/` directory

### Requirement: Phaser loaded from CDN via script tag

The system SHALL load Phaser version 4.x from a CDN script tag in `index.html` and SHALL load the app through ES2020 JavaScript modules.

#### Scenario: Phaser loads from CDN
- **WHEN** `index.html` is loaded
- **THEN** the system SHALL load Phaser version 4.x from a CDN script tag and SHALL load the app through ES2020 JavaScript modules

### Requirement: Simulation engine is independent of Phaser

The system SHALL keep all Wa-Tor rules independent from Phaser APIs and Phaser scene objects.

#### Scenario: Engine has no Phaser imports
- **WHEN** the simulation engine source files are inspected
- **THEN** the system SHALL contain no references to Phaser APIs or Phaser scene objects

### Requirement: Phaser owns the entire app window

The system SHALL render and control the entire app window through Phaser-native scene rendering and input.

#### Scenario: No DOM controls layered over Phaser
- **WHEN** the app is running
- **THEN** the system SHALL render and control the entire app window through Phaser-native scene rendering and input with no HTML or DOM controls layered over Phaser

### Requirement: Toroidal grid with code-defined dimensions

The system SHALL create a rectangular toroidal grid using code constants for width and height with defaults of `100` columns and `70` rows.

#### Scenario: Default grid dimensions
- **WHEN** the simulation initializes
- **THEN** the system SHALL create a rectangular toroidal grid using code constants for width and height with defaults of `100` columns and `70` rows

### Requirement: Random initial population with code-defined densities

The system SHALL randomly populate the grid using code constants for `30%` fish density and `5%` shark density.

#### Scenario: Default population densities
- **WHEN** the simulation initializes
- **THEN** the system SHALL randomly populate the grid using code constants for `30%` fish density and `5%` shark density

### Requirement: World display scales and centers when grid constants change

The system SHALL gracefully scale and center the world display without requiring UI changes when a programmer changes grid dimension constants in code.

#### Scenario: Grid dimension change rescales world
- **WHEN** a programmer changes grid dimension constants in code
- **THEN** the system SHALL gracefully scale and center the world display without requiring UI changes

### Requirement: Browser resize recomputes layout without changing grid

The system SHALL recompute layout and rendering scale without changing the simulation grid dimensions when a browser resize occurs.

#### Scenario: Resize preserves grid dimensions
- **WHEN** a browser resize occurs
- **THEN** the system SHALL recompute layout and rendering scale without changing the simulation grid dimensions

### Requirement: Orthogonal toroidal movement

The system SHALL consider only orthogonal neighbors north, east, south, and west with toroidal edge wrapping when movement is evaluated.

#### Scenario: Movement uses orthogonal toroidal neighbors
- **WHEN** movement is evaluated for any entity
- **THEN** the system SHALL consider only orthogonal neighbors north, east, south, and west with toroidal edge wrapping

### Requirement: Chronon iteration order and acting rules

The system SHALL collect current entity IDs, randomize their order, and allow each surviving entity to act at most once when a chronon starts. The system SHALL prevent an entity born during the current chronon from acting until the next chronon. The system SHALL skip an entity that died or was eaten before its randomized turn when its turn is reached.

#### Scenario: Chronon iteration order
- **WHEN** a chronon starts
- **THEN** the system SHALL collect current entity IDs, randomize their order, and allow each surviving entity to act at most once

#### Scenario: Newborns do not act in birth chronon
- **WHEN** an entity is born during the current chronon
- **THEN** the system SHALL prevent that entity from acting until the next chronon

#### Scenario: Dead entities are skipped
- **WHEN** an entity dies or is eaten before its randomized turn
- **THEN** the system SHALL skip that entity when its turn is reached

### Requirement: Fish movement and breeding rules

The system SHALL move a fish to a randomly selected adjacent empty cell when a fish acts and at least one adjacent empty cell exists. If a fish is breeding-ready and successfully moves, the system SHALL leave a new fish in the old cell and reset the parent fish breed timer to `0`. If a fish is breeding-ready and cannot move, the system SHALL reset the fish breed timer to `0`. If a fish is not breeding-ready and cannot move, the system SHALL continue aging the fish breed timer.

#### Scenario: Fish moves to empty cell
- **WHEN** a fish acts and at least one adjacent empty cell exists
- **THEN** the system SHALL move the fish to a randomly selected adjacent empty cell

#### Scenario: Breeding-ready fish leaves newborn on move
- **WHEN** a fish is breeding-ready and successfully moves
- **THEN** the system SHALL leave a new fish in the old cell and reset the parent fish breed timer to `0`

#### Scenario: Breeding-ready fish resets timer when blocked
- **WHEN** a fish is breeding-ready and cannot move
- **THEN** the system SHALL reset the fish breed timer to `0`

#### Scenario: Non-breeding-ready fish ages when blocked
- **WHEN** a fish is not breeding-ready and cannot move
- **THEN** the system SHALL continue aging the fish breed timer

### Requirement: Shark energy, hunting, and breeding rules

The system SHALL decrement shark energy by `sharkEnergyCostPerChronon` before movement or eating when a shark acts. If a shark energy value reaches `0` after the start-of-action decrement, the system SHALL remove the shark immediately without moving or eating. If a shark has adjacent fish after surviving the energy decrement, the system SHALL move the shark to a randomly selected adjacent fish cell and remove the eaten fish. When a shark eats a fish, the system SHALL add `sharkEnergyGain` to the shark energy. If a shark has no adjacent fish and has at least one adjacent empty cell, the system SHALL move the shark to a randomly selected adjacent empty cell. If a shark is breeding-ready and successfully moves, the system SHALL leave a newborn shark in the old cell and reset the parent shark breed timer to `0`. When a newborn shark is created, the system SHALL initialize the newborn shark energy to `initialSharkEnergy`. If a shark is breeding-ready and cannot move, the system SHALL reset the shark breed timer to `0`. If a shark is not breeding-ready and cannot move, the system SHALL continue aging the shark breed timer.

#### Scenario: Shark energy decremented before action
- **WHEN** a shark acts
- **THEN** the system SHALL decrement shark energy by `sharkEnergyCostPerChronon` before movement or eating

#### Scenario: Shark dies at zero energy
- **WHEN** a shark energy value reaches `0` after the start-of-action decrement
- **THEN** the system SHALL remove the shark immediately without moving or eating

#### Scenario: Shark eats adjacent fish
- **WHEN** a shark has adjacent fish after surviving the energy decrement
- **THEN** the system SHALL move the shark to a randomly selected adjacent fish cell and remove the eaten fish

#### Scenario: Shark gains energy from eating
- **WHEN** a shark eats a fish
- **THEN** the system SHALL add `sharkEnergyGain` to the shark energy

#### Scenario: Shark moves to empty cell when no fish adjacent
- **WHEN** a shark has no adjacent fish and has at least one adjacent empty cell
- **THEN** the system SHALL move the shark to a randomly selected adjacent empty cell

#### Scenario: Breeding-ready shark leaves newborn on move
- **WHEN** a shark is breeding-ready and successfully moves
- **THEN** the system SHALL leave a newborn shark in the old cell and reset the parent shark breed timer to `0`

#### Scenario: Newborn shark initialized with initial energy
- **WHEN** a newborn shark is created
- **THEN** the system SHALL initialize the newborn shark energy to `initialSharkEnergy`

#### Scenario: Breeding-ready shark resets timer when blocked
- **WHEN** a shark is breeding-ready and cannot move
- **THEN** the system SHALL reset the shark breed timer to `0`

#### Scenario: Non-breeding-ready shark ages when blocked
- **WHEN** a shark is not breeding-ready and cannot move
- **THEN** the system SHALL continue aging the shark breed timer

### Requirement: Simulation state storage shape

The system SHALL use a flat grid array plus entity records containing ID, type, position, breed age, and shark energy when applicable.

#### Scenario: State storage shape
- **WHEN** simulation state is stored
- **THEN** the system SHALL use a flat grid array plus entity records containing ID, type, position, breed age, and shark energy when applicable

### Requirement: World rendering with abstract circles

The system SHALL draw empty water as the background and draw fish and sharks as abstract circles with no grid lines when the world is rendered. The system SHALL render immediate state updates without per-cell movement animation when the world advances by one or more chronons. The system SHALL use Phaser `Graphics` drawing rather than per-cell sprites.

#### Scenario: World drawn as circles on water background
- **WHEN** the world is rendered
- **THEN** the system SHALL draw empty water as the background and draw fish and sharks as abstract circles with no grid lines

#### Scenario: Immediate state updates without movement animation
- **WHEN** the world advances by one or more chronons
- **THEN** the system SHALL render immediate state updates without per-cell movement animation

#### Scenario: Rendering uses Phaser Graphics
- **WHEN** rendering is implemented
- **THEN** the system SHALL use Phaser `Graphics` drawing rather than per-cell sprites

### Requirement: Stats panel placement

The system SHALL place Chronon, Fish, Sharks, and Status on the left side of the main world display.

#### Scenario: Stats on the left
- **WHEN** population stats appear
- **THEN** the system SHALL place Chronon, Fish, Sharks, and Status on the left side of the main world display

### Requirement: Controls placement

The system SHALL place controls on the right side of the main world display.

#### Scenario: Controls on the right
- **WHEN** controls appear
- **THEN** the system SHALL place controls on the right side of the main world display

### Requirement: Speed control row

The system SHALL show `1x`, `5x`, `10x`, `30x`, and `60x` buttons in one horizontal row.

#### Scenario: Speed buttons in one row
- **WHEN** speed controls appear
- **THEN** the system SHALL show `1x`, `5x`, `10x`, `30x`, and `60x` buttons in one horizontal row

### Requirement: Action control rows

The system SHALL show only Play/Pause, Step, and Reset with each action button on its own row.

#### Scenario: Action buttons on separate rows
- **WHEN** action controls appear
- **THEN** the system SHALL show only Play/Pause, Step, and Reset with each action button on its own row

### Requirement: Running-state control behavior

The system SHALL disable Step and allow speed changes to take effect during subsequent updates while the simulation is running.

#### Scenario: Step disabled while running
- **WHEN** the simulation is running
- **THEN** the system SHALL disable Step

#### Scenario: Speed changes apply while running
- **WHEN** the simulation is running and a speed button is selected
- **THEN** the system SHALL allow the speed change to take effect during subsequent updates

### Requirement: Paused-state control behavior

The system SHALL allow Step to advance exactly one chronon and SHALL keep selected speed changes from resuming the simulation while the simulation is paused.

#### Scenario: Step advances one chronon while paused
- **WHEN** the simulation is paused and Step is activated
- **THEN** the system SHALL advance exactly one chronon

#### Scenario: Speed change does not resume while paused
- **WHEN** the simulation is paused and a speed button is selected
- **THEN** the system SHALL keep the simulation paused and SHALL not resume it

### Requirement: Reset behavior

The system SHALL create a new random world, set chronon to `0`, clear extinction status, clear population history, and resume running at the selected speed when Reset is activated.

#### Scenario: Reset creates new world and resumes
- **WHEN** Reset is activated
- **THEN** the system SHALL create a new random world, set chronon to `0`, clear extinction status, clear population history, and resume running at the selected speed

### Requirement: Extinction auto-pause and terminal status

The system SHALL auto-pause the simulation and display a terminal status if either fish or sharks become extinct. The system SHALL display `Sharks extinct` if sharks reach zero while fish remain. The system SHALL display `Fish extinct` if fish reach zero while sharks remain. The system SHALL display `Ecosystem collapsed` if fish and sharks both reach zero in the same chronon.

#### Scenario: Auto-pause on extinction
- **WHEN** either fish or sharks become extinct
- **THEN** the system SHALL auto-pause the simulation and display a terminal status

#### Scenario: Sharks extinct status
- **WHEN** sharks reach zero while fish remain
- **THEN** the system SHALL display `Sharks extinct`

#### Scenario: Fish extinct status
- **WHEN** fish reach zero while sharks remain
- **THEN** the system SHALL display `Fish extinct`

#### Scenario: Ecosystem collapsed status
- **WHEN** fish and sharks both reach zero in the same chronon
- **THEN** the system SHALL display `Ecosystem collapsed`

### Requirement: Non-terminal status display

The system SHALL display `Running` while the simulation is not terminal and running. The system SHALL display `Paused` while the simulation is not terminal and paused.

#### Scenario: Running status
- **WHEN** the simulation is not terminal and running
- **THEN** the system SHALL display `Running`

#### Scenario: Paused status
- **WHEN** the simulation is not terminal and paused
- **THEN** the system SHALL display `Paused`

### Requirement: Terminal-state control behavior

The system SHALL keep Play disabled and SHALL require Reset to start another run while the simulation is terminal.

#### Scenario: Play disabled in terminal state
- **WHEN** the simulation is terminal
- **THEN** the system SHALL keep Play disabled and SHALL require Reset to start another run

### Requirement: Population history chart placement

The system SHALL render the population history chart horizontally across the bottom of the window.

#### Scenario: Chart spans bottom of window
- **WHEN** the population history chart appears
- **THEN** the system SHALL render it horizontally across the bottom of the window

### Requirement: Population history sampling

The system SHALL store one sample per chronon for a rolling window of `500` chronons when population history is recorded.

#### Scenario: Rolling 500-chronon history
- **WHEN** population history is recorded
- **THEN** the system SHALL store one sample per chronon for a rolling window of `500` chronons

### Requirement: Population history chart rendering

The system SHALL draw fish and shark population lines using the same green and blue colors as the world and stats. The system SHALL omit chart titles and text labels.

#### Scenario: Chart lines match world colors
- **WHEN** the population history chart is rendered
- **THEN** the system SHALL draw fish and shark population lines using the same green and blue colors as the world and stats

#### Scenario: Chart omits titles and labels
- **WHEN** the population history chart is rendered
- **THEN** the system SHALL omit chart titles and text labels

### Requirement: Chronon-per-second timing

The system SHALL advance the simulation according to the selected chronons-per-second speed as normally as the browser allows when Phaser update frames occur. The system SHALL not implement special real-time preservation or catch-up compensation behavior if the browser tab is hidden or throttled.

#### Scenario: Speed drives chronon rate
- **WHEN** Phaser update frames occur
- **THEN** the system SHALL advance the simulation according to the selected chronons-per-second speed as normally as the browser allows

#### Scenario: No catch-up compensation
- **WHEN** the browser tab is hidden or throttled
- **THEN** the system SHALL not implement special real-time preservation or catch-up compensation behavior

### Requirement: Responsive layout

The system SHALL lay out stats on the left, world in the center, controls on the right, and the history chart across the bottom when the app is viewed on a wide browser window. The system SHALL reflow the display while preserving the world aspect ratio and keeping all controls usable when the app is viewed on a tablet or narrow browser window.

#### Scenario: Wide window layout
- **WHEN** the app is viewed on a wide browser window
- **THEN** the system SHALL lay out stats on the left, world in the center, controls on the right, and the history chart across the bottom

#### Scenario: Narrow window reflow
- **WHEN** the app is viewed on a tablet or narrow browser window
- **THEN** the system SHALL reflow the display while preserving the world aspect ratio and keeping all controls usable

### Requirement: Programmer-tunable code constants

The system SHALL make grid dimensions, densities, breed times, shark energy values, colors, and speed options easy for programmers to change.

#### Scenario: Constants are easy to change
- **WHEN** a programmer inspects the code
- **THEN** the system SHALL make grid dimensions, densities, breed times, shark energy values, colors, and speed options easy for programmers to change

### Requirement: JSDoc documentation for classes

The system SHALL use JSDoc-style comments for every class.

#### Scenario: Every class has JSDoc
- **WHEN** the source code is inspected
- **THEN** the system SHALL use JSDoc-style comments for every class

### Requirement: JSDoc documentation for long methods

The system SHALL document static methods and public methods exceeding 8 lines with JSDoc-style comments.

#### Scenario: Long methods have JSDoc
- **WHEN** static methods and public methods exceed 8 lines
- **THEN** the system SHALL document them with JSDoc-style comments

### Requirement: PWA manifest and service worker

The system SHALL include a manifest and service worker that cache the app shell and same-origin assets. The system SHALL allow first-load or offline behavior to depend on network availability if the CDN Phaser script has not already been successfully loaded and cached.

#### Scenario: Manifest and service worker present
- **WHEN** PWA support is implemented
- **THEN** the system SHALL include a manifest and service worker that cache the app shell and same-origin assets

#### Scenario: Phaser CDN not precached
- **WHEN** the CDN Phaser script has not already been successfully loaded and cached
- **THEN** the system SHALL allow first-load or offline behavior to depend on network availability
