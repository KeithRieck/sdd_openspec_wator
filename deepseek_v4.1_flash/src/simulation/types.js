/**
 * JSDoc typedefs for the simulation's cross-module contracts.
 *
 * These describe the duck-typed `world` seam from design D3: the set of
 * capabilities `WatorSimulation` exposes to entities during their action. This
 * module contains **types only** - it has no runtime exports, because ES2020
 * modules cannot resolve the circular import that a real `WatorSimulation`
 * reference inside `Fish`/`Shark` would create.
 *
 * @module simulation/types
 */

/**
 * The minimal view of the simulation that an entity may use during its turn.
 *
 * Entities depend on this contract rather than on the simulation class, so the
 * engine can be exercised with a stand-in implementation and no Phaser or
 * browser environment is required.
 *
 * @typedef {Object} World
 * @property {import('./RandomSource.js').default} rng - The single random
 *   source for the whole simulation (`world-model` §2.3).
 * @property {Object} config - Read-only model parameters; see the constants in
 *   `src/config.js` for `fishBreedTime`, `sharkBreedTime`,
 *   `initialSharkEnergy`, `sharkEnergyGain`, and `sharkEnergyCostPerChronon`.
 */

/**
 * Return the flat grid indices of the four orthogonally adjacent cells,
 * wrapping toroidally at every edge (`world-model` §1.2, §1.3).
 *
 * @callback NeighborsFn
 * @param {number} position - Flat index of the cell to inspect.
 * @returns {number[]} Exactly four indices: north, east, south, west.
 */

/**
 * Return the entity occupying a cell, or `null` when the cell is empty.
 *
 * @callback EntityAtFn
 * @param {number} position - Flat index of the cell to inspect.
 * @returns {import('./Entity.js').default|null} The occupant, or `null`.
 */

/**
 * Report whether a cell holds no entity.
 *
 * @callback IsEmptyFn
 * @param {number} position - Flat index of the cell to inspect.
 * @returns {boolean} True when the cell is empty.
 */

/**
 * Move an entity to a cell, keeping the grid array and the entity objects
 * consistent (`world-model` §3.2).
 *
 * @callback MoveFn
 * @param {import('./Entity.js').default} entity - The entity to move.
 * @param {number} position - Destination flat grid index.
 * @returns {void}
 */

/**
 * Remove an entity from the world and clear the cell it occupied
 * (`world-model` §3.3).
 *
 * @callback RemoveFn
 * @param {import('./Entity.js').default} entity - The entity to remove.
 * @returns {void}
 */

/**
 * Create a newborn entity of the given kind in a cell, assigning it a fresh
 * never-reused identifier (`world-model` §3.4, `chronon-rules` §2.3, §3.3).
 *
 * @callback SpawnFn
 * @param {number} position - Flat grid index the newborn occupies.
 * @param {string} kind - Either `fish` or `shark`; see `src/config.js`.
 * @returns {import('./Entity.js').default} The newborn entity.
 */

/**
 * Collect the actions an entity needs into a single object.
 *
 * The simulation builds one of these per chronon by binding its own methods;
 * it is what `Entity#act` actually receives. Kept as a distinct typedef so the
 * wiring in `WatorSimulation` can be type-checked against what entities expect.
 *
 * @typedef {Object} WorldCapabilities
 * @property {NeighborsFn} neighbors
 * @property {EntityAtFn} entityAt
 * @property {IsEmptyFn} isEmpty
 * @property {MoveFn} move
 * @property {RemoveFn} remove
 * @property {SpawnFn} spawn
 * @property {import('./RandomSource.js').default} rng
 * @property {Object} config
 */

/**
 * One population sample recorded at the end of a chronon
 * (`population-history` §1.1).
 *
 * @typedef {Object} PopulationSample
 * @property {number} chronon - Chronon number this sample was taken at.
 * @property {number} fish - Fish count at that chronon.
 * @property {number} sharks - Shark count at that chronon.
 */

export {};
