# Proposal: Wa-Tor Phaser Web App

## Overview

A browser-based Wa-Tor predator-prey cellular automaton simulation built as a static ES2020 JavaScript web app using Phaser 4.x for rendering and input. The simulation engine is framework-independent and must not depend on Phaser.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      index.html                              │
│  Phaser CDN + ES2020 module loader + PWA manifest + sw.js    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Phaser Game (BootScene → SimulationScene)  │
│  - Full-window Phaser-native rendering                       │
│  - Graphics-based world rendering (no sprites)               │
│  - Custom PhaserButton UI components                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              Simulation Engine (framework-independent)       │
│  WatorSimulation → Grid → Entity → Fish/Shark              │
│  - Toroidal grid with flat array + entity objects            │
│  - Simultaneous chronon updates                              │
│  - Single RNG for all random choices                         │
└─────────────────────────────────────────────────────────────┘
```

## Key Design Decisions

1. **Simulation engine decoupled from Phaser**: All Wa-Tor rules live in `src/simulation/`, testable without Phaser.
2. **Flat grid array + entity objects**: One slot per cell (entity ID or `empty` marker), plus entity objects carrying ID, position, breed age, and (for sharks) energy.
3. **Simultaneous updates**: Collect all actions from the current state, then apply all changes at once. Newborns and deaths are deferred until the next chronon.
4. **Single RNG**: One random-number generator serves the entire simulation (initialization, movement, turn-order shuffling).
5. **Phaser Graphics only**: No Phaser Sprites. All rendering uses Phaser `Graphics` drawing primitives.
6. **Phaser-native UI**: All controls (buttons, stats, chart) are Phaser `Graphics` + `Text`, no DOM overlays.
7. **Static-site friendly**: CDN Phaser, ES2020 modules, no build step, no backend.

## File Structure

```
index.html
src/
  main.js          — Entry point, Phaser game config
  config.js        — All tunable constants
  simulation/
    WatorSimulation.js   — Orchestrates chronons, stats, history
    Grid.js              — Toroidal grid, neighbor lookup, cell access
    Entity.js            — Base class (position, breed age, breeding readiness)
    Fish.js              — Fish behavior
    Shark.js             — Shark behavior
  scenes/
    BootScene.js         — Preload, layout setup
    SimulationScene.js   — World render, controls, stats, chart
  ui/
    PhaserButton.js      — Reusable button component
sw.js
manifest.webmanifest
assets/
  icon-192.png
  icon-512.png
```

## Requirements Coverage

All 61 acceptance criteria from `prd-v001.md` are addressed in the spec artifact.
