## ADDED Requirements

### Requirement: History recording
The system SHALL store one population sample per chronon for rolling window of 500 chronons.

#### Scenario: Rolling window
- **WHEN** chronon advances beyond 500
- **THEN** oldest sample discarded

### Requirement: History rendering
The system SHALL render fish and shark population lines using green and blue colors across bottom of window.

#### Scenario: Chart draw
- **WHEN** simulation updates
- **THEN** chart shows lines without titles or labels
