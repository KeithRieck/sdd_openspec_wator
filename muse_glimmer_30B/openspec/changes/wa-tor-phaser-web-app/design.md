## Context

PRD-v001 defines a browser-based Wa-Tor simulation using Phaser 4.x with ES2020 modules, static site deployment, and PWA support. Simulation engine must be framework-independent. UI layout requires stats left, world center, controls right, history bottom. Entity hierarchy with common Entity base class for Fish and Shark.

## Goals / Non-Goals

**Goals:**
- Framework-independent simulation core with OO Entity hierarchy
- Phaser-native rendering and input for entire window
- Responsive layout scaling grid while preserving aspect ratio
- Live stats, controls, and rolling population history
- Static site with CDN Phaser, no build step

**Non-Goals:**
- No user controls for grid dimensions or model constants
- No seeded random, no automated tests, no TypeScript
- No DOM overlays, no sprites, no grid lines, no movement animation
- No keyboard shortcuts or world editing

## Decisions

**Simulation architecture**
- `WatorSimulation` owns flat grid array + Map of Entity instances. No Phaser imports.
- `Entity` base class with id, type, x, y, breedAge, isAlive, bornThisChronon. `Fish` and `Shark` extend Entity.
- Chronon step: snapshot IDs, shuffle, act once per entity, skip newborns and dead/eaten. Matches PRD 11-13.

**Grid representation**
- Flat array `grid[width*height]` for cache friendliness. Index = y*width + x.
- Toroidal neighbor calculation with modulo wrap.

**Rendering**
- Phaser `Graphics` drawing only. Circles for fish/shark, no sprites.
- `BootScene` loads config, starts `SimulationScene`.
- `SimulationScene` owns simulation instance, handles resize, draws world, stats, controls, history.

**Layout**
- Wide: stats left, world center, controls right, history bottom full width.
- Narrow: stack vertically preserving world aspect ratio.

**PWA**
- `manifest.webmanifest` and `sw.js` cache app shell. Phaser CDN load is best-effort offline.

## Class Diagram

```mermaid
classDiagram
    class WatorSimulation {
        -width: number
        -height: number
        -grid: (Entity|null)[]
        -entities: Map<number, Entity>
        -chronon: number
        -nextId: number
        -config: SimulationConfig
        -history: PopulationSample[]
        +constructor(config)
        +init()
        +step()
        +reset()
        +getPopulation()
        +isTerminal()
    }

    class Entity {
        #id: number
        #type: string
        #x: number
        #y: number
        #breedAge: number
        #isAlive: boolean
        #bornThisChronon: boolean
        +constructor(id,type,x,y)
        +getId(): number
        +getPosition(): {x,y}
        +ageOneChronon()
        +canBreed(breedTime): boolean
        +resetBreedAge()
        +markBornThisChronon()
        +clearBornFlag()
        +kill()
        +act(sim): void
    }

    class Fish {
        +act(sim): void
    }

    class Shark {
        #energy: number
        +act(sim): void
        +loseEnergy()
        +gainEnergy()
    }

    class SimulationScene {
        -sim: WatorSimulation
        -graphics: Graphics
        -running: boolean
        -speed: number
        +create()
        +update(time,delta)
        +renderWorld()
        +renderStats()
        +renderHistory()
        +handleResize()
    }

    class BootScene {
        +preload()
        +create()
    }

    Entity <|-- Fish
    Entity <|-- Shark
    WatorSimulation "1" *-- "many" Entity
    SimulationScene --> WatorSimulation
    BootScene --> SimulationScene
```

## Risks / Trade-offs

- CDN Phaser limits guaranteed offline → Acceptable per PRD
- No tests increases manual verification burden → Mitigate with clear JSDoc and PRD traceability
- Fixed UI constants require code edits for experimentation → Acceptable for v1
