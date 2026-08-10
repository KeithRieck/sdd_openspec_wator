# rendering Specification

## Purpose
TBD - created by archiving change add-wator-phaser-app. Update Purpose after archive.
## Requirements
### Requirement: Phaser Graphics world rendering
The system SHALL render the world using Phaser `Graphics` drawing (not sprites) with empty water as background and fish and sharks as abstract circles with no grid lines.

#### Scenario: World draws circles
- **WHEN** the world is rendered
- **THEN** empty cells SHALL show water background and fish SHALL be green circles and sharks SHALL be blue circles slightly larger than fish, with no grid lines

#### Scenario: No sprites used
- **WHEN** rendering is implemented
- **THEN** the system SHALL use `Graphics` drawing rather than per-cell sprites

### Requirement: Immediate per-chronon updates
The system SHALL render immediate state updates when the world advances by one or more chronons, with no per-cell movement animation or interpolation.

#### Scenario: No movement animation
- **WHEN** the world advances
- **THEN** the display SHALL update immediately to the new state without animating movement between cells

### Requirement: World scale and center on resize
The system SHALL gracefully scale and center the world display when grid dimension constants change or when the browser resizes, without changing simulation grid dimensions.

#### Scenario: Resize recomputes scale
- **WHEN** the browser window resizes
- **THEN** the system SHALL recompute layout and rendering scale (cellSize and offsets) to keep the world centered and aspect-preserved, without altering `W` or `H`

#### Scenario: Grid constant change scales display
- **WHEN** a programmer changes grid dimension constants in code
- **THEN** the world display SHALL scale and center to fit the new dimensions without requiring UI changes

