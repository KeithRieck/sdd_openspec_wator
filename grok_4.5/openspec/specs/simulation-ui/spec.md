## Purpose

Phaser-native presentation: world rendering, stats, controls, population chart, pacing, and run-state UX.

## Requirements

### Requirement: 1 - Phaser-native full-window UI
The system SHALL render and control the entire app window through Phaser scene rendering and input with no HTML/DOM control overlays. Layout for this change SHALL use the wide arrangement: stats on the left, world in the center, controls on the right, and population history chart across the bottom.

#### Scenario: Launch shows simulation chrome
- **WHEN** the simulation scene starts
- **THEN** the user SHALL see stats, world, controls, and chart regions without a landing page

### Requirement: 2 - World rendering
The system SHALL draw empty water as the background and fish/sharks as abstract circles via Phaser `Graphics` (no sprites, no grid lines). Fish SHALL be green circles; sharks SHALL be blue circles slightly larger than fish. State updates SHALL be immediate with no per-cell movement animation.

#### Scenario: Graphics-only creatures
- **WHEN** the world is rendered
- **THEN** creatures SHALL be drawn with Graphics circles and not Phaser Sprites

#### Scenario: Immediate redraw after step
- **WHEN** the simulation advances one or more chronons
- **THEN** the world display SHALL reflect the new occupancy without interpolating motion

### Requirement: 3 - Stats panel
The system SHALL show Chronon, Fish, Sharks, and Status on the left of the world. Status SHALL be `Running` when non-terminal and playing, `Paused` when non-terminal and paused, or the extinction string when terminal.

#### Scenario: Running status
- **WHEN** the simulation is non-terminal and playing
- **THEN** Status SHALL display `Running`

#### Scenario: Paused status
- **WHEN** the simulation is non-terminal and paused
- **THEN** Status SHALL display `Paused`

#### Scenario: Terminal status text
- **WHEN** extinction has been detected
- **THEN** Status SHALL display the extinction string from the engine

### Requirement: 4 - Control panel layout
The system SHALL place controls on the right of the world with speed buttons `1x`, `5x`, `10x`, `30x`, and `60x` in one horizontal row, and Play/Pause, Step, and Reset each on its own row.

#### Scenario: Speed row present
- **WHEN** the control panel is shown
- **THEN** all five speed options SHALL appear in one row

#### Scenario: Action buttons stacked
- **WHEN** the control panel is shown
- **THEN** Play/Pause, Step, and Reset SHALL each occupy a separate row

### Requirement: 5 - Play, pause, and step behavior
While running, Step SHALL be disabled and speed changes SHALL affect subsequent updates without requiring pause. While paused and non-terminal, Step SHALL advance exactly one chronon and speed changes SHALL NOT resume the simulation. Default launch state SHALL be running at `10x`.

#### Scenario: Launch defaults
- **WHEN** the app launches into the simulation scene
- **THEN** the simulation SHALL be running at `10x` speed

#### Scenario: Step only when paused
- **WHEN** the simulation is running
- **THEN** the Step control SHALL be disabled

#### Scenario: Single step while paused
- **WHEN** the simulation is paused and non-terminal and Step is activated
- **THEN** the engine SHALL advance exactly one chronon and remain paused unless that chronon is terminal

### Requirement: 6 - Reset behavior
When Reset is activated, the system SHALL create a new random world, set chronon to 0, clear extinction status, clear and reseed population history, and resume running at the currently selected speed.

#### Scenario: Reset resumes at selected speed
- **WHEN** the user selects `30x` then activates Reset
- **THEN** a new run SHALL start in the running state at `30x`

### Requirement: 7 - Terminal run state
When either species is extinct, the system SHALL auto-pause into a terminal state, disable Play, and require Reset to start another run. While terminal, Step SHALL NOT advance the world.

#### Scenario: Auto-pause on extinction
- **WHEN** a chronon ends in an extinction state during multi-step or single-step advancement
- **THEN** the UI SHALL enter terminal mode and stop further chronon steps

#### Scenario: Play disabled when terminal
- **WHEN** the simulation is terminal
- **THEN** Play SHALL be disabled until Reset

### Requirement: 8 - Population history chart
The system SHALL render a bottom chart of fish and shark population lines using the same green and blue colors as the world/stats, with no chart titles or text labels. The chart SHALL plot the rolling history window. The Y-axis maximum SHALL be fixed at `gridWidth * gridHeight` and SHALL never rescale during a run.

#### Scenario: Fixed Y scale
- **WHEN** populations change over time
- **THEN** chart Y mapping SHALL continue to use grid cell capacity as maximum

#### Scenario: Unlabeled chart
- **WHEN** the chart is rendered
- **THEN** it SHALL omit titles and axis text labels

### Requirement: 9 - Resize scales world without changing model
When the browser resizes, the system SHALL recompute layout and world render scale/centering without changing simulation grid dimensions. Programmer changes to grid dimension constants SHALL scale and center the world display without requiring UI code changes beyond configuration.

#### Scenario: Resize keeps model size
- **WHEN** the browser window is resized
- **THEN** grid width and height in the engine SHALL remain unchanged while the display layout updates

### Requirement: 10 - Frame pacing without catch-up
While running, the system SHALL advance chronons according to the selected chronons-per-second speed as the browser allows. The system SHALL NOT implement special real-time preservation or catch-up when the tab is hidden or throttled. If extinction occurs mid-frame after a step, further steps in that frame SHALL NOT run.

#### Scenario: Speed maps to chronons per second
- **WHEN** speed `10x` is selected and the simulation is running
- **THEN** the scene SHALL target approximately 10 chronon steps per second under normal foreground timing

#### Scenario: Stop stepping when terminal mid-frame
- **WHEN** multiple steps are due in one frame and a step becomes terminal
- **THEN** remaining scheduled steps in that frame SHALL be skipped

### Requirement: 11 - UI module factoring
Logical UI pieces SHALL be implemented under `src/ui/` as separate components for stats, controls, population chart, and world rendering, orchestrated by `SimulationScene`.

#### Scenario: UI directory components exist
- **WHEN** the project files are organized
- **THEN** the repository SHALL include UI modules for stats, controls, chart, and world rendering under `src/ui/`
