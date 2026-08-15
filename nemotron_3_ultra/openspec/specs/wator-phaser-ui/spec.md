# wator-phaser-ui Specification

## Purpose
TBD - created by archiving change wator-simulation. Update Purpose after archive.
## Requirements
### Requirement: Boot scene
The system SHALL provide a BootScene that initializes the Phaser game and transitions to the simulation scene.

#### Scenario: Boot scene loads and transitions
- **WHEN** the game starts
- **THEN** the system SHALL create a BootScene that immediately transitions to SimulationScene

#### Scenario: PWA registration
- **WHEN** BootScene creates
- **THEN** the system SHALL register the service worker if supported

### Requirement: Simulation scene
The system SHALL provide a SimulationScene that manages the main game loop, rendering, and input handling.

#### Scenario: Simulation scene creates UI components
- **WHEN** SimulationScene creates
- **THEN** the system SHALL instantiate WorldRenderer, StatsPanel, ControlPanel, and HistoryChart

#### Scenario: Simulation scene advances simulation
- **WHEN** the game updates and simulation is running
- **THEN** the system SHALL advance the simulation according to the selected speed

#### Scenario: Simulation scene handles resize
- **WHEN** the browser window resizes
- **THEN** the system SHALL recompute layout and notify all UI components

### Requirement: World renderer
The system SHALL provide a WorldRenderer that draws the simulation grid using Phaser Graphics.

#### Scenario: World renderer draws water background
- **WHEN** the world is rendered
- **THEN** the system SHALL draw empty water as the background color

#### Scenario: World renderer draws fish as green circles
- **WHEN** a fish entity is rendered
- **THEN** the system SHALL draw a green circle at the entity's grid position

#### Scenario: World renderer draws sharks as blue circles
- **WHEN** a shark entity is rendered
- **THEN** the system SHALL draw a blue circle slightly larger than fish at the entity's grid position

#### Scenario: World renderer uses no grid lines
- **WHEN** the world is rendered
- **THEN** the system SHALL NOT draw grid lines

#### Scenario: World renderer scales to fit
- **WHEN** the renderer resizes
- **THEN** the system SHALL compute cell size to fit the grid in the available area while preserving aspect ratio

#### Scenario: World renderer centers grid
- **WHEN** the renderer resizes
- **THEN** the system SHALL center the grid horizontally and vertically in the available area

### Requirement: Stats panel
The system SHALL provide a StatsPanel that displays simulation statistics on the left side of the world display.

#### Scenario: Stats panel shows chronon
- **WHEN** the stats panel updates
- **THEN** the system SHALL display the current chronon number

#### Scenario: Stats panel shows fish count
- **WHEN** the stats panel updates
- **THEN** the system SHALL display the current fish population

#### Scenario: Stats panel shows shark count
- **WHEN** the stats panel updates
- **THEN** the system SHALL display the current shark population

#### Scenario: Stats panel shows status
- **WHEN** the stats panel updates
- **THEN** the system SHALL display the current simulation status (Running, Paused, Sharks extinct, Fish extinct, Ecosystem collapsed)

#### Scenario: Stats panel positions on left
- **WHEN** the stats panel renders
- **THEN** the system SHALL position it on the left side of the main world display

### Requirement: Control panel
The system SHALL provide a ControlPanel with speed and action controls on the right side of the world display.

#### Scenario: Control panel shows speed buttons
- **WHEN** the control panel renders
- **THEN** the system SHALL show 1x, 5x, 10x, 30x, and 60x buttons in one horizontal row

#### Scenario: Control panel shows action buttons
- **WHEN** the control panel renders
- **THEN** the system SHALL show Play/Pause, Step, and Reset buttons each on their own row

#### Scenario: Control panel disables step when running
- **WHILE** the simulation is running
- **THEN** the system SHALL disable the Step button

#### Scenario: Control panel allows step when paused
- **WHILE** the simulation is paused
- **THEN** the system SHALL enable the Step button to advance exactly one chronon

#### Scenario: Control panel speed changes take effect
- **WHEN** a speed button is pressed
- **THEN** the system SHALL update the selected speed for subsequent simulation updates

#### Scenario: Control panel play/pause toggles
- **WHEN** Play/Pause is pressed
- **THEN** the system SHALL toggle the running state

#### Scenario: Control panel reset creates new world
- **WHEN** Reset is pressed
- **THEN** the system SHALL create a new random world, set chronon to 0, clear extinction status, clear population history, and resume running at the selected speed

#### Scenario: Control panel disables play in terminal state
- **WHILE** the simulation is terminal
- **THEN** the system SHALL keep Play disabled and require Reset to start another run

#### Scenario: Control panel positions on right
- **WHEN** the control panel renders
- **THEN** the system SHALL position it on the right side of the main world display

### Requirement: History chart
The system SHALL provide a HistoryChart that renders population history across the bottom of the window.

#### Scenario: History chart renders fish line
- **WHEN** the history chart renders
- **THEN** the system SHALL draw the fish population line using the same green color as the world and stats

#### Scenario: History chart renders shark line
- **WHEN** the history chart renders
- **THEN** the system SHALL draw the shark population line using the same blue color as the world and stats

#### Scenario: History chart omits titles and labels
- **WHEN** the history chart renders
- **THEN** the system SHALL NOT draw chart titles or text labels

#### Scenario: History chart uses rolling window
- **WHEN** the history chart renders
- **THEN** the system SHALL display up to 500 chronons of history

#### Scenario: History chart positions at bottom
- **WHEN** the history chart renders
- **THEN** the system SHALL position it horizontally across the bottom of the window

### Requirement: Responsive layout
The system SHALL provide a responsive layout that adapts to different window sizes.

#### Scenario: Wide layout
- **WHEN** the window is wide
- **THEN** the system SHALL lay out stats on the left, world in the center, controls on the right, and history chart across the bottom

#### Scenario: Narrow layout
- **WHEN** the window is narrow (tablet or mobile)
- **THEN** the system SHALL reflow the display while preserving the world aspect ratio and keeping all controls usable

