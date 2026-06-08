## ADDED Requirements

### Requirement: Launch into running simulation
The app SHALL start directly in a running Wa-Tor simulation at `10x` speed with no landing page or instruction screen.

#### Scenario: Immediate run on launch
- **WHEN** the app launches
- **THEN** it SHALL display a running simulation at `10x` speed with no intermediate landing or instruction screen

### Requirement: Project file organization
The project SHALL include `index.html`, `src/main.js`, `src/config.js`, `src/simulation/WatorSimulation.js`, `src/scenes/BootScene.js`, `src/scenes/SimulationScene.js`, `sw.js`, `manifest.webmanifest`, and an `assets/` directory for PWA assets.

#### Scenario: Required files present
- **WHEN** the project is inspected
- **THEN** it SHALL contain each of the listed files and the `assets/` directory

### Requirement: CDN Phaser and ES modules
`index.html` SHALL load Phaser version 4.x from a CDN `<script>` tag and SHALL load the app through ES2020 JavaScript modules.

#### Scenario: Phaser from CDN
- **WHEN** `index.html` loads
- **THEN** it SHALL include a CDN `<script>` tag for Phaser version 4.x and SHALL load app code as ES2020 modules

### Requirement: Phaser-native rendering and input
The app SHALL render and control the entire app window through Phaser-native scene rendering and input, with no HTML or DOM controls layered over Phaser.

#### Scenario: No DOM control overlay
- **WHEN** the app presents stats, controls, world, or chart
- **THEN** all of them SHALL be drawn and handled by Phaser, with no HTML/DOM controls layered over the canvas

#### Scenario: Boot scene flow
- **WHEN** the game starts
- **THEN** `BootScene` SHALL load first, load needed assets, and start `SimulationScene` as its final create step

### Requirement: World rendering via Graphics
The app SHALL draw the world using Phaser `Graphics`: empty water as background and fish and sharks as abstract circles, with no grid lines, no creature sprite art, and no per-cell sprites.

#### Scenario: Graphics-based world
- **WHEN** the world is rendered
- **THEN** the app SHALL draw water as the background and draw fish and sharks as circles using Phaser `Graphics`, drawing no grid lines and using no per-cell sprites

#### Scenario: Fish and shark appearance
- **WHEN** fish and sharks are drawn
- **THEN** fish SHALL be green circles and sharks SHALL be blue circles slightly larger than fish

#### Scenario: Immediate state updates
- **WHEN** the world advances by one or more chronons
- **THEN** the app SHALL render the new state immediately with no per-cell movement animation

### Requirement: Responsive layout
The app SHALL gracefully scale and center the world from code-constant grid dimensions, and SHALL recompute layout and rendering scale on browser resize without changing the simulation grid dimensions.

#### Scenario: Scale and center the world
- **WHEN** a programmer changes the grid dimension constants
- **THEN** the app SHALL scale and center the world display without requiring UI changes

#### Scenario: Resize recomputes layout
- **WHEN** the browser window is resized
- **THEN** the app SHALL recompute layout and rendering scale while preserving the simulation grid dimensions

#### Scenario: Wide-window layout
- **WHEN** the app is viewed in a wide browser window
- **THEN** it SHALL place stats on the left, the world in the center, controls on the right, and the history chart across the bottom

#### Scenario: Narrow/tablet reflow
- **WHEN** the app is viewed on a tablet or narrow window down to an iPad-mini viewport (`744 x 1133` CSS px)
- **THEN** it SHALL reflow the display while preserving the world aspect ratio and keeping all controls usable

### Requirement: Statistics panel
The app SHALL display Chronon, Fish, Sharks, and Status on the left side of the main world display.

#### Scenario: Stats content and placement
- **WHEN** the simulation is displayed
- **THEN** the left side SHALL show the current Chronon, Fish count, Shark count, and Status

### Requirement: Control panel
The app SHALL place controls on the right side of the world display: a single horizontal speed row with `1x`, `5x`, `10x`, `30x`, and `60x`, and Play/Pause, Step, and Reset each on its own row.

#### Scenario: Speed row
- **WHEN** the controls are displayed
- **THEN** the speed buttons `1x`, `5x`, `10x`, `30x`, and `60x` SHALL appear in one horizontal row

#### Scenario: Action buttons
- **WHEN** the controls are displayed
- **THEN** only Play/Pause, Step, and Reset SHALL appear as action controls, each on its own row

