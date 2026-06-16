## 1. Status Synchronization

- [x] 1.1 Update the Play/Pause handler in `src/scenes/SimulationScene.js` so non-terminal pauses set `simulation.status` to `Paused` and non-terminal resumes set it to `Running`.
- [x] 1.2 Update the Step handler so a non-terminal manual step leaves `simulation.status` as `Paused` after advancing one chronon.
- [x] 1.3 Ensure terminal statuses from `simulation.tick()` are not overwritten by Play/Pause or Step status synchronization.

## 2. Immediate UI Refresh

- [x] 2.1 Refresh statistics text immediately after Play/Pause changes so the displayed status matches `simulation.status` without waiting for another chronon.
- [x] 2.2 Refresh button states immediately after Step changes so terminal manual steps disable Play/Pause and Step controls right away.
- [x] 2.3 Remove or refactor any status-display fallback that renders `Paused` without updating `simulation.status`.

## 3. Verification

- [ ] 3.1 Add or run focused checks proving Pause updates `simulation.status` and statistics display to paused state.
- [ ] 3.2 Add or run focused checks proving Step preserves paused state for non-terminal ticks and refreshes controls for terminal ticks.
- [ ] 3.3 Run JavaScript syntax validation for `src/scenes/SimulationScene.js`.
