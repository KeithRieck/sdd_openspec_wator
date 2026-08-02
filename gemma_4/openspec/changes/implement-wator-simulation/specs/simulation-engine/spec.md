## ADDED Requirements

### Requirement: Toroidal Grid Management
The simulation SHALL maintain a rectangular grid that wraps around edges (toroidal).

#### Scenario: Wrapping North
- **WHEN** an entity at $(x, 0)$ moves North
- **THEN** it SHALL land at $(x, height-1)$

#### Scenario: Wrapping East
- **WHEN** an entity at $(width-1, y)$ moves East
- **THEN** it SHALL land at $(0, y)$

### Requirement: Randomized Action Order
The simulation SHALL ensure that entities act in a random order each chronon to prevent directional bias.

#### Scenario: Chronon Start
- **WHEN** a new chronon begins
- **THEN** the system SHALL shuffle the list of all active entity IDs before processing their turns.

### Requirement: Entity Lifecycle Management
The simulation SHALL manage the creation and removal of entities.

#### Scenario: Entity Death
- **WHEN** a shark's energy reaches 0
- **THEN** the system SHALL remove the shark from the grid and the entity registry.

### Requirement: Fish Movement and Breeding
Fish SHALL move to random empty adjacent cells and breed if ready.

#### Scenario: Successful Fish Move
- **WHEN** a fish acts and at least one adjacent cell is empty
- **THEN** it SHALL move to a randomly selected empty cell.

#### Scenario: Fish Breeding
- **WHEN** a breeding-ready fish successfully moves
- **THEN** it SHALL spawn a new fish at its previous position and reset its breed timer to 0.

#### Scenario: Stuck Fish Breeding Reset
- **WHEN** a breeding-ready fish cannot move
- **THEN** it SHALL reset its breed timer to 0.

### Requirement: Shark Movement, Hunting, and Breeding
Sharks SHALL prioritize eating fish, then moving to empty cells, and breed if ready.

#### Scenario: Shark Energy Loss
- **WHEN** a shark begins its turn
- **THEN** it SHALL decrement its energy by the configured cost per chronon.

#### Scenario: Shark Starvation
- **WHEN** a shark's energy reaches 0 after decrement
- **THEN** it SHALL be removed immediately without moving or eating.

#### Scenario: Shark Hunting
- **WHEN** a shark survives energy loss and has adjacent fish
- **THEN** it SHALL move to a randomly selected fish cell, remove the fish, and gain energy.

#### Scenario: Shark Empty Move
- **WHEN** a shark survives energy loss, has no adjacent fish, but has adjacent empty cells
- **THEN** it SHALL move to a randomly selected empty cell.

#### Scenario: Shark Breeding
- **WHEN** a breeding-ready shark successfully moves (either by eating or moving to empty)
- **THEN** it SHALL spawn a new shark at its previous position and reset its breed timer to 0.

#### Scenario: Stuck Shark Breeding Reset
- **WHEN** a breeding-ready shark cannot move
- **THEN** it SHALL reset its breed timer to 0.
