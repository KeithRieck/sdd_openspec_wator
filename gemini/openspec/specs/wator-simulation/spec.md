# wator-simulation Specification

## Purpose
TBD - created by archiving change wator-simulation. Update Purpose after archive.
## Requirements
### Requirement: Application Bootstrap
The system SHALL bootstrap the application by loading Phaser 4.x from a CDN and loading custom modules through ES2020 modules.

#### Scenario: Normal load of index.html
- **WHEN** index.html is loaded by a browser
- **THEN** Phaser version 4.x is fetched from the CDN and the game is initialized using ES2020 modules.

### Requirement: Toroidal Simulation Grid
The system SHALL initialize a grid of 100 columns by 70 rows where boundary conditions wrap toroidally (north wraps to south, east wraps to west).

#### Scenario: Toroidal bounds check
- **WHEN** an entity at coordinate (0, 0) moves West
- **THEN** its new coordinate SHALL be (99, 0).

### Requirement: Random Population Initializer
The system SHALL randomly populate the grid with 30% fish and 5% sharks based on configurable density constants.

#### Scenario: Initialization density check
- **WHEN** the simulation starts or is reset
- **THEN** approximately 30% of the cells contain fish and 5% contain sharks.

### Requirement: Chronon Turn Shuffling
The system SHALL collect the IDs of all entities at the start of a chronon, randomize their execution order, and ensure each entity acts at most once per chronon.

#### Scenario: Turn execution order
- **WHEN** a new chronon begins
- **THEN** the active entity IDs are gathered, shuffled, and processed sequentially.

### Requirement: Fish Movement and Reproduction
The system SHALL move fish to adjacent unoccupied cells, and if breeding-ready, leave a new fish in the old cell and reset the parent breed timer to 0.

#### Scenario: Fish breeds and moves
- **WHEN** a fish with breed timer at or above fishBreedTime moves to an empty neighboring cell
- **THEN** a new fish with breed timer 0 is left in the old cell, and the parent's breed timer resets to 0.

### Requirement: Shark Energy Cost and Starvation
The system SHALL decrement a shark's energy by 1 at the start of its turn and remove the shark immediately if its energy reaches 0.

#### Scenario: Shark starves
- **WHEN** a shark with 1 energy starts its turn
- **THEN** its energy is decremented to 0 and it is immediately removed from the simulation.

### Requirement: Shark Movement, Hunting, and Reproduction
The system SHALL move sharks to a random adjacent cell containing a fish and increment their energy, or to a random unoccupied cell if no fish are present, and reproduce if breeding-ready.

#### Scenario: Shark hunts fish and reproduces
- **WHEN** a breeding-ready shark moves to an adjacent cell containing a fish
- **THEN** the fish is devoured, the shark moves to the cell, its energy increments by sharkEnergyGain, a new shark is left in the old cell with initialSharkEnergy, and the parent's breed timer resets to 0.

### Requirement: Phaser-Native Graphics Rendering
The system SHALL draw all grid cells, fish, and sharks using a single Phaser.GameObjects.Graphics object with zero Phaser Sprites.

#### Scenario: Draw grid viewport
- **WHEN** the simulation state updates
- **THEN** the Phaser scene clears the graphics context and draws fish as green circles and sharks as blue circles.

### Requirement: Statistics and Status Display
The system SHALL display live counts of chronons, fish, sharks, and simulation status on the screen.

#### Scenario: Stats updates on tick
- **WHEN** a chronon advances
- **THEN** the on-screen statistics text displays the updated chronon, fish count, shark count, and running status.

### Requirement: Native UI Control Panel
The system SHALL provide Phaser-native buttons for Play/Pause, Step, Reset, and Speed selection (1x, 5x, 10x, 30x, 60x).

#### Scenario: Click Speed 30x
- **WHEN** the user clicks the 30x speed button
- **THEN** the simulation advances at 30 chronons per second.

### Requirement: Rolling Population History Chart
The system SHALL render a rolling population history chart showing the last 500 chronons of fish and shark populations using green and blue lines.

#### Scenario: Population history update
- **WHEN** a chronon ticks
- **THEN** the population sizes are recorded, and the chart updates its lines up to a 500-sample limit.

### Requirement: Responsive Layout Reflow
The system SHALL dynamically adjust the positions and scales of all panels (stats, world, controls, chart) during window resizing.

#### Scenario: Window resized to portrait
- **WHEN** the browser window width is resized to be smaller than its height
- **THEN** the panels reflow to a vertical stacked layout structure.

### Requirement: Offline PWA Support
The system SHALL register a service worker caching all static assets and the external Phaser CDN script.

#### Scenario: App loaded offline
- **WHEN** the browser is offline and the app is loaded
- **THEN** the cached index.html, JS modules, and Phaser CDN script are served from the service worker cache.

