# wator-simulation Specification

## Purpose

Provides a browser-based Wa-Tor predator-prey simulation: correct chronon-based fish and shark ecology on a toroidal water world, presented through a full-window Phaser UI with transport and speed controls, live population statistics, a rolling history chart, and lightweight PWA support.

## Requirements

### Requirement: 1. Direct-Start Launch
The system SHALL start directly in a running Wa-Tor simulation at `10x` speed when the app is launched, with no landing page or instruction screen. (prd-v001 AC 1)

#### Scenario: 1.1 Launch Lands in a Running Simulation
- **WHEN** the app is loaded in a browser
- **THEN** the simulation SHALL already be advancing chronons at `10x` speed with a freshly randomized world at chronon `0`

### Requirement: 2. Browser Integration and Architecture Boundaries
The system SHALL load Phaser 4.x from a CDN script tag and run the app as ES2020 JavaScript modules; the Wa-Tor rules SHALL be independent of Phaser APIs and scene objects; all rendering and input SHALL be Phaser-native over the entire app window, with no HTML/DOM controls layered over Phaser and no keyboard shortcuts. (prd-v001 AC 3, 4, 5)

#### Scenario: 2.1 CDN and Module Loading
- **WHEN** `index.html` loads the app
- **THEN** Phaser 4.x SHALL be loaded from a CDN script tag and the application code SHALL load through ES2020 modules

#### Scenario: 2.2 Engine Independence
- **WHEN** the simulation engine code is examined or executed
- **THEN** the Wa-Tor rules SHALL operate with no dependency on Phaser APIs or Phaser scene objects

#### Scenario: 2.3 Phaser-Native Window Ownership
- **WHEN** the app is displayed and operated
- **THEN** Phaser scenes SHALL render and handle input for the entire app window with no DOM-based controls and no keyboard-driven actions

### Requirement: 3. Toroidal World Grid
The system SHALL maintain a rectangular toroidal grid whose dimensions come from code constants defaulting to `100` columns and `70` rows; only orthogonal neighbors north, east, south, and west shall be considered for movement, with wrapping at the edges. (prd-v001 AC 6, 10)

#### Scenario: 3.1 Default Dimensions
- **WHEN** the simulation initializes with default constants
- **THEN** the world SHALL be `100` columns by `70` rows

#### Scenario: 3.2 Orthogonal Wrapped Neighbors
- **WHEN** neighbor cells are determined for a cell at any edge or corner
- **THEN** the result SHALL include exactly the up-to-four orthogonal neighbors with toroidal wrapping

### Requirement: 4. Scaling with Grid Constants
When a programmer changes the grid dimension constants in code, the system SHALL gracefully scale and center the world display without requiring UI changes. (prd-v001 AC 8)

#### Scenario: 4.1 Non-Default Grid Dimensions Center
- **WHEN** the grid dimension constants are changed and the app is run
- **THEN** the world display SHALL be scaled and centered to fit the available area without manual UI adjustment

### Requirement: 5. Window Resize Behavior
When the browser window is resized, the system SHALL recompute layout and rendering scale without changing the simulation grid dimensions. (prd-v001 AC 9)

#### Scenario: 5.1 Resize Relayouts Only
- **WHEN** the browser window is resized during a run
- **THEN** the layout and rendering scale SHALL be recomputed while the grid dimensions and simulation state remain unchanged

### Requirement: 6. Random Initial Population
The system SHALL randomly populate the grid using code constants defaulting to `30%` fish density and `5%` shark density, with each cell occupied by at most one entity. (prd-v001 AC 7)

#### Scenario: 6.1 Initial Densities
- **WHEN** a new world is created with default constants
- **THEN** approximately `30%` of cells SHALL be fish and approximately `5%` of cells SHALL be sharks, with no cell holding more than one entity

### Requirement: 7. Single Random-Number Source
Every random choice in the simulation, including initialization, movement selection, and turn-order shuffling, SHALL be drawn from exactly one random-number generator source rather than direct calls to `Math.random()` in multiple places. (prd-v001 AC 61)

#### Scenario: 7.1 All Randomness Through One Source
- **WHEN** any randomized decision is made (world population, turn order, movement choice)
- **THEN** the random value SHALL be obtained from the single shared random-number generator

