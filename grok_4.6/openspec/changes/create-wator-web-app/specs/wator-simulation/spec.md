## Purpose

Defines the framework-independent Wa-Tor predator-prey rules: a toroidal grid of fish and sharks that move, breed, hunt, starve, and produce population history each chronon.

## ADDED Requirements

### Requirement: 1. Rectangular toroidal world

The system SHALL represent the world as a rectangular grid whose width and height come from code constants, with defaults of `100` columns and `70` rows. Movement SHALL wrap at every edge so the world is a torus.

#### Scenario: 1.1 Default dimensions

- **WHEN** the simulation initializes with default constants
- **THEN** the world SHALL contain `100` columns and `70` rows

#### Scenario: 1.2 Horizontal wrap

- **WHEN** an entity moves west from column `0`
- **THEN** the system SHALL place that entity in the last column of the same row

#### Scenario: 1.3 Vertical wrap

- **WHEN** an entity moves south from the last row
- **THEN** the system SHALL place that entity in row `0` of the same column

### Requirement: 2. Random initial population

The system SHALL populate the initial world using code constants for fish density and shark density, with defaults of `30%` fish and `5%` sharks. Initial placement SHALL use `Math.random()`. Fish and sharks SHALL not occupy the same cell.

#### Scenario: 2.1 Default densities

- **WHEN** the simulation initializes with default constants
- **THEN** the system SHALL attempt to place fish in about `30%` of cells and sharks in about `5%` of cells, with remaining cells empty

#### Scenario: 2.2 Occupancy

- **WHEN** the initial world is complete
- **THEN** no cell SHALL contain more than one entity

### Requirement: 3. Orthogonal neighbors only

WHERE movement or hunting is evaluated, the system SHALL consider only the four orthogonal neighbors north, east, south, and west, each wrapped toroidally. Diagonal cells SHALL NOT be valid destinations.

#### Scenario: 3.1 Four neighbors

- **WHEN** the system lists valid destinations for a cell
- **THEN** the list SHALL contain at most the four orthogonal wrapped neighbors

### Requirement: 4. Chronon turn order

WHEN a chronon starts, the system SHALL collect the IDs of entities that already exist, randomize their acting order, and allow each surviving entity to act at most once. An entity born during the current chronon SHALL NOT act until the next chronon. An entity that dies or is eaten before its turn SHALL be skipped.

#### Scenario: 4.1 Existing entities act once

- **WHEN** a chronon begins with a set of living entities
- **THEN** the system SHALL offer each of those entities at most one action in randomized order

#### Scenario: 4.2 Newborns wait

- **IF** an entity is born during the current chronon
- **THEN** the system SHALL prevent that entity from acting until the next chronon

#### Scenario: 4.3 Dead entities are skipped

- **IF** an entity dies or is eaten before its randomized turn
- **THEN** the system SHALL skip that entity when its turn is reached

### Requirement: 5. Fish movement

WHEN a fish acts and at least one adjacent empty cell exists, the system SHALL move the fish to a randomly selected adjacent empty cell. IF no adjacent empty cell exists, the fish SHALL stay in place.

#### Scenario: 5.1 Fish moves into empty water

- **WHEN** a fish acts and one or more orthogonal neighbors are empty
- **THEN** the system SHALL move the fish to one of those empty cells chosen at random

#### Scenario: 5.2 Fish blocked

- **IF** a fish acts and every orthogonal neighbor is occupied
- **THEN** the fish SHALL remain in its current cell

### Requirement: 6. Fish breeding

A fish SHALL become breeding-ready after surviving `fishBreedTime` chronons, default `3`. IF a breeding-ready fish successfully moves, the system SHALL leave a new fish in the vacated cell and reset the parent breed timer to `0`. IF a breeding-ready fish cannot move, the system SHALL reset the fish breed timer to `0` without creating a child. IF a fish is not breeding-ready and cannot move, the system SHALL continue aging that fish breed timer.

#### Scenario: 6.1 Breed on successful move

- **IF** a fish is breeding-ready and successfully moves
- **THEN** the system SHALL leave a new fish in the old cell and reset the parent breed timer to `0`

#### Scenario: 6.2 Breed timer resets when blocked

- **IF** a fish is breeding-ready and cannot move
- **THEN** the system SHALL reset the fish breed timer to `0` and SHALL NOT create a child

#### Scenario: 6.3 Blocked immature fish keep aging

- **IF** a fish is not breeding-ready and cannot move
- **THEN** the system SHALL continue aging the fish breed timer

### Requirement: 7. Shark energy and starvation

WHEN a shark acts, the system SHALL decrement that shark's energy by `sharkEnergyCostPerChronon` (default `1`) before movement or eating. IF energy reaches `0` after that decrement, the system SHALL remove the shark immediately without moving or eating.

#### Scenario: 7.1 Energy spent first

- **WHEN** a shark begins its action
- **THEN** the system SHALL subtract the energy cost before evaluating neighbors

#### Scenario: 7.2 Starvation death

- **IF** a shark's energy is `0` after the start-of-action decrement
- **THEN** the system SHALL remove the shark immediately without moving or eating

### Requirement: 8. Shark hunting and movement

