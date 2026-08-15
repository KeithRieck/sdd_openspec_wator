# wator-entity-model Specification

## Purpose
TBD - created by archiving change wator-simulation. Update Purpose after archive.
## Requirements
### Requirement: Entity base class
The system SHALL provide an abstract Entity base class that encapsulates common entity state and behavior.

#### Scenario: Entity has unique ID
- **WHEN** an entity is created
- **THEN** the system SHALL assign it a unique numeric ID

#### Scenario: Entity has position
- **WHEN** an entity is created
- **THEN** the system SHALL store its x and y grid coordinates

#### Scenario: Entity has breed age
- **WHEN** an entity is created
- **THEN** the system SHALL initialize its breed age to 0

#### Scenario: Entity can increment breed age
- **WHEN** an entity's breed age is incremented
- **THEN** the system SHALL increase the breed age by 1

#### Scenario: Entity can reset breed age
- **WHEN** an entity's breed age is reset
- **THEN** the system SHALL set the breed age to 0

#### Scenario: Entity can check breeding readiness
- **WHEN** an entity's breed age is compared to a breed time threshold
- **THEN** the system SHALL return true if breed age >= breed time

#### Scenario: Entity can report its type
- **WHEN** getType() is called
- **THEN** the system SHALL return a string identifying the entity type

### Requirement: Fish class
The system SHALL provide a Fish class extending Entity that implements fish-specific behavior.

#### Scenario: Fish creation
- **WHEN** a Fish is created
- **THEN** the system SHALL initialize it with ID, position, and breed age 0

#### Scenario: Fish movement to empty cell
- **WHEN** a fish acts and adjacent empty cells exist
- **THEN** the system SHALL move the fish to a randomly selected adjacent empty cell

#### Scenario: Fish breeding when ready and moves
- **IF** a fish is breeding-ready and successfully moves
- **THEN** the system SHALL leave a new fish in the old cell and reset the parent fish breed timer to 0

#### Scenario: Fish breed timer resets when ready but cannot move
- **IF** a fish is breeding-ready and cannot move
- **THEN** the system SHALL reset the fish breed timer to 0

#### Scenario: Fish breed timer ages when not ready and cannot move
- **IF** a fish is not breeding-ready and cannot move
- **THEN** the system SHALL continue aging the fish breed timer

#### Scenario: Fish type identification
- **WHEN** getType() is called on a Fish
- **THEN** the system SHALL return "fish"

### Requirement: Shark class
The system SHALL provide a Shark class extending Entity that implements shark-specific behavior including energy management.

#### Scenario: Shark creation with initial energy
- **WHEN** a Shark is created
- **THEN** the system SHALL initialize it with ID, position, breed age 0, and the configured initial energy

#### Scenario: Shark energy decrement at start of action
- **WHEN** a shark acts
- **THEN** the system SHALL decrement shark energy by sharkEnergyCostPerChronon before movement or eating

#### Scenario: Shark death when energy reaches zero
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

#### Scenario: Shark breeding when ready and moves
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

#### Scenario: Shark type identification
- **WHEN** getType() is called on a Shark
- **THEN** the system SHALL return "shark"

#### Scenario: Shark energy query
- **WHEN** getEnergy() is called on a Shark
- **THEN** the system SHALL return the current energy value

#### Scenario: Shark death check
- **WHEN** isDead() is called on a Shark
- **THEN** the system SHALL return true if energy <= 0