### Requirement: 8. Chronon Turn Order
At the start of each chronon the system SHALL collect the current entity IDs, randomize their order, and allow each surviving entity to act at most once during that chronon. (prd-v001 AC 11)

#### Scenario: 8.1 Shuffled Single-Action Turn Sequence
- **WHEN** a chronon begins
- **THEN** the system SHALL act on entities in a randomized order of their IDs and each entity SHALL act at most once in that chronon

### Requirement: 9. Newborn Deferral
An entity born during the current chronon SHALL NOT act until the next chronon. (prd-v001 AC 12)

#### Scenario: 9.1 Newborn Waits One Chronon
- **WHEN** an entity is born during a chronon and its turn is reached in that same chronon
- **THEN** the system SHALL skip that entity's action

### Requirement: 10. Skips for Dead and Eaten Entities
An entity that dies or is eaten before its randomized turn SHALL be skipped when its turn is reached. (prd-v001 AC 13)

#### Scenario: 10.1 Eaten Fish Does Not Act
- **WHEN** a fish is eaten earlier in the chronon and its turn comes up later
- **THEN** the system SHALL skip that fish's action

#### Scenario: 10.2 Starved Shark Does Not Act
- **WHEN** a shark is removed earlier in the chronon and its turn comes up later
- **THEN** the system SHALL skip that shark's action

### Requirement: 11. Fish Movement
When a fish acts and at least one adjacent empty cell exists, the system SHALL move the fish to a randomly selected adjacent empty cell; if no empty adjacent cell exists, the fish SHALL not move. (prd-v001 AC 14)

#### Scenario: 11.1 Move to a Random Empty Neighbor
- **WHEN** a fish acts with one or more adjacent empty cells
- **THEN** the fish SHALL move to a uniformly selected one of those empty cells

#### Scenario: 11.2 Surrounded Fish Stays Put
- **WHEN** a fish acts with no adjacent empty cell
- **THEN** the fish SHALL remain in its current cell

### Requirement: 12. Fish Reproduction
When a breeding-ready fish successfully moves, the system SHALL leave a new fish in the old cell and reset the parent's breed timer to `0`; when a breeding-ready fish cannot move, the system SHALL reset its breed timer to `0` without reproducing; when a fish is not breeding-ready and cannot move, the system SHALL continue aging its breed timer. (prd-v001 AC 15, 16, 17)

#### Scenario: 12.1 Breeding-Ready Fish Spawns on Move
- **WHEN** a breeding-ready fish successfully moves to an adjacent empty cell
- **THEN** a new fish SHALL be created in the fish's old cell and the parent's breed timer SHALL be reset to `0`

#### Scenario: 12.2 Breeding-Ready Blocked Fish Resets Timer Only
- **WHEN** a breeding-ready fish has no adjacent empty cell
- **THEN** the fish SHALL reset its breed timer to `0` without leaving a new fish

#### Scenario: 12.3 Blocked Non-Ready Fish Keeps Aging
- **WHEN** a fish that is not breeding-ready has no adjacent empty cell
- **THEN** the fish SHALL continue aging its breed timer

### Requirement: 13. Shark Energy Depletion
When a shark acts, the system SHALL decrement shark energy by `sharkEnergyCostPerChronon` before movement or eating. (prd-v001 AC 18)

#### Scenario: 13.1 Energy Drops First
- **WHEN** a shark's turn begins in a chronon
- **THEN** its energy SHALL be decremented by `sharkEnergyCostPerChronon` before any movement or eating is resolved

### Requirement: 14. Shark Starvation Death
If a shark's energy reaches `0` after the start-of-action decrement, the system SHALL remove the shark immediately without moving or eating. (prd-v001 AC 19)

#### Scenario: 14.1 Zero-Energy Shark Dies in Place
- **WHEN** a shark's energy reaches `0` after the start-of-action decrement
- **THEN** the shark SHALL be removed without moving, eating, or reproducing

### Requirement: 15. Shark Hunting
If a shark has adjacent fish after surviving the energy decrement, the system SHALL move the shark to a randomly selected adjacent fish cell and remove the eaten fish, and the shark SHALL gain `sharkEnergyGain` energy from the meal. (prd-v001 AC 20, 21)

