## ADDED Requirements

### Requirement: Simulation Controls
The system SHALL provide on-screen controls to manage the simulation flow.

#### Scenario: Play/Pause
- **WHEN** the user clicks the Play/Pause button
- **THEN** the simulation SHALL toggle between running and paused states.

#### Scenario: Single Step
- **WHEN** the user clicks the Step button
- **THEN** the simulation SHALL advance by exactly one chronon.

#### Scenario: Reset
- **WHEN** the user clicks the Reset button
- **THEN** the simulation SHALL re-initialize the grid and entities.

#### Scenario: Speed Control
- **WHEN** the user selects a speed (1x, 5x, 10x, 30x, 60x)
- **THEN** the simulation SHALL update the chronon interval accordingly.

### Requirement: Live Statistics
The system SHALL display the current population counts.

#### Scenario: Population Update
- **WHEN** a chronon completes
- **THEN** the system SHALL update the on-screen fish and shark counts.
