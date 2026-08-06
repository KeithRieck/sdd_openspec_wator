## ADDED Requirements

### Requirement: PWA Manifest and Service Worker
The system SHALL include a `manifest.webmanifest` and `sw.js` (service worker) that cache the app shell and same-origin assets.

#### Scenario: PWA Installation
- **WHEN** the app is loaded in a compatible browser
- **THEN** the browser detects the manifest and allows "Add to Home Screen".

### Requirement: Offline Capability
The system SHALL use the service worker to ensure the app shell and assets are available offline.

#### Scenario: Offline load
- **WHEN** the user opens the app without internet connection
- **THEN** the app shell loads from the service worker cache.

### Requirement: CDN Phaser Loading
The system SHALL allow first-load or offline behavior to depend on network availability if the CDN Phaser script has not been cached.

#### Scenario: First load offline
- **WHEN** the user opens the app for the first time without internet
- **THEN** the app fails to load because Phaser is hosted on a CDN.
