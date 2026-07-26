## ADDED Requirements

### Requirement: PWA manifest
The system SHALL include a web manifest file (manifest.webmanifest) for PWA support.

#### Scenario: Manifest file exists
- **WHEN** the app is deployed
- **THEN** a manifest.webmanifest file SHALL be present in the project root

### Requirement: Service worker for caching
The system SHALL include a service worker (sw.js) that caches the app shell and same-origin assets.

#### Scenario: Service worker caches app shell
- **WHEN** the service worker is installed
- **THEN** it SHALL cache index.html, all JavaScript modules, and same-origin assets

### Requirement: PWA icon assets
The system SHALL include icon assets in the assets/ directory, with icon design showing circles suggesting the shark and fish symbols.

#### Scenario: PWA icons present
- **WHEN** the app is deployed
- **THEN** the assets/ directory SHALL contain PWA icon files with a design featuring circles suggesting shark and fish symbols

### Requirement: CDN dependency handling
If the CDN Phaser script has not already been successfully loaded and cached, the system SHALL allow first-load or offline behavior to depend on network availability.

#### Scenario: First load requires network for Phaser
- **WHEN** the app is loaded for the first time with no cached assets
- **THEN** the app SHALL depend on network availability to load the Phaser CDN script

#### Scenario: Subsequent loads may use cache
- **WHEN** the app is loaded after a successful first load
- **THEN** the service worker SHALL serve cached assets, though Phaser CDN availability depends on browser cache behavior
