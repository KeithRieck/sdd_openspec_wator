## ADDED Requirements

### Requirement: Configuration constants module
The system SHALL provide a centralized configuration module exporting all simulation constants.

#### Scenario: Grid dimensions
- **WHEN** the config module is imported
- **THEN** the system SHALL provide GRID_WIDTH (default 100) and GRID_HEIGHT (default 70)

#### Scenario: Initial population densities
- **WHEN** the config module is imported
- **THEN** the system SHALL provide FISH_DENSITY (default 0.30) and SHARK_DENSITY (default 0.05)

#### Scenario: Breeding parameters
- **WHEN** the config module is imported
- **THEN** the system SHALL provide FISH_BREED_TIME (default 3) and SHARK_BREED_TIME (default 25)

#### Scenario: Shark energy parameters
- **WHEN** the config module is imported
- **THEN** the system SHALL provide INITIAL_SHARK_ENERGY (default 5), SHARK_ENERGY_GAIN (default 3), and SHARK_ENERGY_COST_PER_CHRONON (default 1)

#### Scenario: Speed options
- **WHEN** the config module is imported
- **THEN** the system SHALL provide SPEED_OPTIONS array [1, 5, 10, 30, 60] and DEFAULT_SPEED_INDEX (default 2 for 10x)

#### Scenario: Color constants
- **WHEN** the config module is imported
- **THEN** the system SHALL provide COLORS object with FISH (green), SHARK (blue), WATER (background), TEXT, BUTTON_BG, BUTTON_HOVER, BUTTON_DISABLED, BUTTON_SELECTED

#### Scenario: History window
- **WHEN** the config module is imported
- **THEN** the system SHALL provide HISTORY_WINDOW (default 500)

#### Scenario: Config immutability
- **WHEN** the config module is imported
- **THEN** the system SHALL export a frozen object preventing accidental mutation