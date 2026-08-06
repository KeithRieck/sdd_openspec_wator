## ADDED Requirements

### Requirement: Toroidal Grid Initialization
The system SHALL create a rectangular toroidal grid using code constants for width and height (defaults: 100 columns, 70 rows).

#### Scenario: Grid Creation
- **WHEN** the simulation initializes
- **THEN** a grid of 100x70 is created and coordinates wrap around edges (toroidal).

### Requirement: Random Population
The system SHALL randomly populate the grid using code constants for fish density (30%) and shark density (5%).

#### Scenario: Initial Population
- **WHEN** the simulation initializes
- **THEN** approximately 30% of cells contain fish and 5% contain sharks, distributed randomly.

### Requirement: Chronon Execution Order
The system SHALL collect current entity IDs, randomize their order, and allow each surviving entity to act at most once per chronon.

#### Scenario: Randomized Turn Order
- **WHEN** a chronon starts
- **THEN** entities are processed in a random sequence, ensuring no entity acts twice.

### Requirement: Newborn Entity Restriction
The system SHALL prevent entities born during the current chronon from acting until the next chronon.

#### Scenario: Newborn doesn't act
- **WHEN** a fish or shark is created via breeding during a chronon
- **THEN** that new entity is skipped for the remainder of the current chronon.

### Requirement: Dead Entity Skipping
The system SHALL skip an entity's turn if it dies or is eaten before its randomized turn.

#### Scenario: Eaten fish skipped
- **WHEN** a fish is eaten by a shark before its turn in the current chronon
- **THEN** the simulation skips the turn for that fish's ID.

### Requirement: Fish Movement
The system SHALL move a fish to a randomly selected adjacent empty cell if at least one exists.

#### Scenario: Successful fish move
- **WHEN** a fish acts and has adjacent empty cells
- **THEN** it moves to one of them randomly.

### Requirement: Fish Breeding
The system SHALL leave a new fish in the old cell and reset the parent's breed timer to 0 if the fish is breeding-ready and successfully moves.

#### Scenario: Fish reproduces
- **WHEN** a breeding-ready fish moves to a new cell
- **THEN** a new fish is created at the old position and the parent's timer resets.

### Requirement: Fish Breeding Failure
The system SHALL reset the fish breed timer to 0 if a breeding-ready fish cannot move.

#### Scenario: Breeding-ready fish trapped
- **WHEN** a breeding-ready fish has no adjacent empty cells
- **THEN** it stays in place and its breed timer resets to 0.

### Requirement: Fish Aging
The system SHALL continue aging the fish breed timer if a fish is not breeding-ready and cannot move.

#### Scenario: Non-breeding fish trapped
- **WHEN** a fish that is not yet breeding-ready has no adjacent empty cells
- **THEN** it stays in place and its breed timer increments.

### Requirement: Shark Energy Depletion
The system SHALL decrement shark energy by `sharkEnergyCostPerChronon` at the start of its action.

#### Scenario: Energy cost
- **WHEN** a shark begins its turn
- **THEN** its energy is reduced by the cost constant.

### Requirement: Shark Starvation
The system SHALL remove a shark immediately if its energy reaches 0 after the start-of-action decrement.

#### Scenario: Shark dies of hunger
- **WHEN** a shark's energy becomes 0 after the cost decrement
- **THEN** the shark is removed from the simulation without moving or eating.

### Requirement: Shark Hunting
The system SHALL move a shark to a randomly selected adjacent fish cell and remove the eaten fish if adjacent fish exist.

#### Scenario: Shark eats fish
- **WHEN** a shark survives energy depletion and has adjacent fish
- **THEN** it moves to one fish cell randomly and the fish is removed.

### Requirement: Shark Energy Gain
The system SHALL add `sharkEnergyGain` to the shark's energy when it eats a fish.

#### Scenario: Energy reward
- **WHEN** a shark eats a fish
- **THEN** its energy increases by the gain constant.

### Requirement: Shark Movement
The system SHALL move a shark to a randomly selected adjacent empty cell if no fish are adjacent and at least one empty cell exists.

#### Scenario: Shark moves to empty cell
- **WHEN** a shark has no adjacent fish but has adjacent empty cells
- **THEN** it moves to one of them randomly.

### Requirement: Shark Breeding
The system SHALL leave a newborn shark in the old cell and reset the parent's breed timer to 0 if the shark is breeding-ready and successfully moves.

#### Scenario: Shark reproduces
- **WHEN** a breeding-ready shark moves (either eating or to empty cell)
- **THEN** a new shark is created at the old position and the parent's timer resets.

### Requirement: Newborn Shark Energy
The system SHALL initialize a newborn shark's energy to `initialSharkEnergy`.

#### Scenario: Baby shark energy
- **WHEN** a shark is born via breeding
- **THEN** its starting energy is set to the initial energy constant.

### Requirement: Shark Breeding Failure
The system SHALL reset the shark breed timer to 0 if a breeding-ready shark cannot move.

#### Scenario: Breeding-ready shark trapped
- **WHEN** a breeding-ready shark has no adjacent fish and no adjacent empty cells
- **THEN** it stays in place and its breed timer resets to 0.

### Requirement: Shark Aging
The system SHALL continue aging the shark breed timer if a shark is not breeding-ready and cannot move.

#### Scenario: Non-breeding shark trapped
- **WHEN** a shark that is not yet breeding-ready has no adjacent fish and no adjacent empty cells
- **THEN** it stays in place and its breed timer increments.

### Requirement: Simulation State Storage
The system SHALL use a flat grid array plus entity records containing ID, type, position, breed age, and shark energy.

#### Scenario: State retrieval
- **WHEN** the renderer requests the state
- **THEN** the system provides the current grid and the list of entity records.
