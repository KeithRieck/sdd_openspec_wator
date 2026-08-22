# app-ui-controls Specification

## Requirements

### Requirement: Phaser-native full-window app
WHERE Phaser is used, THEN the system SHALL render and control the entire app window through Phaser-native scene rendering and input, with no HTML or DOM controls layered over Phaser.

#### Scenario: No DOM overlay controls
- **WHEN** the user interacts with any control in the app
- **THEN** the interaction is handled by Phaser input on Phaser-rendered elements

### Requirement: Auto-start running
WHEN the app launches, THEN the system SHALL start directly in a running Wa-Tor simulation at 10x speed with no landing page or instruction screen.

#### Scenario: Launch behavior
- **WHEN** `index.html` loads the app
- **THEN** the simulation begins running at 10x speed immediately

### Requirement: Stats panel placement
WHERE population stats appear, THEN the system SHALL place Chronon, Fish, Sharks, and Status on the left side of the main world display.

#### Scenario: Stats visible during run
- **WHEN** the simulation is running
- **THEN** current chronon count, fish population, shark population, and status text are shown left of the world

### Requirement: Controls placement
WHERE controls appear, THEN the system SHALL place controls on the right side of the main world display. WHERE action controls appear, THEN the system SHALL show only Play/Pause, Step, and Reset with each action button on its own row. WHERE speed controls appear, THEN the system SHALL show 1x, 5x, 10x, 30x, and 60x buttons in one horizontal row.

#### Scenario: Control layout
- **WHEN** the control panel is rendered
- **THEN** Play/Pause, Step, and Reset each occupy their own row, and the five speed buttons share one horizontal row, all right of the world

### Requirement: Running-state control behavior
WHILE the simulation is running, THEN the system SHALL disable Step and allow speed changes to take effect during subsequent updates.

#### Scenario: Step disabled while running
- **WHEN** the simulation is running and the user clicks Step
- **THEN** no single-step occurs because Step is disabled

#### Scenario: Speed change while running
- **WHEN** the user selects a different speed while running
- **THEN** subsequent chronons advance at the newly selected rate

### Requirement: Paused-state control behavior
WHILE the simulation is paused, THEN the system SHALL allow Step to advance exactly one chronon and SHALL keep selected speed changes from resuming the simulation.

#### Scenario: Single step while paused
- **WHEN** the simulation is paused and the user clicks Step
- **THEN** exactly one chronon elapses and the simulation remains paused

#### Scenario: Speed change while paused does not resume
- **WHEN** the user selects a different speed while paused
- **THEN** the selection updates but the simulation stays paused

### Requirement: Reset behavior
WHEN Reset is activated, THEN the system SHALL create a new random world, set chronon to 0, clear extinction status, clear population history, and resume running at the selected speed.

#### Scenario: Reset from terminal state
- **WHEN** Reset is activated after an extinction
- **THEN** a fresh random world starts running at the currently selected speed with chronon 0 and empty history

### Requirement: Extinction auto-pause and terminal status
IF either fish or sharks become extinct, THEN the system SHALL auto-pause the simulation and display a terminal status. IF sharks reach zero while fish remain, THEN the system SHALL display `Sharks extinct`. IF fish reach zero while sharks remain, THEN the system SHALL display `Fish extinct`. IF fish and sharks both reach zero in the same chronon, THEN the system SHALL display `Ecosystem collapsed`.

#### Scenario: Sharks die out
- **WHEN** the shark population reaches zero while fish remain
- **THEN** the simulation pauses and displays `Sharks extinct`

#### Scenario: Fish die out
- **WHEN** the fish population reaches zero while sharks remain
- **THEN** the simulation pauses and displays `Fish extinct`

#### Scenario: Simultaneous collapse
- **WHEN** both populations reach zero in the same chronon
- **THEN** the simulation pauses and displays `Ecosystem collapsed`

### Requirement: Non-terminal status display
WHILE the simulation is not terminal and running, THEN the system SHALL display `Running`. WHILE the simulation is not terminal and paused, THEN the system SHALL display `Paused`.

#### Scenario: Running status
- **WHEN** the simulation runs without terminal condition
- **THEN** the status shows `Running`

#### Scenario: Paused status
- **WHEN** the user pauses without terminal condition
- **THEN** the status shows `Paused`

### Requirement: Terminal lockout
WHILE the simulation is terminal, THEN the system SHALL keep Play disabled and SHALL require Reset to start another run.

#### Scenario: Play disabled after extinction
- **WHEN** the simulation has reached a terminal status
- **THEN** Play cannot resume the simulation; only Reset starts another run

### Requirement: Default speed and options
The default speed SHALL be 10x. Supported speed choices SHALL be 1x, 5x, 10x, 30x, and 60x, where Nx means N chronons per second.

#### Scenario: Selected speed button
- **WHEN** a speed button is active
- **THEN** it shows a visually distinct selected state among the five speed choices
