## Purpose

Defines the static browser app that boots a running Wa-Tor world, renders it in a full-window Phaser view, and exposes playback, stats, history, and lightweight PWA install behavior.

## ADDED Requirements

### Requirement: 1. Immediate running launch

WHEN the app launches, the system SHALL start directly in a running Wa-Tor simulation at `10x` speed with no landing page or instruction screen.

#### Scenario: 1.1 No interstitial

- **WHEN** the app finishes loading
- **THEN** the user SHALL see a running world and SHALL NOT be required to dismiss a landing or help screen

#### Scenario: 1.2 Default speed

- **WHEN** the app launches
- **THEN** the selected speed SHALL be `10x`

### Requirement: 2. Static ES module shell

WHEN `index.html` loads the app, the system SHALL load Phaser version 4.x from a CDN script tag and SHALL load the app through ES2020 JavaScript modules. The shipped runtime SHALL NOT require Node.js, a bundler, or a backend. The project SHALL include `index.html`, `src/main.js`, `src/config.js`, `src/simulation/WatorSimulation.js`, `src/scenes/BootScene.js`, `src/scenes/SimulationScene.js`, `sw.js`, `manifest.webmanifest`, and an `assets/` directory. A `src/ui` directory MAY hold on-screen helper classes.

#### Scenario: 2.1 CDN Phaser and modules

- **WHEN** `index.html` loads
- **THEN** the page SHALL include a Phaser 4.x CDN script tag and SHALL start the app as ES2020 modules

#### Scenario: 2.2 Required files

- **WHERE** the project files are organized
- **THEN** the listed shell, simulation, scene, and PWA files SHALL be present

### Requirement: 3. Phaser-owned window

WHERE the app is shown, the system SHALL render and control the entire app window through Phaser-native scene rendering and input. The system SHALL NOT layer HTML or DOM controls over Phaser. The system SHALL NOT provide keyboard shortcuts.

#### Scenario: 3.1 Pointer controls only

- **WHEN** the user operates playback
- **THEN** the controls SHALL be Phaser-drawn hit targets, not HTML form controls

### Requirement: 4. World presentation

WHEN the world is rendered, the system SHALL draw empty water as the background and draw fish and sharks as abstract circles with no grid lines. Fish SHALL be green circles. Sharks SHALL be blue circles and slightly larger than fish. The system SHALL use Phaser `Graphics` drawing rather than per-cell sprites. WHEN the world advances, the system SHALL render the new occupancy immediately with no per-cell movement animation.

#### Scenario: 4.1 Abstract occupants

- **WHEN** a cell contains a fish or a shark
- **THEN** the system SHALL draw a colored circle and SHALL NOT draw a creature sprite or cell grid line

#### Scenario: 4.2 Immediate chronon update

- **WHEN** the simulation advances by one or more chronons
- **THEN** occupants SHALL appear in their new cells on the next render without interpolated travel

### Requirement: 5. Scale, center, and resize

WHEN a programmer changes grid dimension constants, the system SHALL scale and center the world display without requiring UI control changes. WHEN the browser resizes, the system SHALL recompute layout and rendering scale without changing the simulation grid dimensions. The world aspect ratio SHALL be preserved.

#### Scenario: 5.1 Dimension change in code

- **WHEN** grid width or height constants change and the app is reloaded
- **THEN** the world view SHALL scale and remain centered without new UI widgets

#### Scenario: 5.2 Browser resize

- **WHEN** the browser window is resized
- **THEN** the system SHALL relayout and rescale the world and SHALL NOT alter column or row counts

### Requirement: 6. Wide layout

WHEN the app is viewed on a wide browser window, the system SHALL place Chronon, Fish, Sharks, and Status on the left of the world, place controls on the right of the world, and render the population history chart horizontally across the bottom.

#### Scenario: 6.1 Four-region wide frame

- **WHEN** the window is wide enough for the default desktop layout
- **THEN** stats SHALL appear left, the world center, controls right, and the history chart across the bottom

### Requirement: 7. Narrow and tablet layout

WHEN the app is viewed on a tablet or narrow browser window, the system SHALL reflow the display while preserving the world aspect ratio and keeping all controls usable. The minimum tablet CSS viewport to design for SHALL be `744 x 1133` CSS pixels.

#### Scenario: 7.1 Usable iPad mini portrait

- **WHEN** the app is viewed at approximately `744 x 1133` CSS pixels
- **THEN** the world, stats, controls, and chart SHALL remain visible and the action and speed controls SHALL remain tappable

### Requirement: 8. Speed controls

WHERE speed controls appear, the system SHALL show `1x`, `5x`, `10x`, `30x`, and `60x` buttons in one horizontal row. Those values SHALL mean chronons per second as nearly as the browser allows. Speed changes SHALL take effect on subsequent updates and SHALL NOT by themselves resume a paused or terminal simulation.

