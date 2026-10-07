# Wator Simulation Specification

## Purpose

Provides the core Wa-Tor predator-prey cellular automaton simulation engine with a toroidal grid, entity lifecycle management, and chronon-based discrete time updates. The engine is completely independent of any rendering framework.

## Requirements

### Requirement: Toroidal Grid Initialization
The system SHALL create a rectangular toroidal grid with configurable width and height, defaulting to 100 columns and 70 rows.

#### Scenario: Default grid creation
- **WHEN** the simulation initializes with default configuration
- **THEN** the system creates a grid with 100 columns and 70 rows (7000 cells total)

#### Scenario: Custom grid dimensions
- **WHEN** the simulation initializes with custom width and height values
- **THEN** the system creates a grid with the specified dimensions

### Requirement: Random Population Initialization
The system SHALL randomly populate the grid with fish and sharks based on configurable density percentages, defaulting to 30% fish and 5% shark density.

#### Scenario: Default population initialization
- **WHEN** the simulation initializes with default configuration
- **THEN** approximately 30% of cells contain fish and 5% contain sharks, with remaining cells empty

#### Scenario: Custom density initialization
- **WHEN** the simulation initializes with custom density values
- **THEN** the system populates the grid according to the specified percentages

### Requirement: Orthogonal Neighbor Calculation with Toroidal Wrapping
The system SHALL calculate the four orthogonal neighbors (north, east, south, west) for any cell with toroidal edge wrapping.

#### Scenario: Interior cell neighbors
- **WHEN** calculating neighbors for a cell not on the grid edge
- **THEN** the system returns the four adjacent cells in cardinal directions

#### Scenario: Edge cell with toroidal wrapping
- **WHEN** calculating neighbors for a cell on the grid edge
- **THEN** the system wraps around to the opposite edge (e.g., north of row 0 is row height-1)

### Requirement: Chronon-Based Discrete Time
The system SHALL advance simulation time in discrete steps called chronons, where each chronon allows every surviving entity to act at most once.

#### Scenario: Single chronon execution
- **WHEN** the simulation advances by one chronon
- **THEN** each living entity acts exactly once in randomized order

### Requirement: Randomized Turn Order
The system SHALL randomize the order in which entities act during each chronon using a single random number generator.

#### Scenario: Turn order randomization
- **WHEN** a chronon begins
- **THEN** the system collects all living entity IDs, shuffles them randomly, and processes them in that order

### Requirement: Newborn Entity Restriction
The system SHALL prevent entities born during the current chronon from acting until the next chronon.

#### Scenario: Newborn skips current chronon
- **WHEN** an entity is born during a chronon
- **THEN** that entity does not act during the remainder of the current chronon

### Requirement: Dead Entity Skip
The system SHALL skip entities that die or are eaten before their randomized turn is reached.

#### Scenario: Eaten entity skipped
- **WHEN** an entity is eaten by a shark before its turn in the randomized order
- **THEN** the system skips that entity when its turn is reached

### Requirement: Fish Movement
The system SHALL move fish to a randomly selected adjacent empty cell when at least one empty neighbor exists.

#### Scenario: Fish moves to empty cell
- **WHEN** a fish acts and at least one adjacent cell is empty
- **THEN** the system moves the fish to a randomly selected empty adjacent cell

#### Scenario: Fish cannot move
- **WHEN** a fish acts and no adjacent cells are empty
- **THEN** the fish remains in its current position

### Requirement: Fish Breeding
The system SHALL allow fish to reproduce after surviving a configurable number of chronons (default 3), leaving a new fish in the old position when moving.

#### Scenario: Fish breeds when moving
- **WHEN** a breeding-ready fish successfully moves to a new cell
- **THEN** the system creates a new fish in the old cell and resets the parent's breed timer to 0

#### Scenario: Fish breeding-ready but cannot move
- **WHEN** a breeding-ready fish cannot move because no adjacent cells are empty
- **THEN** the system resets the fish's breed timer to 0

#### Scenario: Fish not breeding-ready and cannot move
- **WHEN** a fish that is not breeding-ready cannot move
- **THEN** the system increments the fish's breed timer by 1

### Requirement: Shark Energy Management
The system SHALL decrement shark energy by a configurable amount (default 1) at the start of each shark's action, and remove the shark if energy reaches zero.

#### Scenario: Shark loses energy each chronon
- **WHEN** a shark acts
- **THEN** the system decrements the shark's energy by the configured cost before any movement or eating

