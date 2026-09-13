## Purpose

Defines how population counts are sampled over time for the history chart and how the simulation detects and reports terminal extinction outcomes.

## ADDED Requirements

### Requirement: 1 Population sampling

The system SHALL record one population sample per chronon, containing the fish and shark counts, and SHALL retain a rolling window of the most recent `500` samples.

#### Scenario: 1.1 One sample is recorded per chronon

- **WHEN** a chronon completes
- **THEN** the system records one sample holding the current fish count and shark count

#### Scenario: 1.2 Sample numbering follows the chronon count

- **WHEN** a sample is recorded
- **THEN** the sample corresponds to the chronon number it was taken at

#### Scenario: 1.3 History is capped at the rolling window

- **WHEN** more than `500` samples have been recorded
- **THEN** the system retains only the most recent `500` samples and discards older ones

#### Scenario: 1.4 History clears on reset

- **WHEN** the simulation is reset
- **THEN** the system clears all recorded population history

### Requirement: 2 Extinction detection

The system SHALL detect when fish or sharks reach zero and SHALL auto-pause the simulation with a terminal status message describing the outcome.

#### Scenario: 2.1 Shark extinction

- **WHEN** sharks reach zero while fish remain
- **THEN** the system auto-pauses the simulation and displays the status `Sharks extinct`

#### Scenario: 2.2 Fish extinction

- **WHEN** fish reach zero while sharks remain
- **THEN** the system auto-pauses the simulation and displays the status `Fish extinct`

#### Scenario: 2.3 Simultaneous extinction

- **WHEN** fish and sharks both reach zero in the same chronon
- **THEN** the system auto-pauses the simulation and displays the status `Ecosystem collapsed`

#### Scenario: 2.4 A terminal status is not overwritten by run states

- **WHEN** the simulation has reached a terminal outcome
- **THEN** the system displays the terminal status rather than `Running` or `Paused`

#### Scenario: 2.5 Reset clears the terminal outcome

- **WHEN** the simulation is reset
- **THEN** the system clears the extinction status and the simulation is no longer terminal
