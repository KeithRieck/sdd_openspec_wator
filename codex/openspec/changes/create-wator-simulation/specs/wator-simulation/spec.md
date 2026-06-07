## ADDED Requirements

### Requirement: Static Phaser App Shell
The system SHALL provide a static ES2020 browser app for the Wa-Tor simulation with Phaser 4.x loaded from a CDN script tag and no required build step or backend.

#### Scenario: Launches directly into simulation
- **WHEN** the app launches
- **THEN** the system SHALL start directly in a running Wa-Tor simulation at `10x` speed with no landing page or instruction screen

#### Scenario: Required project files exist
- **WHERE** the project files are organized
- **THEN** the system SHALL include `index.html`, `src/main.js`, `src/config.js`, `src/simulation/WatorSimulation.js`, `src/scenes/BootScene.js`, `src/scenes/SimulationScene.js`, `sw.js`, `manifest.webmanifest`, and an `assets/` directory for PWA assets

#### Scenario: Phaser loads from CDN
- **WHEN** `index.html` loads the app
- **THEN** the system SHALL load Phaser version 4.x from a CDN script tag and SHALL load the app through ES2020 JavaScript modules

#### Scenario: Runtime remains static-site friendly
- **WHERE** the shipped runtime is deployed
- **THEN** the system SHALL require no Node.js dependency, backend service, server-side code, TypeScript, React, or build tooling

### Requirement: Configurable Simulation Defaults
The system SHALL define programmer-editable constants for grid dimensions, initial populations, breed timing, shark energy, colors, and speed options.

#### Scenario: Default grid dimensions
- **WHEN** the simulation initializes
- **THEN** the system SHALL create a rectangular toroidal grid using code constants for width and height with defaults of `100` columns and `70` rows

#### Scenario: Default initial populations
- **WHEN** the simulation initializes
- **THEN** the system SHALL randomly populate the grid using code constants for `30%` fish density and `5%` shark density

#### Scenario: Default model constants
- **WHERE** model constants are defined
- **THEN** the system SHALL default `fishBreedTime` to `3`, `sharkBreedTime` to `10`, `initialSharkEnergy` to `5`, `sharkEnergyGain` to `4`, and `sharkEnergyCostPerChronon` to `1`

#### Scenario: Default speed options
- **WHERE** speed constants are defined
- **THEN** the system SHALL default to `10x` speed and SHALL support `1x`, `5x`, `10x`, `30x`, and `60x`

#### Scenario: Programmer changes constants
- **WHERE** code constants define model parameters
- **THEN** the system SHALL make grid dimensions, densities, breed times, shark energy values, colors, and speed options easy for programmers to change

### Requirement: Framework-Independent Simulation Engine
The system SHALL keep Wa-Tor simulation rules independent from Phaser APIs while storing state in a flat grid array plus entity records.

#### Scenario: Simulation engine has no Phaser dependency
- **WHERE** the simulation engine is implemented
- **THEN** the system SHALL keep all Wa-Tor rules independent from Phaser APIs and Phaser scene objects

#### Scenario: State model
- **WHERE** simulation state is stored
- **THEN** the system SHALL use a flat grid array plus entity records containing ID, type, position, breed age, and shark energy when applicable

#### Scenario: Orthogonal toroidal neighbors
- **WHERE** movement is evaluated
- **THEN** the system SHALL consider only orthogonal neighbors north, east, south, and west with toroidal edge wrapping

#### Scenario: Randomized chronon turn order
- **WHEN** a chronon starts
- **THEN** the system SHALL collect current entity IDs, randomize their order, and allow each surviving entity to act at most once

#### Scenario: Newborns wait until next chronon
- **IF** an entity was born during the current chronon
- **THEN** the system SHALL prevent that entity from acting until the next chronon

#### Scenario: Removed entities are skipped
- **IF** an entity dies or is eaten before its randomized turn
- **THEN** the system SHALL skip that entity when its turn is reached

### Requirement: Fish Chronon Behavior
The system SHALL implement Wa-Tor fish movement and breeding across chronons.

#### Scenario: Fish moves to empty adjacent cell
- **WHEN** a fish acts and at least one adjacent empty cell exists
- **THEN** the system SHALL move the fish to a randomly selected adjacent empty cell

#### Scenario: Breeding-ready fish moves
- **IF** a fish is breeding-ready and successfully moves
- **THEN** the system SHALL leave a new fish in the old cell and reset the parent fish breed timer to `0`

