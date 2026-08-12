## ADDED Requirements

### Requirement: Play pause control
The system SHALL provide Play/Pause button to start and stop simulation.

#### Scenario: Toggle running
- **WHEN** Play/Pause clicked while running
- **THEN** simulation pauses

### Requirement: Step control
The system SHALL provide Step button to advance one chronon when paused.

#### Scenario: Single step
- **WHEN** Step clicked while paused
- **THEN** simulation advances one chronon

### Requirement: Reset control
The system SHALL provide Reset button to create new random world and resume.

#### Scenario: Reset world
- **WHEN** Reset activated
- **THEN** new world created, chronon reset to 0, history cleared

### Requirement: Speed control
The system SHALL provide speed buttons 1x,5x,10x,30x,60x.

#### Scenario: Change speed
- **WHEN** speed button selected
- **THEN** chronons per second updates
