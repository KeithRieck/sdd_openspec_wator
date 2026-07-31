# Wa-Tor Phaser Web App Implementation

## What

Implement a browser-based [Wa-Tor](https://en.wikipedia.org/wiki/Wa-Tor) predator-prey cellular automaton simulation using Phaser 4.x.

## Why

The Wa-Tor simulation demonstrates classic predator-prey dynamics with emergent behavior patterns. This implementation emphasizes:

- **Correct simulation behavior**: Accurate implementation of Wa-Tor rules
- **Object-oriented design**: Entity base class with Fish and Shark subclasses
- **Performance**: Efficient processing of ~2,450 entities on 100×70 grid
- **User experience**: Immediate visual feedback with play/pause controls
- **Educational value**: Visual demonstration of ecological dynamics

## Scope

### Included

- **Simulation Engine**: Pure JavaScript implementation independent of Phaser
- **Phaser Integration**: Graphics-based rendering using Phaser 4.x from CDN
- **UI Components**:
  - Three-column layout (left stats, middle canvas, right controls+chart)
  - Play/pause, single-step, reset controls
  - Speed controls (1x, 5x, 10x, 30x, 60x)
  - Population statistics display
  - Population history chart (rolling 100 chronons)
- **Entity System**:
  - Entity base class
  - Fish class extending Entity
  - Shark class extending Entity
  - EntityManager for entity lifecycle
- **File Structure**:
  - `index.html` - HTML entry point with Phaser CDN
  - `src/config.js` - Configuration constants
  - `src/Entity.js` - Base Entity class
  - `src/Fish.js` - Fish entity implementation
  - `src/Shark.js` - Shark entity implementation
  - `src/EntityManager.js` - Entity lifecycle management
  - `src/WatorSimulation.js` - Core simulation engine
  - `src/scenes/BootScene.js` - Phaser boot scene
  - `src/scenes/SimulationScene.js` - Main Phaser scene
  - `src/main.js` - Application entry point
  - `sw.js` - Service worker for PWA support
  - `manifest.webmanifest` - PWA manifest
  - `assets/` - PWA icons and assets

### Excluded (Non-Goals from PRD)

- No user-facing controls for grid dimensions or simulation parameters
- No seeded random number support
- No automated tests or build tooling
- No keyboard shortcuts
- No world editing or cell inspection
- No debug console API
- No creature sprite art beyond simple circles
- No grid lines
- No movement interpolation
- No title/label text on history chart

## Success Criteria

1. **Simulation Correctness**:
   - Fish move to empty adjacent cells randomly
   - Sharks hunt fish when available, otherwise move to empty cells
   - Breeding occurs after specified chronons
   - Shark energy management works correctly
   - Toroidal grid wrapping functions properly

2. **Performance**:
   - Simulation runs smoothly at 60x speed on 100×70 grid
   - No lag or stuttering during rendering
   - Population history chart updates in real-time

3. **User Interface**:
   - Three-column layout matches specification exactly
   - Controls are responsive and intuitive
   - Population statistics update correctly
   - Population chart displays accurate history
   - Visual design uses specified colors and sizing

4. **Code Quality**:
   - Object-oriented design with proper class hierarchy
   - JSDoc documentation for all classes and public methods
   - Separation of concerns (simulation vs rendering vs UI)
   - No Phaser dependencies in simulation engine
   - Clean, maintainable code structure

5. **Deployment**:
   - Static site deployable from any web server
   - Phaser loaded from CDN
   - PWA support with basic offline caching
   - No Node.js dependencies required for runtime

## Technical Approach

### Architecture

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                            Wa-Tor Simulation System                          │
├───────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────────┐  │
│  │   Config.js     │    │  WatorSimulation│    │   SimulationScene.js   │  │
│  │ (Constants &   │    │     (Core        │    │  (Phaser Scene that    │  │
│  │  Defaults)      │    │    Simulation   │    │   renders simulation)  │  │
│  └─────────────────┘    └────────────┬────────┘    └────────────┬────────────┘  │
│           │                      │                           │               │
│           └──────────────────────┼───────────────────────────┘               │
│                                    │                                         │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────────┐  │
│  │   Entity.js     │    │   Fish.js       │    │   Shark.js              │  │
│  │ (Base class)    │    │ (Extends Entity)│    │ (Extends Entity)        │  │
│  └────────────┬────────┘    └─────────────────┘    └─────────────────────────┘  │
│           │                                                                   │
└───────────┼─────────────────────────────────────────────────────────────────┘
            │
    ┌───────▼───────┐
    │ EntityManager │
    │ (Handles all  │
    │  entity logic)│
    └───────────────┘
```

### Key Components

1. **Entity Base Class**: Provides common lifecycle management and abstract methods
2. **Fish Class**: Implements fish-specific movement and breeding logic
3. **Shark Class**: Implements shark-specific energy management, hunting, and breeding
4. **EntityManager**: Handles spatial queries, entity lifecycle, and population statistics
5. **WatorSimulation**: Core simulation engine that orchestrates entity processing
6. **SimulationScene**: Phaser scene that renders simulation and handles UI controls

### Wa-Tor Rules Implementation

**Fish Rules:**
- Move to random empty adjacent cell (N, E, S, W with toroidal wrapping)
- Breed after `fishBreedTime` chronons (default: 3)
- Infinite energy (doesn't starve)

**Shark Rules:**
- Lose 1 energy per chronon
- Hunt fish when available (gain `sharkEnergyGain` energy)
- Move to empty cell if no fish available
- Breed after `sharkBreedTime` chronons (default: 25)
- Die when energy reaches 0
- Newborn sharks start with `initialSharkEnergy` (default: 5)

**Grid:**
- Toroidal (wrapping edges)
- Default: 100 columns × 70 rows
- Orthogonal movement only (no diagonals)

### UI Layout

```
┌──────────────────────────────────────────────────────────────────────────┐
│                     Wa-Tor Simulation                                    │
│                                                                          │
│  ┌─────────────┐    ┌───────────────────────────────┐  ┌─────────────┐   │
│  │ Statistics  │    │         Simulation Canvas     │  │ Controls    │   │
│  │  (Left)     │    │                               │  │  (Right)    │   │
│  ├─────────────┤    │  [Grid of Fish and Sharks]    │  ├─────────────┤   │
│  │             │    │                               │  │ Speed: 10x  │   │
│  │ Fish: 125   │    │                               │  │ Pause       │   │
│  │ Sharks: 25  │    │                               │  │ Step        │   │
│  │ Chronon: 42 │    │                               │  │ Reset       │   │
│  └─────────────┘    └───────────────────────────────┘  └─────────────┘   │
│                                                                          │
│   ┌─────────────────────────────────────────────────────────────────┐    │
│   │         Population Chart                                        │    │
│   │                                                                 │    │
│   │  [Line chart: Fish (green) and                                  │    │
│   │   Sharks (blue) over time]                                      │    │
│   └─────────────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────────────┘
```

### Performance Considerations

- **Entity Processing**: Randomized order each chronon to prevent bias
- **Grid Representation**: 2D array for spatial queries, Map for O(1) lookups
- **Rendering**: Single Graphics object, redraw entire canvas each chronon
- **Speed Control**: Process multiple chronons per frame based on speed setting
- **Population Tracking**: Maintain separate counts for performance

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Performance issues at 60x speed | Optimize entity processing, use efficient data structures |
| Simulation instability | Thorough testing of edge cases (edge wrapping, breeding, energy management) |
| UI layout issues on mobile | Responsive design with fixed column widths |
| Phaser version compatibility | Use Phaser 4.1.0 from CDN as specified |
| Code complexity | Strict separation of concerns, clear documentation |

## Dependencies

- **Phaser 4.1.0**: Loaded from CDN (`https://cdn.jsdelivr.net/npm/phaser@4.1.0/dist/phaser.min.js`)
- **ES2020 Modules**: Used throughout for clean code organization
- **No Build Step**: Pure static site deployable anywhere

## Out of Scope

- Backend services or server-side code
- TypeScript or build tooling
- Automated testing framework
- User authentication or accounts
- Grid dimension customization UI
- Simulation parameter customization UI
- Advanced PWA features beyond basic offline caching

## Future Enhancements (Not in this change)

- Seeded random number generator for reproducible simulations
- Additional entity types (e.g., different fish species)
- Grid editing/painting tools
- Simulation parameter customization
- Save/load simulation state
- Multiplayer or collaborative features
- Advanced charting and data export
- Theming or customization options

## Success Metrics

- Simulation runs correctly according to Wa-Tor rules
- UI layout matches specification exactly
- Performance acceptable at all speed settings
- Code quality meets standards (JSDoc, OOP design)
- Static site deploys successfully to any web server
- Population dynamics show expected predator-prey cycles

## Rollback Plan

If issues arise:
1. Revert to previous commit
2. Disable problematic features (e.g., speed > 10x)
3. Simplify simulation parameters temporarily
4. Use simpler grid size for debugging

## Related Documents

- [prd-v001.md](../prd-v001.md) - Detailed product requirements
- [design.md](design.md) - Detailed design decisions
- [tasks.md](tasks.md) - Implementation tasks