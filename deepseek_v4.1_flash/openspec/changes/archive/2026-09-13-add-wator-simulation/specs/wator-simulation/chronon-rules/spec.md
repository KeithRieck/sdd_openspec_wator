## Purpose

Defines how a single chronon is executed and what each creature does during its turn: the randomized act-at-most-once order, fish movement and reproduction, and shark energy, starvation, predation, and reproduction.

## ADDED Requirements

### Requirement: 1 Chronon execution order

The system SHALL advance time in discrete chronons. When a chronon starts, the system SHALL collect the current entity IDs, randomize their order, and allow each surviving entity to act at most once.

#### Scenario: 1.1 Each entity acts at most once per chronon

- **WHEN** a chronon executes
- **THEN** each entity that existed at the start of the chronon acts no more than once

#### Scenario: 1.2 Turn order is randomized each chronon

- **WHEN** a chronon starts
- **THEN** the system randomizes the order in which the collected entity IDs act, drawing the randomization from the single random-number generator

#### Scenario: 1.3 An entity born during the chronon does not act until the next chronon

- **WHEN** an entity is born during the current chronon
- **THEN** the system prevents that entity from acting until a later chronon

#### Scenario: 1.4 An entity that dies or is eaten before its turn is skipped

- **WHEN** an entity dies or is eaten before its randomized turn arrives in the current chronon
- **THEN** the system skips that entity when its turn is reached

#### Scenario: 1.5 Breed age advances once per elapsed chronon

- **WHEN** an entity survives a chronon
- **THEN** the system advances that entity's breed age by one chronon

### Requirement: 2 Fish movement and reproduction

The system SHALL move each fish to a randomly selected adjacent empty cell when at least one adjacent empty cell exists, and SHALL reproduce when the fish is breeding-ready and successfully moves.

#### Scenario: 2.1 Fish moves to a random adjacent empty cell

- **WHEN** a fish acts and at least one adjacent empty cell exists
- **THEN** the system moves the fish to a randomly selected adjacent empty cell, drawing the selection from the single random-number generator

#### Scenario: 2.2 Fish does not move when no empty cell is adjacent

- **WHEN** a fish acts and every adjacent cell is occupied
- **THEN** the fish does not move

#### Scenario: 2.3 Breeding-ready fish leaves a new fish behind after moving

- **WHEN** a fish is breeding-ready and successfully moves
- **THEN** the system leaves a new fish in the cell the parent vacated and resets the parent fish breed timer to `0`

#### Scenario: 2.4 Breeding-ready fish that cannot move resets its breed timer

- **WHEN** a fish is breeding-ready and cannot move
- **THEN** the system resets the fish breed timer to `0`

#### Scenario: 2.5 Fish that is not breeding-ready and cannot move keeps aging

- **WHEN** a fish is not breeding-ready and cannot move
- **THEN** the system leaves the fish breed timer aging rather than resetting it

#### Scenario: 2.6 A newborn fish does not act in the chronon it is born

- **WHEN** a fish is born during a chronon
- **THEN** the newborn fish does not act until a later chronon

### Requirement: 3 Shark energy and starvation

The system SHALL decrement each shark's energy by the configured energy cost at the start of that shark's action, and SHALL remove the shark immediately when its energy reaches `0` at that point. A newborn shark SHALL start with the configured initial energy.

#### Scenario: 3.1 Energy is decremented before movement or eating

- **WHEN** a shark acts
- **THEN** the system decrements the shark's energy by `sharkEnergyCostPerChronon` before the shark moves or eats

#### Scenario: 3.2 A shark reaching zero energy dies without acting

- **WHEN** a shark's energy reaches `0` after the start-of-action decrement
- **THEN** the system removes the shark immediately, without the shark moving or eating

#### Scenario: 3.3 Newborn sharks start with the initial energy

- **WHEN** a newborn shark is created
- **THEN** the system initializes the newborn shark's energy to `initialSharkEnergy`

### Requirement: 4 Shark predation and movement

The system SHALL give each acting shark priority to eat an adjacent fish, and SHALL otherwise move the shark to a randomly selected adjacent empty cell.

#### Scenario: 4.1 Shark eats an adjacent fish when one exists

- **WHEN** a shark acts, has survived the energy decrement, and has at least one adjacent fish
- **THEN** the system moves the shark to a randomly selected adjacent fish cell and removes the eaten fish

#### Scenario: 4.2 Eating restores energy

- **WHEN** a shark eats a fish
- **THEN** the system adds `sharkEnergyGain` to the shark's energy

#### Scenario: 4.3 Shark moves to an adjacent empty cell when no fish is adjacent

- **WHEN** a shark acts, no adjacent cell holds a fish, and at least one adjacent empty cell exists
- **THEN** the system moves the shark to a randomly selected adjacent empty cell

#### Scenario: 4.4 Shark does not move when no valid destination exists

- **WHEN** a shark acts and no adjacent cell is either an empty cell or a fish cell
- **THEN** the shark does not move

### Requirement: 5 Shark reproduction

The system SHALL reproduce a shark when the shark is breeding-ready and successfully moves, where moving onto a cell occupied by a fish counts as a successful move.

#### Scenario: 5.1 Breeding-ready shark leaves a newborn after moving

- **WHEN** a shark is breeding-ready and successfully moves
- **THEN** the system leaves a newborn shark in the cell the parent vacated and resets the parent shark breed timer to `0`

#### Scenario: 5.2 Eating counts as a successful move for reproduction

- **WHEN** a breeding-ready shark eats a fish
- **THEN** the system leaves a newborn shark in the cell the parent vacated and resets the parent shark breed timer to `0`

#### Scenario: 5.3 Breeding-ready shark that cannot move resets its breed timer

- **WHEN** a shark is breeding-ready and cannot move
- **THEN** the system resets the shark breed timer to `0`

#### Scenario: 5.4 Shark that is not breeding-ready and cannot move keeps aging

- **WHEN** a shark is not breeding-ready and cannot move
- **THEN** the system leaves the shark breed timer aging rather than resetting it

#### Scenario: 5.5 A newborn shark does not act in the chronon it is born

- **WHEN** a shark is born during a chronon
- **THEN** the newborn shark does not act until a later chronon
