## ADDED Requirements

### Requirement 1: Static Phaser application shell
The application SHALL be a static ES2020 web app with `index.html`, `src/main.js`, `src/config.js`, simulation modules, Phaser scenes, `sw.js`, `manifest.webmanifest`, and an `assets/` directory. `index.html` SHALL load Phaser 4.x from the approved CDN script and then load the application as an ES module.

#### Scenario 1: Direct startup
- **WHEN** the app loads successfully
- **THEN** it SHALL start directly in a running simulation at 10x without a landing or instruction screen

#### Scenario 2: CDN unavailable on first load
- **WHEN** Phaser has not been cached and the CDN is unavailable
- **THEN** first-load behavior MAY depend on network availability without requiring a server-side fallback

### Requirement 2: Phaser-native world rendering
The app SHALL use Phaser scenes, `Graphics`, text, and pointer input to own the complete browser window. The world SHALL draw empty water as background, fish as green circles, and sharks as slightly larger blue circles, without grid lines, sprites, or movement animation.

#### Scenario 1: Immediate redraw
- **WHEN** one or more chronons advance
- **THEN** the world SHALL redraw the current simulation state immediately with no per-cell interpolation

#### Scenario 2: Resizing
- **WHEN** the browser viewport changes size
- **THEN** layout and rendering scale SHALL be recomputed while simulation grid dimensions remain unchanged

### Requirement 3: Responsive application layout
On wide windows, the app SHALL place statistics on the left, the world in the center, controls on the right, and the population chart across the bottom. On tablet or narrow windows, it SHALL reflow those regions while preserving the world aspect ratio and keeping controls usable.

#### Scenario 1: Wide layout
- **WHEN** the viewport is wide enough for a three-column layout
- **THEN** stats, world, and controls SHALL appear in left-to-right order with the chart below

#### Scenario 2: Narrow layout
- **WHEN** the viewport is narrow or tablet-sized
- **THEN** the layout SHALL reflow without distorting the world or making controls inaccessible

### Requirement 4: Statistics and population history UI
The UI SHALL render Chronon, Fish, Sharks, and Status on the left-side statistics region. It SHALL render a horizontal rolling chart across the bottom with fish and shark lines using the same green and blue colors as the world, without chart title or text labels.

#### Scenario 1: Live statistics
- **WHEN** simulation state changes
- **THEN** the statistics panel SHALL display current chronon, population counts, and status

#### Scenario 2: Rolling chart
- **WHEN** history samples exist
- **THEN** the chart SHALL render at most 500 chronon samples in chronological order

### Requirement 5: Playback and reset controls
The controls SHALL include one horizontal row of speed buttons labeled `1x`, `5x`, `10x`, `30x`, and `60x`, plus Play/Pause, Step, and Reset action buttons with one action per row. The default speed SHALL be 10x. While running, Step SHALL be disabled. While paused, Step SHALL advance exactly one chronon and speed changes SHALL not resume playback. Reset SHALL resume at the selected speed.

#### Scenario 1: Running controls
- **WHEN** the simulation is running
- **THEN** Play/Pause SHALL be available, Step SHALL be disabled, and a changed speed SHALL apply to subsequent updates

#### Scenario 2: Paused step
- **WHEN** the simulation is paused and Step is activated
- **THEN** exactly one chronon SHALL advance and the simulation SHALL remain paused

#### Scenario 3: Reset
- **WHEN** Reset is activated
- **THEN** a new random simulation SHALL begin at chronon zero and run at the currently selected speed

### Requirement 6: Playback status and terminal behavior
The app SHALL display `Running` while non-terminal and running, `Paused` while non-terminal and paused, and the exact terminal statuses defined by the simulation. Terminal state SHALL auto-pause, disable Play, and require Reset before another run can begin.

#### Scenario 1: Auto-pause on extinction
- **WHEN** either population becomes extinct
- **THEN** the app SHALL pause automatically and display the terminal status

#### Scenario 2: Terminal play prevention
- **WHEN** the app is terminal
- **THEN** Play SHALL remain disabled until Reset is activated

### Requirement 7: Static PWA support
The app SHALL include a lightweight manifest, service worker, and same-origin app-shell caching for the application files and assets. Manifest, service-worker, and module URLs SHALL support deployment from a repository subpath.

#### Scenario 1: App shell caching
- **WHEN** the service worker is installed
- **THEN** it SHALL cache the same-origin app shell and assets required by the app

#### Scenario 2: Repository subpath deployment
- **WHEN** the app is served from a repository subpath
- **THEN** app modules, manifest, service worker registration, and cache paths SHALL resolve relative to that deployment location