### Requirement: Run, step, and reset behavior
The app SHALL govern Step, speed, and Reset according to run state: Step is disabled while running and advances exactly one chronon while paused; speed changes never resume a paused run; Reset starts a fresh running world at the selected speed.

#### Scenario: Running disables step
- **WHILE** the simulation is running
- **THEN** the app SHALL disable Step and SHALL apply speed changes on subsequent updates

#### Scenario: Paused step advances one chronon
- **WHILE** the simulation is paused
- **WHEN** Step is activated
- **THEN** the app SHALL advance exactly one chronon and SHALL keep speed changes from resuming the run

#### Scenario: Reset starts fresh
- **WHEN** Reset is activated
- **THEN** the app SHALL create a new random world, set the chronon to `0`, clear extinction status, clear population history, and resume running at the selected speed

### Requirement: Extinction status
The app SHALL auto-pause on extinction and show a terminal status, requiring Reset to start another run.

#### Scenario: Sharks extinct
- **WHEN** sharks reach zero while fish remain
- **THEN** the app SHALL auto-pause and display `Sharks extinct`

#### Scenario: Fish extinct
- **WHEN** fish reach zero while sharks remain
- **THEN** the app SHALL auto-pause and display `Fish extinct`

#### Scenario: Ecosystem collapsed
- **WHEN** fish and sharks both reach zero in the same chronon
- **THEN** the app SHALL auto-pause and display `Ecosystem collapsed`

#### Scenario: Terminal requires reset
- **WHILE** the simulation is in a terminal extinction state
- **THEN** the app SHALL keep Play disabled and SHALL require Reset to start another run

#### Scenario: Non-terminal status text
- **WHILE** the simulation is not terminal
- **THEN** the app SHALL display `Running` when running and `Paused` when paused

### Requirement: Population history chart
The app SHALL render a population history chart horizontally across the bottom, storing one sample per chronon for a rolling window of `500` chronons, drawing fish and shark lines in the same green and blue as the world and stats, with no chart titles or text labels.

#### Scenario: Chart placement and window
- **WHEN** population history is displayed
- **THEN** the app SHALL draw it across the bottom of the window using one sample per chronon over a rolling window of the most recent `500` chronons

#### Scenario: Chart colors and labels
- **WHEN** the chart is rendered
- **THEN** it SHALL draw the fish line in green and the shark line in blue and SHALL omit all chart titles and text labels

### Requirement: Speed-driven advancement
The app SHALL advance the simulation according to the selected chronons-per-second speed on Phaser update frames, as normally as the browser allows, with no special catch-up compensation when the tab is hidden or throttled.

#### Scenario: Advance by selected speed
- **WHEN** Phaser update frames occur
- **THEN** the app SHALL advance the simulation at the selected chronons-per-second rate

#### Scenario: No catch-up when throttled
- **WHEN** the browser tab is hidden or throttled
- **THEN** the app SHALL NOT implement real-time preservation or catch-up compensation

### Requirement: Tunable presentation constants
The app SHALL define grid dimensions, densities, breed times, shark energy values, colors, and speed options as code constants that a programmer can change easily in one place.

#### Scenario: Constants easy to change
- **WHEN** a programmer edits the model or display constants in `src/config.js`
- **THEN** the app SHALL adopt the new values without requiring changes elsewhere in the UI code

### Requirement: App documentation
Every app class SHALL carry a JSDoc class comment, and every static method and every public method longer than 8 lines SHALL carry a JSDoc comment.

#### Scenario: Class and method docs present
- **WHEN** an app class or a static/public method longer than 8 lines is defined
- **THEN** it SHALL have a JSDoc documentation comment

### Requirement: PWA packaging
The app SHALL include a manifest and service worker that cache the app shell and same-origin assets, using relative URLs so the app works when served from a repository subpath; offline and first-load behavior MAY depend on network availability when the CDN Phaser script has not yet been cached.

#### Scenario: Shell and assets cached
- **WHEN** the service worker is active
- **THEN** it SHALL cache the app shell and same-origin assets, and the manifest SHALL declare icons suggesting shark and fish circles

#### Scenario: Subpath-safe registration
- **WHEN** the app registers its service worker and references app assets
- **THEN** it SHALL use relative URLs so the app works when served from a repository subpath

#### Scenario: CDN offline caveat
- **WHEN** the CDN Phaser script has not already been successfully loaded and cached
- **THEN** first-load or offline behavior MAY depend on network availability
