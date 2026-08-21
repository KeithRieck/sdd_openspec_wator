# Design: add-wator-web-app

## Context

The project implements the Wa-Tor simulation defined in `prd-v001.md` as a static ES2020 web app. Phaser 4.1.0 loads from a CDN and owns the entire browser window; the simulation engine is framework-independent. There is no existing application code, so this design defines the initial architecture. Requirements trace to `prd-v001.md` acceptance criteria (AC N) and to the delta specs in this change.

## Goals / Non-Goals

**Goals:**

- Correct Wa-Tor chronon semantics per AC 10–26, isolated from rendering.
- Object-oriented entity model: `Entity` base class with `Fish` and `Shark` subclasses (AC 27).
- Phaser-native full-window UI with responsive layout for wide and tablet viewports (AC 5, 51–52).
- Graphics-only rendering at up to 60 chronons/second on a 100x70 grid (AC 29, 48, 50).
- Static-site deployability including repository subpaths, with lightweight PWA support (AC 56–57).

**Non-Goals:**

- No sprites, textures, movement interpolation, grid lines, or chart labels.
- No DOM overlays, keyboard shortcuts, world editing, seeded RNG, or automated tests.
- No catch-up compensation for throttled tabs (AC 49).
- No user-facing tuning of model constants (AC 53 keeps them code-editable only).

## Decisions

### D1. Dual state structure: flat ID grid + entity object map (AC 27)

`WatorSimulation` holds an `Int32Array` grid mapping cell index → entity ID (0 = water) and a `Map<id, Entity>` of live entity objects. The grid gives O(1) neighbor occupancy checks; the map preserves object identity so entities eaten before their randomized turn can be detected and skipped (AC 13). The type discriminator is read from the entity object (`entity.type`), keeping a single source of truth — the grid never stores type codes.

### D2. Entity class hierarchy with template-method act cycle

```
classDiagram
    class Entity {
        <<abstract>>
        +int id
        +int pos
        +int breedAge
        +bool bornThisChronon
        +bool alive
        +act(sim)$ template
        #preAct(sim) bool
        #selectDestination(sim) int
        #afterMove(sim, oldPos) void
    }
    class Fish {
        +TYPE = 1
        #preAct(sim) true
        #selectDestination(sim) random empty neighbor
    }
    class Shark {
        +TYPE = 2
        +int energy
        #preAct(sim) drain energy, die at 0
        #selectDestination(sim) fish cell else empty cell
        #afterMove(sim, oldPos) eat + gain energy
    }
    Entity <|-- Fish
    Entity <|-- Shark
```

`Entity.act(sim)` implements the shared skeleton: pre-act hook → polymorphic destination selection → move → shared breeding bookkeeping (spawn same-type child at old position on success; reset breed timer when blocked while breeding-ready; keep aging otherwise, AC 15–17, 23, 25–26). Subclasses override:

- `Fish.preAct` is a no-op returning `true`.
- `Shark.preAct` decrements energy by `sharkEnergyCostPerChronon` *before* any movement and returns `false` to signal death at zero (AC 18–19).
- `Fish.selectDestination` picks a random adjacent empty cell.
- `Shark.selectDestination` prefers a random adjacent fish cell, else a random adjacent empty cell (AC 20, 22).
- Eating is resolved by the simulation via `sim.consumeAt(pos)` triggered in `Shark.afterMove`, adding `sharkEnergyGain` (AC 21). `Fish` never references being eaten.

Rationale: steps other than destination selection and shark starvation are identical across species; inheritance removes that duplication while the chronon loop stays species-blind (AC 11–13). Alternative considered — switch statements on a type enum inside one monolithic loop — was rejected as it duplicates rule logic per species and resists the required class-based model.

### D3. Chronon loop (AC 11–13)

`step()`: collect IDs of living entities present at chronon start → Fisher-Yates shuffle → iterate; skip entities that died or were eaten mid-chronon (`alive === false`) and newborns flagged `bornThisChronon`; clear all born flags at chronon end; then record the population sample.

### D4. Single scene + pure layout solver (AC 8, 9, 51–52)

One `SimulationScene` owns everything; `BootScene` exists only to satisfy the file plan and immediately starts `SimulationScene` (nothing to preload since there are no textures). A pure `LayoutSolver.solve(viewportW, viewportH, gridAspect)` returns rectangles for stats, world, controls, and chart. Panels receive rects and draw within them; resize handling, tablet reflow (side-by-side panels fold into stacked regions below 744px effective width), and grid-dimension rescaling collapse into one place. World rendering scales cell size to fit the world rect preserving aspect ratio, centered.

### D5. Rendering strategy (AC 29, 50)

Two Phaser `Graphics` objects: one for the world (cleared and redrawn when simulation state changes or scale changes), one for UI chrome. At default densities (~2,500 creatures), full redraws per frame are cheap; no dirty-rect optimization in v1. Circles drawn with radius proportional to cell size, sharks slightly larger than fish.

### D6. Speed semantics (AC 48)

Nx means N chronons per second; 10x default. A frame-time accumulator in `SimulationScene.update(time, delta)` advances `floor(elapsed / (1000/N))` chronons, capped at a small maximum per frame to avoid spiral-of-death after tab stalls — consistent with AC 49's no-catch-up stance. At 60x this naturally approaches one chronon per rAF frame.

### D7. UI widget set (AC 30–46)

`UiButton`: Graphics-drawn rectangle + label text with `enabled`, `selected`, `label` state and pointer input; disabled Step while running (AC 34), disabled Play when terminal (AC 43), speed buttons toggle selected state without resuming a paused sim (AC 35). `StatsPanel`, `ControlPanel`, `HistoryChart` compose `UiButton`/text/Graphics within their solver-provided rects. Chart draws green/blue polylines over the rolling 500-sample buffer, no labels (AC 44–47).

### D8. PWA approach (AC 56–57)

`sw.js` precaches same-origin app shell files; attempts to cache the cross-origin CDN Phaser script opportunistically (jsdelivr sends CORS headers) but treats failure as non-fatal. Icons generated as static PNGs showing overlapping blue/green circles. Relative asset paths throughout so subpath deployment works.

## Risks / Trade-offs

- [Graphics redraw cost at 60x on low-end tablets] → single-layer clear/redraw measured early; fall back to redrawing only on chronon change rather than every frame.
- [No automated tests] → manual verification checklist mapped to PRD acceptance criteria; engine kept headless-runnable for future testability.
- [CDN dependency limits offline guarantee] → accepted per AC 57; opportunistic service-worker caching of the CDN script.
- [Phaser 4 API differences vs Phaser 3 examples] → verify Graphics/input APIs against 4.1.0 docs during implementation; isolate drawing behind panel classes.
- [Randomized turn order makes behavior hard to reproduce when debugging] → accepted (no seeded RNG per PRD); manual observation only.

## Migration Plan

Initial implementation — no migration. Deploy by committing static files; GitHub Pages serves the subpath directly. Rollback is reverting the commit.

## Open Questions

None blocking. Pixel sizes, fonts, and spacing are intentionally unspecified (PRD Known Gaps); implementer chooses tasteful defaults within the layout solver.
