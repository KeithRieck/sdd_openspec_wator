## ADDED Requirements

### Requirement: Stats Display
The system SHALL place Chronon, Fish, Sharks, and Status on the left side of the main world display.

#### Scenario: Stats displayed on left
- **WHEN** the app is running
- **THEN** the system SHALL display Chronon count on the left side
- **AND** the system SHALL display Fish count on the left side
- **AND** the system SHALL display Sharks count on the left side
- **AND** the system SHALL display Status on the left side

### Requirement: Controls Placement
The system SHALL place controls on the right side of the main world display.

#### Scenario: Controls displayed on right
- **WHEN** the app is running
- **THEN** the system SHALL place all controls on the right side of the world display

### Requirement: Speed Controls
The system SHALL show 1x, 5x, 10x, 30x, and 60x buttons in one horizontal row.

#### Scenario: Speed buttons displayed
- **WHEN** the app is running
- **THEN** the system SHALL display speed control buttons for 1x, 5x, 10x, 30x, and 60x
- **AND** the system SHALL arrange them in one horizontal row

### Requirement: Action Controls
The system SHALL show only Play/Pause, Step, and Reset with each action button on its own row.

#### Scenario: Action buttons displayed
- **WHEN** the app is running
- **THEN** the system SHALL display a Play/Pause button
- **AND** the system SHALL display a Step button
- **AND** the system SHALL display a Reset button
- **AND** each action button SHALL be on its own row

### Requirement: Play/Pause Behavior
The system SHALL start directly in a running Wa-Tor simulation at 10x speed with no landing page or instruction screen. While the simulation is running, the system SHALL disable Step and allow speed changes to take effect during subsequent updates.

#### Scenario: Auto-start at 10x speed
- **WHEN** the app launches
- **THEN** the system SHALL start directly in a running simulation
- **AND** the system SHALL set speed to 10x
- **AND** the system SHALL not show a landing page or instruction screen

#### Scenario: Step disabled when running
- **WHEN** the simulation is running
- **THEN** the system SHALL disable the Step button
- **AND** the system SHALL allow speed changes to take effect during subsequent updates

### Requirement: Pause Behavior
While the simulation is paused, the system SHALL allow Step to advance exactly one chronon and SHALL keep selected speed changes from resuming the simulation.

#### Scenario: Step advances one chronon when paused
- **WHEN** the simulation is paused
- **AND** the user activates Step
- **THEN** the system SHALL advance exactly one chronon

#### Scenario: Speed selection preserved when paused
- **WHEN** the simulation is paused
- **AND** the user changes speed
- **THEN** the system SHALL keep the selected speed for when simulation resumes

### Requirement: Reset Behavior
When Reset is activated, the system SHALL create a new random world, set chronon to 0, clear extinction status, clear population history, and resume running at the selected speed.

#### Scenario: Reset creates new world
- **WHEN** Reset is activated
- **THEN** the system SHALL create a new random world
- **AND** the system SHALL set chronon to 0
- **AND** the system SHALL clear extinction status
- **AND** the system SHALL clear population history
- **AND** the system SHALL resume running at the selected speed

### Requirement: Terminal State Handling
If either fish or sharks become extinct, the system SHALL auto-pause the simulation and display a terminal status. While the simulation is terminal, the system SHALL keep Play disabled and SHALL require Reset to start another run.

#### Scenario: Auto-pause on extinction
- **WHEN** either fish or sharks become extinct
- **THEN** the system SHALL auto-pause the simulation
- **AND** the system SHALL display a terminal status

#### Scenario: Play disabled in terminal state
- **WHEN** the simulation is terminal
- **THEN** the system SHALL keep Play disabled
- **AND** the system SHALL require Reset to start another run

### Requirement: Running Status Display
While the simulation is not terminal and running, the system SHALL display "Running".

#### Scenario: Running status displayed
- **WHEN** the simulation is not terminal and running
- **THEN** the system SHALL display "Running" as the status

### Requirement: Paused Status Display
While the simulation is not terminal and paused, the system SHALL display "Paused".

#### Scenario: Paused status displayed
- **WHEN** the simulation is not terminal and paused
- **THEN** the system SHALL display "Paused" as the status

### Requirement: Sharks Extinct Status
If sharks reach zero while fish remain, the system SHALL display "Sharks extinct".

#### Scenario: Sharks extinct displayed
- **WHEN** sharks reach zero while fish remain
- **THEN** the system SHALL display "Sharks extinct" as the status

### Requirement: Fish Extinct Status
If fish reach zero while sharks remain, the system SHALL display "Fish extinct".

#### Scenario: Fish extinct displayed
- **WHEN** fish reach zero while sharks remain
- **THEN** the system SHALL display "Fish extinct" as the status

### Requirement: Ecosystem Collapsed Status
If fish and sharks both reach zero in the same chronon, the system SHALL display "Ecosystem collapsed".

#### Scenario: Ecosystem collapsed displayed
- **WHEN** fish and sharks both reach zero in the same chronon
- **THEN** the system SHALL display "Ecosystem collapsed" as the status
