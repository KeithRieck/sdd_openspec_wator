## Why

The Wa-Tor UI currently lets the running flag and simulation status diverge when users pause, resume, or manually step the simulation. This causes stale statistics text and stale control button states, especially after pausing from a running state or stepping into an extinction state.

## What Changes

- **MODIFIED**: Treat `simulation.status` as the authoritative status shown in the statistics panel.
- **MODIFIED**: Update `simulation.status` to `Paused` when the user pauses a non-terminal simulation.
- **MODIFIED**: Update `simulation.status` to `Running` when the user resumes a non-terminal simulation.
- **MODIFIED**: Keep a manually stepped non-terminal simulation in `Paused` status after the chronon advances.
- **MODIFIED**: Refresh statistics immediately after Play/Pause changes and refresh controls immediately after Step changes, including when Step reaches an extinction/collapse state.

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `wator-simulation`: Clarify and fix status synchronization and control refresh behavior for Play/Pause and Step interactions.

## Impact

- Affects `src/scenes/SimulationScene.js` Play/Pause, Step, status display, and button-state update paths.
- Does not change simulation rules, rendering technology, dependencies, service worker behavior, or public file structure.
