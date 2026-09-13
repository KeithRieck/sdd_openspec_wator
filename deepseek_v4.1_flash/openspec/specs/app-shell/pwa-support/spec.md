# app-shell/pwa-support Specification

## Purpose

Defines the lightweight progressive-web-app support: a web app manifest using the project's existing icon assets, and a service worker that caches the app shell and same-origin assets.

## Requirements

### Requirement: 1 Web app manifest

The system SHALL provide a web app manifest and SHALL reference the project's existing icon files in the `assets/` directory.

#### Scenario: 1.1 Manifest is provided and linked

- **WHEN** `index.html` loads the app
- **THEN** the system links a web app manifest

#### Scenario: 1.2 Manifest uses the existing icon assets

- **WHEN** the manifest is inspected
- **THEN** it references the existing `assets/icon-192.png` and `assets/icon-512.png` files

#### Scenario: 1.3 Manifest declares installable app metadata

- **WHEN** the manifest is inspected
- **THEN** it declares at least the app name, start URL, display mode, and the icon entries needed for installation

#### Scenario: 1.4 Icon references resolve from a subpath

- **WHEN** the app is served from a repository subpath
- **THEN** the manifest's icon and start URL references resolve correctly

### Requirement: 2 Service worker caching

The system SHALL include a service worker that caches the app shell and same-origin assets.

#### Scenario: 2.1 Service worker is registered

- **WHEN** the app loads
- **THEN** the system registers the service worker

#### Scenario: 2.2 App shell is cached

- **WHEN** the service worker installs
- **THEN** it caches the app shell, including the HTML entry point and the application scripts and styles needed to start

#### Scenario: 2.3 Same-origin assets are cached

- **WHEN** the service worker installs
- **THEN** it caches the same-origin assets, including the manifest and the icon files under `assets/`

#### Scenario: 2.4 Service worker scope matches the deployed subpath

- **WHEN** the app is served from a repository subpath
- **THEN** the service worker is registered with a scope that covers the app location

#### Scenario: 2.5 Offline behavior is best-effort for the CDN dependency

- **WHEN** the CDN-hosted Phaser script is unavailable and has not been cached
- **THEN** the system allows the app to fail to start rather than implementing special fallback behavior

#### Scenario: 2.6 Cross-origin requests are not required for the app to start offline

- **WHEN** the app has been loaded once and is reopened offline
- **THEN** the service worker serves the cached app shell and same-origin assets rather than failing on them
