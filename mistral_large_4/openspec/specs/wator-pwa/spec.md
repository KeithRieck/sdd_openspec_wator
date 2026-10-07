# Wator PWA Specification

## Purpose

Provides lightweight Progressive Web App support with a web manifest and service worker that cache the app shell and same-origin assets, enabling installability and offline capability after first load.

## Requirements

### Requirement: Web App Manifest
The system SHALL include a manifest.webmanifest file that defines the app's name, icons, display mode, and theme colors.

#### Scenario: Manifest file exists
- **WHEN** the app is deployed
- **THEN** the system includes a valid manifest.webmanifest file

#### Scenario: Manifest references icons
- **WHEN** the manifest is loaded
- **THEN** the manifest references the icon files in the assets directory (icon-192.png and icon-512.png)

#### Scenario: Manifest display mode
- **WHEN** the manifest is loaded
- **THEN** the manifest specifies standalone display mode for app-like experience

### Requirement: Service Worker
The system SHALL include a service worker (sw.js) that caches the app shell and same-origin assets.

#### Scenario: Service worker registered
- **WHEN** the app loads
- **THEN** the system registers the service worker from sw.js

#### Scenario: App shell cached
- **WHEN** the service worker installs
- **THEN** the service worker caches index.html and all same-origin JavaScript modules and assets

#### Scenario: Assets cached
- **WHEN** the service worker installs
- **THEN** the service worker caches the PWA icon files from the assets directory

### Requirement: CDN Dependency Handling
The system SHALL allow first-load or offline behavior to depend on network availability for the CDN-hosted Phaser script.

#### Scenario: First load requires network
- **WHEN** the app is loaded for the first time and Phaser has not been cached
- **THEN** the system requires network access to load Phaser from the CDN

#### Scenario: Subsequent loads may work offline
- **WHEN** the app is loaded after the service worker has cached assets
- **THEN** the system may function offline if Phaser was previously cached

### Requirement: PWA Icons
The system SHALL use the image files under the assets directory (icon-192.png and icon-512.png) as PWA icons.

#### Scenario: Icons referenced in manifest
- **WHEN** the manifest is loaded
- **THEN** the manifest references assets/icon-192.png and assets/icon-512.png with appropriate sizes

#### Scenario: Icon design
- **WHEN** the icons are displayed
- **THEN** the icons show circles suggesting shark and fish symbols

### Requirement: Static Site Deployment
The system SHALL be deployable as a static site, including from a repository subpath.

#### Scenario: Subpath deployment
- **WHEN** the app is deployed to a repository subpath (e.g., /repo-name/)
- **THEN** the system functions correctly with relative paths for all assets

### Requirement: Minimum Viewport Support
The system SHALL support minimum tablet CSS viewport dimensions of 744 x 1133 CSS pixels (iPad mini).

#### Scenario: Tablet viewport supported
- **WHEN** the app is viewed on a device with 744 x 1133 CSS pixel viewport
- **THEN** the system displays a usable, reflowed layout
