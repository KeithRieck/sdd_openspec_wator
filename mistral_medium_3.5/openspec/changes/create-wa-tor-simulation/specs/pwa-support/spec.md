## ADDED Requirements

### Requirement: Manifest File
The system SHALL include a manifest.webmanifest file for PWA support.

#### Scenario: Manifest file exists
- **WHEN** the app is deployed
- **THEN** the system SHALL include a manifest.webmanifest file at the root

### Requirement: Service Worker
The system SHALL include a sw.js service worker that caches the app shell and same-origin assets.

#### Scenario: Service worker caches app shell
- **WHEN** the app loads
- **THEN** the system SHALL register a service worker
- **AND** the service worker SHALL cache the app shell

#### Scenario: Service worker caches same-origin assets
- **WHEN** the app loads
- **THEN** the service worker SHALL cache same-origin assets

### Requirement: Icon Design
The system SHALL use an icon design that shows circles suggesting the shark and fish symbols.

#### Scenario: Icon shows shark and fish circles
- **WHEN** the app is installed as a PWA
- **THEN** the system SHALL display an icon with circles suggesting shark and fish symbols

### Requirement: CDN Fallback Behavior
If the CDN Phaser script has not already been successfully loaded and cached, the system SHALL allow first-load or offline behavior to depend on network availability.

#### Scenario: First load requires network
- **WHEN** the app is loaded for the first time
- **AND** Phaser has not been cached
- **THEN** the system SHALL require network availability to load Phaser from CDN

#### Scenario: Offline behavior depends on cache
- **WHEN** the app is loaded offline
- **THEN** the system SHALL work if Phaser is cached
- **AND** the system SHALL fail if Phaser is not cached

### Requirement: Static Site Deployment
The system SHALL be deployable as a static site, including from a repository subpath.

#### Scenario: Deployable from subpath
- **WHEN** the app is deployed from a repository subpath
- **THEN** the system SHALL load and run correctly
- **AND** all relative paths SHALL resolve correctly
