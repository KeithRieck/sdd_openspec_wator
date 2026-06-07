---
name: phaser-game
description: Use this skill when creating a new Phaser game or working on this repository's Phaser-based browser game, including feature work, bug fixes, refactors, and small gameplay experiments.
---

# Phaser Game

Use this skill when the task involves the Phaser game in this repository.

## Repository intent

This project is a small browser game with no build step and no backend.

Keep changes aligned with these goals:

- Run entirely in the browser.
- Stay deployable as a static site such as GitHub Pages.
- Preserve installable/offline-capable PWA behavior.
- Prefer simple ES module code over extra tooling.

## Runtime constraints

- Do not add server-side code, SSR, APIs, databases, or a required backend service.
- Do not introduce React or a frontend framework unless the user explicitly asks for a migration.
- Do not require Node.js in the shipped runtime. Development tooling is acceptable only if the user asks for it.
- Assume the app may be served from a repository subpath, so prefer relative URLs for app assets and service worker registration.

## Phaser compatibility

- Treat Phaser version compatibility as a real risk in this repo.
- Verify that any Phaser API you use is compatible with the version already loaded by the app before rewriting working code around a different major version.
- Prefer targeted fixes over sweeping framework upgrades.
- If a requested change would be much simpler with a Phaser version change, call that out explicitly before making the migration.

## Project structure

The current app uses plain browser ES modules with a lightweight structure:

- `index.html` bootstraps the app.
- `src/main.js` creates the Phaser game and registers the service worker.
- `src/scenes/` contains scene classes.
- `src/game/` contains reusable game object classes.
- `assets/` contains icons for the PWA application.
- `sw.js` and `manifest.webmanifest` provide PWA behavior.

Preserve this structure unless the user asks for a larger reorganization.

## Scene guidance

- Every Phaser game should have a `BootScene`.
- `BootScene` must be the first scene loaded by the game.
- `BootScene` should load the assets needed before gameplay begins.
- The last action in `BootScene.create()` should be to start the first game scene.
- Additional scenes are acceptable when the game needs them, but keep the overall scene flow easy to follow.

## Game object design

- Continue the repository's object-oriented style for reusable moving entities.
- When appropriate, put behavior on game object classes instead of growing one large scene file.
- Preserve the existing pattern where shared moving-object behavior lives in base classes such as `Bouncer`, and concrete entities such as `Circle` extend them.
- When adding new entities, make the inheritance story clear and minimal.

## PWA expectations

- Keep the manifest, service worker, and registration working.
- Declare icons in the manifest.
- Cache the application shell and core assets needed for repeat loads and offline use.
- Avoid changes that silently break offline behavior, especially URL/path changes.
- Prefer project-local assets when practical. If an external dependency is necessary, make sure the offline story is still reasonable.

## Implementation style

- Prefer small, readable modules over abstraction-heavy patterns.
- Use browser-native features and plain ES2020 JavaScript.
- Avoid adding a build system, package manager requirement, or code generation step unless the user explicitly wants that tradeoff.
- Keep tablet and mobile browser behavior in mind when changing layout, sizing, or input handling.

## Change strategy

- For small requests, modify the existing scene/object structure instead of regenerating the project.
- Preserve working behavior unless the task requires a gameplay change.
- When fixing bugs, check whether the issue comes from Phaser-version assumptions, resize behavior, physics setup, or service worker pathing before doing larger rewrites.