#### Scenario: 15.1 Shark Eats a Random Adjacent Fish
- **WHEN** a shark acts with one or more adjacent fish
- **THEN** the shark SHALL move to a uniformly selected one of those fish cells, the fish SHALL be removed, and the shark's energy SHALL increase by `sharkEnergyGain`

### Requirement: 16. Shark Movement Without Prey
If a shark has no adjacent fish and at least one adjacent empty cell, the system SHALL move the shark to a randomly selected adjacent empty cell; if there are no empty cells, the shark SHALL not move. (prd-v001 AC 22)

#### Scenario: 16.1 Hungry Shark Roams to Empty Water
- **WHEN** a shark acts with no adjacent fish and one or more adjacent empty cells
- **THEN** the shark SHALL move to a uniformly selected one of those empty cells

#### Scenario: 16.2 Trapped Shark Stays Put
- **WHEN** a shark acts with no adjacent fish and no adjacent empty cell
- **THEN** the shark SHALL remain in its current cell

### Requirement: 17. Shark Reproduction
A breeding-ready shark that successfully moves (eating a fish counts as a successful move) SHALL leave a newborn shark in its old cell and reset its breed timer to `0`; a breeding-ready shark that cannot move SHALL reset its breed timer to `0` without reproducing; a shark that is not breeding-ready and cannot move SHALL continue aging its breed timer. A newborn shark SHALL start with `initialSharkEnergy` energy. (prd-v001 AC 23, 24, 25, 26)

#### Scenario: 17.1 Breeding-Ready Shark Spawns on Move or Eat
- **WHEN** a breeding-ready shark successfully moves to an empty cell or eats an adjacent fish
- **THEN** a newborn shark SHALL be created in the shark's old cell with `initialSharkEnergy` energy and the parent's breed timer SHALL be reset to `0`

#### Scenario: 17.2 Breeding-Ready Blocked Shark Resets Timer Only
- **WHEN** a breeding-ready shark has no legal move
- **THEN** the shark SHALL reset its breed timer to `0` without leaving a newborn shark

#### Scenario: 17.3 Blocked Non-Ready Shark Keeps Aging
- **WHEN** a shark that is not breeding-ready has no legal move
- **THEN** the shark SHALL continue aging its breed timer

### Requirement: 18. Object-Oriented Entity Model
The simulation SHALL represent entities as objects that are instances of JavaScript classes extending a common `Entity` base class (`Fish` and `Shark` extend `Entity`); each entity SHALL carry an ID, a position, and a breed age, and a shark entity SHALL additionally carry energy. The shared entity behavior (position, breed age, breeding readiness) SHALL live on the `Entity` base class, and each entity class SHALL define its own action during a chronon. (prd-v001 AC 27, 58, 59, 60)

#### Scenario: 18.1 Entity Class Hierarchy
- **WHEN** the simulation state is inspected
- **THEN** every fish and shark SHALL be an instance of a class extending the shared `Entity` base class, carrying ID, position, and breed age, with sharks additionally carrying energy

#### Scenario: 18.2 Polymorphic Chronon Action
- **WHEN** an entity's turn arrives during a chronon
- **THEN** the entity's own class behavior SHALL decide its action (fish forage and breed; sharks deplete energy, hunt or roam, and breed)

### Requirement: 19. Flat Grid State Consistency
Simulation state SHALL use a flat grid array with one slot per cell containing the occupying entity ID or an `empty` marker, plus the entity objects; each entity's position SHALL be the flat grid array index of its cell; and the grid array and entity objects SHALL be kept consistent so the entity ID stored in a cell matches the entity occupying that cell. (prd-v001 AC 27a, 27b, 27c)

#### Scenario: 19.1 Cell Slots Hold IDs or Empty
- **WHEN** the grid state is inspected at any time
- **THEN** each flat grid slot SHALL contain either the ID of the entity occupying that cell or an `empty` marker

#### Scenario: 19.2 Position Equals Grid Index
- **WHEN** an entity's position is read
- **THEN** it SHALL equal the flat grid array index of the cell the entity occupies

#### Scenario: 19.3 Grid and Entities Agree
- **WHEN** any movement, birth, eating, or death completes
- **THEN** the grid slot and entity record SHALL agree: the cell holds the ID of the entity whose position is that cell's index

