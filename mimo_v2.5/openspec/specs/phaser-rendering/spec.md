## ADDED Requirements

### Requirement: Phaser 4 CDN loading
The system SHALL load Phaser version 4.x from a CDN script tag in index.html and load the app through ES2020 JavaScript modules.

#### Scenario: index.html loads Phaser from CDN
- **WHEN** index.html is loaded by the browser
- **THEN** the page SHALL include a script tag loading Phaser 4.x from https://cdn.jsdelivr.net/npm/phaser@4.1.0/dist/phaser.min.js

#### Scenario: App entry point uses ES modules
- **WHEN** the app starts
- **THEN** the entry point SHALL be loaded as an ES2020 module via a script tag with type="module"

### Requirement: Full-window Phaser rendering
The system SHALL render and control the entire app window through Phaser-native scene rendering and input.

#### Scenario: Phaser owns the full viewport
- **WHEN** the app launches
- **THEN** Phaser SHALL create a canvas that fills the entire browser window

### Requirement: Immediate state rendering
When the world advances by one or more chronons, the system SHALL render immediate state updates without per-cell movement animation.

#### Scenario: No movement animation
- **WHEN** a chronon completes
- **THEN** entities SHALL appear at their new positions immediately with no interpolation or transition animation

### Requirement: World rendering with Graphics
The system SHALL use Phaser Graphics drawing rather than per-cell sprites to render the world.

#### Scenario: Fish rendered as green circles
- **WHEN** the world is rendered
- **THEN** each fish SHALL be drawn as a green circle using Phaser Graphics

#### Scenario: Sharks rendered as blue circles
- **WHEN** the world is rendered
- **THEN** each shark SHALL be drawn as a blue circle using Phaser Graphics, slightly larger than fish circles

#### Scenario: Empty water as background
- **WHEN** the world is rendered
- **THEN** empty cells SHALL be represented by the background color (no grid lines)

### Requirement: Responsive wide-window layout
When the app is viewed on a wide browser window, the system SHALL lay out stats on the left, world in the center, controls on the right, and the history chart across the bottom.

#### Scenario: Wide layout arrangement
- **WHEN** the browser window is wider than a minimum breakpoint
- **THEN** the system SHALL display: stats panel on the left, the world grid in the center, controls on the right, and the population history chart across the bottom

### Requirement: Responsive narrow-window layout
When the app is viewed on a tablet or narrow browser window, the system SHALL reflow the display while preserving the world aspect ratio and keeping all controls usable.

#### Scenario: Narrow layout reflow
- **WHEN** the browser window width is below the wide-layout breakpoint
- **THEN** the system SHALL reflow the layout while preserving the world aspect ratio and keeping all controls visible and usable

### Requirement: Browser resize handling
When a browser resize occurs, the system SHALL recompute layout and rendering scale without changing the simulation grid dimensions.

#### Scenario: Window resize triggers relayout
- **WHEN** the browser window is resized
- **THEN** the system SHALL recompute the world display scale and reposition all UI elements without changing the simulation grid dimensions

### Requirement: Grid dimension change scales gracefully
When a programmer changes grid dimension constants in code, the system SHALL gracefully scale and center the world display without requiring UI changes.

#### Scenario: Custom grid dimensions
- **WHEN** grid dimension constants are changed in the config module
- **THEN** the world display SHALL scale and center automatically within the available layout space
