## ADDED Requirements

### Requirement: Phaser 4 Integration
The system SHALL load Phaser 4 from a CDN and render the entire app window through Phaser-native scene rendering and input.

#### Scenario: App launch
- **WHEN** the app loads
- **THEN** Phaser 4 is initialized and the SimulationScene is displayed.

### Requirement: World Rendering
The system SHALL draw empty water as the background and draw fish (green circles) and sharks (blue circles, slightly larger) as abstract circles with no grid lines.

#### Scenario: World display
- **WHEN** the simulation state is rendered
- **THEN** the screen shows a blue background with green and blue circles representing entities.

### Requirement: Immediate State Updates
The system SHALL render immediate state updates per chronon without per-cell movement animation.

#### Scenario: Chronon update
- **WHEN** the simulation advances one chronon
- **THEN** entities are instantly redrawn at their new positions.

### Requirement: Stats Display
The system SHALL place Chronon, Fish, Sharks, and Status on the left side of the main world display.

#### Scenario: Stats visibility
- **WHEN** the app is running
- **THEN** the left panel shows the current chronon, population counts, and simulation status.

### Requirement: Controls Display
The system SHALL place controls on the right side of the main world display.

#### Scenario: Controls visibility
- **WHEN** the app is running
- **THEN** the right panel shows the action and speed buttons.

### Requirement: Speed Control UI
The system SHALL show `1x`, `5x`, `10x`, `30x`, and `60x` buttons in one horizontal row.

#### Scenario: Speed selection
- **WHEN** the user clicks a speed button
- **THEN** the simulation update frequency is adjusted.

### Requirement: Action Control UI
The system SHALL show Play/Pause, Step, and Reset buttons, with each action button on its own row.

#### Scenario: Action buttons
- **WHEN** the user views the controls
- **THEN** they see a vertical stack of Play/Pause, Step, and Reset buttons.

### Requirement: Running State Controls
While the simulation is running, the system SHALL disable the Step button and allow speed changes to take effect during subsequent updates.

#### Scenario: Step disabled while running
- **WHEN** the simulation is in "Running" state
- **THEN** the Step button is visually disabled and non-functional.

### Requirement: Paused State Controls
While the simulation is paused, the system SHALL allow Step to advance exactly one chronon and keep selected speed changes for when the simulation resumes.

#### Scenario: Stepping while paused
- **WHEN** the simulation is "Paused" and user clicks Step
- **THEN** the simulation advances exactly one chronon and remains paused.

### Requirement: Reset Functionality
When Reset is activated, the system SHALL create a new random world, set chronon to 0, clear extinction status, clear population history, and resume running at the selected speed.

#### Scenario: Resetting the world
- **WHEN** the user clicks Reset
- **THEN** the simulation restarts from chronon 0 with a new random population.

### Requirement: Extinction Auto-Pause
If either fish or sharks become extinct, the system SHALL auto-pause the simulation and display a terminal status.

#### Scenario: Fish extinction
- **WHEN** fish count reaches 0
- **THEN** the simulation pauses and the status displays "Fish extinct".

### Requirement: Shark Extinction Status
If sharks reach zero while fish remain, the system SHALL display `Sharks extinct`.

#### Scenario: Sharks gone
- **WHEN** shark count is 0 and fish count > 0
- **THEN** the status displays "Sharks extinct".

### Requirement: Fish Extinction Status
If fish reach zero while sharks remain, the system SHALL display `Fish extinct`.

#### Scenario: Fish gone
- **WHEN** fish count is 0 and shark count > 0
- **THEN** the status displays "Fish extinct".

### Requirement: Ecosystem Collapse Status
If fish and sharks both reach zero in the same chronon, the system SHALL display `Ecosystem collapsed`.

#### Scenario: Total collapse
- **WHEN** both populations reach 0 in the same chronon
- **THEN** the status displays "Ecosystem collapsed".

### Requirement: Running Status Display
While the simulation is not terminal and running, the system SHALL display `Running`.

#### Scenario: Running status
- **WHEN** the simulation is active and not extinct
- **THEN** the status displays "Running".

### Requirement: Paused Status Display
While the simulation is not terminal and paused, the system SHALL display `Paused`.

#### Scenario: Paused status
- **WHEN** the simulation is paused and not extinct
- **THEN** the status displays "Paused".

### Requirement: Terminal State Controls
While the simulation is terminal, the system SHALL keep Play disabled and require Reset to start another run.

#### Scenario: Terminal state
- **WHEN** the status is "Fish extinct", "Sharks extinct", or "Ecosystem collapsed"
- **THEN** the Play button is disabled.

### Requirement: Population History Chart
The system SHALL render a population history chart horizontally across the bottom of the window.

#### Scenario: Chart visibility
- **WHEN** the app is running
- **THEN** a chart showing population trends over time is visible at the bottom.

### Requirement: Rolling History Window
The system SHALL store one sample per chronon for a rolling window of 500 chronons.

#### Scenario: Rolling window
- **WHEN** the simulation exceeds 500 chronons
- **THEN** the chart only displays the most recent 500 samples.

### Requirement: Chart Rendering
The system SHALL draw fish and shark population lines using the same green and blue colors as the world and stats, omitting chart titles and text labels.

#### Scenario: Chart colors
- **WHEN** the chart is rendered
- **THEN** fish are green and sharks are blue, with no text labels.

### Requirement: Simulation Update Loop
The system SHALL advance the simulation according to the selected chronons-per-second speed as normally as the browser allows.

#### Scenario: Speed execution
- **WHEN** speed is set to 10x
- **THEN** the simulation advances 10 chronons per second (approx).

### Requirement: Graphics Drawing
The system SHALL use Phaser `Graphics` drawing rather than per-cell sprites.

#### Scenario: Rendering method
- **WHEN** drawing the world or UI
- **THEN** `Phaser.GameObjects.Graphics` is used.

### Requirement: Wide Window Layout
When the app is viewed on a wide browser window, the system SHALL lay out stats on the left, world in the center, controls on the right, and the history chart across the bottom.

#### Scenario: Wide layout
- **WHEN** the browser window is wide
- **THEN** the layout follows the Left(Stats)-Center(World)-Right(Controls)-Bottom(Chart) pattern.

### Requirement: Narrow Window Layout
When the app is viewed on a tablet or narrow browser window, the system SHALL reflow the display while preserving the world aspect ratio and keeping all controls usable.

#### Scenario: Tablet reflow
- **WHEN** the browser window is narrow
- **THEN** the layout reflows (e.g., World on top, Stats/Controls below) while maintaining world aspect ratio.
