# Proposal: Fix Extinction Status Display

## Summary

Fix a race condition in `SimulationScene.update()` where `renderAll()` is called before `checkExtinction()`, causing the status text to show "Running" permanently after a natural extinction instead of the correct terminal status ("Fish extinct", "Sharks extinct", or "Ecosystem collapsed").

## Motivation

When fish or sharks go extinct during a running simulation (not via the Step button), the status line in the stats panel remains stuck on "Running" rather than showing the extinction message. Users see a frozen simulation with no visual indication that extinction occurred.

## What Changes

In `src/scenes/SimulationScene.js`, swap the order of two lines in the `update()` method so that `checkExtinction()` runs before `renderAll()`. This ensures the terminal status is set before rendering occurs.

## Scope

One file, two lines swapped. No new APIs, no behavioral changes beyond correct status display.

## Risk

None. The `checkExtinction()` method already internal-locks controls via `renderControls()`. Calling `renderAll()` after it simply redraws the stats text with the correct `terminalStatus` string. The Step button path already uses the correct order (check then render).
