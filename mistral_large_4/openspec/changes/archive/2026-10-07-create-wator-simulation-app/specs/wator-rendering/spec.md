# Spec Delta

## Purpose

Provides Phaser-based rendering of the Wa-Tor simulation world using Graphics objects to draw fish and sharks as abstract circles, with immediate state updates and no movement animation.

## ADDED Requirements

### Requirement: Phaser Graphics Rendering
The system SHALL render the simulation world using Phaser Graphics objects rather than sprites.

#### Scenario: World rendered with Graphics
- **WHEN** the simulation world is displayed
- **THEN** the system uses Phaser Graphics to draw all visual elements

### Requirement: Abstract Circle Rendering
The system SHALL draw fish as green circles and sharks as blue circles that are slightly larger than fish, with no grid lines.

#### Scenario: Fish rendered as green circles
- **WHEN** a fish is rendered
- **THEN** the system draws a green circle at the fish's grid position

#### Scenario: Shark rendered as larger blue circle
- **WHEN** a shark is rendered
- **THEN** the system draws a blue circle slightly larger than fish circles at the shark's grid position

### Requirement: Empty Water Background
The system SHALL render empty cells as water background color.

#### Scenario: Empty cells show water
- **WHEN** a cell contains no entity
- **THEN** the system renders the cell with the water background color

### Requirement: Immediate State Updates
The system SHALL render immediate state updates without per-cell movement animation.

#### Scenario: No movement animation
- **WHEN** the world advances by one or more chronons
- **THEN** the system immediately renders the new state without animating entity movements

### Requirement: World Scaling and Centering
The system SHALL gracefully scale and center the world display when grid dimensions change, without requiring UI changes.

#### Scenario: World scales to fit available space
- **WHEN** the world is rendered in the available display area
- **THEN** the system scales the grid to fit while maintaining aspect ratio and centers it

### Requirement: Browser Resize Handling
The system SHALL recompute layout and rendering scale when the browser window resizes, without changing simulation grid dimensions.

#### Scenario: Resize triggers re-layout
- **WHEN** the browser window is resized
- **THEN** the system recomputes the rendering scale and layout while preserving the simulation grid dimensions

### Requirement: Full Window Phaser Control
The system SHALL use Phaser to own and control the entire browser window for rendering and input.

#### Scenario: Phaser owns entire window
- **WHEN** the app is running
- **THEN** Phaser controls the entire browser window with no DOM overlays

### Requirement: Speed-Based Simulation Advancement
The system SHALL advance the simulation according to the selected chronons-per-second speed during Phaser update frames.

#### Scenario: Simulation advances at selected speed
- **WHEN** Phaser update frames occur and the simulation is running
- **THEN** the system advances the simulation at the rate corresponding to the selected speed (1x, 5x, 10x, 30x, or 60x chronons per second)

### Requirement: No Special Throttling Behavior
The system SHALL NOT implement special real-time preservation or catch-up compensation when the browser tab is hidden or throttled.

#### Scenario: Throttled tab behavior
- **WHEN** the browser tab is hidden or throttled
- **THEN** the system allows the browser's default throttling behavior without compensation
