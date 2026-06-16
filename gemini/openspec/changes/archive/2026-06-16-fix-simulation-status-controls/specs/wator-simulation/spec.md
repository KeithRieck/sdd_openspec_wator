## MODIFIED Requirements

### Requirement: Statistics and Status Display
R1. The system SHALL display live counts of chronons, fish, sharks, and the authoritative `WatorSimulation.status` value on the screen.

#### Scenario: Stats updates on tick
- **WHEN** a chronon advances while the simulation is running
- **THEN** the on-screen statistics text displays the updated chronon, fish count, shark count, and `Running` status.

#### Scenario: Status updates on pause
- **WHEN** the user presses Pause during a non-terminal running simulation
- **THEN** `WatorSimulation.status` SHALL be `Paused` and the on-screen statistics text SHALL display `PAUSED` without waiting for another chronon.

#### Scenario: Status updates on resume
- **WHEN** the user presses Play during a non-terminal paused simulation
- **THEN** `WatorSimulation.status` SHALL be `Running` and the on-screen statistics text SHALL display `RUNNING`.

### Requirement: Native UI Control Panel
R2. The system SHALL provide Phaser-native buttons for Play/Pause, Step, Reset, and Speed selection (1x, 5x, 10x, 30x, 60x), and SHALL refresh affected button states immediately after Play/Pause or Step actions.

#### Scenario: Click Speed 30x
- **WHEN** the user clicks the 30x speed button
- **THEN** the simulation advances at 30 chronons per second.

#### Scenario: Pause refreshes visible state
- **WHEN** the user clicks Pause during a non-terminal running simulation
- **THEN** the Play/Pause button label SHALL change to `Play`, the Step button SHALL become enabled, and the statistics text SHALL display the paused status immediately.

#### Scenario: Step keeps non-terminal simulation paused
- **WHEN** the user clicks Step during a paused non-terminal simulation and the chronon does not reach a terminal state
- **THEN** the simulation SHALL advance exactly one chronon, `WatorSimulation.status` SHALL remain `Paused`, and the Step button SHALL remain enabled.

#### Scenario: Step refreshes terminal controls
- **WHEN** the user clicks Step during a paused simulation and that chronon reaches a terminal extinction or collapse state
- **THEN** the terminal status SHALL remain visible, the Play/Pause button SHALL be disabled, and the Step button SHALL be disabled immediately.
