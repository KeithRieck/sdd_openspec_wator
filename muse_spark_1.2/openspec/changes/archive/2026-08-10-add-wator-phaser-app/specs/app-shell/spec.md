## ADDED Requirements

### Requirement: Required file structure
The system SHALL include `index.html`, `src/main.js`, `src/config.js`, `src/simulation/WatorSimulation.js`, `src/scenes/BootScene.js`, `src/scenes/SimulationScene.js`, `sw.js`, `manifest.webmanifest`, and an `assets/` directory for PWA assets, with an optional `src/ui/` directory for helpers and `src/simulation/Entity.js`, `Fish.js`, `Shark.js` for the OO hierarchy.

#### Scenario: File structure exists
- **WHEN** the project is built
- **THEN** all required files and directories SHALL be present at the specified paths

### Requirement: CDN Phaser and ES2020 modules
The system SHALL load Phaser version 4.x from a CDN script tag in `index.html` and load the app through ES2020 JavaScript modules.

#### Scenario: CDN and modules
- **WHEN** `index.html` loads
- **THEN** it SHALL include a script tag for `https://cdn.jsdelivr.net/npm/phaser@4.1.0/dist/phaser.min.js` and import the app via `type="module"` ES2020

### Requirement: Framework-independent engine
The system SHALL keep all Wa-Tor rules independent from Phaser APIs and Phaser scene objects.

#### Scenario: Engine has no Phaser import
- **WHEN** the simulation engine is inspected
- **THEN** `src/simulation/*` SHALL not import or reference Phaser

### Requirement: Static and subpath-safe
The system SHALL be deployable as a static site with no required Node.js runtime and no backend, including from a repository subpath, using relative URLs.

#### Scenario: Subpath deploy
- **WHEN** the app is served from a subpath (e.g., `/sdd_openspec_wator/muse_spark_1.2/`)
- **THEN** all asset and module URLs SHALL resolve relative to the app base and the app SHALL load correctly

### Requirement: Config constants
The system SHALL make grid dimensions, densities, breed times, shark energy values, colors, and speed options easy for programmers to change via code constants in `src/config.js`.

#### Scenario: Constants in config
- **WHEN** a programmer inspects `src/config.js`
- **THEN** it SHALL export constants for `GRID_WIDTH`, `GRID_HEIGHT`, `FISH_DENSITY`, `SHARK_DENSITY`, `FISH_BREED_TIME`, `SHARK_BREED_TIME`, `INITIAL_SHARK_ENERGY`, `SHARK_ENERGY_GAIN`, `SHARK_ENERGY_COST`, `SPEEDS`, `DEFAULT_SPEED`, and colors

### Requirement: JSDoc documentation
The system SHALL use JSDoc-style comments for every class and for every static method and public method longer than 8 lines.

#### Scenario: JSDoc coverage
- **WHEN** code is inspected
- **THEN** every class SHALL have a class-level JSDoc and every qualifying method SHALL have method JSDoc

### Requirement: PWA manifest and service worker with CDN caching
The system SHALL include a `manifest.webmanifest` and `sw.js` that cache the app shell and same-origin assets, and SHALL cache the CDN Phaser script so the app runs on a tablet after it loses network connectivity following first load.

#### Scenario: Offline after first load
- **WHEN** the app has been loaded once online and the tablet then loses network
- **THEN** the app SHALL still load and run from service worker cache, including Phaser

#### Scenario: Manifest present
- **WHEN** PWA support is inspected
- **THEN** `manifest.webmanifest` SHALL be present with `start_url`, `display`, and circle-based icons, and `sw.js` SHALL implement cache-first for shell and CDN

### Requirement: No build step
The system SHALL run with no build step, no TypeScript, no React, and no backend services.

#### Scenario: Static serve
- **WHEN** the project is served as static files
- **THEN** the app SHALL run without any build or server-side code
