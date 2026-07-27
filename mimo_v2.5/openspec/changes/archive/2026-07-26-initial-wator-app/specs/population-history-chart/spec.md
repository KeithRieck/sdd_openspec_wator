## ADDED Requirements

### Requirement: Population history chart placement
The population history chart SHALL be rendered horizontally across the bottom of the window.

#### Scenario: Chart at bottom
- **WHEN** the app is displayed
- **THEN** the population history chart SHALL occupy a horizontal band at the bottom of the window

### Requirement: Rolling population history window
The system SHALL store one population sample per chronon for a rolling window of 500 chronons.

#### Scenario: Samples recorded per chronon
- **WHEN** each chronon completes
- **THEN** the system SHALL record the current fish count and shark count as one sample

#### Scenario: Rolling window limit
- **WHEN** more than 500 samples have been recorded
- **THEN** the oldest sample SHALL be discarded to maintain a window of 500 chronons

### Requirement: Population line colors
The system SHALL draw fish and shark population lines using the same green and blue colors as the world rendering and stats display.

#### Scenario: Fish line is green
- **WHEN** the population history chart is rendered
- **THEN** the fish population line SHALL use the same green color as fish circles in the world

#### Scenario: Shark line is blue
- **WHEN** the population history chart is rendered
- **THEN** the shark population line SHALL use the same blue color as shark circles in the world

### Requirement: No chart text labels
The population history chart SHALL omit chart titles and text labels.

#### Scenario: Chart has no text
- **WHEN** the population history chart is rendered
- **THEN** the chart SHALL display only the population lines with no title, axis labels, legends, or other text
