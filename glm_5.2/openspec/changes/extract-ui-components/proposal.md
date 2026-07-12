## Why

`SimulationScene` currently owns six distinct responsibilities (~430 lines): engine driving, world rendering, stats text, button creation/handlers, layout, and chart delegation. The per-chronon drawing logic (`drawWorld`, `drawStats`) is tangled with scene orchestration, making the scene harder to read and the rendering logic untestable in isolation. Extracting the per-chronon renderers into dedicated UI classes — following the established `HistoryChart` / `PhaserButton` pattern — sharpens the scene into a thin orchestrator and makes the rendering components reusable and independently understandable.

## What Changes

- **New `WatorWorld` UI class** (`src/ui/WatorWorld.js`): owns the world `Graphics` object and the `draw(x, y, w, h)` method that renders the water background plus fish/shark circles. Takes the `WatorSimulation` instance at construction.
- **New `StatsPanel` UI class** (`src/ui/StatsPanel.js`): owns the four stats `Text` objects (Chronon, Fish, Sharks, Status) and exposes `draw()` (update text content) and `layout(x, y, w, h)` (position the four lines). Takes the `WatorSimulation` instance at construction.
- **Deepen the `Entity` hierarchy**: add abstract getters `color` and `radiusFactor` to `Entity`, overridden by `Fish` and `Shark`. This lets `WatorWorld.draw()` render entities polymorphically without type-checking or duck-typing (`'energy' in entity`), removing the renderer's knowledge of entity subtypes.
- **`SimulationScene` becomes a thin orchestrator**: delegates per-chronon drawing to `WatorWorld`, `StatsPanel`, and `HistoryChart`. Retains the engine driver (accumulator, `update()`), button creation and event handlers (`onPlayPause`/`onStep`/`onReset`/`onSpeed`), and all layout logic (`layout`/`_layoutWide`/`_layoutNarrow`/`_layoutStats`/`_layoutControls`).
- **Two method renames in `SimulationScene`**: `_drawChart()` → `drawChart()` and `_updateControlStates()` → `updateControlStates()`. These are now composition points on the orchestrator's public surface, not private implementation details.
- No changes to button behavior, layout regions, chart rendering, simulation rules, or the PWA shell.

## Capabilities

### New Capabilities

(None — no new capabilities are introduced. The new UI classes are implementation modules within the existing `rendering-ui` capability.)

### Modified Capabilities

- `rendering-ui`: add requirements specifying that per-chronon world rendering and stats display SHALL be encapsulated in dedicated `WatorWorld` and `StatsPanel` UI classes, and that `SimulationScene` SHALL delegate per-chronon drawing to these components while retaining buttons, handlers, and layout.
- `simulation-engine`: add a requirement that each `Entity` subclass SHALL expose its render-time `color` and `radiusFactor` as polymorphic properties, so renderers can draw entities without type inspection.

## Impact

- **New files**: `src/ui/WatorWorld.js`, `src/ui/StatsPanel.js`.
- **Modified files**:
  - `src/scenes/SimulationScene.js` — substantially simplified; delegates drawing, renames two methods.
  - `src/simulation/Entity.js` — adds two abstract getters.
  - `src/simulation/Fish.js` — overrides `color` and `radiusFactor`.
  - `src/simulation/Shark.js` — overrides `color` and `radiusFactor`.
- **No API/dependency changes**: no new runtime dependencies, no changes to `config.js`, `index.html`, `sw.js`, or `manifest.webmanifest`.
- **No behavioral changes**: rendering output, button behavior, layout, and simulation rules remain identical. This is a pure structural refactor.
- **Risk**: low. The refactor is mechanical with one deliberate semantic improvement (polymorphic color/radius replacing duck-typing). Visual output is unchanged.
