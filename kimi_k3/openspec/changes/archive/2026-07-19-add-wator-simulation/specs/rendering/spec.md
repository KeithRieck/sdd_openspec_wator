# Spec: rendering (delta, new capability)

## ADDED Requirements

### Requirement: RE-R1 Graphics-only rendering
The world SHALL be rendered using Phaser `Graphics` drawing exclusively; Phaser Sprites SHALL NOT be used, and no grid lines SHALL be drawn (PRD AC 28, 50).

#### Scenario: RE-R1.1 Render implementation
- **WHEN** the world render path is inspected
- **THEN** all visual output SHALL come from Phaser `Graphics` API calls

### Requirement: RE-R2 Entity appearance
Empty water SHALL be drawn as the background, fish SHALL be drawn as green circles, and sharks SHALL be drawn as blue circles slightly larger than fish (PRD AC 28).

#### Scenario: RE-R2.1 Fish and shark display
- **WHEN** the world is rendered
- **THEN** fish SHALL appear as green circles and sharks as larger blue circles against the water background

### Requirement: RE-R3 Immediate updates
When the world advances by one or more chronons, the display SHALL update immediately with no per-cell movement animation or interpolation (PRD AC 29).

#### Scenario: RE-R3.1 No animation
- **WHEN** a chronon advances
- **THEN** the next rendered frame SHALL show the new state directly without tweening or interpolation

### Requirement: RE-R4 Scaling and centering
The world display SHALL scale and center automatically from the grid dimension constants without requiring UI changes when a programmer changes those constants (PRD AC 8).

#### Scenario: RE-R4.1 Constant-driven scaling
- **WHEN** grid dimension constants are changed in code and the app reloads
- **THEN** the world SHALL render scaled and centered with no other code modifications

### Requirement: RE-R5 Resize handling
On browser resize, the layout and rendering scale SHALL be recomputed without changing simulation grid dimensions (PRD AC 9).

#### Scenario: RE-R5.1 Resize preserves grid
- **WHEN** the browser window is resized
- **THEN** the world SHALL rescale and recenter while the simulation grid remains 100x70 (or current constants)

### Requirement: RE-R6 Phaser-native full-window UI
The entire app window SHALL be rendered and controlled through Phaser-native scene rendering and input; no HTML or DOM controls SHALL be layered over Phaser (PRD AC 5).

#### Scenario: RE-R6.1 No DOM overlays
- **WHEN** the running app is inspected in the browser
- **THEN** all interactive controls SHALL be Phaser objects, not DOM elements
