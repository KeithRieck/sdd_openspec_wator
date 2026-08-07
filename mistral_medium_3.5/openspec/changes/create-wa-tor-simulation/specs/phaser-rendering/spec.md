## ADDED Requirements

### Requirement: Phaser 4.x CDN Loading
The system SHALL load Phaser version 4.x from a CDN script tag in index.html. The CDN URL SHALL be https://cdn.jsdelivr.net/npm/phaser@4.1.0/dist/phaser.min.js.

#### Scenario: Phaser loads from CDN
- **WHEN** index.html loads in a browser
- **THEN** the system SHALL load Phaser 4.x from the specified CDN URL

### Requirement: ES2020 Module Loading
The system SHALL load the app through ES2020 JavaScript modules.

#### Scenario: App uses ES2020 modules
- **WHEN** index.html loads
- **THEN** the system SHALL use script tags with type="module"
- **AND** the system SHALL import main.js as a module

### Requirement: Phaser-Native Full Window Rendering
The system SHALL render and control the entire app window through Phaser-native scene rendering and input. No HTML or DOM controls SHALL be layered over Phaser.

#### Scenario: Phaser owns entire window
- **WHEN** the app starts
- **THEN** the system SHALL create a Phaser game that covers the entire browser window
- **AND** all rendering SHALL be done through Phaser Graphics objects
- **AND** no DOM elements SHALL be used for controls or display

### Requirement: World Rendering
The system SHALL draw empty water as the background and draw fish and sharks as abstract circles with no grid lines. Fish SHALL be green circles. Sharks SHALL be blue circles and slightly larger than fish.

#### Scenario: Empty water background
- **WHEN** the world is rendered
- **THEN** the system SHALL draw empty cells as water background

#### Scenario: Fish rendered as green circles
- **WHEN** a fish is present at a grid position
- **THEN** the system SHALL draw a green circle at that position

#### Scenario: Sharks rendered as larger blue circles
- **WHEN** a shark is present at a grid position
- **THEN** the system SHALL draw a blue circle at that position
- **AND** the shark circle SHALL be slightly larger than fish circles

#### Scenario: No grid lines
- **WHEN** the world is rendered
- **THEN** the system SHALL not draw any grid lines

### Requirement: Immediate State Updates
The system SHALL render immediate state updates without per-cell movement animation when the world advances by one or more chronons.

#### Scenario: Immediate rendering on chronon advance
- **WHEN** the simulation advances by one or more chronons
- **THEN** the system SHALL render the new state immediately
- **AND** the system SHALL not animate movement between cells

### Requirement: Responsive Layout
The system SHALL gracefully scale and center the world display when a programmer changes grid dimension constants in code. The system SHALL recompute layout and rendering scale on browser resize without changing the simulation grid dimensions.

#### Scenario: World scales with custom dimensions
- **WHEN** a programmer changes grid width and height constants
- **THEN** the system SHALL scale and center the world display accordingly

#### Scenario: Layout recomputes on resize
- **WHEN** a browser resize occurs
- **THEN** the system SHALL recompute layout and rendering scale
- **AND** the system SHALL not change the simulation grid dimensions

### Requirement: Wide Layout
The system SHALL lay out stats on the left, world in the center, controls on the right, and the history chart across the bottom when the app is viewed on a wide browser window.

#### Scenario: Wide layout arrangement
- **WHEN** the app is viewed on a wide browser window
- **THEN** the system SHALL place stats on the left side
- **AND** the system SHALL place the world in the center
- **AND** the system SHALL place controls on the right side
- **AND** the system SHALL place the history chart across the bottom

### Requirement: Narrow Layout
The system SHALL reflow the display while preserving the world aspect ratio and keeping all controls usable when the app is viewed on a tablet or narrow browser window.

#### Scenario: Narrow layout reflow
- **WHEN** the app is viewed on a tablet or narrow browser window
- **THEN** the system SHALL reflow the display
- **AND** the system SHALL preserve the world aspect ratio
- **AND** the system SHALL keep all controls usable

### Requirement: Graphics API Usage
The system SHALL use Phaser Graphics drawing rather than per-cell sprites for all rendering.

#### Scenario: Graphics used for world
- **WHEN** the world is rendered
- **THEN** the system SHALL use Phaser Graphics objects
- **AND** the system SHALL not use Phaser Sprites

#### Scenario: Graphics used for UI
- **WHEN** stats, controls, or chart are rendered
- **THEN** the system SHALL use Phaser Graphics objects
