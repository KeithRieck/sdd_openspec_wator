## Purpose

Defines the Wa-Tor world itself: how the toroidal grid is constructed, how cells are addressed across wrapped edges, how the world is seeded with fish and sharks, and how the flat grid array and the entity objects are kept consistent.

## ADDED Requirements

### Requirement: 1 Rectangular toroidal grid

The system SHALL construct a rectangular grid of cells whose dimensions come from code constants, defaulting to `100` columns and `70` rows, and SHALL treat the grid as a torus so that edges wrap in all four directions.

#### Scenario: 1.1 Default grid is constructed on initialization

- **WHEN** the simulation initializes
- **THEN** the system creates a grid of `100` columns by `70` rows using code constants

#### Scenario: 1.2 Neighbors wrap toroidally

- **WHEN** a cell on an edge of the grid is queried for its north, east, south, or west neighbor
- **THEN** the system returns the cell on the opposite edge of the same row or column

#### Scenario: 1.3 Only orthogonal neighbors are considered

- **WHEN** the system evaluates movement from a cell
- **THEN** it considers only the four orthogonal neighbors north, east, south, and west, and does not consider diagonal neighbors

#### Scenario: 1.4 Changed dimensions scale without UI changes

- **WHEN** a programmer changes the grid width or height constants in code
- **THEN** the system scales and centers the rendered world to fit without requiring any change to the UI code

### Requirement: 2 Randomized initial population

The system SHALL seed the grid randomly on initialization using code constants for fish density and shark density, defaulting to `30%` fish and `5%` sharks, and SHALL draw every random choice from the single random-number generator.

#### Scenario: 2.1 Fish and sharks are seeded at configured densities

- **WHEN** the simulation initializes a new world
- **THEN** the system populates the grid randomly using the `30%` fish density and `5%` shark density constants

#### Scenario: 2.2 Each cell holds at most one entity

- **WHEN** the world has been seeded
- **THEN** no cell contains more than one entity

#### Scenario: 2.3 Seeding uses the single random-number generator

- **WHEN** the system makes any random choice while seeding the world
- **THEN** it draws that choice from the single random-number generator rather than calling `Math.random()` directly

### Requirement: 3 Flat grid array with consistent entity objects

The system SHALL store simulation state as a flat grid array with one slot per cell, containing the occupying entity's ID or an `empty` marker, together with entity objects that are instances of classes extending a common `Entity` base class. Each entity SHALL carry an ID, a position, and a breed age, and a shark entity SHALL additionally carry energy. The system SHALL keep the grid array and the entity objects consistent, so the entity ID stored in a cell matches the entity occupying that cell.

#### Scenario: 3.1 Entity position is a flat grid index

- **WHEN** an entity moves to a new cell
- **THEN** the system records the new position as the flat grid array index of that cell

#### Scenario: 3.2 Grid and entity objects stay consistent after a move

- **WHEN** an entity moves from one cell to another
- **THEN** the destination slot holds that entity's ID, the origin slot holds the `empty` marker, and the entity's stored position equals the destination index

#### Scenario: 3.3 Grid and entity objects stay consistent after a death

- **WHEN** an entity is removed from the world
- **THEN** the slot it occupied holds the `empty` marker and the entity is no longer part of the simulation

#### Scenario: 3.4 Entity identity is stable and never reused

- **WHEN** an entity is created
- **THEN** the system assigns it an ID that has not been used before and SHALL NOT reuse that ID for any later entity

### Requirement: 4 Object-oriented entity model

The system SHALL define an `Entity` base class and SHALL define `Fish` and `Shark` as classes that extend it. The `Entity` base class SHALL expose the shared behavior of entities, including position, breed age, and breeding readiness. Each entity class SHALL decide its own action during a chronon.

#### Scenario: 4.1 Fish and shark are distinct entity types

- **WHEN** the simulation is running
- **THEN** every fish is an instance of the fish class and every shark is an instance of the shark class, and both are instances of the common entity base class

#### Scenario: 4.2 Breeding readiness is shared behavior

- **WHEN** an entity's breed age reaches the breed time configured for its type
- **THEN** the entity is considered breeding-ready

#### Scenario: 4.3 Only sharks track energy

- **WHEN** a fish is created
- **THEN** the fish does not carry a shark energy value
