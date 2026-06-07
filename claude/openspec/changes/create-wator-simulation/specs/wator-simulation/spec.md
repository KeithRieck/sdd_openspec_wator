## ADDED Requirements

### Requirement: Framework-independent engine
The simulation engine SHALL implement all Wa-Tor rules with no dependency on Phaser APIs or Phaser scene objects, so the engine can run and be reasoned about in isolation from rendering.

#### Scenario: Engine has no rendering dependency
- **WHEN** `src/simulation/WatorSimulation.js` is loaded
- **THEN** it SHALL NOT import, reference, or require Phaser or any Phaser scene object

#### Scenario: Engine advances without a renderer
- **WHEN** the engine is stepped one or more chronons with no renderer attached
- **THEN** it SHALL update grid and entity state correctly using only its own data structures

### Requirement: Toroidal grid initialization
The engine SHALL create a rectangular toroidal grid sized from code constants, defaulting to `100` columns by `70` rows, and randomly populate it from code-constant densities defaulting to `30%` fish and `5%` sharks.

#### Scenario: Default grid dimensions
- **WHEN** the simulation initializes with default constants
- **THEN** it SHALL create a grid of `100` columns and `70` rows

#### Scenario: Default population densities
- **WHEN** the simulation initializes with default constants
- **THEN** it SHALL randomly place fish on approximately `30%` of cells and sharks on approximately `5%` of cells, with no cell holding more than one entity

#### Scenario: Programmer changes dimensions
- **WHEN** a programmer changes the width or height constant in code
- **THEN** the engine SHALL build the grid at the new dimensions without further code changes to the engine logic

### Requirement: Flat-array state representation
The engine SHALL store world state as a flat grid array plus entity records, where each entity record contains an ID, a type, a position, a breed age, and a shark energy value when the entity is a shark.

#### Scenario: Entity record fields
- **WHEN** an entity exists in the world
- **THEN** its record SHALL expose ID, type, position, and breed age, and SHALL expose an energy value when the entity is a shark

#### Scenario: Flat grid storage
- **WHEN** world state is stored
- **THEN** the engine SHALL use a flat grid array to index cell occupancy alongside the entity records

### Requirement: Orthogonal toroidal movement
The engine SHALL consider only the four orthogonal neighbors (north, east, south, west) for movement, with toroidal wrapping at all grid edges.

#### Scenario: Orthogonal neighbors only
- **WHEN** the engine evaluates an entity's possible moves
- **THEN** it SHALL consider only the north, east, south, and west neighbor cells

#### Scenario: Toroidal wrapping
- **WHEN** an entity at an edge column or row evaluates neighbors
- **THEN** the neighbor on the missing side SHALL wrap to the opposite edge of the grid

### Requirement: Chronon stepping order
When a chronon starts, the engine SHALL collect current entity IDs, randomize their order, and allow each surviving entity to act at most once; entities born during the chronon SHALL NOT act until the next chronon, and entities that die or are eaten before their turn SHALL be skipped.

#### Scenario: Randomized single action per entity
- **WHEN** a chronon begins
- **THEN** the engine SHALL snapshot the current entity IDs, randomize their order, and let each surviving entity act at most once

#### Scenario: Newborn defers to next chronon
- **WHEN** an entity is born during the current chronon
- **THEN** the engine SHALL NOT let that newborn act until the next chronon

#### Scenario: Dead entity skipped
- **WHEN** an entity dies or is eaten before its randomized turn is reached
- **THEN** the engine SHALL skip that entity's turn

### Requirement: Fish behavior
When a fish acts it SHALL move to a randomly selected adjacent empty cell if one exists; breeding and timer rules SHALL follow from whether the fish is breeding-ready and whether it can move.

#### Scenario: Fish moves to empty cell
- **WHEN** a fish acts and at least one adjacent empty cell exists
- **THEN** the fish SHALL move to a randomly selected adjacent empty cell

#### Scenario: Breeding-ready fish reproduces on move
- **WHEN** a breeding-ready fish moves
- **THEN** the engine SHALL leave a new fish in the old cell and reset the parent fish breed timer to `0`

#### Scenario: Breeding-ready fish blocked
- **WHEN** a breeding-ready fish has no adjacent empty cell
- **THEN** the fish SHALL not move and the engine SHALL reset its breed timer to `0`

#### Scenario: Non-breeding fish blocked
- **WHEN** a fish that is not breeding-ready has no adjacent empty cell
- **THEN** the fish SHALL not move and the engine SHALL continue aging its breed timer

### Requirement: Shark behavior and energy
When a shark acts the engine SHALL decrement its energy by `sharkEnergyCostPerChronon` first; a shark reaching `0` energy SHALL die immediately; a surviving shark SHALL prefer eating an adjacent fish, otherwise move to an adjacent empty cell, applying breeding and timer rules.

#### Scenario: Energy decrement first
- **WHEN** a shark acts
- **THEN** the engine SHALL decrement the shark's energy by `sharkEnergyCostPerChronon` before any movement or eating

#### Scenario: Starvation death
- **WHEN** a shark's energy reaches `0` after the start-of-action decrement
- **THEN** the engine SHALL remove the shark immediately without moving or eating

#### Scenario: Shark eats adjacent fish
- **WHEN** a surviving shark has at least one adjacent fish
- **THEN** the shark SHALL move to a randomly selected adjacent fish cell, remove the eaten fish, and gain `sharkEnergyGain` energy

#### Scenario: Shark moves when no fish adjacent
- **WHEN** a surviving shark has no adjacent fish but at least one adjacent empty cell
- **THEN** the shark SHALL move to a randomly selected adjacent empty cell

#### Scenario: Breeding-ready shark reproduces on move
- **WHEN** a breeding-ready shark moves
- **THEN** the engine SHALL leave a newborn shark in the old cell, initialize the newborn's energy to `initialSharkEnergy`, and reset the parent shark breed timer to `0`

#### Scenario: Breeding-ready shark blocked
- **WHEN** a breeding-ready shark cannot move
- **THEN** the engine SHALL reset its breed timer to `0`

#### Scenario: Non-breeding shark blocked
- **WHEN** a shark that is not breeding-ready cannot move
- **THEN** the engine SHALL continue aging its breed timer

### Requirement: Population accounting
The engine SHALL expose current fish and shark counts after each chronon so callers can render statistics, history, and detect extinction without inspecting internal arrays.

#### Scenario: Counts available after step
- **WHEN** a chronon completes
- **THEN** the engine SHALL expose the current fish count and shark count for that chronon

### Requirement: Tunable engine constants
The engine's model parameters — grid dimensions, densities, breed times, and shark energy values — SHALL be defined as code constants that a programmer can change in one place without altering engine logic.

#### Scenario: Constants centralized
- **WHEN** a programmer changes `fishBreedTime`, `sharkBreedTime`, `initialSharkEnergy`, `sharkEnergyGain`, or `sharkEnergyCostPerChronon` in the config constants
- **THEN** the engine SHALL use the new values with no other code edits

### Requirement: Engine documentation
Every engine class SHALL carry a JSDoc class comment, and every static method and every public method longer than 8 lines SHALL carry a JSDoc comment.

#### Scenario: Class and method docs present
- **WHEN** an engine class or a static/public method longer than 8 lines is defined
- **THEN** it SHALL have a JSDoc documentation comment
