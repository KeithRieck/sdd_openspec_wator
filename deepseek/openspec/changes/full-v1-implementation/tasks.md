# Tasks: Full V1 Implementation

## Task Order

Tasks are ordered by dependency. Each builds on the previous.

---

### 1. Create `src/config.js` — Simulation and Rendering Constants

**Depends on:** Nothing

Export all configurable constants from a single module:
- Grid dimensions: `GRID_W = 100`, `GRID_H = 70`
- Densities: `FISH_DENSITY = 0.30`, `SHARK_DENSITY = 0.05`
- Breed times: `FISH_BREED_TIME = 3`, `SHARK_BREED_TIME = 25`
- Shark energy: `INITIAL_SHARK_ENERGY = 5`, `SHARK_ENERGY_GAIN = 3`, `SHARK_ENERGY_COST = 1`
- Speed options: `SPEEDS = [1, 5, 10, 30, 60]`, `DEFAULT_SPEED = 10`
- Colors: fish green `0x00cc66`, shark blue `0x3366ff`, water dark `0x0a0a2e`, UI background, text colors, button colors, chart colors
- Pixels: cell radius ratios, chart height ratio, stats font size, button dimensions, padding/margin values
- History window: `HISTORY_WINDOW = 500`

**Verification:** File exports all constants. Values match `spec-v001.md`.

---

### 2. Create `src/simulation/WatorSimulation.js` — Core Simulation Engine

**Depends on:** Task 1 (config.js)

