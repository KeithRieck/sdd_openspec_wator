## ADDED Requirements

### Requirement: Population History Storage
The system SHALL store one sample per chronon for a rolling window of 500 chronons.

#### Scenario: Sample stored per chronon
- **WHEN** a chronon completes
- **THEN** the system SHALL store one population sample

#### Scenario: Rolling window of 500
- **WHEN** more than 500 chronons have elapsed
- **THEN** the system SHALL maintain only the most recent 500 samples
- **AND** the system SHALL discard older samples

### Requirement: Population History Chart Rendering
The system SHALL render the population history chart horizontally across the bottom of the window.

#### Scenario: Chart rendered across bottom
- **WHEN** the app is running
- **THEN** the system SHALL render the population history chart horizontally across the bottom of the window

### Requirement: Chart Line Colors
The system SHALL draw fish and shark population lines using the same green and blue colors as the world and stats.

#### Scenario: Fish line is green
- **WHEN** the population history chart is rendered
- **THEN** the system SHALL draw the fish population line in green

#### Scenario: Shark line is blue
- **WHEN** the population history chart is rendered
- **THEN** the system SHALL draw the shark population line in blue

### Requirement: Chart Without Labels
The system SHALL omit chart titles and text labels from the population history chart.

#### Scenario: No chart titles
- **WHEN** the population history chart is rendered
- **THEN** the system SHALL not display any chart title

#### Scenario: No text labels
- **WHEN** the population history chart is rendered
- **THEN** the system SHALL not display any text labels

### Requirement: Live Population Stats
The system SHALL display live population counts for fish and sharks as part of the stats display.

#### Scenario: Live fish count displayed
- **WHEN** the app is running
- **THEN** the system SHALL display the current fish population count

#### Scenario: Live shark count displayed
- **WHEN** the app is running
- **THEN** the system SHALL display the current shark population count
