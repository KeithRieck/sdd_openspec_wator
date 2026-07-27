## Context

This is a greenfield browser-based Wa-Tor simulation. The PRD (`prd-v001.md`) defines 57 acceptance criteria. Phaser 4.x loads from CDN. No build step, no backend, ES2020 modules only. The user has specified an OO design with `Entity` → `Fish`/`Shark` class hierarchy.

## Goals / Non-Goals

**Goals:**
- Clean OO architecture with `Entity`, `Fish`, `Shark`, `Grid`, `WatorSimulation` classes
- Simulation engine completely independent of Phaser (framework-independent)
- Correct Wa-Tor behavior per all 57 acceptance criteria
- Responsive layout: stats left, world center, controls right, chart bottom
- Easy-to-change simulation constants in a single config module

**Non-Goals:**
- Automated tests (per PRD)
- TypeScript, build tooling, npm dependencies
- User-facing parameter controls
- Seeded random, movement animation, sprite art

## Decisions

### Decision 1: Entity class hierarchy with polymorphic `act()`

Use a base `Entity` class with `Fish` and `Shark` subclasses. Each subclass overrides `act(grid)` to implement its own behavior.

```
Entity (abstract)
├── id, type, x, y, breedAge, alive, bornThisChronon
├── act(grid)        — abstract, overridden by subclasses
├── age()            — increment breedAge
├── canBreed(): bool — breedAge >= breedTime
├── die()            — set alive = false
└── createBaby()     — factory method, overridden by subclasses

Fish extends Entity
└── act(grid) — find empty neighbors, move, breed, age

Shark extends Entity
├── energy: number
└── act(grid) — decrement energy, die check, eat fish or move, breed, age
```

**Why polymorphism over a flag-based approach?** Fish and shark behavior differs substantially (energy management, eating, movement priority). Polymorphic `act()` keeps each class focused and avoids branching on `type` in shared code. Each `act()` is ~15 lines of distinct logic — textbook subclass material.

**Why `act(grid)` receives the grid?** The entity needs to query neighbors and request moves/spawns. Passing the grid object gives access to both. The grid is the world-state authority; entities are actors that request changes through its interface.

### Decision 2: Grid with flat array + entity map

```
Grid
├── width, height
├── cells: Array<Entity|null>    — flat [width * height], O(1) position lookup
├── entities: Map<number, Entity> — keyed by entity ID, O(1) by-ID lookup
├── nextId: number               — auto-incrementing entity ID generator
├── get(x, y): Entity|null
├── set(x, y, entity): void
├── move(entity, newX, newY): void
├── remove(entity): void
├── spawnAt(x, y, EntityType, config): Entity
├── getEmptyNeighbors(x, y): [x, y][]
├── getFishNeighbors(x, y): [x, y][]
├── allEntityIds(): number[]
└── wrap(x, y): [x, y]           — toroidal edge wrapping
```

**Why flat array over 2D array?** A flat `Array(width * height)` with index `y * width + x` is cache-friendly and avoids nested array overhead. One allocation, simple indexing.

**Why a separate entity map?** During chronon processing we iterate by shuffled entity IDs (AC #11). A map gives O(1) lookup by ID. The grid array gives O(1) lookup by position. Both are needed.

### Decision 3: Chronon processing in WatorSimulation

```
WatorSimulation
├── grid: Grid
├── chrononCount: number
├── config: SimulationConfig
├── tick(): void          — advance one chronon
├── fishCount(): number
├── sharkCount(): number
├── status(): Status      — Running | Paused | Sharks extinct | Fish extinct | Ecosystem collapsed
└── reset(): void         — create fresh random world
```

`tick()` orchestrates one chronon:
1. Collect all living entity IDs from `grid.allEntityIds()`
2. Shuffle the IDs (Fisher-Yates with `Math.random()`)
3. For each ID: check alive, check `bornThisChronon`, call `entity.act(grid)`
4. Clear `bornThisChronon` flags on all entities born this chronon
5. Increment `chrononCount`

**Why shuffle IDs rather than the entities array?** Entities can die or be born during the chronon. IDs are stable references — we check `alive` and `bornThisChronon` before acting. The map handles removed IDs gracefully (returns undefined → skip).

### Decision 4: Phaser 4 scene architecture

Two scenes:

- **BootScene**: Minimal scene that transitions immediately to SimulationScene. Exists to satisfy the Phaser scene lifecycle and could hold future asset preloading.
- **SimulationScene**: Owns the simulation, renders the world, handles UI, and runs the game loop.

The scene owns a `WatorSimulation` instance. On each Phaser `update()` frame, it advances the simulation by the appropriate number of chronons based on the selected speed, then redraws.

**Rendering approach**: Phaser `Graphics` objects. Each chronon, clear and redraw all circles. No sprites, no grid lines (AC #28, #50).

```
Phaser update() loop:
  elapsed += delta
  while (elapsed >= chrononInterval):
    simulation.tick()
    elapsed -= chrononInterval
    chrononsThisFrame++
  redraw()
```

### Decision 5: Responsive layout strategy

```
┌──────────┬──────────────────────┬──────────────┐
│  Stats   │                      │   Controls   │
│  (left)  │     World (center)   │   (right)    │
│          │                      │              │
└──────────┴──────────────────────┴──────────────┘
┌─────────────────────────────────────────────────┐
│           Population History Chart               │
└─────────────────────────────────────────────────┘
```

Layout computed from `game.scale.width` and `game.scale.height` on resize. The world display scales to fit available space while preserving aspect ratio (100:70 = 10:7). Stats and controls get fixed-width columns. The chart gets a fixed-height band at the bottom.

On narrow viewports (below a breakpoint), stack vertically: world on top, controls below, chart at bottom. Stats overlay the world area.

### Decision 6: Config as a frozen object

```js
export const CONFIG = Object.freeze({
  gridWidth: 100,
  gridHeight: 70,
  fishDensity: 0.30,
  sharkDensity: 0.05,
  fishBreedTime: 3,
  sharkBreedTime: 25,
  initialSharkEnergy: 5,
  sharkEnergyGain: 3,
  sharkEnergyCostPerChronon: 1,
  defaultSpeed: 10,
  speedOptions: [1, 5, 10, 30, 60],
  // colors, chart window, etc.
});
```

`Object.freeze` prevents accidental mutation at runtime. Changing constants means editing `config.js` — no UI needed (per PRD non-goal).

## Risks / Trade-offs

- **Phaser 4 API stability** → Phaser 4 is newer than Phaser 3. API details may differ from 3.x docs. Mitigation: stick to core Graphics and Scene APIs, check Phaser 4 changelog.
- **Redrawing all circles every chronon** → With 100×70 grid at 30%+5% density (~3500 entities), clearing and redrawing ~3500 circles per chronon at 60 chronons/sec could be expensive. Mitigation: Phaser Graphics batches efficiently; if needed, use a texture/bitmap approach later.
- **CDN dependency for PWA** → Service worker can't guarantee offline Phaser loading if CDN is unreachable on first visit. Mitigation: PRD accepts this as "best effort."
- **No tests** → Correctness depends on careful implementation and manual browser verification. Mitigation: the simulation engine is isolated and testable in the future.
- **`bornThisChronon` clearing strategy** → Must clear the flag at the right point in the chronon. Clearing per-entity during the loop (after its turn) vs. clearing all at the end affects whether entities born early in a chronon can be eaten in the same chronon. Per the PRD, newborns are skipped for the entire chronon, so clearing at the end of `tick()` is correct.
