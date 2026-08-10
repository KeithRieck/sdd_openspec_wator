# controls Specification

## Purpose
TBD - created by archiving change add-wator-phaser-app. Update Purpose after archive.
## Requirements
### Requirement: Auto-start at 10x
The system SHALL start directly in a running Wa-Tor simulation at 10x speed with no landing page or instruction screen when the app launches.

#### Scenario: Launch runs at 10x
- **WHEN** the app launches
- **THEN** the simulation SHALL be running at 10x with no intermediate screen

### Requirement: Speed controls
The system SHALL provide speed choices `1x`, `5x`, `10x`, `30x`, `60x` as buttons in one horizontal row, with default `10x`, and speed changes SHALL take effect during subsequent updates when running and SHALL not resume the simulation when paused.

#### Scenario: Speed row
- **WHEN** controls are displayed
- **THEN** buttons for `1x`, `5x`, `10x`, `30x`, `60x` SHALL appear in one row with `10x` initially selected

#### Scenario: Speed change while running
- **WHEN** the simulation is running and a new speed is selected
- **THEN** subsequent updates SHALL use the new chronons-per-second

#### Scenario: Speed change while paused stays paused
- **WHEN** the simulation is paused and a new speed is selected
- **THEN** the simulation SHALL remain paused and use the new speed on next resume or step

### Requirement: Action controls
The system SHALL show only Play/Pause, Step, and Reset with each action button on its own row.

#### Scenario: Action column
- **WHEN** controls are displayed
- **THEN** Play/Pause, Step, and Reset SHALL each be on their own row

### Requirement: Play/Pause and Step behavior
The system SHALL disable Step while running, allow Step to advance exactly one chronon while paused, and keep Play/Pause toggling correctly.

#### Scenario: Step disabled while running
- **WHEN** the simulation is running
- **THEN** Step SHALL be disabled

#### Scenario: Step advances one chronon while paused
- **WHEN** the simulation is paused and Step is activated
- **THEN** the system SHALL advance exactly one chronon and remain paused

### Requirement: Reset behavior
The system SHALL on Reset create a new random world, set chronon to 0, clear extinction status, clear population history, and resume running at the selected speed.

#### Scenario: Reset creates new run
- **WHEN** Reset is activated
- **THEN** the system SHALL generate a new random population, reset chronon to 0, clear history and terminal status, and resume at the selected speed

### Requirement: Chronon timing
The system SHALL on Phaser update frames advance the simulation according to the selected chronons-per-second speed as normally as the browser allows, with no special real-time preservation or catch-up compensation when the tab is hidden or throttled.

#### Scenario: Update advances by speed
- **WHEN** Phaser update frames occur
- **THEN** the system SHALL advance `speed` chronons per second via an accumulator, capping steps per frame to avoid spiral

#### Scenario: No catch-up when throttled
- **WHEN** the browser tab is hidden or throttled
- **THEN** the system SHALL not implement catch-up compensation

### Requirement: Terminal extinction handling
The system SHALL auto-pause when either fish or sharks become extinct, display `Sharks extinct` if sharks reach zero while fish remain, `Fish extinct` if fish reach zero while sharks remain, `Ecosystem collapsed` if both reach zero in the same chronon, and keep Play disabled while terminal, requiring Reset to start another run.

#### Scenario: Sharks extinct
- **WHEN** sharks reach zero while fish remain
- **THEN** the system SHALL auto-pause and display `Sharks extinct`

#### Scenario: Fish extinct
- **WHEN** fish reach zero while sharks remain
- **THEN** the system SHALL auto-pause and display `Fish extinct`

#### Scenario: Ecosystem collapsed
- **WHEN** fish and sharks both reach zero in the same chronon
- **THEN** the system SHALL auto-pause and display `Ecosystem collapsed`

#### Scenario: Play disabled when terminal
- **WHEN** the simulation is in a terminal state
- **THEN** Play SHALL remain disabled until Reset

### Requirement: Status text
The system SHALL display `Running` while not terminal and running, and `Paused` while not terminal and paused.

#### Scenario: Running status
- **WHEN** the simulation is not terminal and running
- **THEN** status SHALL be `Running`

#### Scenario: Paused status
- **WHEN** the simulation is not terminal and paused
- **THEN** status SHALL be `Paused`

