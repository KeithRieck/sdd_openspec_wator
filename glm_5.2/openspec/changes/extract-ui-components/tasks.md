## 1. Entity polymorphic appearance

- [x] 1.1 Add abstract getters `color` and `radiusFactor` to `Entity` (throwing, mirroring `act()` and `canBreed()`), with JSDoc
- [x] 1.2 Override `color` and `radiusFactor` getters in `Fish` (return `COLORS.fish`, `FISH_RADIUS_FACTOR`), importing from `config.js`, with JSDoc
- [x] 1.3 Override `color` and `radiusFactor` getters in `Shark` (return `COLORS.shark`, `SHARK_RADIUS_FACTOR`), importing from `config.js`, with JSDoc

## 2. WatorWorld UI class

- [x] 2.1 Create `src/ui/WatorWorld.js` with class-level JSDoc describing it as the per-chronon world renderer (water background + fish/shark circles)
- [x] 2.2 Implement `constructor(scene, sim)` that stores references and creates `this.graphics = scene.add.graphics()`
- [x] 2.3 Implement `draw(x, y, w, h)` by moving the body of `SimulationScene.drawWorld()` verbatim, replacing the `'energy' in entity` branch with polymorphic reads of `entity.color` and `entity.radiusFactor` (no type checks, no branching)
- [x] 2.4 Implement `destroy()` that destroys the graphics object

## 3. StatsPanel UI class

- [x] 3.1 Create `src/ui/StatsPanel.js` with class-level JSDoc describing it as the per-chronon stats text renderer (Chronon, Fish, Sharks, Status)
- [x] 3.2 Implement `constructor(scene, sim)` that stores references and creates the four `Text` objects using the style currently in `SimulationScene._statsStyle()`
- [x] 3.3 Implement `draw()` by moving the body of `SimulationScene.drawStats()` verbatim (including the terminal-vs-running status display logic)
- [x] 3.4 Implement `layout(x, y, w, h)` by moving the body of `SimulationScene._layoutStats()` verbatim (positions the four text objects within the region)
- [x] 3.5 Implement `destroy()` that destroys all four text objects

## 4. SimulationScene refactor

- [x] 4.1 Add imports for `WatorWorld` and `StatsPanel`; remove now-unused imports (`COLORS`, `FISH_RADIUS_FACTOR`, `SHARK_RADIUS_FACTOR`, `STATUS` if no longer referenced after delegation)
- [x] 4.2 In `create()`, replace `this.worldGraphics = this.add.graphics()` and the `this.statsTexts = {...}` block with `this.world = new WatorWorld(this, this.sim)` and `this.statsPanel = new StatsPanel(this, this.sim)`
- [x] 4.3 Remove `_statsStyle()` (now internal to `StatsPanel`)
- [x] 4.4 Remove `drawWorld()` and `drawStats()` methods (now delegated)
- [x] 4.5 In `update()`, replace `this.drawWorld()` and `this.drawStats()` with `this.world.draw(this.worldRegion.x, this.worldRegion.y, this.worldRegion.w, this.worldRegion.h)` and `this.statsPanel.draw()`
- [x] 4.6 In `onStep()` and `onReset()`, replace direct `drawWorld()`/`drawStats()` calls with the same delegations
- [x] 4.7 In `_layoutStats()`, replace the body with a one-line delegation: `this.statsPanel.layout(x, y, w, h)`
- [x] 4.8 Rename `_drawChart()` to `drawChart()` and update all call sites in `update()` and `onStep()`
- [x] 4.9 Rename `_updateControlStates()` to `updateControlStates()` and update all call sites (`create()`, `update()`, `onPlayPause()`, `onStep()`, `onReset()`)
- [x] 4.10 Update the class-level JSDoc to reflect the new orchestrator role (delegates per-chronon drawing to `WatorWorld`, `StatsPanel`, `HistoryChart`)

## 5. Verification

- [ ] 5.1 Run the app and confirm the world, stats, chart, and buttons render identically to before the refactor
- [ ] 5.2 Confirm Play/Pause, Step, Reset, and all five speed buttons behave correctly
- [ ] 5.3 Confirm resize triggers re-layout and all components reposition correctly in both wide and narrow modes
- [ ] 5.4 Confirm extinction states (fish extinct, sharks extinct, ecosystem collapsed) display correctly in the stats panel and disable the right buttons
- [x] 5.5 Grep the codebase to confirm no remaining `'energy' in` duck-typing and no remaining `_drawChart` / `_updateControlStates` references
