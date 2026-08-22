# population-history Specification

## Requirements

### Requirement: History chart placement
WHERE the population history chart appears, THEN the system SHALL render it horizontally across the bottom of the window.

#### Scenario: Chart region
- **WHEN** the app is displayed
- **THEN** the population history chart spans the bottom of the window below world, stats, and controls

### Requirement: Rolling sampling
WHEN population history is recorded, THEN the system SHALL store one sample per chronon for a rolling window of 500 chronons.

#### Scenario: Window slides
- **WHEN** more than 500 chronons have elapsed
- **THEN** the history retains only the most recent 500 samples

#### Scenario: One sample per chronon
- **WHEN** each chronon completes
- **THEN** exactly one fish/shark population sample is appended to the history

### Requirement: Label-free line chart
WHERE the population history chart is rendered, THEN the system SHALL draw fish and shark population lines using the same green and blue colors as the world and stats, and SHALL omit chart titles and text labels.

#### Scenario: Chart visual content
- **WHEN** the chart is rendered
- **THEN** it shows green and blue population lines with no titles or text labels
