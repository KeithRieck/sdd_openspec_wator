# Wa-Tor Simulation

## Purpose
TBD

## Requirements

### Requirement: Simulation initialization
The system SHALL create a rectangular toroidal grid with width 100 and height 70 and randomly populate it with 30% fish density and 5% shark density.

#### Scenario: Initial population
- **WHEN** simulation initializes
- **THEN** grid contains approximately 30% fish and 5% sharks with no overlap

### Requirement: Chronon stepping
The system SHALL advance simulation by one chronon per step with entity actions randomized and each entity acting at most once.

#### Scenario: Randomized order
- **WHEN** step starts
- **THEN** entity IDs are shuffled and each surviving entity acts once

### Requirement: Fish movement
The system SHALL move fish to random adjacent empty orthogonal cell on torus.

#### Scenario: Fish moves to empty
- **WHEN** fish has adjacent empty cell
- **THEN** fish moves to randomly selected empty cell

### Requirement: Fish breeding
The system SHALL leave newborn fish in old cell when breeding-ready fish moves successfully.

#### Scenario: Fish breeds on move
- **WHEN** breeding-ready fish moves
- **THEN** new fish created in old cell with breed age reset

### Requirement: Shark energy
The system SHALL decrement shark energy by 1 each chronon before movement and remove shark at zero energy.

#### Scenario: Shark starves
- **WHEN** shark energy reaches zero after decrement
- **THEN** shark is removed without moving

### Requirement: Shark hunting
The system SHALL move shark to adjacent fish if present, eat fish, and gain energy.

#### Scenario: Shark eats fish
- **WHEN** shark has adjacent fish
- **THEN** shark moves to fish cell, fish removed, shark energy increased
