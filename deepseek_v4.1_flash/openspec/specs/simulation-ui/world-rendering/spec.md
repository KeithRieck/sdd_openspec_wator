# simulation-ui/world-rendering Specification

## Purpose

Defines what the user sees: the live world drawing, the population statistics readout, the population history chart, and how the whole display rearranges between wide and narrow browser windows.

## Requirements

### Requirement: 1 World rendering

The system SHALL render the world by drawing empty water as the background and drawing fish and sharks as abstract circles with no grid lines, using Phaser `Graphics` drawing rather than per-cell sprites.

#### Scenario: 1.1 Water is drawn as the background

- **WHEN** the world is rendered
- **THEN** the system draws the water background color for the empty region of the grid

#### Scenario: 1.2 Fish are drawn as green circles

- **WHEN** the world is rendered and a cell holds a fish
- **THEN** the system draws a green circle at that cell

#### Scenario: 1.3 Sharks are drawn as slightly larger blue circles

- **WHEN** the world is rendered and a cell holds a shark
- **THEN** the system draws a blue circle at that cell that is slightly larger than a fish circle

#### Scenario: 1.4 No grid lines are drawn

- **WHEN** the world is rendered
- **THEN** the system draws no grid lines

#### Scenario: 1.5 Rendering uses Graphics rather than sprites

- **WHEN** the world is rendered
- **THEN** the system draws using Phaser `Graphics` and does not create per-cell sprites

### Requirement: 2 Immediate state updates

The system SHALL render the updated world state immediately when the simulation advances, without per-cell movement animation.

#### Scenario: 2.1 State updates are immediate

- **WHEN** the world advances by one or more chronons
- **THEN** the system renders the new state without animating movement between cells

#### Scenario: 2.2 No movement interpolation is drawn

- **WHEN** the world is rendered after a chronon
- **THEN** the system draws entities only at their current cells and draws no interpolation between an entity's previous and current cell

### Requirement: 3 Live population statistics

The system SHALL display the current Chronon, Fish count, Shark count, and Status on the left side of the main world display.

#### Scenario: 3.1 Statistics appear on the left of the world

- **WHEN** the app is viewed
- **THEN** the system displays Chronon, Fish, Sharks, and Status on the left side of the main world display

#### Scenario: 3.2 Statistics track the simulation

- **WHEN** the simulation advances
- **THEN** the displayed chronon and population counts reflect the current simulation state

#### Scenario: 3.3 Status reports the running state

- **WHEN** the simulation is not terminal and is running
- **THEN** the system displays the status `Running`

#### Scenario: 3.4 Status reports the paused state

- **WHEN** the simulation is not terminal and is paused
- **THEN** the system displays the status `Paused`

### Requirement: 4 Population history chart

The system SHALL render a population history chart horizontally across the bottom of the window, drawing the fish and shark population lines using the same green and blue colors as the world and stats, and SHALL omit chart titles and text labels.

#### Scenario: 4.1 Chart spans the bottom of the window

- **WHEN** the app is viewed
- **THEN** the system renders the population history chart horizontally across the bottom of the window

#### Scenario: 4.2 Chart lines match the world colors

- **WHEN** the chart is rendered
- **THEN** the fish line uses the same green as the fish circles and the shark line uses the same blue as the shark circles

#### Scenario: 4.3 Color is not the only distinction between chart lines

- **WHEN** the chart is rendered
- **THEN** the fish and shark lines differ in shape or thickness in addition to color, so the two populations remain distinguishable without relying on color alone

#### Scenario: 4.4 Chart has no titles or labels

- **WHEN** the chart is rendered
- **THEN** the system draws no chart title and no text labels

#### Scenario: 4.5 Chart reflects the rolling window

- **WHEN** the chart is rendered
- **THEN** the system plots the retained population samples in chronon order

#### Scenario: 4.6 Vertical scale is fixed to the initial population

- **WHEN** the chart is rendered
- **THEN** the vertical axis is scaled to the initial population rather than re-scaling as the population changes

### Requirement: 5 Wide and narrow layouts

The system SHALL lay out statistics on the left, the world in the center, controls on the right, and the history chart across the bottom when the window is wide. When the window is narrow, as on a tablet, the system SHALL reflow the display into stacked regions while preserving the world aspect ratio and keeping every control usable.

#### Scenario: 5.1 Wide layout places regions side by side

- **WHEN** the app is viewed in a wide browser window
- **THEN** the system lays out stats on the left, the world in the center, controls on the right, and the history chart across the bottom

#### Scenario: 5.2 Narrow layout stacks regions

- **WHEN** the app is viewed at the minimum supported tablet viewport size of `744 x 1133` CSS pixels
- **THEN** the system reflows the display into stacked regions with the stats strip above the world and the controls below it

#### Scenario: 5.3 World aspect ratio is preserved when narrowing

- **WHEN** the layout reflows to the narrow arrangement
- **THEN** the world is scaled to fit the available space while preserving its aspect ratio

#### Scenario: 5.4 All controls remain usable when narrowing

- **WHEN** the layout reflows to the narrow arrangement
- **THEN** every control remains fully visible and usable, with no control hidden or clipped

#### Scenario: 5.5 Resize recomputes layout without changing grid dimensions

- **WHEN** a browser resize occurs
- **THEN** the system recomputes the layout and rendering scale and does not change the simulation grid dimensions