Implement the framework-agnostic Wa-Tor engine as a class:
- `constructor(config)` — initialize grid (`Int32Array`), entity map, chronon counter
- `initGrid()` — allocate flat grid, populate randomly using densities
- `populateRandom()` — fill grid with fish and sharks at configured densities, no overlap
- `tick()` — one chronon: shuffle entity IDs, iterate, skip dead/newborn, dispatch to processFish/processShark
- `processFish(id, entity)` — movement, breeding logic per AC #14–#17
- `processShark(id, entity)` — energy decrement, eating, movement, breeding per AC #18–#26
- `getNeighbors(x, y)` — orthogonal neighbors with toroidal wrap (AC #10)
- `moveEntity(id, entity, nx, ny)` — update grid and entity position
- `removeEntity(id)` — clear grid cell, delete from entity map
- `spawnEntity(type, x, y, energy?)` — create entity, place on grid, mark bornThisChronon
- `reset()` — reinitialize grid and entities, zero chronon
- `getStats()` — return { chronon, fish, sharks, status }
- `getGrid()` / `getEntities()` — read accessors for rendering

Entity record shape: `{ id, type: "fish"|"shark", x, y, breedAge, energy? }`

Tick return value includes counters: `{ fishBorn, fishDied, sharksBorn, sharksDied, sharksStarved, fishEaten }`

No Phaser imports. Uses only `Math.random()`.

**Verification:** Can instantiate, call tick(), observe entity movement and state changes through getGrid() and getStats().

---

### 3. Create `src/scenes/BootScene.js` — Minimal Boot Scene

**Depends on:** Nothing (Phaser-only, no simulation)

Extend `Phaser.Scene` with key `"BootScene"`:
- `preload()` — no assets to load (all rendering is procedural Graphics)
- `create()` — transition immediately to `"SimulationScene"` via `this.scene.start("SimulationScene")`

**Verification:** Game boots without error, SimulationScene receives control.

---

### 4. Create `src/scenes/SimulationScene.js` — World Rendering

**Depends on:** Tasks 1, 2, 3

Extend `Phaser.Scene` with key `"SimulationScene"`:
- `create()` — instantiate `WatorSimulation`, compute layout dimensions, create Graphics objects for world and chart, start at running state with default speed
- `createLayout()` — compute positions for stats panel, world area, controls panel, chart area based on viewport
- `createWorldDisplay()` — add Graphics object for the world grid area
- `renderWorld()` — clear and redraw: water background fill, then iterate all entities, draw fish as green circles and sharks as blue (slightly larger) circles at their grid positions
- `update(time, delta)` — accumulate delta time, advance simulation by appropriate number of chronons based on speed, re-render

Cell size: `cellSize = floor(min(availableWorldWidth / GRID_W, availableWorldHeight / GRID_H))`

**Verification:** Grid renders. Fish and sharks visible as colored circles moving each chronon.

---

### 5. Add Stats Panel to SimulationScene

**Depends on:** Task 4

Add to `createLayout()`:
- Stats text area on left side showing: Chronon number, Fish count, Sharks count, Status text
- `renderStats()` — update text each frame after tick

Phaser `Text` objects with fixed positions. Status shows: `"Running"`, `"Paused"`, `"Sharks extinct"`, `"Fish extinct"`, `"Ecosystem collapsed"`.

**Verification:** Stats panel visible, values update each chronon, status reflects simulation state.

---

### 6. Add Controls to SimulationScene

**Depends on:** Task 5

Add to `createLayout()` and `createControls()`:
- **Speed row** (horizontal): 5 buttons for `1x`, `5x`, `10x`, `30x`, `60x` — highlight selected speed
- **Action buttons** (vertical): Play/Pause, Step, Reset — each on its own row

Button rendering:
- Use `Graphics` to draw rounded rectangles with text overlay
- Set interactive zones on each button
- On pointerover: tint lighter; on pointerout: restore; on pointerdown: handle action

Control logic:
- **Play/Pause**: toggle `isRunning` flag, update button text, disable Step when running
- **Step**: advance exactly one chronon (only when paused), check extinction after step
- **Reset**: call `sim.reset()`, clear history, resume running
- **Speed buttons**: update `speed` multiplier, do not resume if paused

When terminal (extinction): disable Play/Pause, disable Step, disable speed buttons. Only Reset works.

**Verification:** All buttons clickable, Play/Pause toggles correctly, Step advances one chronon when paused, Reset creates new world, speed changes take effect, terminal state locks controls.

---

### 7. Add Population History Chart

**Depends on:** Task 5

Add to SimulationScene:
- `historyData` array — rolling window of `{ chronon, fish, sharks }` up to 500 entries
- `recordHistory()` — push current pop counts after each chronon, shift oldest if > 500
- `createChart()` — Graphics object positioned across bottom of window
- `renderChart()` — clear and draw two polyline paths (fish green, shark blue) spanning the chart area

Chart rendering:
- X axis: chronon index (0 to historyData.length-1) mapped to chart width
- Y axis: population count (0 to max ever seen in window) mapped to chart height, or relative max within window
- No titles, labels, or axes rendered (AC #47)

**Verification:** Chart renders across bottom, lines grow and scroll as simulation runs, colors match fish/shark colors.

---

### 8. Implement Responsive Layout and Extinction Handling

**Depends on:** Tasks 4, 5, 6, 7

**Responsive reflow:**
- Listen for Phaser `resize` event (`this.scale.on("resize", ...)`)
- `reflowLayout()` — recompute all layout positions and scaling
- World maintains aspect ratio; stats, controls, and chart reposition
- On narrow screens (< ~900px viewport width): stack vertically (stats top → world middle → controls below world → chart bottom)

**Extinction handling:**
- After each tick (or step), call `checkExtinction()`
- If `fish == 0 && sharks == 0`: set status `"collapsed"`, auto-pause
- If `fish == 0 && sharks > 0`: set status `"fishExtinct"`, auto-pause
- If `sharks == 0 && fish > 0`: set status `"sharksExtinct"`, auto-pause
- Terminal state: disable Play/Pause, disable Step, disable speed buttons

**Verification:** Resizing browser reflows layout correctly. When an extinction condition is met, simulation auto-pauses and terminal status displays. Controls locked except Reset.

---

### 9. Create PWA Files

**Depends on:** Nothing (independent)

**`manifest.webmanifest`:**
- name: "Wa-Tor Simulation"
- short_name: "Wa-Tor"
- start_url matching deployment path
- display: standalone
- icons: reference to PNG icons in assets/

**`sw.js`:**
- Cache name with version
- Install: cache index.html, src/, assets/, manifest
- Fetch: cache-first for same-origin, network-only for CDN
- Activate: clean old caches

**`assets/`:**
- Generate simple PNG icons (192x192, 512x512) — abstract circles suggesting fish (green) and shark (blue) on dark background

**Verification:** Manifest referenced in index.html, service worker registered, icons load, offline caching works (best-effort for CDN resources).

---

### 10. Create `index.html` and `src/main.js` — Entry Point

**Depends on:** All prior tasks

**`index.html`:**
- Minimal HTML5 boilerplate
- Meta viewport for mobile scaling
- `<link rel="manifest">` to manifest.webmanifest
- `<link rel="icon">` to icon
- `<script src="phaser CDN">` — load Phaser 4.1.0 from jsdelivr
- `<script type="module" src="src/main.js">` — load app
- Register service worker from inline script or sw.js
- Dark background `<body>` to match Phaser canvas

**`src/main.js`:**
- `new Phaser.Game({...})` configuration:
  - `type: Phaser.AUTO`
  - `parent: document.body`
  - `backgroundColor: '#0a0a2e'`
  - `scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH }`
  - `scene: [BootScene, SimulationScene]`
- No game width/height — scale manager handles sizing

**Verification:** Open index.html in browser → Phaser loads → Wa-Tor simulation starts at 10x speed. All 57 acceptance criteria passable.

---

### 11. Final Verification and Polish

**Depends on:** All tasks

- Walk through all 57 acceptance criteria in `spec-v001.md`
- Verify grid wrapping (toroidal) visually and through behavior
- Verify entity turn ordering (newborns don't act, dead entities skipped)
- Verify extinction auto-pause and terminal status display
- Verify all speed settings work correctly
- Verify chart rolls properly (500 chronon window)
- Verify responsive layout on narrow viewport
- Verify PWA offline behavior (best-effort)
- Ensure all JSDoc comments present per AGENTS.md requirements
