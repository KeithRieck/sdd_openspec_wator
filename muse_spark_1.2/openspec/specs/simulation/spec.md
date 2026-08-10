# simulation Specification

## Purpose
TBD - created by archiving change add-wator-phaser-app. Update Purpose after archive.
## Requirements
### Requirement: Toroidal grid dimensions
The system SHALL create a rectangular toroidal grid using code constants for width and height with defaults of 100 columns and 70 rows.

#### Scenario: Default grid created
- **WHEN** the simulation initializes with default config
- **THEN** the grid SHALL have 100 columns and 70 rows (7000 cells) and wrap toroidally

#### Scenario: Programmer changes grid constants
- **WHEN** a programmer changes grid dimension constants in `src/config.js`
- **THEN** the simulation SHALL use the new width and height for grid creation and all toroidal calculations

### Requirement: Random initial population
The system SHALL randomly populate the grid at initialization using code constants for 30% fish density and 5% shark density.

#### Scenario: Default densities applied
- **WHEN** the simulation initializes with default config
- **THEN** approximately 30% of cells SHALL contain fish and 5% SHALL contain sharks, placed uniformly at random without overlap, with remaining cells empty

### Requirement: Orthogonal toroidal neighbors
The system SHALL consider only orthogonal neighbors (north, east, south, west) with toroidal edge wrapping when evaluating movement.

#### Scenario: Edge wrapping
- **WHEN** an entity at the grid edge evaluates neighbors
- **THEN** the system SHALL wrap coordinates via `(x+dx+W)%W` and `(y+dy+H)%H` and SHALL never consider diagonal neighbors

### Requirement: Chronon ordering and single action
The system SHALL at the start of each chronon collect current entity IDs, randomize their order via `Math.random()`, and allow each surviving entity to act at most once per chronon.

#### Scenario: Randomized order
- **WHEN** a chronon starts
- **THEN** the system SHALL snapshot IDs present at chronon start, shuffle them, and iterate in shuffled order

### Requirement: Newborn exclusion
The system SHALL prevent any entity born during the current chronon from acting until the next chronon.

#### Scenario: Newborn does not act same chronon
- **WHEN** a fish or shark is born during a chronon
- **THEN** that newborn SHALL be excluded from the current chronon iteration even though it exists in the grid

### Requirement: Eaten and dead skip
The system SHALL skip any entity whose turn is reached but that has already died or been eaten earlier in the same chronon.

#### Scenario: Eaten fish skipped
- **WHEN** a shark eats a fish earlier in the shuffled order
- **THEN** the eaten fish SHALL be skipped when its ID is later reached

### Requirement: Fish movement and breeding
The system SHALL move fish according to Wa-Tor rules: if at least one adjacent empty cell exists, move to a randomly selected adjacent empty cell; if breeding-ready (`breedAge >= fishBreedTime`) and movement succeeds, leave a new fish in the old cell and reset parent breed timer to 0; if breeding-ready and cannot move, reset breed timer to 0; if not breeding-ready and cannot move, continue aging the breed timer.

#### Scenario: Fish moves to random empty
- **WHEN** a fish acts and at least one adjacent empty cell exists
- **THEN** the system SHALL move the fish to a randomly selected adjacent empty cell

#### Scenario: Fish breeds on successful move
- **WHEN** a breeding-ready fish successfully moves
- **THEN** the system SHALL leave a newborn fish in the old cell and reset the parent breed timer to 0

#### Scenario: Fish breeding-ready but blocked
- **WHEN** a breeding-ready fish has no adjacent empty cells
- **THEN** the system SHALL reset its breed timer to 0 and not spawn

#### Scenario: Fish not breeding-ready and blocked
- **WHEN** a non-breeding-ready fish has no adjacent empty cells
- **THEN** the system SHALL increment its breed age (continue aging) and not reset

### Requirement: Shark energy decrement and starvation
The system SHALL at the start of each shark action decrement energy by `sharkEnergyCostPerChronon` (default 1) before movement or eating, and if energy reaches 0 after decrement, remove the shark immediately without moving or eating.

