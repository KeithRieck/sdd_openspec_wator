## ADDED Requirements

### Requirement 1: Framework-independent simulation model
The simulation SHALL implement the Wa-Tor world without importing Phaser APIs or depending on Phaser scene objects. State SHALL use a flat toroidal grid and entity records represented by separate `Entity`, `Fish`, and `Shark` classes, with `Fish` and `Shark` extending `Entity`.

#### Scenario 1: Model loads without Phaser
- **WHEN** the simulation module is imported in a JavaScript runtime without Phaser
- **THEN** the entity classes and simulation SHALL be constructible and usable

#### Scenario 2: Entity records expose required state
- **WHEN** a fish or shark is created
- **THEN** its record SHALL contain an ID, type, position, breed age, and shark energy where applicable

### Requirement 2: Configurable world initialization
The simulation SHALL initialize a rectangular toroidal grid using programmer-editable constants, defaulting to 100 columns, 70 rows, 30% fish density, and 5% shark density. Initial placement SHALL use `Math.random()` and SHALL not require a seeded random source.

#### Scenario 1: Default world creation
- **WHEN** a new simulation is created with default configuration
- **THEN** it SHALL create a 100-by-70 grid with randomly initialized fish and sharks using the configured densities

#### Scenario 2: Programmer changes dimensions
- **WHEN** grid width or height constants are changed before construction
- **THEN** the simulation SHALL create and query the changed dimensions without requiring UI configuration changes

### Requirement 3: Query-oriented simulation state
The simulation SHALL expose query methods for chronon, entity counts, status, running/terminal state, entity lookup, entities, and population history. Callers SHALL not need to mutate internal grid or entity collections directly.

#### Scenario 1: Population queries
- **WHEN** a caller queries fish and shark counts
- **THEN** the returned counts SHALL match the living entities in the grid

#### Scenario 2: History query
- **WHEN** a caller queries population history after chronons have advanced
- **THEN** the result SHALL contain samples in chronological order with no more than 500 chronons

### Requirement 4: Randomized chronon turn processing
At the beginning of every chronon, the simulation SHALL collect the IDs of living entities, randomize their order, and allow each surviving entity to act at most once. Entities born during the chronon SHALL not act until the next chronon. Entities dead or eaten before their turn SHALL be skipped.

#### Scenario 1: Newborn exclusion
- **WHEN** reproduction creates an entity during a chronon
- **THEN** that entity SHALL remain inactive until the following chronon

#### Scenario 2: Dead entity skip
- **WHEN** an entity is removed before its randomized turn
- **THEN** the simulation SHALL skip that ID without acting on the removed entity

### Requirement 5: Fish movement and reproduction
A fish SHALL consider only orthogonal toroidal neighbors. It SHALL move randomly to an adjacent empty cell when one exists. A breeding-ready fish that successfully moves SHALL leave a newborn fish in its old cell and reset its own breed age to zero. A breeding-ready fish that cannot move SHALL reset its breed age to zero; a non-breeding fish that cannot move SHALL continue aging.

#### Scenario 1: Fish moves to empty neighbor
- **WHEN** a fish acts with one or more adjacent empty cells
- **THEN** it SHALL move to one randomly selected empty neighbor

#### Scenario 2: Fish reproduces after movement
- **WHEN** a breeding-ready fish successfully moves
- **THEN** the old cell SHALL contain a newborn fish and the parent breed age SHALL be zero

#### Scenario 3: Blocked fish breeding reset
- **WHEN** a breeding-ready fish has no adjacent empty cell
- **THEN** it SHALL remain in place and reset its breed age to zero

### Requirement 6: Shark energy, hunting, movement, and reproduction
At the start of a shark turn, the simulation SHALL subtract the configured energy cost. A shark reaching zero SHALL die before movement or eating. Otherwise it SHALL prefer a randomly selected adjacent fish, eat that fish, and gain configured energy. If no fish is adjacent, it SHALL move to a randomly selected adjacent empty cell when available. Breeding behavior SHALL match fish, and newborn sharks SHALL receive initial shark energy.

#### Scenario 1: Starving shark dies before acting
- **WHEN** a shark reaches zero energy after the start-of-action decrement
- **THEN** it SHALL be removed without moving or eating

#### Scenario 2: Shark hunts adjacent fish
- **WHEN** a surviving shark has adjacent fish
- **THEN** it SHALL move to one selected adjacent fish cell, remove the fish, and gain configured energy

#### Scenario 3: Shark moves without prey
- **WHEN** a surviving shark has no adjacent fish and has an adjacent empty cell
- **THEN** it SHALL move to one selected adjacent empty cell

#### Scenario 4: Shark reproduction
- **WHEN** a breeding-ready shark successfully moves
- **THEN** the old cell SHALL contain a newborn shark with initial energy and the parent breed age SHALL be zero

### Requirement 7: Chronon progression and extinction
The simulation SHALL advance by one chronon per progression call, record one population sample per chronon, and detect terminal extinction. If both populations reach zero in the same chronon it SHALL report ecosystem collapse; otherwise it SHALL report the extinct population. Terminal state SHALL prevent further progression until reset.

#### Scenario 1: Shark extinction
- **WHEN** sharks reach zero while fish remain
- **THEN** status SHALL become `Sharks extinct` and terminal state SHALL be true

#### Scenario 2: Fish extinction
- **WHEN** fish reach zero while sharks remain
- **THEN** status SHALL become `Fish extinct` and terminal state SHALL be true

#### Scenario 3: Ecosystem collapse
- **WHEN** fish and sharks both reach zero in the same chronon
- **THEN** status SHALL become `Ecosystem collapsed` and terminal state SHALL be true

#### Scenario 4: Reset
- **WHEN** reset is requested
- **THEN** the simulation SHALL create a new random world, set chronon to zero, clear history, clear terminal status, and become ready to run
