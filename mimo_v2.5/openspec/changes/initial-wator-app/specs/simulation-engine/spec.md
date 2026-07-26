## ADDED Requirements

### Requirement: Toroidal grid initialization
The simulation SHALL create a rectangular toroidal grid using code constants for width and height with defaults of 100 columns and 70 rows.

#### Scenario: Default grid dimensions
- **WHEN** the simulation initializes with default constants
- **THEN** the grid SHALL be 100 columns wide and 70 rows tall

#### Scenario: Toroidal wrapping
- **WHEN** an entity at the edge of the grid attempts to move past the boundary
- **THEN** the position SHALL wrap to the opposite edge (north of row 0 is row 69, east of column 99 is column 0, etc.)

### Requirement: Random initial population
The simulation SHALL randomly populate the grid using code constants for fish density and shark density.

#### Scenario: Default population densities
- **WHEN** the simulation initializes with default constants
- **THEN** approximately 30% of cells SHALL contain fish and approximately 5% of cells SHALL contain sharks

#### Scenario: No overlapping entities
- **WHEN** the grid is populated
- **THEN** each cell SHALL contain at most one entity (fish or shark)

### Requirement: Orthogonal neighbor movement
The simulation SHALL consider only orthogonal neighbors (north, east, south, west) for all movement decisions, with toroidal edge wrapping.

#### Scenario: Four orthogonal neighbors
- **WHEN** the system evaluates neighbors for a cell at position (x, y)
- **THEN** the system SHALL consider exactly four cells: (x, y-1), (x+1, y), (x, y+1), (x-1, y), with wrapping applied

### Requirement: Chronon entity ordering
When a chronon starts, the simulation SHALL collect current entity IDs, randomize their order, and allow each surviving entity to act at most once.

#### Scenario: Randomized turn order
- **WHEN** a chronon begins
- **THEN** the system SHALL collect all living entity IDs and shuffle them into a random order

#### Scenario: Each entity acts once per chronon
- **WHEN** the chronon processes entities
- **THEN** each living entity SHALL be given exactly one turn in the randomized order

### Requirement: Newborn entities skip first chronon
If an entity was born during the current chronon, the simulation SHALL prevent that entity from acting until the next chronon.

#### Scenario: Newborn fish does not act
- **WHEN** a fish is spawned during chronon N
- **THEN** that fish SHALL NOT act during chronon N, and SHALL first be eligible to act during chronon N+1

#### Scenario: Newborn shark does not act
- **WHEN** a shark is spawned during chronon N
- **THEN** that shark SHALL NOT act during chronon N, and SHALL first be eligible to act during chronon N+1

### Requirement: Dead entities are skipped
If an entity dies or is eaten before its randomized turn, the simulation SHALL skip that entity when its turn is reached.

#### Scenario: Entity killed earlier in chronon
- **WHEN** an entity has been removed from the grid before its turn in the current chronon
- **THEN** the system SHALL skip that entity without error

### Requirement: Fish movement
When a fish acts and at least one adjacent empty cell exists, the simulation SHALL move the fish to a randomly selected adjacent empty cell.

#### Scenario: Fish moves to empty cell
- **WHEN** a fish has one or more empty orthogonal neighbors
- **THEN** the fish SHALL move to a randomly selected empty neighbor

#### Scenario: Fish with no empty neighbors
- **WHEN** a fish has no empty orthogonal neighbors
- **THEN** the fish SHALL remain in its current cell

### Requirement: Fish breeding
If a fish is breeding-ready and successfully moves, the simulation SHALL leave a new fish in the old cell and reset the parent fish breed timer to 0.

#### Scenario: Fish breeds on move
- **WHEN** a fish with breedAge >= fishBreedTime moves to an empty cell
- **THEN** a new fish SHALL be spawned at the fish's original position and the parent's breedAge SHALL be reset to 0

#### Scenario: Breeding-ready fish cannot move
- **WHEN** a fish with breedAge >= fishBreedTime has no empty neighbors
- **THEN** the fish's breedAge SHALL be reset to 0 but no new fish SHALL be spawned

#### Scenario: Non-breeding fish cannot move
- **WHEN** a fish with breedAge < fishBreedTime has no empty neighbors
- **THEN** the fish's breedAge SHALL continue to increment

