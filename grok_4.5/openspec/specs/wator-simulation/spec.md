## Purpose

Phaser-independent Wa-Tor engine: entities, chronon rules, breeding, energy, history, and extinction.

## Requirements

### Requirement: 1 - Phaser-independent engine
The simulation engine SHALL implement all Wa-Tor rules without importing or calling Phaser APIs or scene objects.

#### Scenario: Engine module has no Phaser dependency
- **WHEN** the simulation package is loaded
- **THEN** its modules SHALL NOT reference Phaser globals or Phaser imports

### Requirement: 2 - Simulation-owned world state
The system SHALL store world state in `WatorSimulation` using a flat grid plus entity instances, and SHALL expose world-port operations for neighbor queries, move, remove, and spawn so entities do not own the grid.

#### Scenario: Grid dimensions from constants
- **WHEN** the simulation initializes or resets
- **THEN** it SHALL create a toroidal rectangular grid using configured width and height defaults of 100 columns and 70 rows

#### Scenario: Random initial population
- **WHEN** the simulation initializes or resets
- **THEN** it SHALL populate the grid using configured fish density default 30% and shark density default 5%

### Requirement: 3 - Object-oriented entities
The system SHALL model creatures with an abstract `Entity` base class and concrete `Fish` and `Shark` subclasses, factoring shared identity, position, breed age, and breed bookkeeping into `Entity`.

#### Scenario: Species specialization
- **WHEN** entities are created
- **THEN** fish and sharks SHALL be instances of distinct classes that extend `Entity`

### Requirement: 4 - Orthogonal toroidal neighbors
When evaluating movement, the system SHALL consider only north, east, south, and west neighbors with toroidal wrapping.

#### Scenario: Edge wrap
- **WHEN** an entity at the west edge queries neighbors
- **THEN** its west neighbor SHALL be the cell at the same row on the east edge

### Requirement: 5 - Fish movement and breeding
A fish SHALL move to a randomly chosen adjacent empty cell when one exists; if breeding-ready and it moves, it SHALL leave a newborn fish in the old cell and set its breed age to 0; if breeding-ready and blocked, it SHALL set breed age to 0; if not ready, it SHALL increment breed age by 1 whether or not it moved.

#### Scenario: Fish moves into empty cell
- **WHEN** a fish acts and at least one adjacent empty cell exists
- **THEN** the system SHALL move the fish to one randomly selected adjacent empty cell

#### Scenario: Fish breeds on successful move
- **WHEN** a breeding-ready fish successfully moves
- **THEN** the system SHALL spawn a new fish in the vacated cell with breed age 0 and set the parent breed age to 0 without incrementing it in the same chronon

#### Scenario: Fish breeding-ready but blocked
- **WHEN** a breeding-ready fish has no empty adjacent cell
- **THEN** the system SHALL set the fish breed age to 0 and SHALL NOT spawn offspring

#### Scenario: Fish not ready ages
- **WHEN** a fish that is not breeding-ready completes its action
- **THEN** the system SHALL increment its breed age by 1

### Requirement: 6 - Shark energy, hunting, and breeding
A shark SHALL decrement energy by the configured cost at action start; if energy reaches 0 it SHALL die immediately without moving, eating, or changing breed age. Otherwise it SHALL prefer a random adjacent fish cell (eat and gain energy), else a random adjacent empty cell. Breeding bookkeeping SHALL match fish rules; newborn sharks SHALL receive `initialSharkEnergy` and breed age 0.

#### Scenario: Shark starves at action start
- **WHEN** a shark’s energy reaches 0 after the start-of-action decrement
- **THEN** the system SHALL remove the shark immediately without movement, eating, or breed-age change

#### Scenario: Shark eats adjacent fish
- **WHEN** a living shark has one or more adjacent fish
- **THEN** the system SHALL move it to a randomly selected adjacent fish cell, remove the eaten fish, and add `sharkEnergyGain` to the shark energy

#### Scenario: Shark moves to empty when no prey
- **WHEN** a living shark has no adjacent fish and has adjacent empty cells
- **THEN** the system SHALL move it to a randomly selected adjacent empty cell

#### Scenario: Shark breeds on successful move
- **WHEN** a breeding-ready shark successfully moves
- **THEN** the system SHALL spawn a newborn shark in the vacated cell with breed age 0 and energy `initialSharkEnergy`, and set the parent breed age to 0 without incrementing it in the same chronon

