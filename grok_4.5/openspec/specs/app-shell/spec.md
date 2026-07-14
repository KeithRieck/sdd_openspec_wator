## Purpose

Static bootstrap, configuration, Boot/Simulation scene wiring, and lightweight PWA support for the Wa-Tor web app.

## Requirements

### Requirement: 1 - Static ES module bootstrap
The system SHALL load as a static site through `index.html` that includes Phaser 4.x from a CDN script tag and starts the app via ES2020 modules. The shipped runtime SHALL NOT require Node.js.

#### Scenario: CDN Phaser and module entry
- **WHEN** `index.html` loads in a browser
- **THEN** Phaser 4.x SHALL be available from a CDN script and the app SHALL start from an ES module entry point

#### Scenario: Acceptable Phaser CDN
- **WHEN** choosing the Phaser script source
- **THEN** `https://cdn.jsdelivr.net/npm/phaser@4.1.0/dist/phaser.min.js` SHALL be an acceptable source

### Requirement: 2 - Required project structure
The system SHALL include `index.html`, `src/main.js`, `src/config.js`, `src/simulation/WatorSimulation.js`, `src/simulation/Entity.js`, `src/simulation/Fish.js`, `src/simulation/Shark.js`, `src/scenes/BootScene.js`, `src/scenes/SimulationScene.js`, `src/ui/` components, `sw.js`, `manifest.webmanifest`, and an `assets/` directory for PWA assets.

#### Scenario: Boot scene first
- **WHEN** the Phaser game starts
- **THEN** `BootScene` SHALL be the first scene and SHALL start `SimulationScene` after setup

#### Scenario: Config centralizes constants
- **WHEN** a programmer changes grid dimensions, densities, breed times, shark energy values, colors, or speed options
- **THEN** those values SHALL be editable in `src/config.js` (or clearly re-exported constants) without hunting through UI code

### Requirement: 3 - Direct launch into running simulation
When the app launches, the system SHALL start directly in a running Wa-Tor simulation at default `10x` speed with no landing page or instruction screen.

#### Scenario: No interstitial screens
- **WHEN** a user opens the app URL
- **THEN** they SHALL reach the live simulation UI without an intermediate menu scene

### Requirement: 4 - Lightweight PWA support
The system SHALL include a web manifest and service worker that cache the app shell and same-origin assets. Icons SHOULD depict circles suggesting fish and shark symbols. If the CDN Phaser script has not already been successfully loaded and cached, first-load or offline behavior MAY depend on network availability.

#### Scenario: Manifest and service worker present
- **WHEN** the app is deployed
- **THEN** `manifest.webmanifest` and `sw.js` SHALL be present and the app SHALL register the service worker

#### Scenario: Subpath-friendly URLs
- **WHEN** the app is served from a repository subpath
- **THEN** asset and service worker references SHALL use relative URLs so the shell can load

### Requirement: 5 - Documentation comments
The system SHALL use JSDoc-style comments for every class. Each static method and each public method longer than 8 lines SHALL have a JSDoc-style documentation comment.

#### Scenario: Classes documented
- **WHEN** a class is added for entities, simulation, scenes, or UI components
- **THEN** it SHALL include a class-level JSDoc comment