### Requirement: Shark energy decrement
When a shark acts, the simulation SHALL decrement shark energy by sharkEnergyCostPerChronon before movement or eating.

#### Scenario: Energy decremented first
- **WHEN** a shark begins its turn
- **THEN** the shark's energy SHALL be decremented by sharkEnergyCostPerChronon before any other action

### Requirement: Shark starvation death
If a shark energy value reaches 0 after the start-of-action decrement, the simulation SHALL remove the shark immediately without moving or eating.

#### Scenario: Shark dies at zero energy
- **WHEN** a shark's energy reaches 0 after the start-of-turn decrement
- **THEN** the shark SHALL be removed from the grid and SHALL NOT move or eat

### Requirement: Shark hunting
If a shark has adjacent fish after surviving the energy decrement, the simulation SHALL move the shark to a randomly selected adjacent fish cell and remove the eaten fish.

#### Scenario: Shark eats adjacent fish
- **WHEN** a shark has one or more adjacent fish after the energy decrement
- **THEN** the shark SHALL move to a randomly selected adjacent fish cell and the fish SHALL be removed from the grid

#### Scenario: Shark gains energy from eating
- **WHEN** a shark eats a fish
- **THEN** the shark's energy SHALL be increased by sharkEnergyGain

### Requirement: Shark movement without prey
If a shark has no adjacent fish and has at least one adjacent empty cell, the simulation SHALL move the shark to a randomly selected adjacent empty cell.

#### Scenario: Shark moves to empty cell when no fish nearby
- **WHEN** a shark has no adjacent fish but has one or more empty neighbors
- **THEN** the shark SHALL move to a randomly selected empty neighbor

### Requirement: Shark breeding
If a shark is breeding-ready and successfully moves, the simulation SHALL leave a newborn shark in the old cell and reset the parent shark breed timer to 0.

#### Scenario: Shark breeds on move
- **WHEN** a shark with breedAge >= sharkBreedTime moves (to empty cell or fish cell)
- **THEN** a new shark SHALL be spawned at the shark's original position with energy equal to initialSharkEnergy, and the parent's breedAge SHALL be reset to 0

#### Scenario: Newborn shark initial energy
- **WHEN** a newborn shark is created
- **THEN** the newborn shark's energy SHALL be initialized to initialSharkEnergy

#### Scenario: Breeding-ready shark cannot move
- **WHEN** a shark with breedAge >= sharkBreedTime has no valid neighbors
- **THEN** the shark's breedAge SHALL be reset to 0 but no new shark SHALL be spawned

#### Scenario: Non-breeding shark cannot move
- **WHEN** a shark with breedAge < sharkBreedTime has no valid neighbors
- **THEN** the shark's breedAge SHALL continue to increment

### Requirement: Grid data model
The simulation SHALL use a flat grid array plus entity records containing ID, type, position, breed age, and shark energy when applicable.

#### Scenario: Entity record structure
- **WHEN** an entity exists on the grid
- **THEN** the entity record SHALL contain at minimum: unique ID, type (fish or shark), x position, y position, breedAge, and (for sharks) energy

### Requirement: Entity class hierarchy
The simulation SHALL use an object-oriented class hierarchy with a base Entity class and Fish and Shark subclasses, where each subclass implements polymorphic behavior via an `act(grid)` method.

#### Scenario: Fish extends Entity
- **WHEN** the simulation is implemented
- **THEN** Fish SHALL be a class that extends Entity and overrides act(grid) with fish-specific movement and breeding logic

#### Scenario: Shark extends Entity
- **WHEN** the simulation is implemented
- **THEN** Shark SHALL be a class that extends Entity and overrides act(grid) with shark-specific hunting, movement, energy, and breeding logic

### Requirement: Framework-independent simulation
The simulation engine SHALL keep all Wa-Tor rules independent from Phaser APIs and Phaser scene objects.

#### Scenario: No Phaser imports in simulation
- **WHEN** simulation source files are examined
- **THEN** no simulation source file SHALL import or reference any Phaser module, class, or type

### Requirement: Easy-to-change constants
The simulation SHALL make grid dimensions, densities, breed times, shark energy values, colors, and speed options easy for programmers to change via code constants.

#### Scenario: Constants in config module
- **WHEN** a programmer wants to change simulation parameters
- **THEN** all tunable constants SHALL be available in a single config module
