## Purpose

Defines the behavior of the bottom rolling population history chart: its placement, sampling, colors, and label-free rendering.

## ADDED Requirements

### Requirement: R1. Chart placement
The system SHALL render the population history chart horizontally across the bottom of the window.

#### Scenario: R1.1 Bottom placement
- **WHEN** the app is rendered
- **THEN** the population history chart SHALL span horizontally across the bottom of the window

### Requirement: R2. Chart data
The system SHALL draw fish and shark population lines from the rolling population history, using the same green and blue colors as the world and stats.

#### Scenario: R2.1 Population lines
- **WHEN** the chart is rendered
- **THEN** it SHALL draw a fish population line in green and a shark population line in blue, matching the world and stats colors

#### Scenario: R2.2 Rolling window
- **WHEN** the chart is rendered
- **THEN** it SHALL reflect the rolling window of up to 500 chronon samples

### Requirement: R3. Label-free rendering
The system SHALL omit chart titles and text labels.

#### Scenario: R3.1 No labels
- **WHEN** the chart is rendered
- **THEN** it SHALL contain no titles or text labels
