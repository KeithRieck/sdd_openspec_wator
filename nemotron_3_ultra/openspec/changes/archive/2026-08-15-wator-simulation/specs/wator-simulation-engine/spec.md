## ADDED Requirements

### Requirement: Toroidal grid initialization
The system SHALL create a rectangular toroidal grid using configurable width and height with defaults of 100 columns and 70 rows.

#### Scenario: Grid created with default dimensions
- **WHEN** the simulation initializes
- **THEN** the grid SHALL have 100 columns and 70 rows

#### Scenario: Grid created with custom dimensions
- **WHEN** a programmer changes the grid dimension constants in code
- **THEN** the system SHALL gracefully scale and center the world display without requiring UI changes

### Requirement: Random initial population
The system SHALL randomly populate the grid using configurable fish density (default 30%) and shark density (default 5%).

#### Scenario: Initial population densities
- **WHEN** the simulation initializes
- **THEN** approximately 30% of cells SHALL contain fish and 5% SHALL contain sharks

### Requirement: Chronon step execution
The system SHALL advance the simulation by one chronon where each surviving entity acts at most once in randomized order.

#### Scenario: Entities act in randomized order
- **WHEN** a chronon starts
- **THEN** the system SHALL collect current entity IDs, randomize their order, and allow each surviving entity to act at most once

#### Scenario: Newborn entities do not act until next chronon
- **IF** an entity was born during the current chronon
- **THEN** the system SHALL prevent that entity from acting until the next chronon

#### Scenario: Dead or eaten entities are skipped
- **IF** an entity dies or is eaten before its randomized turn
- **THEN** the system SHALL skip that entity when its turn is reached

### Requirement: Fish movement and breeding
The system SHALL implement fish movement to adjacent empty cells and breeding when breed timer reaches threshold.

#### Scenario: Fish moves to random empty adjacent cell
- **WHEN** a fish acts and at least one adjacent empty cell exists
- **THEN** the system SHALL move the fish to a randomly selected adjacent empty cell

#### Scenario: Fish breeds when ready and moves
- **IF** a fish is breeding-ready and successfully moves
- **THEN** the system SHALL leave a new fish in the old cell and reset the parent fish breed timer to 0

#### Scenario: Fish breed timer resets when ready but cannot move
- **IF** a fish is breeding-ready and cannot move
- **THEN** the system SHALL reset the fish breed timer to 0

#### Scenario: Fish breed timer ages when not ready and cannot move
- **IF** a fish is not breeding-ready and cannot move
- **THEN** the system SHALL continue aging the fish breed timer

### Requirement: Shark movement, eating, energy, and breeding
The system SHALL implement shark movement prioritizing fish, energy management, and breeding.

#### Scenario: Shark energy decremented at start of action
- **WHEN** a shark acts
- **THEN** the system SHALL decrement shark energy by sharkEnergyCostPerChronon before movement or eating

#### Scenario: Shark dies when energy reaches zero
- **IF** a shark energy value reaches 0 after the start-of-action decrement
- **THEN** the system SHALL remove the shark immediately without moving or eating

#### Scenario: Shark eats adjacent fish
- **IF** a shark has adjacent fish after surviving the energy decrement
- **THEN** the system SHALL move the shark to a randomly selected adjacent fish cell and remove the eaten fish

#### Scenario: Shark gains energy when eating
- **WHEN** a shark eats a fish
- **THEN** the system SHALL add sharkEnergyGain to the shark energy

#### Scenario: Shark moves to empty cell when no fish adjacent
- **IF** a shark has no adjacent fish and has at least one adjacent empty cell
- **THEN** the system SHALL move the shark to a randomly selected adjacent empty cell

#### Scenario: Shark breeds when ready and moves
- **IF** a shark is breeding-ready and successfully moves
- **THEN** the system SHALL leave a newborn shark in the old cell and reset the parent shark breed timer to 0

#### Scenario: Newborn shark initialized with initial energy
- **WHEN** a newborn shark is created
- **THEN** the system SHALL initialize the newborn shark energy to initialSharkEnergy

#### Scenario: Shark breed timer resets when ready but cannot move
- **IF** a shark is breeding-ready and cannot move
- **THEN** the system SHALL reset the shark breed timer to 0

#### Scenario: Shark breed timer ages when not ready and cannot move
- **IF** a shark is not breeding-ready and cannot move
- **THEN** the system SHALL continue aging the shark breed timer

### Requirement: Extinction detection and terminal status
The system SHALL detect extinction conditions and auto-pause with appropriate status.

#### Scenario: Sharks extinct while fish remain
- **IF** sharks reach zero while fish remain
- **THEN** the system SHALL display "Sharks extinct"

#### Scenario: Fish extinct while sharks remain
- **IF** fish reach zero while sharks remain
- **THEN** the system SHALL display "Fish extinct"

#### Scenario: Ecosystem collapsed
- **IF** fish and sharks both reach zero in the same chronon
- **THEN** the system SHALL display "Ecosystem collapsed"

#### Scenario: Running status when not terminal
- **WHILE** the simulation is not terminal and running
- **THEN** the system SHALL display "Running"

#### Scenario: Paused status when not terminal
- **WHILE** the simulation is not terminal and paused
- **THEN** the system SHALL display "Paused"

#### Scenario: Play disabled in terminal state
- **WHILE** the simulation is terminal
- **THEN** the system SHALL keep Play disabled and SHALL require Reset to start another run

### Requirement: Population history recording
The system SHALL record population history for a rolling window of 500 chronons.

#### Scenario: History recorded per chronon
- **WHEN** population history is recorded
- **THEN** the system SHALL store one sample per chronon for a rolling window of 500 chronons

### Requirement: Reset functionality
The system SHALL reset the simulation to a new random world.

#### Scenario: Reset creates new world
- **WHEN** Reset is activated
- **THEN** the system SHALL create a new random world, set chronon to 0, clear extinction status, clear population history, and resume running at the selected speed