#### Scenario: Shark loses energy each chronon
- **WHEN** a shark acts
- **THEN** the system SHALL decrement its energy by 1 before any other action

#### Scenario: Shark starves at zero
- **WHEN** a shark energy reaches 0 after decrement
- **THEN** the system SHALL remove the shark immediately and it SHALL not move or eat

### Requirement: Shark eating and energy gain
The system SHALL if a surviving shark has adjacent fish, move it to a randomly selected adjacent fish cell, remove the eaten fish, and add `sharkEnergyGain` (default 3) to shark energy.

#### Scenario: Shark eats random adjacent fish
- **WHEN** a shark has at least one adjacent fish after surviving energy decrement
- **THEN** the system SHALL move to a randomly selected fish cell, remove that fish, and increase energy by 3

### Requirement: Shark movement to empty
The system SHALL if a shark has no adjacent fish and has at least one adjacent empty cell, move it to a randomly selected adjacent empty cell.

#### Scenario: Shark moves to empty when no fish adjacent
- **WHEN** a shark has no adjacent fish but has empty neighbors
- **THEN** the system SHALL move to a randomly selected empty cell

### Requirement: Shark breeding and newborn energy
The system SHALL handle shark breeding: if breeding-ready (`breedAge >= sharkBreedTime`) and successfully moves (by eating or to empty), leave a newborn shark in the old cell, reset parent breed timer to 0, and initialize newborn energy to `initialSharkEnergy` (default 5); if breeding-ready and cannot move, reset breed timer to 0; if not breeding-ready and cannot move, continue aging.

#### Scenario: Shark breeds after move
- **WHEN** a breeding-ready shark successfully moves
- **THEN** the system SHALL leave a newborn shark with energy 5 in the old cell and reset parent timer to 0

#### Scenario: Shark breeding-ready but blocked
- **WHEN** a breeding-ready shark cannot move
- **THEN** the system SHALL reset its breed timer to 0

#### Scenario: Shark not breeding-ready and blocked
- **WHEN** a non-breeding-ready shark cannot move
- **THEN** the system SHALL continue aging its breed timer

#### Scenario: Newborn shark energy
- **WHEN** a newborn shark is created
- **THEN** its energy SHALL be initialized to `initialSharkEnergy`

### Requirement: Flat grid and OO entity state
The system SHALL store simulation state as a flat grid array plus entity objects that are instances of classes extending a common `Entity` base (`Fish extends Entity`, `Shark extends Entity`), each containing ID, type, position, breed age, and shark energy when applicable.

#### Scenario: State uses flat grid and class instances
- **WHEN** the simulation runs
- **THEN** `grid` SHALL be a flat array of length `W*H` holding entity IDs or null, and `entities` SHALL be a `Map<id, Entity>` where values are `Fish` or `Shark` instances

#### Scenario: Breed and energy encapsulated
- **WHEN** breed or energy logic is needed
- **THEN** the system SHALL use `Entity` helpers (`canBreed`, `ageBreed`, `resetBreed`) and `Shark` helpers (`spendEnergy`, `gainEnergy`, `isStarved`) rather than plain record fields

### Requirement: Population history sampling
The system SHALL store one population sample per chronon for a rolling window of 500 chronons.

#### Scenario: History rolls at 500
- **WHEN** more than 500 chronons have elapsed
- **THEN** history SHALL contain only the most recent 500 samples, each with fish and shark counts

### Requirement: Breed timer semantics
The system SHALL define `canBreed(breedTime)` as `breedAge >= breedTime`, increment `breedAge` via `ageBreed()` at end of turn when not breeding, and reset via `resetBreed()` to 0 on breeding or when breeding-ready but blocked.

#### Scenario: Breed age lifecycle
- **WHEN** an entity survives a chronon without breeding
- **THEN** its breed age SHALL increase by 1; when it breeds or is breeding-ready but blocked, it SHALL reset to 0

