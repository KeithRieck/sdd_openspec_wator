## 1. Entity polymorphic appearance

- [ ] 1.1 Add abstract getters `color` and `radiusFactor` to `Entity` (throwing, mirroring `act()` and `canBreed()`), with JSDoc
- [ ] 1.2 Override `color` and `radiusFactor` getters in `Fish` (return `COLORS.fish`, `FISH_RADIUS_FACTOR`), importing from `config.js`, with JSDoc
- [ ] 1.3 Override `color` and `radiusFactor` getters in `Shark` (return `COLORS.shark`, `SHARK_RADIUS_FACTOR`), importing from `config.js`, with JSDoc

## 2. WatorWorld UI class

- [ ] 2.1 Create `src/ui/WatorWorld.js` with class-level JSDoc describing it as the per-chronon world renderer (water background + fish/shark circles)
- [ ] 2.2 Implement `constructor(scene, sim)` that stores references and creates `this.graphics = scene.add.graphics()`
- [ ] 2.3 Implement `draw(x, y, w, h)` by moving the body of `SimulationScene.drawWorld()` verbatim, replacing the `'energy' in entity` branch with polymorphic reads of `entity.color` and `entity.radiusFactor` (no type checks, no branching)
- [ ] 2.4 Implement `destroy()` that destroys the graphics object

## 3. StatsPanel UI class

- [ ] 3.1 Create `src/ui/StatsPanel.js` with class-level JSDoc describing it as the per-chronon stats text renderer (Chronon, Fish, Sharks, Status)
- [ ] 3.2 Implement `constructor(scene, sim)` that stores references and creates the four `Text` objects using the style currently in `SimulationScene._statsStyle()`
- [ ] 3.3 Implement `draw()` by moving the body of `SimulationScene.drawStats()` verbatim (including the terminal-vs-running status display logic)
- [ ] 3.4 Implement `layout(x, y, w, h)` by moving the body of `SimulationScene._layoutStats()` verbatim (positions the four text objects within the region)
- [ ] 3.5 Implement `destroy()` that destroys all four text objects

## 4. SimulationScene refactor

- [ ] 4.1 Add imports for `WatorWorld` and `StatsPanel`; remove now-unused imports (`COLORS`, `FISH_RADIUS_FACTOR`, `SHARK_RADIUS_FACTOR`, `STATUS` if no longer referenced after delegation)
- [ ] 4.2 In `create()`, replace `this.worldGraphics = this.add.graphics()` and the `this.statsTexts = {...}` block with `this.world = new WatorWorld(this, this.sim)` and `this.statsPanel = new StatsPanel(this, this.sim)`
- [ ] 4.3 Remove `_statsStyle()` (now internal to `StatsPanel`)
- [ ] 4.4 Remove `drawWorld()` and `drawStats()` methods (now delegated)
- [ ] 4.5 In `update()`, replace `this.drawWorld()` and `this.drawStats()` with `this.world.draw(this.worldRegion.x, this.worldRegion.y, this.worldRegion.w, this.worldRegion.h)` and `this.statsPanel.draw()`
- [ ] 4.6 In `onStep()` and `onReset()`, replace direct `drawWorld()`/`drawStats()` calls with the same delegations
- [ ] 4.7 In `_layoutStats()`, replace the body with a one-line delegation: `this.statsPanel.layout(x, y, w, h)`
- [ ] 4.8 Rename `_drawChart()` to `drawChart()` and update all call sites in `update()` and `onStep()`
- [ ] 4.9 Rename `_updateControlStates()` to `updateControlStates()` and update all call sites (`create()`, `update()`, `onPlayPause()`, `onStep()`, `onReset()`)
- [ ] 4.10 Update the class-level JSDoc to reflect the new orchestrator role (delegates per-chronon drawing to `WatorWorld`, `StatsPanel`, `HistoryChart`)

## 5. Verification

- [ ] 5.1 Run the app and confirm the world, stats, chart, and buttons render identically to before the refactor
- [ ] 5.2 Confirm Play/Pause, Step, Reset, and all five speed buttons behave correctly
- [ ] 5.3 Confirm resize triggers re-layout and all components reposition correctly in both wide and narrow modes
- [ ] 5.4 Confirm extinction states (fish extinct, sharks extinct, ecosystem collapsed) display correctly in the stats panel and disable the right buttons
- [ ] 5.5 Grep the codebase to confirm no remaining `'energy' in` duck-typing and no remaining `_drawChart` / `_updateControlStates` references
