# Spec: simulation-engine (delta, new capability)

## ADDED Requirements

### Requirement: SE-R1 Framework independence
The simulation engine SHALL be implemented in plain ES2020 JavaScript with no imports from or references to Phaser APIs or Phaser scene objects (PRD AC 4).

#### Scenario: SE-R1.1 Engine module isolation
- **WHEN** the engine module source is inspected
- **THEN** it SHALL contain no Phaser imports, globals, or scene references

### Requirement: SE-R2 Grid initialization
The engine SHALL create a rectangular toroidal grid using code constants for width and height, defaulting to 100 columns and 70 rows, and SHALL randomly populate it using code constants defaulting to 30% fish density and 5% shark density (PRD AC 6, 7).

#### Scenario: SE-R2.1 Default initialization
- **WHEN** a new simulation is constructed with default constants
- **THEN** the grid SHALL have 100x70 cells, with approximately 30% fish and 5% sharks placed at random non-overlapping positions

#### Scenario: SE-R2.2 Custom dimensions
- **WHEN** a programmer changes the width/height constants
- **THEN** the next constructed simulation SHALL use the new dimensions without other code changes

### Requirement: SE-R3 State representation
Simulation state SHALL use a flat grid array plus entity records containing ID, type, position, breed age, and shark energy when applicable; grid cells SHALL store direct entity references or null, and entity records in a registry SHALL be the single source of truth (PRD AC 27).

#### Scenario: SE-R3.1 Referential consistency
- **WHEN** an entity moves from cell A to cell B
- **THEN** cell A SHALL be null, cell B SHALL reference the entity, and the entity record's position SHALL equal B

### Requirement: SE-R3a Object-oriented entity model
The engine SHALL be object oriented using JavaScript classes: an `Entity` base class SHALL hold shared state and behavior (ID, position, breed age, movement and breeding plumbing), and `Fish` and `Shark` classes SHALL extend `Entity` and implement their species-specific behavior (eating, energy management, breed thresholds, spawn type) in subclass methods; the simulation SHALL invoke per-entity behavior polymorphically rather than via type-switching code.

#### Scenario: SE-R3a.1 Class hierarchy
- **WHEN** the engine source is inspected
- **THEN** `Fish` and `Shark` SHALL be declared as subclasses of `Entity`

#### Scenario: SE-R3a.2 Polymorphic dispatch
- **WHEN** a chronon executes an entity's turn
- **THEN** the simulation SHALL invoke the entity's own action method without branching on entity type

### Requirement: SE-R4 Neighbor evaluation
Movement SHALL consider only orthogonal neighbors (north, east, south, west) with toroidal edge wrapping (PRD AC 10).

#### Scenario: SE-R4.1 Edge wrapping
- **WHEN** an entity at column 0 evaluates neighbors
- **THEN** its west neighbor SHALL be the cell in the last column of the same row

#### Scenario: SE-R4.2 No diagonals
- **WHEN** an entity evaluates movement destinations
- **THEN** diagonal cells SHALL NOT be included

### Requirement: SE-R5 Chronon turn order
At each chronon the engine SHALL collect current entity IDs, randomize their order, and allow each surviving entity to act at most once; entities born during the current chronon SHALL NOT act until the next chronon; entities that die or are eaten before their turn SHALL be skipped (PRD AC 11, 12, 13).

#### Scenario: SE-R5.1 Newborn does not act
- **WHEN** a fish reproduces during chronon N
- **THEN** the newborn fish SHALL NOT be in the acting set for chronon N

#### Scenario: SE-R5.2 Eaten entity skipped
- **WHEN** a fish is eaten before its randomized turn in a chronon
- **THEN** the engine SHALL skip that entity when its turn is reached

### Requirement: SE-R6 Fish behavior
A fish SHALL move to a randomly selected adjacent empty cell when one exists; a breeding-ready fish that moves SHALL leave a new fish in its old cell and reset its breed timer to 0; a breeding-ready fish that cannot move SHALL reset its breed timer to 0; a non-breeding-ready fish that cannot move SHALL continue aging its breed timer (PRD AC 14, 15, 16, 17).

#### Scenario: SE-R6.1 Fish moves and breeds
- **WHEN** a breeding-ready fish has an adjacent empty cell
- **THEN** it SHALL move there, leave a newborn fish in the old cell, and reset its breed timer to 0

#### Scenario: SE-R6.2 Breeding-ready fish blocked
- **WHEN** a breeding-ready fish has no adjacent empty cell
- **THEN** it SHALL NOT move and its breed timer SHALL reset to 0

#### Scenario: SE-R6.3 Aging fish blocked
- **WHEN** a non-breeding-ready fish has no adjacent empty cell
- **THEN** it SHALL NOT move and its breed timer SHALL increment

### Requirement: SE-R7 Shark energy lifecycle
At each chronon a shark's energy SHALL be decremented by `sharkEnergyCostPerChronon` before movement or eating; if energy reaches 0 the shark SHALL be removed immediately without moving or eating; eating a fish SHALL add `sharkEnergyGain` to its energy (PRD AC 18, 19, 21).

#### Scenario: SE-R7.1 Starvation
- **WHEN** a shark's energy reaches 0 after the start-of-action decrement
- **THEN** the shark SHALL be removed before any movement or eating

#### Scenario: SE-R7.2 Energy before eating
- **WHEN** a shark with 1 energy and cost 1 has an adjacent fish
- **THEN** the shark SHALL die from starvation without eating the fish

### Requirement: SE-R8 Shark movement and breeding
A surviving shark SHALL move to a randomly selected adjacent fish cell (removing the fish) when one exists, else to a randomly selected adjacent empty cell when one exists; a breeding-ready shark that moves SHALL leave a newborn shark in its old cell with energy equal to `initialSharkEnergy` and reset its breed timer to 0; a breeding-ready shark that cannot move SHALL reset its breed timer to 0; a non-breeding-ready shark that cannot move SHALL continue aging (PRD AC 20, 22, 23, 24, 25, 26).

#### Scenario: SE-R8.1 Shark eats fish
- **WHEN** a surviving shark has an adjacent fish
- **THEN** it SHALL move to a random adjacent fish cell, remove the fish, and gain `sharkEnergyGain` energy

#### Scenario: SE-R8.2 Shark breeds
- **WHEN** a breeding-ready shark successfully moves
- **THEN** a newborn shark with `initialSharkEnergy` SHALL occupy the old cell and the parent's breed timer SHALL reset to 0

### Requirement: SE-R9 Extinction detection
After each chronon the engine SHALL report terminal status when fish or sharks reach zero: `Sharks extinct` when sharks are zero and fish remain, `Fish extinct` when fish are zero and sharks remain, and `Ecosystem collapsed` when both reach zero in the same chronon (PRD AC 37–40).

#### Scenario: SE-R9.1 Shark extinction
- **WHEN** a chronon ends with 0 sharks and more than 0 fish
- **THEN** the engine SHALL report terminal status `Sharks extinct`

#### Scenario: SE-R9.2 Simultaneous extinction
- **WHEN** a chronon ends with 0 fish and 0 sharks
- **THEN** the engine SHALL report terminal status `Ecosystem collapsed`
