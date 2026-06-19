# Wa-Tor Delta Spec

Change: create-wator-simulation
Status: draft (delta)
Created: 2026-06-19

This delta spec captures the implementable requirements for the Wa-Tor web app derived from `spec-v001.md` and will be maintained during the change lifecycle.

## Purpose
Provide a concise, living specification that the implementation and QA teams can reference. This file focuses on the model invariants, public engine API expectations, and UI placement/behavior required by the acceptance criteria.

## Model & Data Shape (required)
- World: rectangular toroidal grid represented as a flat array of length `width * height`.
- Entity record: `{ id: number, type: 'fish'|'shark', x: number, y: number, breedAge: number, bornChronon: number, energy?: number }`.
- History: ring buffer of `{chronon, fish, sharks}` with capacity `HISTORY_WINDOW` (default 500).

## Core Chronon Rules (required)
1. Each chronon the engine shall: collect current entity IDs, randomize order (Fisher–Yates), and allow each surviving entity to act at most once.
2. Entities with `bornChronon === currentChronon` must not act until the next chronon.
3. If an entity dies before its turn, its ID is skipped when encountered.

## Fish Rules (required)
- Move to random adjacent empty orthogonal neighbor if available; if none, remain.
- When moving and `breedAge >= fishBreedTime`, leave a newborn fish in the old cell and reset parent `breedAge` to 0; newborn `bornChronon = currentChronon`.
- If breeding-ready but cannot move, reset `breedAge` to 0.

## Shark Rules (required)
- At start of action decrement `energy` by `sharkEnergyCostPerChronon`; if `energy <= 0` remove shark immediately.
- If adjacent fish exist, move to one chosen at random, remove the fish, and add `sharkEnergyGain` to shark energy.
- Otherwise move to a random adjacent empty cell if any.
- Breeding mirrors fish rules; newborn sharks initialized with `initialSharkEnergy`.

## Public Engine API (required)
- `reset()` — create new random world using config densities; set `chronon=0`; clear history.
- `step(n=1)` — advance `n` chronons applying rules above.
- `spawnEntity(type, x, y, bornChronon?, energy?)` — create entity record and place in grid.
- `removeEntity(id)` — remove entity from entities map and clear cell.
- `moveEntity(id, x, y)` — move entity if destination empty; return boolean success.
- `getStats()` — return `{chronon, fish, sharks}`.
- `getChronon()` — return current chronon integer.

## UI & Rendering (required)
- Renderer must be Phaser-based using `Graphics` only; no DOM controls overlaid.
- Layout: stats left, world center, controls right, history chart across bottom.
- Controls: Play/Pause (toggle), Step (single chronon), Reset (recreate world); speed choices `1x,5x,10x,30x,60x` (default `10x`).
- While running Step disabled; while paused Step advances exactly one chronon and does not auto-resume.
- Auto-pause with terminal status on extinction (fish or sharks or both) and disable Play until Reset.

## Acceptance mapping
This delta spec assumes `spec-v001.md` acceptance criteria are normative; implementation tasks should verify each numbered acceptance criterion from that spec. Use this file to record any deviations or clarifications during implementation.

## Notes & Change Log
- 2026-06-19: Initial delta spec created for change `create-wator-simulation`.
