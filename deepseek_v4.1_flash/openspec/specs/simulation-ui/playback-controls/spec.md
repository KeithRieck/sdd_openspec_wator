# simulation-ui/playback-controls Specification

## Purpose

Defines the controls the user operates: speed selection, play/pause, single-step, and reset, along with how each control is enabled or disabled as the simulation moves between running, paused, and terminal states.

## Requirements

### Requirement: 1 Speed controls

The system SHALL display speed controls as the buttons `1x`, `5x`, `10x`, `30x`, and `60x` in one horizontal row, SHALL start at `10x`, and SHALL make each button easy for a programmer to change through code constants.

#### Scenario: 1.1 Speed buttons appear in one horizontal row

- **WHEN** the controls are rendered
- **THEN** the system shows `1x`, `5x`, `10x`, `30x`, and `60x` buttons in one horizontal row

#### Scenario: 1.2 Default speed is ten times

- **WHEN** the app launches
- **THEN** the simulation runs at `10x` speed

#### Scenario: 1.3 Selecting a speed marks it as selected

- **WHEN** the user selects a speed button
- **THEN** the system marks that button as the selected speed and clears the selected state from the others

#### Scenario: 1.4 Speed changes take effect during subsequent updates

- **WHEN** the user changes speed while the simulation is running
- **THEN** the system applies the new speed to subsequent updates

#### Scenario: 1.5 Speed changes do not resume a paused simulation

- **WHEN** the user changes speed while the simulation is paused
- **THEN** the system keeps the simulation paused

### Requirement: 2 Action controls

The system SHALL display only Play/Pause, Step, and Reset as action controls, with each action button on its own row.

#### Scenario: 2.1 Action buttons each occupy their own row

- **WHEN** the controls are rendered
- **THEN** the system shows the Play/Pause, Step, and Reset buttons with each action button on its own row

#### Scenario: 2.2 No additional action controls are shown

- **WHEN** the controls are rendered
- **THEN** the system shows only Play/Pause, Step, and Reset as action controls

### Requirement: 3 Control availability by simulation state

The system SHALL disable Step while the simulation is running, SHALL allow Step to advance exactly one chronon while paused, and SHALL keep Play disabled and require Reset once the simulation is terminal.

#### Scenario: 3.1 Step is disabled while running

- **WHEN** the simulation is running
- **THEN** the system disables the Step button

#### Scenario: 3.2 Step advances exactly one chronon while paused

- **WHEN** the simulation is paused and the user activates Step
- **THEN** the system advances the simulation by exactly one chronon and remains paused

#### Scenario: 3.3 Play is disabled when the simulation is terminal

- **WHEN** the simulation has reached a terminal outcome
- **THEN** the system keeps the Play control disabled and requires Reset before another run can start

#### Scenario: 3.4 Play and Pause reflect the run state

- **WHEN** the simulation is running
- **THEN** the system presents the control as Pause, and when the simulation is paused the system presents it as Play

### Requirement: 4 Reset

The system SHALL create a new random world when Reset is activated, set the chronon count to `0`, clear the extinction status, clear the population history, and resume running at the selected speed.

#### Scenario: 4.1 Reset creates a new random world

- **WHEN** the user activates Reset
- **THEN** the system creates a new randomly populated world sized by the grid constants

#### Scenario: 4.2 Reset restores the chronon count

- **WHEN** the user activates Reset
- **THEN** the system sets the chronon count to `0`

#### Scenario: 4.3 Reset clears status and history

- **WHEN** the user activates Reset
- **THEN** the system clears the extinction status and clears the population history

#### Scenario: 4.4 Reset resumes running at the selected speed

- **WHEN** the user activates Reset
- **THEN** the system resumes the simulation running at the currently selected speed

#### Scenario: 4.5 Reset re-enables Play after a terminal outcome

- **WHEN** the user activates Reset after the simulation became terminal
- **THEN** the system clears the terminal state and the Play control becomes available again

### Requirement: 5 Settings control is absent

The system SHALL NOT provide user-facing controls for grid dimensions, densities, breeding values, or shark energy values.

#### Scenario: 5.1 No model-parameter controls are shown

- **WHEN** the controls are rendered
- **THEN** the system shows no control for grid dimensions, densities, breeding values, or shark energy values
