# simulation-engine Specification

## ADDED Requirements

### Requirement: Framework independence
The Wa-Tor simulation engine SHALL implement all rules without importing or referencing any Phaser API, Phaser scene object, or browser rendering API.

#### Scenario: Engine runs headless
- **WHEN** the simulation engine module is loaded and stepped in isolation
- **THEN** it produces correct chronon results with no Phaser or DOM dependency

### Requirement: Toroidal orthogonal grid
The simulation SHALL use a rectangular grid where movement considers only orthogonal neighbors north, east, south, and west, with toroidal edge wrapping.

#### Scenario: Wrap at east edge
- **WHEN** an entity at the easternmost column moves east
- **THEN** it arrives at the westernmost cell of the same row

#### Scenario: Wrap at north edge
- **WHEN** an entity at the topmost row moves north
- **THEN** it arrives at the bottommost cell of the same column

### Requirement: Randomized chronon turn order
At the start of each chronon, the system SHALL collect the IDs of all currently living entities, randomize their order, and allow each surviving entity to act at most once.

#### Scenario: Each entity acts once per chronon
- **WHEN** a chronon is processed
- **THEN** every entity alive at chronon start acts exactly once, in randomized order

#### Scenario: Entity eaten before its turn
- **WHEN** an entity is eaten by a shark earlier in the randomized order
- **THEN** the eaten entity is skipped when its turn is reached

### Requirement: Newborn deferral
IF an entity is born during the current chronon, THEN the system SHALL prevent that entity from acting until the next chronon.

#### Scenario: Newborn does not act in birth chronon
- **WHEN** a fish or shark is born during a chronon
- **THEN** the newborn takes no action until the following chronon

### Requirement: Fish movement
WHEN a fish acts and at least one adjacent empty cell exists, THEN the system SHALL move the fish to a randomly selected adjacent empty cell. IF no adjacent empty cell exists, THEN the fish SHALL not move.

#### Scenario: Fish moves to empty cell
- **WHEN** a fish acts with at least one adjacent empty cell
- **THEN** it moves to one of the empty cells chosen at random

#### Scenario: Fish is blocked
- **WHEN** a fish acts with all four orthogonal neighbors occupied
- **THEN** it remains in place

### Requirement: Fish breeding
IF a fish is breeding-ready and successfully moves, THEN the system SHALL leave a new fish in the old cell and reset the parent breed timer to 0. IF a fish is breeding-ready and cannot move, THEN the system SHALL reset the breed timer to 0. IF a fish is not breeding-ready and cannot move, THEN the system SHALL continue aging the breed timer.

#### Scenario: Breeding-ready fish moves
- **WHEN** a fish with breed age at the breeding threshold moves successfully
- **THEN** a newborn fish occupies the parent's old cell and the parent's breed timer resets to 0

#### Scenario: Breeding-ready fish is blocked
- **WHEN** a breeding-ready fish has no adjacent empty cell
- **THEN** the breed timer resets to 0 and the fish does not move

#### Scenario: Non-breeding fish is blocked
- **WHEN** a fish below the breeding threshold has no adjacent empty cell
- **THEN** the breed timer continues to increment on subsequent chronons

### Requirement: Shark energy decrement before action
WHEN a shark acts, THEN the system SHALL decrement shark energy by `sharkEnergyCostPerChronon` before movement or eating. IF the energy value reaches 0 after the decrement, THEN the system SHALL remove the shark immediately without moving or eating.

#### Scenario: Shark starves
- **WHEN** a shark's energy reaches 0 after the start-of-action decrement
- **THEN** the shark is removed from the grid before moving or eating

#### Scenario: Shark survives decrement
- **WHEN** a shark's energy is above 0 after the decrement
- **THEN** the shark proceeds to movement and eating as normal

### Requirement: Shark hunting and eating
IF a shark has adjacent fish after surviving the energy decrement, THEN the system SHALL move the shark to a randomly selected adjacent fish cell and remove the eaten fish. WHEN a shark eats a fish, THEN the system SHALL add `sharkEnergyGain` to the shark energy. IF a shark has no adjacent fish and has at least one adjacent empty cell, THEN the system SHALL move the shark to a randomly selected adjacent empty cell.

#### Scenario: Shark eats adjacent fish
- **WHEN** a shark acts with at least one adjacent fish
- **THEN** it moves onto a randomly chosen fish cell, removes the fish, and gains `sharkEnergyGain` energy

#### Scenario: Shark drifts to empty cell
- **WHEN** a shark acts with no adjacent fish but at least one adjacent empty cell
- **THEN** it moves to a randomly chosen adjacent empty cell

#### Scenario: Shark is fully blocked
- **WHEN** a shark acts with no adjacent fish and no adjacent empty cell
- **THEN** it remains in place

### Requirement: Shark breeding
IF a shark is breeding-ready and successfully moves, THEN the system SHALL leave a newborn shark in the old cell and reset the parent breed timer to 0. WHEN a newborn shark is created, THEN the system SHALL initialize its energy to `initialSharkEnergy`. IF a shark is breeding-ready and cannot move, THEN the system SHALL reset the breed timer to 0. IF a shark is not breeding-ready and cannot move, THEN the system SHALL continue aging the breed timer.

#### Scenario: Breeding-ready shark moves
- **WHEN** a breeding-ready shark moves successfully
- **THEN** a newborn shark with `initialSharkEnergy` energy occupies the old cell and the parent's breed timer resets to 0

#### Scenario: Breeding-ready shark is blocked
- **WHEN** a breeding-ready shark has no valid destination
- **THEN** the breed timer resets to 0 and the shark does not move

### Requirement: State model
WHERE simulation state is stored, THEN the system SHALL use a flat grid array of entity IDs plus entity objects that are instances of classes extending a common `Entity` base class, with `Fish` and `Shark` subclasses, each entity record containing ID, type, position, breed age, and shark energy when applicable.

#### Scenario: Entity class hierarchy
- **WHEN** entities are created by the simulation
- **THEN** each is an instance of `Fish` or `Shark`, both extending `Entity`

#### Scenario: Grid lookup
- **WHEN** the simulation resolves the occupant of a cell
- **THEN** it uses the flat grid array to find the entity ID and the entity map to resolve the entity object

### Requirement: Configurable model constants
The system SHALL define grid dimensions (default 100x70), fish density (default 30%), shark density (default 5%), fish breed time (default 3), shark breed time (default 25), initial shark energy (default 5), shark energy gain (default 3), and shark energy cost per chronon (default 1) as code constants that are easy for programmers to change.

#### Scenario: Programmer changes grid dimensions
- **WHEN** a programmer edits the grid dimension constants
- **THEN** the simulation initializes with the new dimensions without other code changes

### Requirement: Random initialization
WHEN the simulation initializes, THEN the system SHALL randomly populate the grid using `Math.random()` with the configured fish and shark densities.

#### Scenario: Fresh world population
- **WHEN** a new simulation is created
- **THEN** approximately 30% of cells contain fish and 5% contain sharks, placed randomly with no cell holding more than one entity
