# pwa-static-deploy Specification

## Requirements

### Requirement: Static site deployment
The app SHALL be deployable as a static site with no build step, no backend, and no required Node.js runtime dependency, including deployment from a repository subpath.

#### Scenario: Static hosting
- **WHEN** the project files are served by any static file server
- **THEN** the app loads and runs without server-side code

#### Scenario: Subpath deployment
- **WHEN** the app is served from a repository subpath such as `/ox_alpha/`
- **THEN** all asset references resolve correctly relative to the subpath

### Requirement: CDN Phaser loading
WHEN `index.html` loads the app, THEN the system SHALL load Phaser version 4.x from a CDN script tag (https://cdn.jsdelivr.net/npm/phaser@4.1.0/dist/phaser.min.js) and SHALL load the application code through ES2020 JavaScript modules.

#### Scenario: Phaser script tag
- **WHEN** `index.html` is inspected
- **THEN** it contains a CDN script tag for Phaser 4.x and module scripts for the app entry point

### Requirement: PWA manifest and service worker
WHERE PWA support is implemented, THEN the system SHALL include a manifest (`manifest.webmanifest`) and service worker (`sw.js`) that cache the app shell and same-origin assets. Icon design SHALL show circles suggesting the shark and fish symbols.

#### Scenario: Installable app shell
- **WHEN** the app is loaded over HTTPS
- **THEN** the manifest and service worker are registered and same-origin assets are cached for offline reuse

### Requirement: Best-effort offline behavior
IF the CDN Phaser script has not already been successfully loaded and cached, THEN the system SHALL allow first-load or offline behavior to depend on network availability. No special real-time preservation or catch-up compensation behavior SHALL be implemented for hidden or throttled browser tabs.

#### Scenario: Offline without cached Phaser
- **WHEN** the app is opened offline before Phaser was ever cached
- **THEN** loading fails gracefully due to network unavailability, which is accepted behavior

#### Scenario: Throttled background tab
- **WHEN** the browser tab is hidden or throttled
- **THEN** the simulation continues without catch-up compensation when the tab becomes active again
