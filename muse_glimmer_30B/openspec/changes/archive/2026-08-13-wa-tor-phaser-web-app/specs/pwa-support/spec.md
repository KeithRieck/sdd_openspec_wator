## ADDED Requirements

### Requirement: Manifest
The system SHALL include manifest.webmanifest for PWA installation.

#### Scenario: Manifest present
- **WHEN** app loads
- **THEN** manifest is served

### Requirement: Service worker
The system SHALL include sw.js that caches app shell and same-origin assets.

#### Scenario: Cache shell
- **WHEN** service worker installs
- **THEN** index.html, js modules, assets cached
