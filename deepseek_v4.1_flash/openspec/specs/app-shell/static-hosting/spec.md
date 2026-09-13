# app-shell/static-hosting Specification

## Purpose

Defines how the app loads and runs as a static site: the HTML entry point, the CDN Phaser dependency, ES2020 module loading, the file organization, and deployment from a repository subpath.

## Requirements

### Requirement: 1 Static entry point and module loading

The system SHALL load Phaser version 4.x from a CDN script tag in `index.html` and SHALL load the application through ES2020 JavaScript modules.

#### Scenario: 1.1 Phaser loads from a CDN script tag

- **WHEN** `index.html` loads the app
- **THEN** the system loads Phaser version 4.x from a CDN script tag rather than from a bundled local copy

#### Scenario: 1.2 The app loads as ES2020 modules

- **WHEN** `index.html` loads the app
- **THEN** the system loads the application code through ES2020 JavaScript modules

#### Scenario: 1.3 No build step or backend is required

- **WHEN** the app is served from a static host
- **THEN** the system runs without any build step, package install, or backend service

#### Scenario: 1.4 First load may depend on the network

- **WHEN** the CDN Phaser script has not already been successfully loaded and cached
- **THEN** the system allows first-load or offline behavior to depend on network availability

### Requirement: 2 Project file organization

The system SHALL provide `index.html`, `src/main.js`, `src/config.js`, `src/simulation/WatorSimulation.js`, `src/scenes/BootScene.js`, `src/scenes/SimulationScene.js`, `sw.js`, `manifest.webmanifest`, and an `assets/` directory for PWA assets, and MAY provide a `src/ui` directory for on-screen elements and UI helper classes.

#### Scenario: 2.1 Required files are present

- **WHEN** the project files are inspected
- **THEN** the system includes `index.html`, `src/main.js`, `src/config.js`, `src/simulation/WatorSimulation.js`, `src/scenes/BootScene.js`, `src/scenes/SimulationScene.js`, `sw.js`, `manifest.webmanifest`, and an `assets/` directory

#### Scenario: 2.2 UI helpers may live in a ui directory

- **WHEN** on-screen elements and UI helper classes are organized
- **THEN** the system may place them in a `src/ui` directory

### Requirement: 3 Immediate start

The system SHALL start directly in a running Wa-Tor simulation with no landing page or instruction screen.

#### Scenario: 3.1 The app starts running

- **WHEN** the app launches
- **THEN** the system starts directly in a running Wa-Tor simulation at `10x` speed

#### Scenario: 3.2 No landing page is shown

- **WHEN** the app launches
- **THEN** the system shows no landing page or instruction screen before the simulation

### Requirement: 4 Engine independence from Phaser

The system SHALL keep all Wa-Tor rules independent from Phaser APIs and Phaser scene objects, and SHALL render and control the entire app window through Phaser-native scene rendering and input.

#### Scenario: 4.1 Simulation rules do not depend on Phaser

- **WHEN** the simulation rules are implemented
- **THEN** the system keeps them independent of Phaser APIs and Phaser scene objects

#### Scenario: 4.2 The window is owned by Phaser

- **WHEN** the app is rendered
- **THEN** the system renders and controls the entire app window through Phaser-native scene rendering and input

#### Scenario: 4.3 No DOM controls are layered over Phaser

- **WHEN** the UI is built
- **THEN** the system adds no HTML or DOM controls layered over the Phaser display

### Requirement: 5 Subpath deployment

The system SHALL remain deployable as a static site from a repository subpath, with all application asset references resolving relative to the deployed location.

#### Scenario: 5.1 Assets resolve from a subpath

- **WHEN** the app is served from a repository subpath rather than the domain root
- **THEN** the system loads all of its scripts, manifest, service worker, and assets successfully

### Requirement: 6 Programmer-modifiable constants

The system SHALL make grid dimensions, densities, breed times, shark energy values, colors, and speed options easy for a programmer to change through code constants.

#### Scenario: 6.1 Model parameters are code constants

- **WHEN** a programmer inspects the configuration code
- **THEN** the grid dimensions, densities, breed times, shark energy values, colors, and speed options are defined as code constants that can be edited in one place

#### Scenario: 6.2 No settings UI is required to change model parameters

- **WHEN** a programmer changes a model parameter constant
- **THEN** the change takes effect without requiring any settings control in the UI
