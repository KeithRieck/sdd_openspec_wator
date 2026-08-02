## ADDED Requirements

### Requirement: Population History Chart
The system SHALL visualize population trends over time using a rolling line graph.

#### Scenario: Chart Update
- **WHEN** a chronon completes
- **THEN** the system SHALL add the current population counts to the history buffer and redraw the line graph.

#### Scenario: Rolling Window
- **WHEN** the history buffer reaches its maximum capacity
- **THEN** the system SHALL remove the oldest data point to make room for the new one.
