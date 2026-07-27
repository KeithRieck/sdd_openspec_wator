## ADDED Requirements

### Requirement: Simulation starts running on launch
When the app launches, the system SHALL start directly in a running Wa-Tor simulation at the default speed with no landing page or instruction screen.

#### Scenario: App launches into simulation
- **WHEN** the app is loaded in a browser
- **THEN** the simulation SHALL immediately begin running at the default speed (10x) with no landing page, splash screen, or instruction overlay

### Requirement: Play/Pause control
The system SHALL provide a Play/Pause toggle control that starts and stops the simulation.

#### Scenario: Pause the simulation
- **WHEN** the user activates the Pause button while the simulation is running
- **THEN** the simulation SHALL stop advancing chronons

#### Scenario: Resume the simulation
- **WHEN** the user activates the Play button while the simulation is paused
- **THEN** the simulation SHALL resume advancing chronons at the selected speed

### Requirement: Step control
The system SHALL provide a Step control that advances exactly one chronon when the simulation is paused.

#### Scenario: Step advances one chronon
- **WHEN** the user activates the Step button while the simulation is paused
- **THEN** the simulation SHALL advance exactly one chronon and remain paused

#### Scenario: Step disabled while running
- **WHEN** the simulation is running
- **THEN** the Step button SHALL be disabled

### Requirement: Reset control
The system SHALL provide a Reset control that creates a new random world and resumes the simulation.

#### Scenario: Reset creates new world
- **WHEN** the user activates the Reset button
- **THEN** the system SHALL create a new random world, set chronon to 0, clear extinction status, clear population history, and resume running at the selected speed

### Requirement: Speed control
The system SHALL provide speed buttons for 1x, 5x, 10x, 30x, and 60x speeds in one horizontal row.

#### Scenario: Speed change while running
- **WHEN** the user selects a different speed while the simulation is running
- **THEN** the new speed SHALL take effect on subsequent chronon updates

#### Scenario: Speed change while paused
- **WHEN** the user selects a different speed while the simulation is paused
- **THEN** the selected speed SHALL be recorded but the simulation SHALL remain paused

### Requirement: Controls placement
The system SHALL place controls on the right side of the main world display.

#### Scenario: Right-side controls panel
- **WHEN** the app is displayed on a wide screen
- **THEN** the controls (Play/Pause, Step, Reset, and speed buttons) SHALL appear on the right side of the world display

### Requirement: Stats display placement
The system SHALL place Chronon, Fish count, Sharks count, and Status on the left side of the main world display.

#### Scenario: Left-side stats panel
- **WHEN** the app is displayed
- **THEN** Chronon count, Fish count, Sharks count, and Status SHALL appear on the left side of the world display

### Requirement: Extinction detection and auto-pause
If either fish or sharks become extinct, the system SHALL auto-pause the simulation and display a terminal status.

#### Scenario: Sharks extinct
- **WHEN** the shark population reaches zero while fish remain
- **THEN** the system SHALL auto-pause and display "Sharks extinct"

#### Scenario: Fish extinct
- **WHEN** the fish population reaches zero while sharks remain
- **THEN** the system SHALL auto-pause and display "Fish extinct"

#### Scenario: Ecosystem collapsed
- **WHEN** both fish and sharks reach zero in the same chronon
- **THEN** the system SHALL auto-pause and display "Ecosystem collapsed"

### Requirement: Running status display
While the simulation is not terminal and running, the system SHALL display "Running".

#### Scenario: Running status shown
- **WHEN** the simulation is active and not in an extinction state
- **THEN** the status display SHALL show "Running"

### Requirement: Paused status display
While the simulation is not terminal and paused, the system SHALL display "Paused".

#### Scenario: Paused status shown
- **WHEN** the simulation is paused by the user and not in an extinction state
- **THEN** the status display SHALL show "Paused"

### Requirement: Terminal state disables Play
While the simulation is terminal, the system SHALL keep Play disabled and require Reset to start another run.

#### Scenario: Play disabled after extinction
- **WHEN** the simulation enters a terminal state (extinction)
- **THEN** the Play button SHALL remain disabled and only the Reset button SHALL be available to start a new run

### Requirement: Default speed
The default simulation speed SHALL be 10x.

#### Scenario: Default speed on launch
- **WHEN** the app launches
- **THEN** the simulation SHALL run at 10x speed (10 chronons per update cycle at the base rate)
