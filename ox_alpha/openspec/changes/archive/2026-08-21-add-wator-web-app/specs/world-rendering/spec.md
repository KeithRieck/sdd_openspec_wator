# world-rendering Specification

## ADDED Requirements

### Requirement: Graphics-only rendering
WHERE rendering is implemented, THEN the system SHALL use Phaser `Graphics` drawing rather than per-cell sprites. The system SHALL draw empty water as the background and draw fish and sharks as abstract circles with no grid lines.

#### Scenario: World frame contents
- **WHEN** the world is rendered
- **THEN** the frame shows a water background with green fish circles and slightly larger blue shark circles, and no grid lines or sprite textures

### Requirement: Immediate state updates
WHEN the world advances by one or more chronons, THEN the system SHALL render immediate state updates without per-cell movement animation.

#### Scenario: Chronon renders instantly
- **WHEN** a chronon completes
- **THEN** the new world state is drawn immediately with no interpolated movement

### Requirement: Creature colors and sizes
Fish SHALL be rendered as green circles; sharks SHALL be rendered as blue circles slightly larger than fish. Colors SHALL be defined as code constants shared with stats and chart rendering.

#### Scenario: Distinguishable creatures
- **WHEN** the world is viewed
- **THEN** fish appear as green circles and sharks as larger blue circles

### Requirement: Grid dimension rescaling
WHEN a programmer changes grid dimension constants in code, THEN the system SHALL gracefully scale and center the world display without requiring UI changes.

#### Scenario: Non-default grid dimensions
- **WHEN** grid constants are changed to new width and height values
- **THEN** the world scales to fit its viewport while preserving aspect ratio and remains centered