#### Scenario: Breeding-ready fish cannot move
- **IF** a fish is breeding-ready and cannot move
- **THEN** the system SHALL reset the fish breed timer to `0`

#### Scenario: Non-breeding fish cannot move
- **IF** a fish is not breeding-ready and cannot move
- **THEN** the system SHALL continue aging the fish breed timer

### Requirement: Shark Chronon Behavior
The system SHALL implement Wa-Tor shark movement, starvation, eating, energy gain, and breeding across chronons.

#### Scenario: Shark spends energy before action
- **WHEN** a shark acts
- **THEN** the system SHALL decrement shark energy by `sharkEnergyCostPerChronon` before movement or eating

#### Scenario: Shark dies at zero energy
- **IF** a shark energy value reaches `0` after the start-of-action decrement
- **THEN** the system SHALL remove the shark immediately without moving or eating

#### Scenario: Shark eats adjacent fish
- **IF** a shark has adjacent fish after surviving the energy decrement
- **THEN** the system SHALL move the shark to a randomly selected adjacent fish cell and remove the eaten fish

#### Scenario: Shark gains energy from eating
- **WHEN** a shark eats a fish
- **THEN** the system SHALL add `sharkEnergyGain` to the shark energy

#### Scenario: Shark moves to empty adjacent cell
- **IF** a shark has no adjacent fish and has at least one adjacent empty cell
- **THEN** the system SHALL move the shark to a randomly selected adjacent empty cell

#### Scenario: Breeding-ready shark moves
- **IF** a shark is breeding-ready and successfully moves
- **THEN** the system SHALL leave a newborn shark in the old cell and reset the parent shark breed timer to `0`

#### Scenario: Newborn shark energy
- **WHEN** a newborn shark is created
- **THEN** the system SHALL initialize the newborn shark energy to `initialSharkEnergy`

#### Scenario: Breeding-ready shark cannot move
- **IF** a shark is breeding-ready and cannot move
- **THEN** the system SHALL reset the shark breed timer to `0`

#### Scenario: Non-breeding shark cannot move
- **IF** a shark is not breeding-ready and cannot move
- **THEN** the system SHALL continue aging the shark breed timer

### Requirement: Simulation Status and Controls
The system SHALL provide Phaser-native controls for play, pause, stepping, reset, and speed selection while maintaining correct running, paused, and terminal states.

#### Scenario: Stats placement
- **WHERE** population stats appear
- **THEN** the system SHALL place Chronon, Fish, Sharks, and Status on the left side of the main world display

#### Scenario: Controls placement
- **WHERE** controls appear
- **THEN** the system SHALL place controls on the right side of the main world display

#### Scenario: Speed controls
- **WHERE** speed controls appear
- **THEN** the system SHALL show `1x`, `5x`, `10x`, `30x`, and `60x` buttons in one horizontal row

#### Scenario: Action controls
- **WHERE** action controls appear
- **THEN** the system SHALL show only Play/Pause, Step, and Reset with each action button on its own row

#### Scenario: Step disabled while running
- **WHILE** the simulation is running
- **THEN** the system SHALL disable Step and allow speed changes to take effect during subsequent updates

#### Scenario: Step advances while paused
- **WHILE** the simulation is paused
- **THEN** the system SHALL allow Step to advance exactly one chronon and SHALL keep selected speed changes from resuming the simulation

#### Scenario: Reset starts new run
- **WHEN** Reset is activated
- **THEN** the system SHALL create a new random world, set chronon to `0`, clear extinction status, clear population history, and resume running at the selected speed

#### Scenario: Running status
- **WHILE** the simulation is not terminal and running
- **THEN** the system SHALL display `Running`

#### Scenario: Paused status
- **WHILE** the simulation is not terminal and paused
- **THEN** the system SHALL display `Paused`

### Requirement: Terminal Extinction States
The system SHALL auto-pause and report terminal statuses when fish, sharks, or both populations become extinct.

#### Scenario: Terminal auto-pause
- **IF** either fish or sharks become extinct
- **THEN** the system SHALL auto-pause the simulation and display a terminal status

#### Scenario: Sharks extinct
- **IF** sharks reach zero while fish remain
- **THEN** the system SHALL display `Sharks extinct`

#### Scenario: Fish extinct
- **IF** fish reach zero while sharks remain
- **THEN** the system SHALL display `Fish extinct`