### Requirement: 20. Abstract Circle Rendering
The world SHALL render empty water as the background and fish and sharks as abstract circles with no grid lines: fish as green circles and sharks as slightly larger blue circles. Rendering SHALL use Phaser `Graphics` drawing rather than per-cell sprites. (prd-v001 AC 28, 50)

#### Scenario: 20.1 Circles on Water, No Sprites or Grid Lines
- **WHEN** the world is rendered
- **THEN** empty water SHALL be drawn as the background, fish as green circles, sharks as slightly larger blue circles, with no grid lines and no sprite-based rendering

### Requirement: 21. Immediate State Updates
When the world advances by one or more chronons, the system SHALL render immediate state updates without per-cell movement animation. (prd-v001 AC 29)

#### Scenario: 21.1 No Movement Animation
- **WHEN** the world advances by one or more chronons
- **THEN** the display SHALL update to the new state directly, with no interpolation or per-cell movement animation

### Requirement: 22. Population Statistics Display
The system SHALL display Chronon, Fish, Sharks, and Status values on the left side of the main world display, updated as the simulation advances. (prd-v001 AC 30)

#### Scenario: 22.1 Live Stats Panel
- **WHEN** the simulation advances or its run state changes
- **THEN** the left-side stats SHALL show the current chronon, fish count, shark count, and status text

### Requirement: 23. Controls Layout and Composition
Controls SHALL appear on the right side of the main world display. Speed controls SHALL show `1x`, `5x`, `10x`, `30x`, and `60x` buttons in one horizontal row. Action controls SHALL show only Play/Pause, Step, and Reset, with each action button on its own row. (prd-v001 AC 31, 32, 33)

#### Scenario: 23.1 Right-Side Control Panel
- **WHEN** the app is displayed
- **THEN** the right side SHALL contain the speed row (`1x`, `5x`, `10x`, `30x`, `60x`) and the Play/Pause, Step, and Reset action buttons each on their own row, and no other action controls

### Requirement: 24. Play, Pause, and Step Semantics
While the simulation is running, the system SHALL disable Step and allow speed changes to take effect during subsequent updates. While the simulation is paused, Step SHALL advance exactly one chronon, and selecting a speed SHALL NOT resume the simulation. (prd-v001 AC 34, 35)

#### Scenario: 24.1 Step Disabled While Running
- **WHEN** the simulation is running
- **THEN** the Step button SHALL be disabled and a speed selection SHALL apply to subsequent updates

#### Scenario: 24.2 Step Advances Exactly One Chronon
- **WHEN** the simulation is paused and Step is activated
- **THEN** the world SHALL advance by exactly one chronon and remain paused

#### Scenario: 24.3 Speed Change Does Not Resume
- **WHEN** the simulation is paused and a speed button is selected
- **THEN** the selected speed SHALL be recorded and the simulation SHALL remain paused

### Requirement: 25. Reset Behavior
When Reset is activated, the system SHALL create a new random world, set the chronon to `0`, clear any extinction status, clear the population history, and resume running at the selected speed. (prd-v001 AC 36)

#### Scenario: 25.1 Fresh Run from Reset
- **WHEN** Reset is activated from any state (running, paused, or terminal)
- **THEN** a newly randomized world SHALL start at chronon `0` with cleared history and no extinction status, running at the currently selected speed

### Requirement: 26. Extinction and Terminal Status
If either population reaches zero, the system SHALL auto-pause and display a terminal status: `Sharks extinct` when sharks reach zero while fish remain, `Fish extinct` when fish reach zero while sharks remain, and `Ecosystem collapsed` when both reach zero in the same chronon. While not terminal the system SHALL display `Running` when running and `Paused` when paused. While terminal, Play SHALL remain disabled and Reset SHALL be required to start another run. (prd-v001 AC 37, 38, 39, 40, 41, 42, 43)

#### Scenario: 26.1 Sharks Extinct
- **WHEN** the shark population reaches zero while fish remain
- **THEN** the simulation SHALL auto-pause and display `Sharks extinct`

#### Scenario: 26.2 Fish Extinct
- **WHEN** the fish population reaches zero while sharks remain
- **THEN** the simulation SHALL auto-pause and display `Fish extinct`

#### Scenario: 26.3 Ecosystem Collapsed
- **WHEN** fish and sharks both reach zero in the same chronon
- **THEN** the simulation SHALL auto-pause and display `Ecosystem collapsed`

