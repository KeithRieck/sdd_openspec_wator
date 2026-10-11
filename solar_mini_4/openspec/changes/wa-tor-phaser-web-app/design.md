# Design: Wa-Tor Phaser Web App

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      index.html                              │
│  Phaser CDN + ES2020 module loader + PWA manifest + sw.js    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Phaser Game (BootScene → SimulationScene)  │
│  - Full-window Phaser-native rendering                       │
│  - Graphics-based world rendering (no sprites)               │
│  - Custom PhaserButton UI components                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              Simulation Engine (framework-independent)       │
│  WatorSimulation → Grid → Entity → Fish/Shark              │
│  - Toroidal grid with flat array + entity objects            │
│  - Simultaneous chronon updates                              │
│  - Single RNG for all random choices                         │
└─────────────────────────────────────────────────────────────┘
```

## Class Diagram

```mermaid
classDiagram
    class Entity {
        +number id
        +number x
        +number y
        +number breedAge
        +boolean isAlive
        +boolean isBreedingReady()
        +void resetBreedAge()
        +void act()
    }

    class Fish {
        +number breedTime
        +number breedTimer
        +Fish(id, x, y, breedTime, breedTimer)
        +void act()
    }

    class Shark {
        +number energy
        +number breedTime
        +number breedTimer
        +number initialSharkEnergy
        +number sharkEnergyGain
        +number sharkEnergyCostPerChronon
        +Shark(id, x, y, energy, breedTime, breedTimer)
        +void act()
    }

    class Grid {
        +number width
        +number height
        +Map<number, Entity> cells
        +Entity[] entities
        +number getFlatIndex(x, y)
        +Object getCell(x, y)
        +Entity[] getNeighbors(x, y)
        +Entity[] getEmptyNeighbors(x, y)
        +Entity[] getFishNeighbors(x, y)
        +void setEntity(entity)
        +void removeEntity(entity)
        +boolean isEmpty(x, y)
        +boolean isOccupied(x, y)
    }

    class WatorSimulation {
        +number width
        +number height
        +number fishDensity
        +number sharkDensity
        +number fishBreedTime
        +number sharkBreedTime
        +number initialSharkEnergy
        +number sharkEnergyGain
        +number sharkEnergyCostPerChronon
        +number chronon
        +Entity[] entities
        +number[] historyFish
        +number[] historySharks
        +boolean running
        +boolean paused
        +boolean terminal
        +string status
        +Grid grid
        +RandomGenerator rng
        +WatorSimulation(config)
        +void initialize()
        +void step()
        +void advanceChronon()
        +void updateStats()
        +void recordHistory()
        +void checkExtinction()
        +Entity[] getAliveEntities()
        +void reset()
    }

    class RandomGenerator {
        +number next()
        +number nextInt(min, max)
        +boolean nextBoolean()
        +void shuffle(array)
    }

    Entity <|-- Fish
    Entity <|-- Shark

```

## Component Interaction Diagram

```mermaid
flowchart TD
    A[Phaser BootScene] --> B[Phaser SimulationScene]
    B --> C[WatorSimulation]
    C --> D[Grid]
    C --> E[Entity]
    E --> F[Fish]
    E --> G[Shark]
    C --> H[RandomGenerator]
    B --> I[PhaserButton]
    B --> J[Stats Display]
    B --> K[History Chart]
    C --> L[Extinction Check]
    L --> M[Terminal Status]
```

## Key Design Decisions

### 1. Flat Grid Array + Entity Objects (R3)

The grid uses a flat array where each slot holds either an entity ID (number) or an `empty` marker (null). Entity objects are stored separately in a list. This provides:

- O(1) cell access by flat index
- Entity objects carry full state (position, breed age, energy)
- The grid array and entity objects are kept consistent by the Grid class

### 2. Simultaneous Chronon Updates (R6)

Each chronon proceeds in two phases:

1. **Collection phase**: For each surviving entity (in randomized order), compute the action (move, eat, reproduce, die) and record it. Newborns and deaths are deferred.
2. **Application phase**: Apply all collected actions simultaneously. This ensures that entities born in the current chronon do not act, and entities that die before their turn are skipped.

### 3. Single Random Number Generator (R7)

A single `RandomGenerator` class serves the entire simulation. Every random choice—initialization, movement selection, turn-order shuffling—draws from this one source. This ensures reproducibility of random sequences and avoids scattered `Math.random()` calls.

### 4. Phaser Graphics Rendering (R8, R14)

All rendering uses Phaser `Graphics` drawing primitives:

- Empty water: background color
- Fish: green circle
- Sharks: blue circle (slightly larger than fish)
- No grid lines
- No per-cell sprites
- No movement animation

### 5. Phaser-Native UI (R9, R13)

All controls are Phaser `Graphics` + `Text` objects:

- `PhaserButton` component handles normal/hover/active/disabled/selected states
- Speed buttons in a horizontal row
- Action buttons (Play/Pause, Step, Reset) on separate rows
- Stats on the left, world in center, controls on right
- History chart across the bottom

### 6. Responsive Layout (R12)

The layout adapts to window size:

- Wide window: stats left, world center, controls right, chart bottom
- Narrow window (tablet): reflow while preserving world aspect ratio
- Browser resize triggers layout recomputation without changing grid dimensions

## Data Flow

```mermaid
sequenceDiagram
    participant B as BootScene
    participant S as SimulationScene
    participant W as WatorSimulation
    participant G as Grid
    participant E as Entity
    participant R as RandomGenerator

    B->>S: init()
    S->>W: initialize()
    W->>G: createGrid()
    W->>R: initialize()
    W->>E: createFish()
    W->>E: createShark()
    W->>S: startRunning()

    loop Each frame
        S->>W: update()
        W->>W: checkSpeed()
        W->>W: advanceChronon()
        W->>G: applyActions()
        W->>W: checkExtinction()
        W->>W: recordHistory()
        S->>S: renderWorld()
        S->>S: updateStats()
        S->>S: renderChart()
    end
```

## File Organization

```
index.html
src/
  main.js          — Entry point, Phaser game config
  config.js        — All tunable constants
  simulation/
    WatorSimulation.js   — Orchestrates chronons, stats, history
    Grid.js              — Toroidal grid, neighbor lookup, cell access
    Entity.js            — Base class (position, breed age, breeding readiness)
    Fish.js              — Fish behavior
    Shark.js             — Shark behavior
  scenes/
    BootScene.js         — Preload, layout setup
    SimulationScene.js   — World render, controls, stats, chart
  ui/
    PhaserButton.js      — Reusable button component
sw.js
manifest.webmanifest
assets/
  icon-192.png
  icon-512.png
```

## Constants (from PRD)

| Constant | Default |
|---|---|
| Grid width | 100 |
| Grid height | 70 |
| Fish density | 30% |
| Shark density | 5% |
| Fish breed time | 3 |
| Shark breed time | 25 |
| Initial shark energy | 5 |
| Shark energy gain | 3 |
| Shark energy cost per chronon | 1 |
| Speed | 10x |
| Supported speeds | 1x, 5x, 10x, 30x, 60x |
| History window | 500 chronons |
