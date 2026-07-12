## ADDED Requirements

### Requirement: Per-chronon world rendering encapsulated in WatorWorld
The system SHALL encapsulate per-chronon world rendering (water background plus fish and shark circles) in a dedicated `WatorWorld` UI class under `src/ui/`. The class SHALL own its Phaser `Graphics` object, accept the `WatorSimulation` instance at construction, and expose a `draw(x, y, w, h)` method that renders the world into the given region. `SimulationScene` SHALL delegate world drawing to this class rather than rendering directly.

#### Scenario: Scene delegates to WatorWorld
- **WHEN** the simulation advances one or more chronons and the scene redraws
- **THEN** `SimulationScene` SHALL call `WatorWorld.draw(x, y, w, h)` with the current world layout region and SHALL NOT render world graphics itself

#### Scenario: WatorWorld owns its graphics
- **WHEN** a `WatorWorld` is constructed
- **THEN** it SHALL create and own its own Phaser `Graphics` object via `scene.add.graphics()` and SHALL clear and redraw it on each `draw()` call

### Requirement: Per-chronon stats rendering encapsulated in StatsPanel
The system SHALL encapsulate per-chronon stats text updates (Chronon, Fish, Sharks, Status) in a dedicated `StatsPanel` UI class under `src/ui/`. The class SHALL own its four Phaser `Text` objects, accept the `WatorSimulation` instance at construction, and expose a `draw()` method that updates the four text strings from simulation state and a `layout(x, y, w, h)` method that positions the four text objects within a panel region. `SimulationScene` SHALL delegate stats drawing and stats layout to this class.

#### Scenario: Scene delegates stats drawing to StatsPanel
- **WHEN** the simulation advances and the scene redraws
- **THEN** `SimulationScene` SHALL call `StatsPanel.draw()` to update the four stats text strings and SHALL NOT update stats text objects directly

#### Scenario: Scene delegates stats layout to StatsPanel
- **WHEN** the scene computes a stats panel region on layout or resize
- **THEN** `SimulationScene` SHALL call `StatsPanel.layout(x, y, w, h)` with the region and SHALL NOT position the stats text objects directly

#### Scenario: StatsPanel status display reflects running flag
- **WHEN** `StatsPanel.draw()` is called and the simulation is not in a terminal state
- **THEN** the Status text SHALL display `Running` if `sim.running` is true and `Paused` otherwise, matching the pre-refactor behavior

### Requirement: SimulationScene retains buttons, handlers, and layout
`SimulationScene` SHALL retain ownership of button creation, button event handlers (`onPlayPause`, `onStep`, `onReset`, `onSpeed`), button state updates, and all layout logic (`layout`, `_layoutWide`, `_layoutNarrow`, `_layoutStats`, `_layoutControls`). Only per-chronon drawing shall be delegated to UI classes.

#### Scenario: Buttons remain in the scene
- **WHEN** the scene is created
- **THEN** `SimulationScene` SHALL construct and own the `PhaserButton` instances for Play/Pause, Step, Reset, and the speed segmented control directly, and SHALL wire their click callbacks to scene methods

#### Scenario: Layout remains in the scene
- **WHEN** the window is resized or the scene is created
- **THEN** `SimulationScene` SHALL compute all layout regions (world, stats, controls, chart) itself and SHALL delegate only the internal positioning of stats text to `StatsPanel.layout()`

### Requirement: Scene drawing methods are public composition points
`SimulationScene` SHALL expose `drawChart()` (delegating to `HistoryChart.draw`) and `updateControlStates()` (updating button enabled/selected/label states) as unprefixed methods on the scene's public surface. These methods SHALL NOT use the underscore-private naming convention.

#### Scenario: drawChart is public
- **WHEN** the scene needs to redraw the chart
- **THEN** it SHALL call `this.drawChart()` (not `this._drawChart()`)

#### Scenario: updateControlStates is public
- **WHEN** the scene needs to refresh button states
- **THEN** it SHALL call `this.updateControlStates()` (not `this._updateControlStates()`)