#### Scenario: 8.1 Speed row

- **WHERE** speed controls are shown
- **THEN** the five speeds SHALL appear as one horizontal row of buttons

#### Scenario: 8.2 Change while running

- **WHILE** the simulation is running
- **THEN** a newly selected speed SHALL change how fast later chronons are applied

#### Scenario: 8.3 Change while paused

- **WHILE** the simulation is paused
- **THEN** a speed change SHALL update the selected speed and SHALL NOT resume the simulation

### Requirement: 9. Playback controls

WHERE action controls appear, the system SHALL show only Play/Pause, Step, and Reset, with each action button on its own row. WHILE the simulation is running, Step SHALL be disabled. WHILE the simulation is paused and not terminal, Step SHALL advance exactly one chronon. WHEN Reset is activated, the system SHALL create a new random world, set chronon to `0`, clear extinction status, clear population history, and resume running at the selected speed.

#### Scenario: 9.1 Action stack

- **WHERE** action controls are shown
- **THEN** Play/Pause, Step, and Reset SHALL each occupy their own row

#### Scenario: 9.2 Step disabled while running

- **WHILE** the simulation is running
- **THEN** the Step control SHALL be disabled

#### Scenario: 9.3 Single step while paused

- **WHILE** the simulation is paused and not terminal
- **THEN** activating Step SHALL advance exactly one chronon and leave the simulation paused

#### Scenario: 9.4 Reset starts a new run

- **WHEN** Reset is activated
- **THEN** the system SHALL rebuild a random world at chronon `0`, clear history and extinction, and resume running at the selected speed

### Requirement: 10. Status text

WHILE the simulation is not terminal and running, the system SHALL display `Running`. WHILE the simulation is not terminal and paused, the system SHALL display `Paused`. WHILE the simulation is terminal, the system SHALL display the engine terminal status, keep Play disabled, and require Reset to start another run. IF either population reaches zero, the app SHALL auto-pause.

#### Scenario: 10.1 Running label

- **WHILE** the simulation is not terminal and running
- **THEN** Status SHALL read `Running`

#### Scenario: 10.2 Paused label

- **WHILE** the simulation is not terminal and paused
- **THEN** Status SHALL read `Paused`

#### Scenario: 10.3 Terminal lockout

- **WHILE** the simulation is terminal
- **THEN** Play SHALL be disabled and only Reset SHALL start another run

#### Scenario: 10.4 Auto-pause on extinction

- **IF** fish or sharks become extinct
- **THEN** the app SHALL pause automatically and show the matching terminal status

### Requirement: 11. Population history chart

WHERE the population history chart is rendered, the system SHALL draw fish and shark population lines using the same green and blue colors as the world and stats. The chart SHALL omit titles and text labels. The chart SHALL reflect the rolling `500`-chronon history.

#### Scenario: 11.1 Colored unlabeled series

- **WHEN** history samples exist
- **THEN** the chart SHALL draw a green fish series and a blue shark series with no title or axis text

### Requirement: 12. Frame timing without catch-up

WHEN Phaser update frames occur, the system SHALL advance the simulation according to the selected chronons-per-second speed as normally as the browser allows. IF the browser tab is hidden or throttled, the system SHALL NOT implement special real-time preservation or catch-up compensation.

#### Scenario: 12.1 No catch-up burst

- **IF** the tab was hidden and then becomes visible again
- **THEN** the system SHALL resume from the current world state without applying a backlog of missed chronons

### Requirement: 13. Programmer-editable presentation constants

WHERE code constants define presentation parameters, the system SHALL make colors and speed options easy for a programmer to change in the same configuration module as the model constants.

#### Scenario: 13.1 Shared config module

- **WHEN** a programmer changes color or speed-option constants
- **THEN** subsequent rendering and speed controls SHALL use the updated values

### Requirement: 14. Lightweight PWA

WHERE PWA support is implemented, the system SHALL include a web app manifest and a service worker that cache the app shell and same-origin assets. The manifest SHALL declare `assets/icon-192.png` and `assets/icon-512.png` as the app icons. IF the CDN Phaser script has not already been successfully loaded and cached, first-load or offline behavior MAY depend on network availability. Asset URLs SHALL work when the app is served from a repository subpath.

#### Scenario: 14.1 App shell cache

- **WHEN** the service worker is active after a successful first load of same-origin files
- **THEN** a later same-origin visit SHALL be able to load the cached app shell

#### Scenario: 14.2 Uncached Phaser

- **IF** Phaser has not already been successfully loaded and cached
- **THEN** the app MAY fail to start while the CDN is unavailable

#### Scenario: 14.3 Existing icon files

- **WHEN** the web app manifest is read
- **THEN** it SHALL reference `assets/icon-192.png` and `assets/icon-512.png`
