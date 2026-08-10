## ADDED Requirements

### Requirement: Phaser owns entire window
The system SHALL render and control the entire app window through Phaser-native scene rendering and input, with no HTML or DOM controls layered over Phaser.

#### Scenario: No DOM overlays
- **WHEN** the app is running
- **THEN** all rendering and input SHALL be handled by Phaser scenes and `Graphics`/`Text`/hit-areas, with no DOM buttons or overlays

### Requirement: Wide layout arrangement
The system SHALL lay out the app with population stats on the left side of the main world display, controls on the right side, and the population history chart horizontally across the bottom of the window, preserving world aspect ratio.

#### Scenario: Wide layout positions
- **WHEN** the app is viewed in a wide browser window
- **THEN** stats SHALL be on the left, world in the center, controls on the right, and history chart across the bottom

### Requirement: Stats placement
The system SHALL place Chronon, Fish, Sharks, and Status on the left side of the main world display.

#### Scenario: Stats on left
- **WHEN** the app renders
- **THEN** Chronon, Fish, Sharks, and Status SHALL appear on the left of the world

### Requirement: Controls placement
The system SHALL place controls on the right side of the main world display, with speed buttons `1x`, `5x`, `10x`, `30x`, `60x` in one horizontal row and action buttons Play/Pause, Step, Reset each on their own row.

#### Scenario: Controls on right
- **WHEN** the app renders
- **THEN** speed buttons SHALL be in one row and Play/Pause, Step, Reset SHALL each be on their own row on the right side

### Requirement: Population history chart placement and style
The system SHALL render the population history chart horizontally across the bottom of the window, drawing fish and shark lines using the same green and blue colors as the world and stats, with no chart titles or text labels, for a rolling window of 500 chronons.

#### Scenario: Chart across bottom
- **WHEN** the app renders
- **THEN** the chart SHALL span the bottom of the window, show up to 500 samples, use green for fish and blue for sharks, and omit titles and labels

#### Scenario: Chart Y-scale
- **WHEN** history is rendered
- **THEN** the Y-scale SHALL be the maximum of fish and shark counts in the visible 500-sample window (dynamic), with at least 1 to avoid division by zero
