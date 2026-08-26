## Purpose

Defines the behavior of the Phaser 4 application shell: scene lifecycle, Graphics-based world rendering, speed-based chronon scheduling, and responsive layout across window sizes.

## ADDED Requirements

### Requirement: R1. App launch
The system SHALL start directly in a running Wa-Tor simulation at 10x speed when the app launches, with no landing page or instruction screen.

#### Scenario: R1.1 Immediate start
- **WHEN** the app launches
- **THEN** the simulation SHALL be running at 10x speed with a freshly populated world

### Requirement: R2. Static app shell
The system SHALL load Phaser 4.x from a CDN script tag and load the app through ES2020 JavaScript modules, with no build step, no backend, and no required Node.js dependency.

#### Scenario: R2.1 Module loading
- **WHEN** `index.html` loads in a browser
- **THEN** Phaser 4.x SHALL be loaded from a CDN script tag and the application SHALL run as ES2020 modules

#### Scenario: R2.2 Subpath deployment
- **WHEN** the app is deployed from a repository subpath
- **THEN** all same-origin assets SHALL load correctly using relative paths

### Requirement: R3. Phaser-native full-window rendering
The system SHALL render and control the entire app window through Phaser-native scene rendering and input, with no HTML or DOM controls layered over Phaser.

#### Scenario: R3.1 No DOM overlay
- **WHEN** the app is rendered
- **THEN** all visible UI elements SHALL be drawn by Phaser scenes, with no DOM elements overlaid on the canvas

### Requirement: R4. World rendering
The system SHALL draw empty water as the background and draw fish and sharks as abstract circles with no grid lines, using Phaser Graphics drawing rather than per-cell sprites; fish SHALL be green circles and sharks SHALL be blue circles slightly larger than fish.

#### Scenario: R4.1 Circle rendering
- **WHEN** the world is rendered
- **THEN** each fish SHALL appear as a green circle and each shark as a slightly larger blue circle, with no grid lines

#### Scenario: R4.2 Immediate state updates
- **WHEN** the world advances by one or more chronons
- **THEN** the rendering SHALL reflect the new state immediately without per-cell movement animation

### Requirement: R5. Speed-based chronon scheduling
The system SHALL advance the simulation according to the selected chronons-per-second speed as normally as the browser allows, and SHALL not implement special real-time preservation or catch-up compensation when the browser tab is hidden or throttled.

#### Scenario: R5.1 Speed honored
- **WHILE** the simulation is running
- **THEN** the system SHALL advance the simulation at the selected chronons-per-second rate as normally as the browser allows

#### Scenario: R5.2 No catch-up
- **IF** the browser tab is hidden or throttled
- **THEN** the system SHALL not implement special real-time preservation or catch-up compensation behavior

### Requirement: R6. Responsive layout
The system SHALL lay out stats on the left, world in the center, controls on the right, and the history chart across the bottom on wide windows, and SHALL reflow the display while preserving the world aspect ratio and keeping all controls usable on tablet or narrow windows; the world display SHALL scale and center gracefully when grid dimension constants change, and browser resizes SHALL recompute layout without changing the simulation grid dimensions.

#### Scenario: R6.1 Wide layout
- **WHEN** the app is viewed on a wide browser window
- **THEN** stats SHALL appear on the left, the world in the center, controls on the right, and the history chart across the bottom

#### Scenario: R6.2 Narrow reflow
- **WHEN** the app is viewed on a tablet or narrow browser window
- **THEN** the display SHALL reflow while preserving the world aspect ratio and keeping all controls usable

#### Scenario: R6.3 Resize
- **WHEN** a browser resize occurs
- **THEN** the system SHALL recompute layout and rendering scale without changing the simulation grid dimensions

#### Scenario: R6.4 Grid constant changes
- **WHEN** a programmer changes grid dimension constants in code
- **THEN** the world display SHALL scale and center without requiring UI changes