#### Scenario: 26.4 Non-Terminal Status Text
- **WHEN** the simulation is not terminal
- **THEN** the status SHALL read `Running` while running and `Paused` while paused

#### Scenario: 26.5 Terminal State Requires Reset
- **WHEN** the simulation is in a terminal state
- **THEN** the Play button SHALL remain disabled and only Reset SHALL start another run

### Requirement: 27. Population History Chart
The system SHALL render a population history chart horizontally across the bottom of the window, storing one sample per chronon for a rolling window of `500` chronons, drawing fish and shark population lines in the same green and blue colors as the world and stats, with no chart titles or text labels. (prd-v001 AC 44, 45, 46, 47)

#### Scenario: 27.1 Rolling 500-Chronon Population Lines
- **WHEN** chronons advance and history is recorded
- **THEN** the bottom chart SHALL show fish (green) and shark (blue) population lines for the most recent `500` chronons, one sample per chronon, with no titles or text labels

### Requirement: 28. Frame-Paced Simulation Speed
Phaser update frames SHALL advance the simulation according to the selected chronons-per-second speed (`1x`, `5x`, `10x`, `30x`, `60x` mapping to 1, 5, 10, 30, and 60 chronons per second) as normally as the browser allows, with no special real-time preservation or catch-up compensation when the tab is hidden or throttled. (prd-v001 AC 48, 49)

#### Scenario: 28.1 Speed Selection Paces Chronons
- **WHEN** a speed is selected and the simulation is running
- **THEN** the simulation SHALL advance at the corresponding chronons-per-second rate as normally delivered by browser update frames

#### Scenario: 28.2 Throttled Tab Makes No Catch-Up
- **WHEN** the browser tab is hidden or throttled
- **THEN** the system SHALL neither compensate elapsed time nor queue catch-up chronons when frames resume

### Requirement: 29. Responsive Layout
On a wide browser window the system SHALL lay out stats on the left, the world in the center, controls on the right, and the history chart across the bottom. On a tablet or narrow browser window (down to an iPad mini viewport of `744 x 1133` CSS pixels) the system SHALL reflow the display while preserving the world aspect ratio and keeping all controls usable. (prd-v001 AC 51, 52)

#### Scenario: 29.1 Wide Three-Column Layout
- **WHEN** the app is viewed on a wide browser window
- **THEN** stats SHALL be on the left, the world in the center, controls on the right, and the history chart across the bottom

#### Scenario: 29.2 Narrow Viewport Reflows
- **WHEN** the app is viewed on a tablet or narrow window down to `744 x 1133` CSS pixels
- **THEN** the layout SHALL reflow while preserving the world's aspect ratio and keeping every control reachable and operable

### Requirement: 30. Programmer-Facing Configuration and Documentation
Grid dimensions, densities, breed times, shark energy values, colors, and speed options SHALL be defined as code constants that are easy for a programmer to change. Every class SHALL have a JSDoc documentation comment, and every static method and public method longer than 8 lines SHALL have a JSDoc documentation comment. (prd-v001 AC 53, 54, 55)

#### Scenario: 30.1 Constants Centralized
- **WHEN** a programmer adjusts grid dimensions, densities, breed times, shark energy values, colors, or speed options
- **THEN** the change SHALL be made in code constants without hunting through logic

#### Scenario: 30.2 JSDoc Coverage
- **WHEN** the source code is inspected
- **THEN** every class SHALL carry a JSDoc comment and every static or public method exceeding 8 lines SHALL carry a JSDoc comment

### Requirement: 31. Lightweight PWA Support
The system SHALL include a manifest and a service worker that cache the app shell and same-origin assets. If the CDN Phaser script has not already been successfully loaded and cached, first-load or offline behavior MAY depend on network availability. (prd-v001 AC 56, 57)

#### Scenario: 31.1 App Shell Cached
- **WHEN** the app has been loaded once and the service worker is active
- **THEN** the app shell and same-origin assets SHALL be served from cache when requested again

#### Scenario: 31.2 CDN Dependency Tolerated
- **WHEN** the app is loaded offline and the CDN Phaser script has not been previously cached
- **THEN** the system SHALL be allowed to fail or degrade without special offline fallback for the CDN script