#### Scenario: Shark breeding-ready but blocked
- **WHEN** a breeding-ready shark cannot move
- **THEN** the system SHALL set the shark breed age to 0 and SHALL NOT spawn offspring

#### Scenario: Shark not ready ages only if it survives
- **WHEN** a shark survives its action and is not breeding-ready
- **THEN** the system SHALL increment its breed age by 1

### Requirement: 7 - Breeding readiness threshold
An entity SHALL be breeding-ready when its `breedAge` is greater than or equal to its species breed time constant.

#### Scenario: Threshold inclusive
- **WHEN** a fish has `breedAge` equal to `fishBreedTime`
- **THEN** the fish SHALL be treated as breeding-ready for that action

### Requirement: 8 - Newborn initialization
Newborn fish SHALL start with breed age 0. Newborn sharks SHALL start with breed age 0 and energy `initialSharkEnergy`. Initial population entities SHALL also start with breed age 0 and sharks with `initialSharkEnergy`.

#### Scenario: Reset initializes ages and energy
- **WHEN** the simulation resets
- **THEN** every fish and shark SHALL have breed age 0 and every shark SHALL have energy `initialSharkEnergy`

### Requirement: 9 - Chronon turn order
At the start of each chronon, the system SHALL collect current entity IDs, randomize their order, and allow each surviving non-newborn entity to act at most once. Entities born during the chronon SHALL NOT act until a later chronon. Entities that die or are eaten before their turn SHALL be skipped.

#### Scenario: Snapshot and shuffle
- **WHEN** a chronon starts
- **THEN** the system SHALL act only on the shuffled snapshot of IDs present at chronon start

#### Scenario: Newborn waits
- **WHEN** an entity is spawned during chronon N
- **THEN** it SHALL NOT act during chronon N

#### Scenario: Eaten entity skipped
- **WHEN** a fish is eaten before its shuffled turn
- **THEN** the system SHALL skip that fish when its ID is reached

### Requirement: 10 - Shared entity action template
`Entity` SHALL apply a shared action template: species prelude, optional move, then breed bookkeeping, so fish and sharks do not diverge on shared breed rules.

#### Scenario: Blocked non-ready still ages
- **WHEN** a non-ready entity cannot move and survives the action
- **THEN** its breed age SHALL increase by 1

### Requirement: 11 - Default model constants
Unless overridden in code configuration, the system SHALL use fish breed time 3, shark breed time 25, initial shark energy 5, shark energy gain 3, and shark energy cost per chronon 1.

#### Scenario: Defaults available to engine
- **WHEN** the engine constructs entities and evaluates rules
- **THEN** it SHALL read these values from shared configuration rather than hard-coding scattered literals

### Requirement: 12 - Chronon counter
The chronon counter SHALL start at 0 on init/reset and SHALL increment by 1 after each completed chronon step.

#### Scenario: First step advances chronon
- **WHEN** the simulation is at chronon 0 and `step()` completes
- **THEN** the chronon counter SHALL equal 1

### Requirement: 13 - Population history sampling
The system SHALL record one population sample per chronon for a rolling window of 500 chronons, including a sample at init/reset for chronon 0 and a sample after each completed chronon including a terminal chronon.

#### Scenario: Reset clears and reseeds history
- **WHEN** the simulation resets
- **THEN** history SHALL be cleared and a chronon-0 sample of the new populations SHALL be stored

#### Scenario: Rolling window bound
- **WHEN** more than 500 samples would be retained
- **THEN** the system SHALL drop the oldest samples so at most 500 remain

### Requirement: 14 - Extinction detection
After each chronon completes, the system SHALL detect extinction. If sharks are zero and fish remain, status is `Sharks extinct`. If fish are zero and sharks remain, status is `Fish extinct`. If both are zero in the same chronon, status is `Ecosystem collapsed`. Extinction SHALL NOT be finalized mid-actor before the chronon ends.

#### Scenario: Both zero same chronon
- **WHEN** a chronon ends with zero fish and zero sharks
- **THEN** the extinction status SHALL be `Ecosystem collapsed`

#### Scenario: Sharks only gone
- **WHEN** a chronon ends with zero sharks and at least one fish
- **THEN** the extinction status SHALL be `Sharks extinct`

#### Scenario: Fish only gone
- **WHEN** a chronon ends with zero fish and at least one shark
- **THEN** the extinction status SHALL be `Fish extinct`
