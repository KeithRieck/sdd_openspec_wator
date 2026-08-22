# responsive-layout Specification

## Requirements

### Requirement: Wide layout regions
WHEN the app is viewed on a wide browser window, THEN the system SHALL lay out stats on the left, world in the center, controls on the right, and the history chart across the bottom.

#### Scenario: Wide window arrangement
- **WHEN** the browser window is wide enough for side panels
- **THEN** stats, world, controls, and chart occupy left, center, right, and bottom regions respectively

### Requirement: Narrow and tablet reflow
WHEN the app is viewed on a tablet or narrow browser window, THEN the system SHALL reflow the display while preserving the world aspect ratio and keeping all controls usable. The minimum supported CSS viewport SHALL be iPad mini dimensions of 744 x 1133 pixels.

#### Scenario: iPad mini portrait
- **WHEN** the viewport is 744 x 1133 CSS pixels
- **THEN** all panels remain visible and usable and the world preserves its aspect ratio

### Requirement: Resize recomputation
WHEN a browser resize occurs, THEN the system SHALL recompute layout and rendering scale without changing the simulation grid dimensions.

#### Scenario: Window resized mid-run
- **WHEN** the user resizes the browser window while the simulation runs
- **THEN** the layout recomputes and rendering rescales while grid dimensions and simulation state are unchanged

### Requirement: Layout solver purity
Layout computation SHALL be a pure function of viewport width, viewport height, and grid aspect ratio, producing rectangles for every UI region.

#### Scenario: Deterministic layout
- **WHEN** the solver is invoked twice with identical inputs
- **THEN** it produces identical region rectangles
