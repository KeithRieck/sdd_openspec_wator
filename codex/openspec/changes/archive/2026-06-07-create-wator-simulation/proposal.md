## Why

The project needs a complete static browser app that turns the Wa-Tor predator-prey automaton into an observable, controllable simulation. The source spec defines the desired Phaser 4 experience and simulation rules, but the OpenSpec proposal, design, capability spec, and implementation tasks are not yet present.

## What Changes

- Create a Phaser 4 web app that starts directly in a running Wa-Tor simulation.
- Implement a framework-independent simulation engine for fish and shark movement, breeding, eating, starvation, toroidal wrapping, and terminal extinction states.
- Render the entire app window through Phaser-native graphics and input, including the world, stats, controls, and population history chart.
- Add static-site friendly project files, lightweight PWA support, and programmer-editable constants for model and display settings.
- Omit build tooling, backend services, DOM controls, seeded random support, keyboard shortcuts, world editing, sprites, grid lines, and movement animation.

## Capabilities

### New Capabilities
- `wator-simulation`: Covers the static Phaser Wa-Tor app, framework-independent simulation rules, rendering, controls, history chart, layout behavior, and lightweight PWA shell.

### Modified Capabilities

## Impact

- Adds static web app entry files, ES2020 source modules, Phaser scenes, simulation engine modules, PWA files, and asset placeholders.
- Depends on Phaser 4.x loaded from a CDN script tag at runtime.
- Keeps the shipped runtime free of required Node.js tooling, backend services, and server-side APIs.
