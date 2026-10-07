# Spec Delta

## Purpose

Provides Phaser-native UI components for displaying simulation statistics, controlling the simulation (play/pause, step, reset), selecting speed, and showing a rolling population history chart, all rendered within the Phaser canvas.

## ADDED Requirements

### Requirement: Stats Panel Display
The system SHALL display Chronon, Fish count, Sharks count, and Status on the left side of the main world display.

#### Scenario: Stats visible on left side
- **WHEN** the app is running
- **THEN** the system displays Chronon, Fish, Sharks, and Status text on the left side of the world

#### Scenario: Stats update in real-time
- **WHEN** the simulation advances
- **THEN** the stats panel updates to show current values

### Requirement: Control Buttons
The system SHALL display Play/Pause, Step, and Reset buttons on the right side of the main world display, with each action button on its own row.

#### Scenario: Controls on right side
- **WHEN** the app is running
- **THEN** the system displays Play/Pause, Step, and Reset buttons on the right side of the world

#### Scenario: Action buttons stacked vertically
- **WHEN** the controls are displayed
- **THEN** Play/Pause, Step, and Reset each appear on their own row

### Requirement: Speed Control Buttons
The system SHALL display 1x, 5x, 10x, 30x, and 60x speed buttons in one horizontal row.

#### Scenario: Speed buttons in horizontal row
- **WHEN** the speed controls are displayed
- **THEN** the system shows 1x, 5x, 10x, 30x, and 60x buttons arranged horizontally

#### Scenario: Selected speed highlighted
- **WHEN** a speed is selected
- **THEN** the system visually indicates the selected speed button

### Requirement: Play/Pause Toggle
The system SHALL toggle between running and paused states when the Play/Pause button is activated.

#### Scenario: Pause during running
- **WHEN** the simulation is running and Play/Pause is activated
- **THEN** the system pauses the simulation and updates the button label

#### Scenario: Resume during paused
- **WHEN** the simulation is paused and Play/Pause is activated
- **THEN** the system resumes the simulation and updates the button label

### Requirement: Step Control
The system SHALL advance exactly one chronon when Step is activated while paused, and SHALL be disabled while the simulation is running.

#### Scenario: Step advances one chronon
- **WHEN** the simulation is paused and Step is activated
- **THEN** the system advances exactly one chronon and remains paused

#### Scenario: Step disabled while running
- **WHEN** the simulation is running
- **THEN** the Step button is disabled

### Requirement: Reset Control
The system SHALL create a new random world, set chronon to 0, clear extinction status, clear population history, and resume running at the selected speed when Reset is activated.

#### Scenario: Reset creates new simulation
- **WHEN** Reset is activated
- **THEN** the system creates a new random world, resets chronon to 0, clears terminal status, clears history, and resumes running

### Requirement: Speed Changes During Running
The system SHALL allow speed changes to take effect during subsequent updates while the simulation is running.

#### Scenario: Speed change while running
- **WHEN** a speed button is activated while the simulation is running
- **THEN** the system changes the simulation speed for subsequent updates

### Requirement: Speed Changes While Paused
The system SHALL keep selected speed changes from resuming the simulation when paused.

#### Scenario: Speed change while paused
- **WHEN** a speed button is activated while the simulation is paused
- **THEN** the system updates the selected speed but keeps the simulation paused

### Requirement: Terminal State Controls
The system SHALL disable Play and keep Step disabled when the simulation is in a terminal state, requiring Reset to start another run.

#### Scenario: Play disabled when terminal
- **WHEN** the simulation reaches a terminal state (extinction)
- **THEN** the Play button is disabled

#### Scenario: Reset required to restart
- **WHEN** the simulation is terminal
- **THEN** only Reset can start a new simulation run

### Requirement: Status Display Values
The system SHALL display "Running" when not terminal and running, "Paused" when not terminal and paused, and the appropriate terminal status message when terminal.

#### Scenario: Running status
- **WHEN** the simulation is not terminal and running
- **THEN** the system displays "Running"

#### Scenario: Paused status
- **WHEN** the simulation is not terminal and paused
- **THEN** the system displays "Paused"

#### Scenario: Sharks extinct status
- **WHEN** sharks reach zero while fish remain
- **THEN** the system displays "Sharks extinct"

#### Scenario: Fish extinct status
- **WHEN** fish reach zero while sharks remain
- **THEN** the system displays "Fish extinct"

#### Scenario: Ecosystem collapsed status
- **WHEN** both fish and sharks reach zero in the same chronon
- **THEN** the system displays "Ecosystem collapsed"

### Requirement: Population History Chart
The system SHALL render a population history chart horizontally across the bottom of the window.

#### Scenario: Chart at bottom
- **WHEN** the app is running
- **THEN** the system displays the population history chart across the bottom of the window

### Requirement: History Chart Line Colors
The system SHALL draw fish and shark population lines using the same green and blue colors as the world and stats.

#### Scenario: Fish line is green
- **WHEN** the population history chart is rendered
- **THEN** the fish population line is drawn in green

#### Scenario: Shark line is blue
- **WHEN** the population history chart is rendered
- **THEN** the shark population line is drawn in blue

### Requirement: No Chart Labels
The system SHALL omit chart titles and text labels from the population history chart.

#### Scenario: Chart has no text
- **WHEN** the population history chart is rendered
- **THEN** the system displays only the population lines without titles or labels

### Requirement: Responsive Layout - Wide Window
The system SHALL lay out stats on the left, world in the center, controls on the right, and the history chart across the bottom when viewed on a wide browser window.

#### Scenario: Wide window layout
- **WHEN** the app is viewed on a wide browser window
- **THEN** the system arranges stats left, world center, controls right, chart bottom

### Requirement: Responsive Layout - Narrow Window
The system SHALL reflow the display while preserving the world aspect ratio and keeping all controls usable when viewed on a tablet or narrow browser window.

#### Scenario: Narrow window reflow
- **WHEN** the app is viewed on a tablet or narrow browser window
- **THEN** the system reflows the layout while maintaining world aspect ratio and control usability

### Requirement: Phaser-Native Button Component
The system SHALL use the PhaserButton class for all on-screen buttons.

#### Scenario: Buttons use PhaserButton
- **WHEN** any button is displayed
- **THEN** the system uses the PhaserButton class from src/ui/PhaserButton.js
