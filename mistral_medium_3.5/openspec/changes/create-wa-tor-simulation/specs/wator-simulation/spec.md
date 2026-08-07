## ADDED Requirements

### Requirement: Entity Class Structure
The system SHALL implement Entity, Fish, and Shark as separate classes where Fish and Shark extend Entity. Entity SHALL contain common properties: id, x, y, breedAge, and type. Fish SHALL not have additional properties beyond Entity. Shark SHALL extend Entity and add an energy property.

#### Scenario: Entity base class exists
- **WHEN** the application loads
- **THEN** the system SHALL define an Entity class with id, x, y, breedAge, and type properties

#### Scenario: Fish extends Entity
- **WHEN** the application loads
- **THEN** the system SHALL define a Fish class that extends Entity

#### Scenario: Shark extends Entity with energy
- **WHEN** the application loads
- **THEN** the system SHALL define a Shark class that extends Entity
- **AND** Shark SHALL have an energy property

### Requirement: Toroidal Grid Creation
The system SHALL create a rectangular toroidal grid using code constants for width and height with defaults of 100 columns and 70 rows.

#### Scenario: Grid initialized with default dimensions
- **WHEN** the simulation initializes
- **THEN** the system SHALL create a grid with 100 columns and 70 rows

#### Scenario: Grid initialized with custom dimensions
- **WHEN** a programmer changes the width and height constants in code
- **THEN** the system SHALL create a grid with the specified dimensions

### Requirement: Random Population
The system SHALL randomly populate the grid using code constants for 30% fish density and 5% shark density.

#### Scenario: Grid populated with default densities
- **WHEN** the simulation initializes
- **THEN** the system SHALL populate approximately 30% of cells with fish
- **AND** the system SHALL populate approximately 5% of cells with sharks
- **AND** the system SHALL ensure no cell contains both a fish and a shark

#### Scenario: Grid populated with custom densities
- **WHEN** a programmer changes the fish and shark density constants in code
- **THEN** the system SHALL populate the grid with the specified densities

### Requirement: Fish Movement
The system SHALL move fish according to Wa-Tor rules. At each chronon, a fish SHALL move randomly to one of the adjacent unoccupied squares. If there are no free squares, no movement SHALL take place.

#### Scenario: Fish moves to empty adjacent cell
- **WHEN** a fish has at least one adjacent empty cell during its turn
- **THEN** the system SHALL move the fish to a randomly selected adjacent empty cell

#### Scenario: Fish cannot move when surrounded
- **WHEN** a fish has no adjacent empty cells during its turn
- **THEN** the system SHALL not move the fish

### Requirement: Fish Breeding
The system SHALL handle fish reproduction according to Wa-Tor rules. Once a fish has survived fishBreedTime chronons, it may reproduce as it moves to a neighboring square, leaving behind a new fish in its old position. Its reproduction time SHALL also reset to zero.

#### Scenario: Fish breeds when moving
- **WHEN** a fish with breedAge >= fishBreedTime successfully moves to a new cell
- **THEN** the system SHALL create a new fish in the old cell
- **AND** the system SHALL reset the parent fish breedAge to 0

#### Scenario: Fish breed timer resets when cannot move
- **WHEN** a fish with breedAge >= fishBreedTime cannot move
- **THEN** the system SHALL reset the fish breedAge to 0

#### Scenario: Fish breed timer continues when not breeding-ready
- **WHEN** a fish with breedAge < fishBreedTime cannot move
- **THEN** the system SHALL increment the fish breedAge by 1

### Requirement: Shark Energy Management
The system SHALL manage shark energy according to Wa-Tor rules. At each chronon, each shark SHALL be deprived of a unit of energy (sharkEnergyCostPerChronon). Upon reaching zero energy, a shark SHALL die.

#### Scenario: Shark energy decrements each chronon
- **WHEN** a shark begins its turn
- **THEN** the system SHALL decrement shark energy by sharkEnergyCostPerChronon

#### Scenario: Shark dies when energy reaches zero
- **WHEN** a shark energy value reaches 0 after the start-of-action decrement
- **THEN** the system SHALL remove the shark immediately without moving or eating

### Requirement: Shark Eating
The system SHALL handle shark feeding according to Wa-Tor rules. If a shark has adjacent fish after surviving the energy decrement, the shark SHALL move to a randomly selected adjacent fish cell and remove the eaten fish. When a shark eats a fish, it SHALL earn sharkEnergyGain energy.

