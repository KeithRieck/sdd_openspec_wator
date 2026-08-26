## Purpose

Defines the lightweight progressive web app support: a web manifest with icons and a service worker that caches the app shell and same-origin assets.

## ADDED Requirements

### Requirement: R1. Web manifest
The system SHALL include a web manifest that declares the app name and icons, with icon designs showing circles that suggest the shark and fish symbols.

#### Scenario: R1.1 Manifest present
- **WHEN** the app is loaded
- **THEN** a web manifest SHALL be available and reference the app icons

#### Scenario: R1.2 Icons
- **WHEN** the manifest is inspected
- **THEN** it SHALL reference icon assets whose designs show circles suggesting the shark and fish symbols

### Requirement: R2. Service worker caching
The system SHALL include a service worker that caches the app shell and same-origin assets.

#### Scenario: R2.1 App shell cached
- **WHEN** the app is first loaded
- **THEN** the service worker SHALL cache the app shell and same-origin assets

### Requirement: R3. CDN dependency behavior
The system SHALL allow first-load or offline behavior to depend on network availability when the CDN Phaser script has not already been successfully loaded and cached.

#### Scenario: R3.1 CDN not cached
- **IF** the CDN Phaser script has not already been successfully loaded and cached
- **THEN** first-load or offline behavior SHALL be allowed to depend on network availability
