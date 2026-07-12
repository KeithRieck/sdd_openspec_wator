# PWA Shell Specification

## Purpose

Defines the Progressive Web App shell for Wa-Tor: web manifest, service worker app-shell caching, best-effort offline behavior for the CDN-loaded Phaser dependency, and PWA icon assets.

## Requirements

### Requirement: Web manifest
The system SHALL include a web manifest declaring the app as a PWA with a name, start URL, display mode, and icons.

#### Scenario: Manifest present
- **WHEN** the app is loaded
- **THEN** `manifest.webmanifest` SHALL be referenced from `index.html` and SHALL declare the app name, start URL, display mode, and icons

### Requirement: Service worker app-shell caching
The system SHALL include a service worker that caches the app shell and same-origin assets so the app loads from cache on subsequent visits.

#### Scenario: App shell cached
- **WHEN** the service worker installs
- **THEN** the app shell (index.html, JS modules, manifest, icons) and same-origin assets SHALL be cached for offline use

#### Scenario: Cached app loads offline
- **WHEN** the app is reopened after a successful first load and the network is unavailable
- **THEN** the cached app shell SHALL load from the service worker cache

### Requirement: CDN dependency best-effort offline
IF the CDN Phaser script has not already been successfully loaded and cached, the system SHALL allow first-load or offline behavior to depend on network availability.

#### Scenario: First load needs network
- **WHEN** the app is loaded for the first time with no cache
- **THEN** loading Phaser SHALL require network availability

#### Scenario: Phaser cached after first load
- **WHEN** Phaser has been successfully loaded and cached by the service worker
- **THEN** subsequent loads SHALL use the cached Phaser script

### Requirement: PWA icons
The system SHALL include icon assets in an `assets/` directory. Icons SHALL suggest the shark and fish symbols using circles.

#### Scenario: Icons present
- **WHEN** the app is packaged as a PWA
- **THEN** icon files SHALL exist in `assets/` and SHALL depict circles suggesting the shark and fish symbols
