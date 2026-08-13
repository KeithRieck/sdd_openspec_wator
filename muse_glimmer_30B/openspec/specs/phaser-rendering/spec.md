# Phaser Rendering

## Purpose
TBD

## Requirements

### Requirement: Phaser scene loading
The system SHALL load Phaser 4.x from CDN and start directly in running simulation at 10x speed.

#### Scenario: App launch
- **WHEN** index.html loads
- **THEN** Phaser loads and SimulationScene starts at 10x speed

### Requirement: Graphics rendering
The system SHALL render world using Phaser Graphics with green fish circles and blue shark circles, no grid lines.

#### Scenario: World render
- **WHEN** simulation updates
- **THEN** entities drawn as circles with correct colors

### Requirement: Responsive layout
The system SHALL recompute layout on browser resize while preserving world aspect ratio.

#### Scenario: Resize
- **WHEN** window resizes
- **THEN** world scales and centers without changing grid dimensions
