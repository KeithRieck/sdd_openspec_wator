# Simulation Engine Specification

## Purpose

Defines the core Wa-Tor simulation engine: a toroidal grid of fish and sharks, entity behavior, chronon-based turn order, breeding, energy, population tracking, extinction detection, and reset. The engine is independent of any rendering layer (e.g., Phaser).

## Requirements

### Requirement: Toroidal grid initialization
The system SHALL create a rectangular toroidal grid using code constants for width and height with defaults of 100 columns and 70 rows. The grid SHALL be a flat array indexed `y * width + x`, where each cell holds an `Entity` instance or `null`.

#### Scenario: Default grid dimensions
- **WHEN** the simulation initializes with default constants
- **THEN** the system SHALL create a grid of 100 columns by 70 rows (7000 cells)

#### Scenario: Programmer changes grid dimensions
- **WHEN** a programmer changes the width and height constants in `src/config.js`
- **THEN** the system SHALL create a grid with the new dimensions without requiring any UI changes

### Requirement: Random initial population
The system SHALL randomly populate the grid using code constants for fish density (default 30%) and shark density (default 5%). Each cell SHALL be independently assigned a fish, a shark, or left empty according to the densities, using `Math.random()`.

#### Scenario: Default densities
- **WHEN** the simulation initializes with default constants
- **THEN** approximately 30% of cells SHALL contain fish and approximately 5% SHALL contain sharks

#### Scenario: No cell double-occupied
- **WHEN** initial population is placed
- **THEN** no cell SHALL contain both a fish and a shark

### Requirement: Stable integer entity IDs
Each entity SHALL have a stable integer ID assigned at construction from a monotonic counter on the simulation. IDs SHALL NOT be reused within a simulation run.

#### Scenario: Unique IDs across births
- **WHEN** multiple entities are created during a run including births
- **THEN** every entity SHALL have a unique integer ID that no other entity shares

### Requirement: Toroidal orthogonal movement
Movement SHALL consider only orthogonal neighbors — north, east, south, and west — with toroidal edge wrapping. Diagonal movement SHALL NOT occur.

#### Scenario: Edge wrapping
- **WHEN** an entity at column 0 moves west
- **THEN** it SHALL wrap to column `width - 1` of the same row

#### Scenario: Corner wrapping
- **WHEN** an entity at row 0, column 0 moves north
- **THEN** it SHALL wrap to row `height - 1`, column 0

### Requirement: Chronon turn order
At the start of each chronon, the system SHALL snapshot all current entity IDs, randomize their order via Fisher-Yates shuffle, and allow each surviving entity to act at most once.

#### Scenario: Randomized order
- **WHEN** a chronon begins
- **THEN** the system SHALL collect all entity IDs that exist at that instant and shuffle them before any entity acts

#### Scenario: Each entity acts at most once
- **WHEN** a chronon runs
- **THEN** each surviving entity SHALL act no more than one time during that chronon

### Requirement: Newborns do not act
IF an entity was born during the current chronon, the system SHALL prevent that entity from acting until the next chronon.

#### Scenario: Newborn skipped this chronon
- **WHEN** an entity is born during chronon N
- **THEN** the system SHALL skip that entity when its ID is reached in the turn list during chronon N

### Requirement: Dead-before-turn skipped
IF an entity dies or is eaten before its randomized turn, the system SHALL skip that entity when its turn is reached.

#### Scenario: Eaten fish skipped
- **WHEN** a fish is eaten by a shark earlier in the turn order
- **THEN** the system SHALL skip that fish when its ID is later reached in the shuffled list

### Requirement: Fish movement
WHEN a fish acts and at least one adjacent empty cell exists, the system SHALL move the fish to a randomly selected adjacent empty cell.

#### Scenario: Fish moves to empty neighbor
- **WHEN** a fish acts and at least one orthogonal neighbor is empty
- **THEN** the system SHALL move the fish to one randomly selected empty neighbor

#### Scenario: Fish cannot move
- **WHEN** a fish acts and no orthogonal neighbor is empty
- **THEN** the fish SHALL not move

### Requirement: Fish breeding
IF a fish is breeding-ready (breed age reached `fishBreedTime`) and successfully moves, the system SHALL leave a new fish in the old cell and reset the parent breed timer to 0. IF a fish is breeding-ready and cannot move, the system SHALL reset the breed timer to 0. IF a fish is not breeding-ready and cannot move, the system SHALL continue aging the breed timer.

#### Scenario: Breeding fish moves
- **WHEN** a breeding-ready fish moves to an empty neighbor
- **THEN** a new fish SHALL be left in the old cell with a fresh ID and `birthChronon` set to the current chronon, and the parent breed timer SHALL reset to 0

#### Scenario: Breeding-ready fish blocked
- **WHEN** a breeding-ready fish cannot move
- **THEN** the breed timer SHALL reset to 0 and no new fish SHALL be created

#### Scenario: Non-breeding fish blocked
- **WHEN** a non-breeding-ready fish cannot move
- **THEN** the breed timer SHALL increment

