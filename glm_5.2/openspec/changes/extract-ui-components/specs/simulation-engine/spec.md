## ADDED Requirements

### Requirement: Entity render-time appearance is polymorphic
Each `Entity` subclass SHALL expose its render-time appearance — `color` and `radiusFactor` — as polymorphic properties (getters) on the entity itself. The abstract `Entity` base class SHALL declare `color` and `radiusFactor` as abstract (throwing when accessed directly, mirroring the existing `act()` and `canBreed()` pattern). `Fish` SHALL return its color and radius factor; `Shark` SHALL return its color and radius factor. Renderers SHALL draw entities by reading these properties and SHALL NOT inspect entity type, fields, or use `instanceof` to determine appearance.

#### Scenario: Fish exposes appearance
- **WHEN** a `Fish` instance's `color` and `radiusFactor` are read
- **THEN** `color` SHALL return the fish color constant and `radiusFactor` SHALL return the fish radius factor constant from `src/config.js`

#### Scenario: Shark exposes appearance
- **WHEN** a `Shark` instance's `color` and `radiusFactor` are read
- **THEN** `color` SHALL return the shark color constant and `radiusFactor` SHALL return the shark radius factor constant from `src/config.js`

#### Scenario: Base Entity appearance is abstract
- **WHEN** `color` or `radiusFactor` is accessed on a bare `Entity` instance
- **THEN** the access SHALL throw an error indicating the property must be overridden by a subclass

#### Scenario: Renderer uses polymorphism
- **WHEN** the world is rendered
- **THEN** the renderer SHALL read `entity.color` and `entity.radiusFactor` for each entity and SHALL NOT use `'energy' in entity`, `instanceof`, or any other type-discrimination check to determine appearance