IF a shark survives the energy decrement and has at least one adjacent fish, the system SHALL move the shark to a randomly selected adjacent fish cell and remove the eaten fish. WHEN a shark eats a fish, the system SHALL add `sharkEnergyGain` (default `3`) to the shark energy. IF a surviving shark has no adjacent fish and has at least one adjacent empty cell, the system SHALL move the shark to a randomly selected adjacent empty cell. IF no valid destination exists, the shark SHALL stay in place.

#### Scenario: 8.1 Hunt preferred

- **IF** a shark has adjacent fish after surviving the energy decrement
- **THEN** the system SHALL move the shark onto one of those fish at random and remove the eaten fish

#### Scenario: 8.2 Eating restores energy

- **WHEN** a shark eats a fish
- **THEN** the system SHALL add `sharkEnergyGain` to that shark's energy

#### Scenario: 8.3 Move to empty water

- **IF** a shark has no adjacent fish and has at least one adjacent empty cell
- **THEN** the system SHALL move the shark to one of those empty cells at random

#### Scenario: 8.4 Shark blocked

- **IF** a shark has no adjacent fish and no adjacent empty cell
- **THEN** the shark SHALL remain in its current cell

### Requirement: 9. Shark breeding

A shark SHALL become breeding-ready after surviving `sharkBreedTime` chronons, default `25`. IF a breeding-ready shark successfully moves, the system SHALL leave a newborn shark in the vacated cell, initialize the newborn energy to `initialSharkEnergy` (default `5`), and reset the parent breed timer to `0`. IF a breeding-ready shark cannot move, the system SHALL reset the shark breed timer to `0` without creating a child. IF a shark is not breeding-ready and cannot move, the system SHALL continue aging that shark breed timer.

#### Scenario: 9.1 Breed on successful move

- **IF** a shark is breeding-ready and successfully moves
- **THEN** the system SHALL leave a newborn shark in the old cell and reset the parent breed timer to `0`

#### Scenario: 9.2 Newborn energy

- **WHEN** a newborn shark is created
- **THEN** the system SHALL initialize the newborn shark energy to `initialSharkEnergy`

#### Scenario: 9.3 Breed timer resets when blocked

- **IF** a shark is breeding-ready and cannot move
- **THEN** the system SHALL reset the shark breed timer to `0` and SHALL NOT create a child

#### Scenario: 9.4 Blocked immature sharks keep aging

- **IF** a shark is not breeding-ready and cannot move
- **THEN** the system SHALL continue aging the shark breed timer

### Requirement: 10. Entity records and grid storage

WHERE simulation state is stored, the system SHALL use a flat grid plus entity records. Each entity record SHALL include identity, type, position, and breed age. Shark records SHALL also include energy. Fish and shark records SHALL be instances of classes that share a common entity base type.

#### Scenario: 10.1 Shared entity model

- **WHEN** the world contains fish and sharks
- **THEN** each occupant SHALL be addressable from the flat grid and as an entity record with identity, type, position, and breed age

#### Scenario: 10.2 Shark energy field

- **WHEN** a shark record is inspected
- **THEN** it SHALL include an energy value in addition to the shared entity fields

### Requirement: 11. Population history

WHEN a chronon completes, the system SHALL record one fish-count and shark-count sample. The history SHALL be a rolling window of the most recent `500` chronons.

#### Scenario: 11.1 One sample per chronon

- **WHEN** the world advances by one chronon
- **THEN** the system SHALL append one population sample for that chronon

#### Scenario: 11.2 Rolling window

- **WHEN** more than `500` chronons have been recorded
- **THEN** the system SHALL retain only the most recent `500` samples

### Requirement: 12. Extinction outcomes

IF either fish or sharks become extinct, the simulation SHALL enter a terminal state. IF sharks reach zero while fish remain, the terminal status SHALL be `Sharks extinct`. IF fish reach zero while sharks remain, the terminal status SHALL be `Fish extinct`. IF both reach zero in the same chronon, the terminal status SHALL be `Ecosystem collapsed`.

#### Scenario: 12.1 Sharks gone

- **IF** sharks reach zero while fish remain
- **THEN** the system SHALL report `Sharks extinct` and become terminal

#### Scenario: 12.2 Fish gone

- **IF** fish reach zero while sharks remain
- **THEN** the system SHALL report `Fish extinct` and become terminal

#### Scenario: 12.3 Both gone

- **IF** fish and sharks both reach zero in the same chronon
- **THEN** the system SHALL report `Ecosystem collapsed` and become terminal

### Requirement: 13. Programmer-editable model constants

WHERE code constants define model parameters, the system SHALL make grid dimensions, densities, breed times, and shark energy values easy for a programmer to change in one configuration module. Changing those constants SHALL change subsequent initialization and stepping behavior without requiring user-facing controls.

#### Scenario: 13.1 Constants drive a new world

- **WHEN** a programmer changes grid size or density constants and the simulation is reset
- **THEN** the new world SHALL use the updated values

### Requirement: 14. Engine independence

The simulation engine SHALL evaluate Wa-Tor rules without depending on rendering APIs or scene objects. A caller SHALL be able to initialize, step, pause conceptually, and read world state and history through the engine alone.

#### Scenario: 14.1 Headless step

- **WHEN** a caller advances the simulation by one chronon without a renderer
- **THEN** the engine SHALL update entity positions, populations, history, and extinction status