#### Scenario: Ecosystem collapsed
- **IF** fish and sharks both reach zero in the same chronon
- **THEN** the system SHALL display `Ecosystem collapsed`

#### Scenario: Terminal controls
- **WHILE** the simulation is terminal
- **THEN** the system SHALL keep Play disabled and SHALL require Reset to start another run

### Requirement: Phaser Rendering and Layout
The system SHALL render the full app window through Phaser-native scene rendering and input, using immediate graphics updates and responsive layout.

#### Scenario: Phaser owns app rendering and input
- **WHERE** Phaser is used
- **THEN** the system SHALL render and control the entire app window through Phaser-native scene rendering and input

#### Scenario: Grid dimensions can change in code
- **WHEN** a programmer changes grid dimension constants in code
- **THEN** the system SHALL gracefully scale and center the world display without requiring UI changes

#### Scenario: Browser resize
- **WHEN** a browser resize occurs
- **THEN** the system SHALL recompute layout and rendering scale without changing the simulation grid dimensions

#### Scenario: World drawing
- **WHEN** the world is rendered
- **THEN** the system SHALL draw empty water as the background and draw fish and sharks as abstract circles with no grid lines

#### Scenario: Creature colors and sizes
- **WHERE** creatures are rendered
- **THEN** the system SHALL draw fish as green circles and sharks as blue circles that are slightly larger than fish

#### Scenario: Immediate updates
- **WHEN** the world advances by one or more chronons
- **THEN** the system SHALL render immediate state updates without per-cell movement animation

#### Scenario: Graphics rendering
- **WHERE** rendering is implemented
- **THEN** the system SHALL use Phaser `Graphics` drawing rather than per-cell sprites

#### Scenario: Wide layout
- **WHEN** the app is viewed on a wide browser window
- **THEN** the system SHALL lay out stats on the left, world in the center, controls on the right, and the history chart across the bottom

#### Scenario: Tablet or narrow layout
- **WHEN** the app is viewed on a tablet or narrow browser window
- **THEN** the system SHALL reflow the display while preserving the world aspect ratio and keeping all controls usable

### Requirement: Population History Chart
The system SHALL render a rolling population history chart across the bottom of the Phaser window.

#### Scenario: Chart placement
- **WHERE** the population history chart appears
- **THEN** the system SHALL render it horizontally across the bottom of the window

#### Scenario: Rolling history window
- **WHEN** population history is recorded
- **THEN** the system SHALL store one sample per chronon for a rolling window of `500` chronons

#### Scenario: Chart line colors
- **WHERE** the population history chart is rendered
- **THEN** the system SHALL draw fish and shark population lines using the same green and blue colors as the world and stats

#### Scenario: Chart has no labels
- **WHERE** the population history chart is rendered
- **THEN** the system SHALL omit chart titles and text labels

### Requirement: Simulation Timing
The system SHALL advance chronons according to the selected speed during Phaser update frames without special hidden-tab catch-up behavior.

#### Scenario: Advance by selected speed
- **WHEN** Phaser update frames occur
- **THEN** the system SHALL advance the simulation according to the selected chronons-per-second speed as normally as the browser allows

#### Scenario: Hidden or throttled tab
- **IF** the browser tab is hidden or throttled
- **THEN** the system SHALL not implement special real-time preservation or catch-up compensation behavior

### Requirement: Lightweight PWA Support
The system SHALL include lightweight PWA metadata and app-shell caching while accepting network dependence for first-load Phaser CDN availability.

#### Scenario: PWA files
- **WHERE** PWA support is implemented
- **THEN** the system SHALL include a manifest and service worker that cache the app shell and same-origin assets

#### Scenario: CDN first-load dependency
- **IF** the CDN Phaser script has not already been successfully loaded and cached
- **THEN** the system SHALL allow first-load or offline behavior to depend on network availability

#### Scenario: App icon design
- **WHERE** PWA assets are created
- **THEN** the system SHALL include icon artwork that uses circles suggesting the shark and fish symbols

### Requirement: Code Documentation
The system SHALL document classes and longer static or public methods with JSDoc comments.

#### Scenario: Classes documented
- **WHERE** code documentation is written
- **THEN** the system SHALL use JSDoc-style comments for every class

#### Scenario: Longer static and public methods documented
- **WHERE** static methods and public methods exceed 8 lines
- **THEN** the system SHALL document them with JSDoc-style comments