#### Scenario: Shark dies from starvation
- **WHEN** a shark's energy reaches 0 after the start-of-action decrement
- **THEN** the system removes the shark immediately without moving or eating

### Requirement: Shark Hunting
The system SHALL move sharks to adjacent fish cells to eat them, gaining energy upon successful consumption.

#### Scenario: Shark eats adjacent fish
- **WHEN** a shark acts and has at least one adjacent fish
- **THEN** the system moves the shark to a randomly selected adjacent fish cell, removes the eaten fish, and adds the configured energy gain (default 3) to the shark's energy

#### Scenario: Shark moves to empty cell when no fish adjacent
- **WHEN** a shark acts, has no adjacent fish, and has at least one adjacent empty cell
- **THEN** the system moves the shark to a randomly selected empty adjacent cell

### Requirement: Shark Breeding
The system SHALL allow sharks to reproduce after surviving a configurable number of chronons (default 25), with eating a fish counting as a successful move for breeding purposes.

#### Scenario: Shark breeds after eating
- **WHEN** a breeding-ready shark eats a fish
- **THEN** the system creates a newborn shark in the old cell with initial energy, and resets the parent's breed timer to 0

#### Scenario: Shark breeds after moving to empty cell
- **WHEN** a breeding-ready shark moves to an empty cell
- **THEN** the system creates a newborn shark in the old cell with initial energy, and resets the parent's breed timer to 0

#### Scenario: Newborn shark energy initialization
- **WHEN** a newborn shark is created
- **THEN** the system initializes the newborn's energy to the configured initial value (default 5)

#### Scenario: Shark breeding-ready but cannot move
- **WHEN** a breeding-ready shark cannot move (no adjacent fish and no empty cells)
- **THEN** the system resets the shark's breed timer to 0

#### Scenario: Shark not breeding-ready and cannot move
- **WHEN** a shark that is not breeding-ready cannot move
- **THEN** the system increments the shark's breed timer by 1

### Requirement: Entity Data Model
The system SHALL store simulation state using a flat grid array with one slot per cell containing an entity ID or empty marker, plus entity objects that carry ID, position (as flat grid index), and breed age.

#### Scenario: Grid and entity consistency
- **WHEN** an entity occupies a cell
- **THEN** the grid slot at that cell's index contains the entity's ID, and the entity's position matches that index

#### Scenario: Shark entity additional data
- **WHEN** a shark entity is created
- **THEN** the shark object additionally carries an energy value

### Requirement: Population Statistics
The system SHALL track and expose current chronon count, fish count, shark count, and simulation status (Running, Paused, or terminal states).

#### Scenario: Statistics available during simulation
- **WHEN** the simulation is running or paused
- **THEN** the system provides current chronon, fish count, shark count, and status

### Requirement: Extinction Detection
The system SHALL detect when fish or sharks become extinct and set a terminal status.

#### Scenario: Sharks extinct
- **WHEN** shark count reaches 0 while fish remain
- **THEN** the system sets status to "Sharks extinct" and marks the simulation as terminal

#### Scenario: Fish extinct
- **WHEN** fish count reaches 0 while sharks remain
- **THEN** the system sets status to "Fish extinct" and marks the simulation as terminal

#### Scenario: Ecosystem collapsed
- **WHEN** both fish and shark counts reach 0 in the same chronon
- **THEN** the system sets status to "Ecosystem collapsed" and marks the simulation as terminal

### Requirement: Single Random Number Generator
The system SHALL use exactly one random number generator for all random choices including initialization, movement selection, and turn-order shuffling.

#### Scenario: All randomness from single source
- **WHEN** any random choice is needed during simulation
- **THEN** the system draws from the single shared random number generator

### Requirement: Simulation Reset
The system SHALL support resetting the simulation to a new random world with chronon set to 0, cleared extinction status, and cleared population history.

#### Scenario: Reset creates new world
- **WHEN** reset is activated
- **THEN** the system creates a new randomly populated world, sets chronon to 0, clears terminal status, and clears population history

### Requirement: Population History Recording
The system SHALL record population history with one sample per chronon for a rolling window of 500 chronons.

#### Scenario: History recorded per chronon
- **WHEN** a chronon completes
- **THEN** the system records the fish count and shark count for that chronon

#### Scenario: Rolling window limit
- **WHEN** population history exceeds 500 samples
- **THEN** the system discards the oldest sample to maintain a maximum of 500 samples
