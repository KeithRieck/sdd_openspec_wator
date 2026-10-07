# Proposal

## Why

The project needs a browser-based Wa-Tor predator-prey simulation that demonstrates correct cellular automaton behavior. This provides an interactive, visual demonstration of ecosystem dynamics using Phaser 4 for rendering, with a clean separation between the simulation engine and the UI layer. The app will be deployable as a static site with PWA support.

## What Changes

- **New**: Create a complete Wa-Tor simulation web app with Phaser 4 rendering
- **New**: Implement object-oriented simulation engine with `Entity`, `Fish`, and `Shark` classes
- **New**: Create Phaser scenes for boot and simulation display
- **New**: Build Phaser-native UI components (stats panel, controls, speed selector, history chart)
- **New**: Add PWA support with manifest and service worker
- **New**: Create static `index.html` entry point loading Phaser from CDN
- **New**: Add configuration module with all simulation constants

## Capabilities

### New Capabilities
- `wator-simulation`: Core Wa-Tor simulation engine with toroidal grid, entity lifecycle, and chronon-based updates
- `wator-rendering`: Phaser-based rendering of the simulation world using Graphics objects
- `wator-ui`: Phaser-native UI components for stats, controls, speed selection, and population history
- `wator-pwa`: Progressive Web App support with manifest and service worker

### Modified Capabilities
- (none)

## Impact

- **New files**: `index.html`, `src/main.js`, `src/config.js`, `src/simulation/*.js`, `src/scenes/*.js`, `src/ui/*.js`, `manifest.webmanifest`, `sw.js`
- **Existing files**: `src/ui/PhaserButton.js` (already exists, will be used)
- **Assets**: `assets/icon-192.png`, `assets/icon-512.png` (already exist, will be referenced)
- **Dependencies**: Phaser 4.x loaded from CDN (https://cdn.jsdelivr.net/npm/phaser@4.1.0/dist/phaser.min.js)
- **No backend**: Static site only, no server-side code
- **No build step**: ES2020 modules loaded directly by browser