### Requirement: Shark energy decrement
WHEN a shark acts, the system SHALL decrement shark energy by `sharkEnergyCostPerChronon` (default 1) before movement or eating.

#### Scenario: Energy decremented each chronon
- **WHEN** a shark acts
- **THEN** the shark energy SHALL decrease by `sharkEnergyCostPerChronon` before any movement or eating is considered

### Requirement: Shark starvation
IF a shark energy value reaches 0 after the start-of-action decrement, the system SHALL remove the shark immediately without moving or eating.

#### Scenario: Shark starves
- **WHEN** a shark's energy reaches 0 after the decrement
- **THEN** the shark SHALL be removed and SHALL not move or eat during that action

### Requirement: Shark eating
IF a shark has adjacent fish after surviving the energy decrement, the system SHALL move the shark to a randomly selected adjacent fish cell, remove the eaten fish, and add `sharkEnergyGain` (default 3) to the shark energy.

#### Scenario: Shark eats adjacent fish
- **WHEN** a shark survives the energy decrement and at least one orthogonal neighbor contains a fish
- **THEN** the shark SHALL move to one randomly selected fish neighbor, the eaten fish SHALL be removed, and the shark energy SHALL increase by `sharkEnergyGain`

### Requirement: Shark movement without fish
IF a shark has no adjacent fish and at least one adjacent empty cell, the system SHALL move the shark to a randomly selected adjacent empty cell.

#### Scenario: Shark moves to empty cell
- **WHEN** a shark has no adjacent fish and at least one empty orthogonal neighbor
- **THEN** the shark SHALL move to one randomly selected empty neighbor

### Requirement: Shark breeding
WHEN a shark is breeding-ready (breed age reached `sharkBreedTime`) and successfully moves, the system SHALL leave a newborn shark in the old cell, reset the parent breed timer to 0, and initialize the newborn shark energy to `initialSharkEnergy` (default 5). IF a shark is breeding-ready and cannot move, the system SHALL reset the breed timer to 0. IF a shark is not breeding-ready and cannot move, the system SHALL continue aging the breed timer.

#### Scenario: Breeding shark moves
- **WHEN** a breeding-ready shark moves (by eating or to an empty cell)
- **THEN** a newborn shark SHALL be left in the old cell with a fresh ID, `birthChronon` set to the current chronon, and energy set to `initialSharkEnergy`, and the parent breed timer SHALL reset to 0

#### Scenario: Breeding-ready shark blocked
- **WHEN** a breeding-ready shark cannot move
- **THEN** the breed timer SHALL reset to 0 and no new shark SHALL be created

#### Scenario: Non-breeding shark blocked
- **WHEN** a non-breeding-ready shark cannot move
- **THEN** the breed timer SHALL increment

### Requirement: Population tracking
The system SHALL maintain live counts of fish and sharks, updated on every birth and death, and SHALL record one population sample per chronon for a rolling window of 500 chronons.

#### Scenario: Counts updated on birth
- **WHEN** a fish or shark is born
- **THEN** the corresponding live count SHALL increment

#### Scenario: Counts updated on death
- **WHEN** a fish or shark dies or is eaten
- **THEN** the corresponding live count SHALL decrement

#### Scenario: Rolling history window
- **WHEN** more than 500 chronons have elapsed
- **THEN** the history SHALL retain only the most recent 500 samples

### Requirement: Extinction detection
The system SHALL detect extinction after each chronon. IF both fish and sharks reach zero, the status SHALL be `Ecosystem collapsed`. IF sharks reach zero while fish remain, the status SHALL be `Sharks extinct`. IF fish reach zero while sharks remain, the status SHALL be `Fish extinct`. Otherwise the status SHALL reflect running or paused state.

#### Scenario: Sharks extinct
- **WHEN** shark count reaches zero while fish count is greater than zero
- **THEN** the status SHALL become `Sharks extinct`

#### Scenario: Fish extinct
- **WHEN** fish count reaches zero while shark count is greater than zero
- **THEN** the status SHALL become `Fish extinct`

#### Scenario: Ecosystem collapsed
- **WHEN** both fish and shark counts reach zero in the same chronon
- **THEN** the status SHALL become `Ecosystem collapsed`

### Requirement: Engine independence from Phaser
The simulation engine SHALL NOT import or depend on any Phaser API or Phaser scene object. The engine SHALL be usable independently of any rendering layer.

#### Scenario: No Phaser imports in engine
- **WHEN** the engine source files in `src/simulation/` are inspected
- **THEN** none SHALL import or reference Phaser

### Requirement: Reset
WHEN reset is activated, the system SHALL create a new random world, set chronon to 0, clear extinction status, clear population history, and resume running at the currently selected speed.

#### Scenario: Reset creates new world
- **WHEN** reset is activated
- **THEN** a new random grid SHALL be generated, chronon SHALL be 0, history SHALL be empty, status SHALL be cleared, and the simulation SHALL resume running at the selected speed