#### Scenario: Shark eats adjacent fish
- **WHEN** a shark has adjacent fish after surviving the energy decrement
- **THEN** the system SHALL move the shark to a randomly selected adjacent fish cell
- **AND** the system SHALL remove the eaten fish immediately
- **AND** the system SHALL add sharkEnergyGain to the shark energy

#### Scenario: Shark moves to empty cell when no fish adjacent
- **WHEN** a shark has no adjacent fish and has at least one adjacent empty cell
- **THEN** the system SHALL move the shark to a randomly selected adjacent empty cell

### Requirement: Shark Breeding
The system SHALL handle shark reproduction according to Wa-Tor rules. Once a shark has survived sharkBreedTime chronons, it may reproduce in exactly the same way as the fish. Newborn sharks SHALL initialize with initialSharkEnergy.

#### Scenario: Shark breeds when moving
- **WHEN** a shark with breedAge >= sharkBreedTime successfully moves to a new cell
- **THEN** the system SHALL create a newborn shark in the old cell
- **AND** the system SHALL reset the parent shark breedAge to 0
- **AND** the system SHALL initialize the newborn shark energy to initialSharkEnergy

#### Scenario: Shark breed timer resets when cannot move
- **WHEN** a shark with breedAge >= sharkBreedTime cannot move
- **THEN** the system SHALL reset the shark breedAge to 0

#### Scenario: Shark breed timer continues when not breeding-ready
- **WHEN** a shark with breedAge < sharkBreedTime cannot move
- **THEN** the system SHALL increment the shark breedAge by 1

### Requirement: Chronon Processing Order
The system SHALL process entities in a random order each chronon, ensuring each surviving entity acts at most once. Newborn entities SHALL not act until the next chronon. Dead entities SHALL be skipped when their turn is reached.

#### Scenario: Entities processed in random order
- **WHEN** a chronon starts
- **THEN** the system SHALL collect current entity IDs
- **AND** the system SHALL randomize their order
- **AND** the system SHALL allow each surviving entity to act at most once

#### Scenario: Newborns skip their turn
- **WHEN** an entity is born during the current chronon
- **THEN** the system SHALL prevent that entity from acting until the next chronon

#### Scenario: Dead entities skip their turn
- **WHEN** an entity dies or is eaten before its randomized turn
- **THEN** the system SHALL skip that entity when its turn is reached

### Requirement: Toroidal Edge Wrapping
The system SHALL consider only orthogonal neighbors north, east, south, and west with toroidal edge wrapping.

#### Scenario: North neighbor wraps to bottom
- **WHEN** checking the north neighbor of a cell at (x, 0)
- **THEN** the system SHALL return the cell at (x, height - 1)

#### Scenario: East neighbor wraps to left
- **WHEN** checking the east neighbor of a cell at (width - 1, y)
- **THEN** the system SHALL return the cell at (0, y)

#### Scenario: South neighbor wraps to top
- **WHEN** checking the south neighbor of a cell at (x, height - 1)
- **THEN** the system SHALL return the cell at (x, 0)

#### Scenario: West neighbor wraps to right
- **WHEN** checking the west neighbor of a cell at (0, y)
- **THEN** the system SHALL return the cell at (width - 1, y)

### Requirement: Simulation State Storage
The system SHALL use a flat grid array plus entity records containing ID, type, position, breed age, and shark energy when applicable.

#### Scenario: Grid uses flat array
- **WHEN** the simulation initializes
- **THEN** the system SHALL use a flat array for the grid where index = y * width + x

#### Scenario: Entity records contain required properties
- **WHEN** an entity is created
- **THEN** the system SHALL store entity records containing id, type, x, y, and breedAge
- **AND** for sharks, the system SHALL also store energy

### Requirement: Extinction Detection
The system SHALL detect when fish or sharks become extinct and report the appropriate status.

#### Scenario: Sharks extinct
- **WHEN** sharks reach zero while fish remain
- **THEN** the system SHALL report "Sharks extinct" status

#### Scenario: Fish extinct
- **WHEN** fish reach zero while sharks remain
- **THEN** the system SHALL report "Fish extinct" status

#### Scenario: Ecosystem collapsed
- **WHEN** fish and sharks both reach zero in the same chronon
- **THEN** the system SHALL report "Ecosystem collapsed" status
