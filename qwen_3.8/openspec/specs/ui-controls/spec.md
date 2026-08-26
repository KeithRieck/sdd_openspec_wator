# ui-controls Specification

## Purpose

Defines the behavior of the Phaser-native on-screen controls and readouts: the stats panel, action buttons, speed segmented control, and status display, including their enable/disable and terminal-state behavior.

## Requirements

### Requirement: R1. Stats panel
The system SHALL display Chronon, Fish, Sharks, and Status on the left side of the main world display, updated live as the simulation advances.

#### Scenario: R1.1 Live stats
- **WHILE** the simulation is running
- **THEN** the Chronon, Fish, and Sharks values SHALL update to reflect the current simulation state

#### Scenario: R1.2 Status shown
- **WHEN** the simulation state changes between running, paused, and terminal
- **THEN** the Status readout SHALL reflect the current state

### Requirement: R2. Action controls
The system SHALL show only Play/Pause, Step, and Reset action buttons on the right side of the main world display, with each action button on its own row.

#### Scenario: R2.1 Button set
- **WHEN** the controls are rendered
- **THEN** exactly Play/Pause, Step, and Reset SHALL be shown, each on its own row

#### Scenario: R2.2 Play/Pause toggle
- **WHEN** Play/Pause is activated while running
- **THEN** the simulation SHALL pause, and activating it again SHALL resume at the selected speed

### Requirement: R3. Speed controls
The system SHALL show 1x, 5x, 10x, 30x, and 60x speed buttons in one horizontal row, with the selected speed indicated.

#### Scenario: R3.1 Speed row
- **WHEN** the controls are rendered
- **THEN** the five speed buttons SHALL appear in a single horizontal row with the active speed visually selected

#### Scenario: R3.2 Speed change while running
- **WHILE** the simulation is running
- **THEN** a speed change SHALL take effect during subsequent updates

#### Scenario: R3.3 Speed change while paused
- **WHILE** the simulation is paused
- **THEN** a speed change SHALL update the selected speed without resuming the simulation

### Requirement: R4. Step behavior
The system SHALL allow Step to advance exactly one chronon while paused, and SHALL disable Step while the simulation is running.

#### Scenario: R4.1 Step while paused
- **WHILE** the simulation is paused
- **THEN** Step SHALL advance the simulation by exactly one chronon

#### Scenario: R4.2 Step disabled while running
- **WHILE** the simulation is running
- **THEN** Step SHALL be disabled

### Requirement: R5. Reset behavior
The system SHALL, when Reset is activated, create a new random world, set the chronon to 0, clear extinction status, clear population history, and resume running at the selected speed.

#### Scenario: R5.1 Reset
- **WHEN** Reset is activated
- **THEN** the system SHALL create a new random world, set the chronon to 0, clear extinction status, clear population history, and resume running at the selected speed

### Requirement: R6. Status display
The system SHALL display `Running` while the simulation is not terminal and running, `Paused` while it is not terminal and paused, and the terminal status (`Sharks extinct`, `Fish extinct`, or `Ecosystem collapsed`) when extinction occurs.

#### Scenario: R6.1 Running status
- **WHILE** the simulation is not terminal and running
- **THEN** the status SHALL display `Running`

#### Scenario: R6.2 Paused status
- **WHILE** the simulation is not terminal and paused
- **THEN** the status SHALL display `Paused`

#### Scenario: R6.3 Terminal status
- **WHEN** extinction is detected
- **THEN** the status SHALL display the corresponding terminal message

### Requirement: R7. Terminal state controls
The system SHALL auto-pause the simulation when either species becomes extinct, keep Play disabled while the simulation is terminal, and require Reset to start another run.

#### Scenario: R7.1 Auto-pause on extinction
- **IF** either fish or sharks become extinct
- **THEN** the simulation SHALL auto-pause and display the terminal status

#### Scenario: R7.2 Play disabled when terminal
- **WHILE** the simulation is terminal
- **THEN** Play SHALL be disabled and Reset SHALL be required to start another run
