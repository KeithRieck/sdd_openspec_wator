## ADDED Requirements

### Requirement: PWA Support
The system SHALL be installable as a Progressive Web App.

#### Scenario: Manifest Installation
- **WHEN** the app is loaded in a compatible browser
- **THEN** the system SHALL provide a `manifest.webmanifest` file for installation.

#### Scenario: Offline Access
- **WHEN** the app is loaded
- **THEN** the system SHALL register a service worker (`sw.js`) to cache essential assets for offline use.
