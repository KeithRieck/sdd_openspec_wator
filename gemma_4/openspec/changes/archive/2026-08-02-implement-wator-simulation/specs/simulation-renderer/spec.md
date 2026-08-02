## ADDED Requirements

### Requirement: Simulation Rendering
The system SHALL render the simulation state using Phaser 4 Graphics.

#### Scenario: World Rendering
- **WHEN** the simulation state updates
- **THEN** the system SHALL draw the grid background and all active entities as circles.

#### Scenario: Entity Visuals
- **WHEN** rendering entities
- **THEN** fish SHALL be green circles and sharks SHALL be blue circles (slightly larger).

### Requirement: Responsive Scaling
The system SHALL scale the fixed-dimension grid to fit the browser window.

#### Scenario: Window Resize
- **WHEN** the browser window is resized
- **THEN** the system SHALL recompute the scale and center the world view without changing the simulation grid dimensions.
