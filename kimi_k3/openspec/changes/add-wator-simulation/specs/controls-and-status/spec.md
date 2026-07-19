# Spec: controls-and-status (delta, new capability)

## ADDED Requirements

### Requirement: CS-R1 Control layout
Controls SHALL appear on the right side of the main world display in wide layout; speed controls SHALL show `1x`, `5x`, `10x`, `30x`, and `60x` buttons in one horizontal row; action controls SHALL show only Play/Pause, Step, and Reset with each action button on its own row (PRD AC 31, 32, 33).

#### Scenario: CS-R1.1 Wide-layout control placement
- **WHEN** the app renders in wide layout
- **THEN** controls SHALL be right of the world, with the five speed buttons in one row and Play/Pause, Step, Reset each on their own row

### Requirement: CS-R2 Stats layout
Population stats showing Chronon, Fish, Sharks, and Status SHALL appear on the left side of the main world display in wide layout (PRD AC 30).

#### Scenario: CS-R2.1 Stats placement
- **WHEN** the app renders in wide layout
- **THEN** Chronon, Fish, Sharks, and Status SHALL be displayed left of the world

### Requirement: CS-R3 Initial state
On launch the app SHALL start directly in a running simulation at `10x` speed with no landing page or instruction screen (PRD AC 1).

#### Scenario: CS-R3.1 Direct start
- **WHEN** the app loads
- **THEN** the simulation SHALL immediately run at 10x with no interstitial screen

### Requirement: CS-R4 Running behavior
While running, Step SHALL be disabled and speed changes SHALL take effect during subsequent updates; the simulation SHALL advance according to the selected chronons-per-second speed as normally as the browser allows, with no special catch-up compensation when the tab is hidden or throttled (PRD AC 34, 48, 49).

#### Scenario: CS-R4.1 Speed change while running
- **WHEN** the user selects a different speed while running
- **THEN** subsequent updates SHALL advance at the new speed without pausing

#### Scenario: CS-R4.2 Step disabled while running
- **WHEN** the simulation is running
- **THEN** the Step control SHALL be disabled

### Requirement: CS-R5 Paused behavior and Step
While paused, Step SHALL advance exactly one chronon, render the result, and record a population history sample; speed changes made while paused SHALL NOT resume the simulation (PRD AC 35).

#### Scenario: CS-R5.1 Single step
- **WHEN** the user activates Step while paused
- **THEN** the simulation SHALL advance exactly one chronon, update the display, and record a chart sample

#### Scenario: CS-R5.2 Speed change while paused
- **WHEN** the user selects a different speed while paused
- **THEN** the simulation SHALL remain paused

### Requirement: CS-R6 Reset
When Reset is activated, the system SHALL create a new random world, set chronon to 0, clear extinction status, clear population history, and resume running at the selected speed (PRD AC 36).

#### Scenario: CS-R6.1 Full reset
- **WHEN** the user activates Reset
- **THEN** a new random world SHALL appear with chronon 0, cleared history, no terminal status, running at the currently selected speed

### Requirement: CS-R7 Status display and terminal handling
The status SHALL display `Running` while running, `Paused` while paused, and the terminal message after extinction; on extinction the simulation SHALL auto-pause, Play SHALL remain disabled, and Reset SHALL be required to start another run (PRD AC 37–43).

#### Scenario: CS-R7.1 Auto-pause on extinction
- **WHEN** either population reaches zero
- **THEN** the simulation SHALL auto-pause and display the corresponding terminal status

#### Scenario: CS-R7.2 Terminal lockout
- **WHEN** the simulation is in a terminal state
- **THEN** Play SHALL be disabled until Reset is activated
