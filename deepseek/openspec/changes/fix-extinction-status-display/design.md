# Design: Fix Extinction Status Display

## Problem

```mermaid
sequenceDiagram
    participant Update as update(delta)
    participant Sim as WatorSimulation
    participant Render as renderAll/Stats/Controls
    participant State as Scene State

    Note over Update: Current (buggy) order
    Update->>Sim: tick() × N (last entity dies)
    Update->>Render: renderAll() — status="Running"
    Update->>State: checkExtinction()
    State-->>State: isTerminal=true, terminalStatus="Fish extinct"
    State->>Render: renderControls() — buttons locked
    Note over State,Render: renderStats() NOT called — status stuck as "Running"
    Note over Update: Next frame: isRunning=false → return immediately
```

## Fix

Swap lines 434–435 in `SimulationScene.js`:

```
// Before                                   // After
renderAll();         ← line 434             checkExtinction();     ← was 435
this.checkExtinction();  ← line 435         this.renderAll();     ← was 434
```

```mermaid
sequenceDiagram
    participant Update as update(delta)
    participant Sim as WatorSimulation
    participant State as Scene State
    participant Render as renderAll/Stats

    Note over Update: Fixed order
    Update->>Sim: tick() × N (last entity dies)
    Update->>State: checkExtinction()
    State-->>State: isTerminal=true, isRunning=false, terminalStatus="Fish extinct"
    State->>Render: renderControls() — buttons locked
    Update->>Render: renderAll()
    Render->>Render: renderStats() — status="Fish extinct" ✓
```

## Consistency

The Step button path already uses `checkExtinction()` then `renderAll()` (line 283→284). This fix aligns the natural-tick path with the step path.

## No Other Changes

- `checkExtinction()` calls `renderControls()` internally; `renderAll()` calls `renderUIBackground()`, `renderWorld()`, `renderStats()`, and `renderChart()`. These operate on different `Graphics` objects so there are no clear/redraw conflicts.
- `renderStats()` reads `this.isTerminal` and `this.terminalStatus` to determine the status string — by the time it runs, both are correctly set.
