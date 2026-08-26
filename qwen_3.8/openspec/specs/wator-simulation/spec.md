# wator-simulation Specification

## Purpose

Defines the behavior of the framework-independent Wa-Tor predator-prey cellular automaton engine: toroidal grid, entity records, chronon stepping rules, extinction detection, and rolling population history.

## Requirements

### Requirement: R1. Toroidal grid initialization
The system SHALL create a rectangular toroidal grid whose width and height are code constants with defaults of 100 columns and 70 rows, and SHALL randomly populate it using code constants for 30% fish density and 5% shark density on disjoint cells.

#### Scenario: R1.1 Default world creation
- **WHEN** the simulation initializes
- **THEN** the grid SHALL be 100 columns by 70 rows with orthogonal edge wrapping in all four directions

#### Scenario: R1.2 Initial population
- **WHEN** the simulation initializes
- **THEN** approximately 30% of all cells SHALL contain fish and approximately 5% of the remaining cells SHALL contain sharks, with no cell containing both

#### Scenario: R1.3 Changed grid constants
- **WHEN** a programmer changes the grid dimension constants in code
- **THEN** the simulation SHALL initialize a world of the new dimensions without other code changes

### Requirement: R2. Randomized-sequential chronon stepping
The system SHALL advance time in discrete chronons; at the start of each chronon it SHALL collect the IDs of all living entities, randomize their order, and allow each surviving entity to act at most once.

#### Scenario: R2.1 Randomized turn order
- **WHEN** a chronon starts
- **THEN** each living entity SHALL act at most once, in a randomly shuffled order

#### Scenario: R2.2 Newborns wait
- **IF** an entity was born during the current chronon
- **THEN** the system SHALL prevent that entity from acting until the next chronon

#### Scenario: R2.3 Dead entities skipped
- **IF** an entity dies or is eaten before its randomized turn
- **THEN** the system SHALL skip that entity when its turn is reached

### Requirement: R3. Fish movement and breeding
A fish SHALL move to a randomly selected adjacent unoccupied cell when at least one exists; a breeding-ready fish SHALL leave a new fish in its old cell when it moves, and the breed timer SHALL reset to 0 whenever the fish is breeding-ready (whether or not it moved) and otherwise age by one chronon.

#### Scenario: R3.1 Fish moves to empty cell
- **WHEN** a fish acts and at least one adjacent empty cell exists
- **THEN** the fish SHALL move to a randomly selected adjacent empty cell

#### Scenario: R3.2 Breeding fish leaves offspring
- **IF** a fish is breeding-ready and successfully moves
- **THEN** a new fish SHALL occupy the old cell and the parent fish's breed timer SHALL reset to 0

#### Scenario: R3.3 Breeding-ready fish blocked
- **IF** a fish is breeding-ready and cannot move
- **THEN** the fish's breed timer SHALL reset to 0

#### Scenario: R3.4 Non-breeding fish blocked
- **IF** a fish is not breeding-ready and cannot move
- **THEN** the fish's breed timer SHALL continue aging

### Requirement: R4. Shark energy and starvation
The system SHALL decrement each shark's energy by the per-chronon cost at the start of the shark's action, before movement or eating, and SHALL remove the shark immediately without moving or eating if its energy reaches 0.

#### Scenario: R4.1 Energy cost applied first
- **WHEN** a shark acts
- **THEN** the shark's energy SHALL be decremented by the per-chronon cost before any movement or eating

#### Scenario: R4.2 Starvation
- **IF** a shark's energy reaches 0 after the start-of-action decrement
- **THEN** the shark SHALL be removed without moving or eating

### Requirement: R5. Shark predation
A shark that survives the energy decrement SHALL move to a randomly selected adjacent fish cell when adjacent fish exist, remove the eaten fish, and gain the configured energy amount.

#### Scenario: R5.1 Shark eats adjacent fish
- **IF** a shark has adjacent fish after surviving the energy decrement
- **THEN** the shark SHALL move to a randomly selected adjacent fish cell and the eaten fish SHALL be removed

#### Scenario: R5.2 Energy gain
- **WHEN** a shark eats a fish
- **THEN** the shark's energy SHALL increase by the configured energy gain

