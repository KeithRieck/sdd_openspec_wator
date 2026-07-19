# Spec: population-chart (delta, new capability)

## ADDED Requirements

### Requirement: PC-R1 Chart placement
The population history chart SHALL render horizontally across the bottom of the window in both wide and narrow layouts (PRD AC 44).

#### Scenario: PC-R1.1 Bottom placement
- **WHEN** the app renders in either layout mode
- **THEN** the chart SHALL span the bottom of the window

### Requirement: PC-R2 Rolling history
The system SHALL record one population sample per chronon for a rolling window of 500 chronons; a manual Step while paused SHALL also record a sample (PRD AC 45).

#### Scenario: PC-R2.1 Rolling window
- **WHEN** more than 500 chronons have elapsed
- **THEN** only the most recent 500 samples SHALL be retained and displayed

#### Scenario: PC-R2.2 Step records sample
- **WHEN** the user steps one chronon while paused
- **THEN** one new sample SHALL be appended to the history

### Requirement: PC-R3 Chart appearance
The chart SHALL draw fish and shark population lines using the same green and blue colors as the world and stats, and SHALL omit chart titles and text labels (PRD AC 46, 47).

#### Scenario: PC-R3.1 Colors and no labels
- **WHEN** the chart is rendered
- **THEN** the fish line SHALL be green, the shark line SHALL be blue, and no titles or text labels SHALL appear

### Requirement: PC-R4 Reset clears history
When Reset is activated, the population history SHALL be cleared before new samples are recorded (PRD AC 36).

#### Scenario: PC-R4.1 Cleared on reset
- **WHEN** Reset is activated
- **THEN** the chart SHALL restart from an empty history
