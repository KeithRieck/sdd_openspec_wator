# Rendering & UI Specification

## Purpose

Defines the Phaser-based rendering and user interface layer for the Wa-Tor simulation: full-window Phaser scenes, graphics-based world rendering, stats/controls/chart layout, speed and action control behavior, responsive layout, and timing via a Phaser accumulator.

## Requirements

### Requirement: Phaser owns the full window
The system SHALL render and control the entire app window through Phaser-native scene rendering and input. No HTML or DOM controls SHALL be layered over Phaser.

#### Scenario: No DOM controls
- **WHEN** the app runs
- **THEN** all controls, stats, world display, and chart SHALL be rendered inside Phaser scenes with no DOM overlay elements

### Requirement: App launch behavior
WHEN the app launches, the system SHALL start directly in a running Wa-Tor simulation at 10x speed with no landing page or instruction screen.

#### Scenario: Direct simulation start
- **WHEN** the app loads in the browser
- **THEN** a running simulation SHALL be visible immediately at 10x speed with no intermediate screen

### Requirement: Phaser 4.x CDN load
WHEN `index.html` loads the app, the system SHALL load Phaser version 4.x from a CDN script tag and SHALL load the app through ES2020 JavaScript modules.

#### Scenario: Phaser loaded from CDN
- **WHEN** `index.html` is opened
- **THEN** Phaser 4.x SHALL be loaded from `https://cdn.jsdelivr.net/npm/phaser@4.1.0/dist/phaser.min.js` via a script tag, and app modules SHALL load as ES2020 modules

### Requirement: Graphics-based rendering
WHERE rendering is implemented, the system SHALL use Phaser `Graphics` drawing rather than per-cell sprites. Fish and sharks SHALL be drawn as abstract circles with no grid lines.

#### Scenario: No sprites used
- **WHEN** the world is rendered
- **THEN** fish and sharks SHALL be drawn as circles via `Graphics` methods, and no Phaser `Sprite` or `Image` SHALL be used for world cells

#### Scenario: No grid lines
- **WHEN** the world is rendered
- **THEN** empty water SHALL be the background and no grid lines SHALL be drawn

### Requirement: Entity appearance
Fish SHALL be drawn as green circles. Sharks SHALL be drawn as blue circles and SHALL be slightly larger than fish.

#### Scenario: Fish appearance
- **WHEN** a fish is rendered
- **THEN** it SHALL appear as a green circle

#### Scenario: Shark appearance
- **WHEN** a shark is rendered
- **THEN** it SHALL appear as a blue circle larger than a fish circle

### Requirement: Immediate state updates
WHEN the world advances by one or more chronons, the system SHALL render immediate state updates without per-cell movement animation.

#### Scenario: No movement animation
- **WHEN** the simulation advances chronons
- **THEN** the world SHALL redraw with the new positions immediately with no interpolation or movement animation

### Requirement: Stats panel placement
WHERE population stats appear, the system SHALL place Chronon, Fish, Sharks, and Status on the left side of the main world display.

#### Scenario: Stats on left
- **WHEN** the app is viewed on a wide window
- **THEN** the stats panel showing Chronon, Fish, Sharks, and Status SHALL appear on the left side of the world display

### Requirement: Controls placement
WHERE controls appear, the system SHALL place controls on the right side of the main world display.

#### Scenario: Controls on right
- **WHEN** the app is viewed on a wide window
- **THEN** the control buttons SHALL appear on the right side of the world display

### Requirement: Speed controls layout
WHERE speed controls appear, the system SHALL show 1x, 5x, 10x, 30x, and 60x buttons in one horizontal row. The currently selected speed SHALL be visually distinguished as a segmented control.

#### Scenario: Speed buttons in a row
- **WHEN** the controls panel is rendered
- **THEN** the five speed buttons SHALL appear in a single horizontal row

#### Scenario: Selected speed highlighted
- **WHEN** a speed is selected
- **THEN** that speed button SHALL show a selected visual state distinct from unselected speed buttons

### Requirement: Action controls layout
WHERE action controls appear, the system SHALL show only Play/Pause, Step, and Reset, with each action button on its own row.

#### Scenario: Three action buttons
- **WHEN** the controls panel is rendered
- **THEN** exactly Play/Pause, Step, and Reset buttons SHALL appear, each on its own row

### Requirement: Running-state control behavior
WHILE the simulation is running, the system SHALL disable Step and SHALL allow speed changes to take effect during subsequent updates.

#### Scenario: Step disabled while running
- **WHEN** the simulation is running
- **THEN** the Step button SHALL be disabled

#### Scenario: Speed change while running
- **WHEN** a speed button is clicked while running
- **THEN** the new speed SHALL take effect on subsequent updates without pausing the simulation

### Requirement: Paused-state control behavior
WHILE the simulation is paused, the system SHALL allow Step to advance exactly one chronon and SHALL keep selected speed changes from resuming the simulation.

