# Spec: app-shell (delta, new capability)

## ADDED Requirements

### Requirement: AS-R1 Project structure
The project SHALL include `index.html`, `src/main.js`, `src/config.js`, `src/simulation/WatorSimulation.js`, `src/scenes/BootScene.js`, `src/scenes/SimulationScene.js`, `sw.js`, `manifest.webmanifest`, and an `assets/` directory for PWA assets; a `src/ui` directory MAY exist for on-screen elements and UI helper classes (PRD AC 2).

#### Scenario: AS-R1.1 Required files present
- **WHEN** the repository tree is inspected
- **THEN** all listed files SHALL exist at the specified paths

### Requirement: AS-R2 Phaser loading and modules
`index.html` SHALL load Phaser version 4.x from a CDN script tag and SHALL load the app through ES2020 JavaScript modules (PRD AC 3).

#### Scenario: AS-R2.1 CDN and module loading
- **WHEN** `index.html` is inspected
- **THEN** a CDN script tag for Phaser 4.x SHALL be present and the app entry SHALL use `type="module"`

### Requirement: AS-R3 Static-site deployment
The app SHALL be deployable as a static site with no build step and no backend, including from a repository subpath (PRD Goals; AC 2).

#### Scenario: AS-R3.1 Subpath deployment
- **WHEN** the app is served from a subpath such as `/repo/index.html`
- **THEN** all asset references SHALL resolve correctly using relative paths

### Requirement: AS-R4 Configurable constants
Code constants SHALL make grid dimensions, densities, breed times, shark energy values, colors, and speed options easy for programmers to change in one place (PRD AC 53).

#### Scenario: AS-R4.1 Single config module
- **WHEN** a programmer wants to change a model parameter
- **THEN** the change SHALL be possible by editing only `src/config.js`

### Requirement: AS-R5 Responsive layout modes
On a wide window the layout SHALL show stats on the left, world in the center, controls on the right, and the history chart across the bottom; on a tablet or narrow window the layout SHALL reflow to world full-width on top, stats left and controls right below it, and the chart full-width at the bottom, while preserving world aspect ratio and keeping all controls usable (PRD AC 51, 52).

#### Scenario: AS-R5.1 Wide layout
- **WHEN** the window is wide enough for the wide layout
- **THEN** stats, world, controls, and bottom chart SHALL appear in the wide arrangement

#### Scenario: AS-R5.2 Narrow layout at tablet size
- **WHEN** the viewport is 744x1133 CSS pixels (iPad mini)
- **THEN** the world SHALL be full-width with preserved aspect ratio, stats left and controls right below, chart at bottom, and all controls usable

### Requirement: AS-R6 Documentation comments
Every class SHALL have a JSDoc documentation comment; every static method and every public method longer than 8 lines SHALL have a JSDoc documentation comment (PRD AC 54, 55).

#### Scenario: AS-R6.1 JSDoc coverage
- **WHEN** source files are inspected
- **THEN** all classes and all qualifying methods SHALL have JSDoc comments

### Requirement: AS-R7 PWA manifest and icons
The app SHALL include a web app manifest with icons showing circles suggesting the shark and fish symbols (PRD AC 56, Assumptions).

#### Scenario: AS-R7.1 Manifest present
- **WHEN** `manifest.webmanifest` is inspected
- **THEN** it SHALL reference circle-motif icons in `assets/`

### Requirement: AS-R8 Service worker caching
A service worker SHALL cache the app shell and same-origin assets; if the CDN Phaser script has not already been successfully loaded and cached, first-load or offline behavior MAY depend on network availability (PRD AC 56, 57).

#### Scenario: AS-R8.1 Shell caching
- **WHEN** the app has loaded once with network available
- **THEN** the service worker SHALL serve the app shell and same-origin assets on subsequent loads

#### Scenario: AS-R8.2 CDN dependency acknowledged
- **WHEN** the app loads offline without a previously cached Phaser script
- **THEN** the behavior MAY fail gracefully and SHALL NOT be treated as a defect
