# Proposal: Full V1 Implementation

## Summary

Implement the complete Wa-Tor predator-prey simulation as a browser-based static web app using Phaser 4. This covers the simulation engine, Phaser rendering, stats display, controls, population history chart, and lightweight PWA support — satisfying all 57 acceptance criteria defined in `spec-v001.md`.

## Motivation

The project currently has a detailed specification but zero implementation code. This change delivers the first working version that can be deployed as a static site and verified against every acceptance criterion.

## What Changes

### New files
- `index.html` — entry point loading Phaser 4 from CDN and ES2020 modules
- `src/main.js` — Phaser game configuration and boot
- `src/config.js` — all simulation constants and rendering parameters
- `src/simulation/WatorSimulation.js` — framework-agnostic Wa-Tor engine
- `src/scenes/BootScene.js` — minimal boot/preload scene
- `src/scenes/SimulationScene.js` — main scene: world rendering, stats, controls, chart
- `sw.js` — service worker for PWA caching
- `manifest.webmanifest` — PWA manifest
- `assets/` — PWA icons

### Architecture boundaries
- Simulation engine (`WatorSimulation`) has zero Phaser dependencies
- `SimulationScene` owns the game loop, calls `sim.tick()`, and renders state
- All rendering uses Phaser `Graphics` — no sprites
- All controls are Phaser-native interactive graphics — no DOM overlays

## Scope

**In scope:** Full v1 implementation matching all 57 acceptance criteria with correct toroidal grid, entity turn ordering (randomized, newborn-skip, dead-skip), predator-prey rules, stats panel, speed/play/pause/step/reset controls, rolling population chart, responsive layout, and PWA shell.

**Out of scope:** Everything listed in the spec non-goals — no user-facing model parameter controls, no seeded RNG, no automated tests, no build tooling, no keyboard shortcuts, no world editing, no creature sprites, no movement animation, no chart labels.

## Risk

- Phaser 4 API surface may have undocumented behaviors; implementation targets the published CDN version
- No automated tests means verification is manual against acceptance criteria
- PWA offline support is best-effort since Phaser loads from CDN