#### Scenario: Step advances one chronon
- **WHEN** Step is clicked while paused
- **THEN** the simulation SHALL advance exactly one chronon and remain paused

#### Scenario: Speed change while paused
- **WHEN** a speed button is clicked while paused
- **THEN** the selected speed SHALL update but the simulation SHALL NOT resume running

### Requirement: Terminal-state control behavior
WHILE the simulation is terminal, the system SHALL keep Play disabled and SHALL require Reset to start another run.

#### Scenario: Play disabled when terminal
- **WHEN** the simulation is in a terminal extinction state
- **THEN** the Play button SHALL be disabled

#### Scenario: Reset required after extinction
- **WHEN** the simulation is terminal and the user wants to continue
- **THEN** only Reset SHALL start a new run

### Requirement: Population history chart placement
WHERE the population history chart appears, the system SHALL render it horizontally across the bottom of the window.

#### Scenario: Chart at bottom
- **WHEN** the app is viewed
- **THEN** the population history chart SHALL span the bottom of the window horizontally

### Requirement: Population history chart rendering
WHERE the chart is rendered, the system SHALL draw fish and shark population lines using the same green and blue colors as the world and stats, SHALL omit chart titles and text labels, and SHALL auto-scale the vertical axis to the maximum population in the rolling 500-chronon window.

#### Scenario: Two colored lines
- **WHEN** the chart is rendered
- **THEN** a green line SHALL represent fish population and a blue line SHALL represent shark population

#### Scenario: No labels
- **WHEN** the chart is rendered
- **THEN** no titles, axis labels, or tick labels SHALL appear

#### Scenario: Auto-scaled vertical axis
- **WHEN** the chart is rendered
- **THEN** the vertical scale SHALL be determined by the maximum population value in the current 500-chronon window

### Requirement: Wide window layout
WHEN the app is viewed on a wide browser window, the system SHALL lay out stats on the left, world in the center, controls on the right, and the history chart across the bottom.

#### Scenario: Wide layout regions
- **WHEN** the browser window is wide
- **THEN** stats SHALL be left, world SHALL be centered, controls SHALL be right, and chart SHALL span the bottom

### Requirement: Tablet and narrow window layout
WHEN the app is viewed on a tablet or narrow browser window, the system SHALL reflow the display while preserving the world aspect ratio and keeping all controls usable.

#### Scenario: Narrow reflow preserves aspect ratio
- **WHEN** the browser window is narrow (e.g., iPad mini 744 x 1133 CSS pixels)
- **THEN** the world SHALL reflow while preserving its 100:70 aspect ratio and all controls SHALL remain usable

### Requirement: Browser resize handling
WHEN a browser resize occurs, the system SHALL recompute layout and rendering scale without changing the simulation grid dimensions.

#### Scenario: Resize recomputes layout
- **WHEN** the browser window is resized
- **THEN** the layout and rendering scale SHALL recompute but the grid dimensions SHALL remain unchanged

### Requirement: Speed timing via accumulator
WHEN Phaser update frames occur, the system SHALL advance the simulation according to the selected chronons-per-second speed as normally as the browser allows, using an accumulator with `stepMs = 1000 / speed`.

#### Scenario: 60x speed
- **WHEN** speed is 60x
- **THEN** the system SHALL advance approximately one chronon per frame (stepMs ≈ 16.7ms)

#### Scenario: 1x speed
- **WHEN** speed is 1x
- **THEN** the system SHALL advance approximately one chronon per second (stepMs = 1000ms)

### Requirement: No catch-up on tab throttle
IF the browser tab is hidden or throttled, the system SHALL NOT implement special real-time preservation or catch-up compensation behavior.

#### Scenario: Throttled tab
- **WHEN** the browser tab becomes hidden or throttled
- **THEN** the system SHALL not attempt to catch up on missed chronons when the tab returns to focus

### Requirement: Status display
WHILE the simulation is not terminal and running, the system SHALL display `Running`. WHILE not terminal and paused, the system SHALL display `Paused`. WHILE terminal, the system SHALL display the terminal status (`Sharks extinct`, `Fish extinct`, or `Ecosystem collapsed`).

#### Scenario: Running status
- **WHEN** the simulation is running and not terminal
- **THEN** the status SHALL display `Running`

#### Scenario: Paused status
- **WHEN** the simulation is paused and not terminal
- **THEN** the status SHALL display `Paused`

### Requirement: Familiar button affordance
The system SHALL render buttons as rounded rectangles with a text label and SHALL provide normal, hover, active/pressed, and disabled visual states. Speed buttons SHALL behave as a segmented control with a selected state on the active speed.

#### Scenario: Button states
- **WHEN** a button is rendered
- **THEN** it SHALL show distinct visual states for normal, hover, pressed, and disabled

#### Scenario: Segmented speed control
- **WHEN** speed buttons are rendered
- **THEN** the active speed SHALL show a selected state distinct from unselected speeds