### Requirement: R6. Shark movement without prey
A shark with no adjacent fish SHALL move to a randomly selected adjacent unoccupied cell when at least one exists, and SHALL not move if no adjacent cell is free.

#### Scenario: R6.1 Shark wanders
- **IF** a shark has no adjacent fish and has at least one adjacent empty cell
- **THEN** the shark SHALL move to a randomly selected adjacent empty cell

#### Scenario: R6.2 Shark boxed in
- **IF** a shark has no adjacent fish and no adjacent empty cell
- **THEN** the shark SHALL not move

### Requirement: R7. Shark breeding
A breeding-ready shark SHALL leave a newborn shark in its old cell when it moves, with the newborn's energy initialized to the configured initial energy; the parent's breed timer SHALL reset to 0 whenever the shark is breeding-ready (whether or not it moved) and otherwise age by one chronon.

#### Scenario: R7.1 Breeding shark leaves offspring
- **IF** a shark is breeding-ready and successfully moves
- **THEN** a newborn shark SHALL occupy the old cell and the parent shark's breed timer SHALL reset to 0

#### Scenario: R7.2 Newborn energy
- **WHEN** a newborn shark is created
- **THEN** its energy SHALL be initialized to the configured initial shark energy

#### Scenario: R7.3 Breeding-ready shark blocked
- **IF** a shark is breeding-ready and cannot move
- **THEN** the shark's breed timer SHALL reset to 0

#### Scenario: R7.4 Non-breeding shark blocked
- **IF** a shark is not breeding-ready and cannot move
- **THEN** the shark's breed timer SHALL continue aging

### Requirement: R8. Simulation state representation
The system SHALL store simulation state as a flat grid array plus entity records containing an ID, type, position, breed age, and shark energy when applicable.

#### Scenario: R8.1 State shape
- **WHEN** the simulation state is inspected
- **THEN** each cell SHALL reference at most one entity record, and each entity record SHALL carry its ID, type, position, breed age, and (for sharks) energy

### Requirement: R9. Extinction detection
The system SHALL detect extinction at the end of each chronon and set a terminal status: `Sharks extinct` when sharks reach zero while fish remain, `Fish extinct` when fish reach zero while sharks remain, and `Ecosystem collapsed` when both reach zero in the same chronon.

#### Scenario: R9.1 Sharks extinct
- **IF** sharks reach zero while fish remain
- **THEN** the status SHALL be `Sharks extinct`

#### Scenario: R9.2 Fish extinct
- **IF** fish reach zero while sharks remain
- **THEN** the status SHALL be `Fish extinct`

#### Scenario: R9.3 Ecosystem collapsed
- **IF** fish and sharks both reach zero in the same chronon
- **THEN** the status SHALL be `Ecosystem collapsed`

### Requirement: R10. Rolling population history
The system SHALL record one population sample per chronon for a rolling window of 500 chronons, including the initial population as the first sample.

#### Scenario: R10.1 Sample per chronon
- **WHEN** the world advances by one chronon
- **THEN** the history SHALL contain one new sample of fish and shark counts

#### Scenario: R10.2 Rolling window
- **WHEN** more than 500 samples exist
- **THEN** the oldest samples SHALL be discarded so that at most 500 remain

#### Scenario: R10.3 Initial sample
- **WHEN** the simulation initializes
- **THEN** the history SHALL contain one sample reflecting the initial population

### Requirement: R11. Reset
The system SHALL support resetting to a new random world with the chronon counter set to 0, extinction status cleared, and population history cleared.

#### Scenario: R11.1 Reset produces fresh world
- **WHEN** a reset is requested
- **THEN** the system SHALL create a new random world, set the chronon to 0, clear any extinction status, and clear the population history

### Requirement: R12. Configurable model parameters
The system SHALL define grid dimensions, densities, breed times, shark energy values, colors, and speed options as code constants in a single configuration module that is easy for programmers to change.

#### Scenario: R12.1 Constants in one place
- **WHEN** a programmer needs to change a model parameter
- **THEN** the change SHALL be made by editing a constant in the configuration module without modifying simulation logic
