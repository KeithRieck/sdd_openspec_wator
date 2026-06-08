## 1. Project Setup and PWA Scaffolding

- [x] 1.1 Create directory structure for assets and source files
- [x] 1.2 Generate circle-themed PWA icons (assets/icon-192.png, assets/icon-512.png)
- [x] 1.3 Create manifest.webmanifest defining PWA features and icons
- [x] 1.4 Create sw.js with caching rules for local assets and the Phaser 4.1.0 CDN script
- [x] 1.5 Create index.html loading Phaser from CDN, registering the service worker, and loading src/main.js

## 2. Configuration & Simulation Engine

- [x] 2.1 Create src/config.js containing constants for colors, speeds, densities, breed ages, and energy values
- [x] 2.2 Create src/simulation/WatorSimulation.js defining class structures for WatorEntity, WatorFish, WatorShark, and WatorSimulation
- [x] 2.3 Implement grid initialization using a flat 1D array of size 7000 (100x70) populated with random densities
- [x] 2.4 Implement simulation tick logic with ID gathering, random turn ordering, and survival checks
- [x] 2.5 Implement fish action: orthogonal movements, toroidal wrapping, and reproduction
- [x] 2.6 Implement shark action: energy loss, starvation removal, hunting movement, empty movement, and reproduction
- [x] 2.7 Implement extinction detection (Sharks extinct, Fish extinct, Ecosystem collapsed) and reset state API

## 3. Phaser Scenes and Startup

- [x] 3.1 Create src/main.js configuring Phaser scale settings, physics, and registering scene sequence
- [x] 3.2 Create src/scenes/BootScene.js handling startup and transitioning directly to SimulationScene

## 4. UI rendering, Controls, and Chart

- [x] 4.1 Create src/scenes/SimulationScene.js setting up UI layout regions (Stats, Grid, Controls, Chart)
- [x] 4.2 Implement handleResize to compute scales and coordinates for Landscape vs Portrait views dynamically
- [x] 4.3 Implement grid rendering by clearing and drawing green/blue circles on a single Phaser Graphics object
- [x] 4.4 Implement Phaser-native interactive buttons for speed selections (1x, 5x, 10x, 30x, 60x) and state controls (Play/Pause, Step, Reset)
- [x] 4.5 Implement rolling population history chart rendering via Phaser Graphics (last 500 samples, dynamic scaling)
- [x] 4.6 Connect Phaser update delta accumulator to drive simulation ticks according to selected speed

## 5. Verification

- [x] 5.1 Verify Wa-Tor behavior rules (energy, reproduction, toroidal wrapping, extinction states)
- [x] 5.2 Verify layout reflow under resizing and portrait dimensions
- [x] 5.3 Verify offline caching by loading the application via local server with disabled network
