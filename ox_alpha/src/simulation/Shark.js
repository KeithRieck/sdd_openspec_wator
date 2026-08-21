/**
 * @file Shark entity class for the Wa-Tor simulation.
 */

import { Entity } from './Entity.js';
import { SIM } from '../config.js';

/**
 * Numeric type code identifying shark entities.
 *
 * @constant {number}
 */
export const SHARK_TYPE = 2;

/**
 * A shark: the predator species of the Wa-Tor world.
 *
 * Each chronon a shark first loses energy (AC 18) and dies immediately
 * at zero before moving or eating (AC 19). Surviving sharks prefer to
 * move onto an adjacent fish, devouring it and gaining energy
 * (AC 20-21); otherwise they drift to a random adjacent empty cell
 * (AC 22). Breeding follows the shared {@link Entity} rules (AC 23-26);
 * newborn sharks start with {@link SIM.initialSharkEnergy} energy (AC 24).
 */
export class Shark extends Entity {
  /**
   * Creates a shark.
   *
   * @param {number} id Unique entity ID.
   * @param {number} pos Flat grid index of the shark's cell.
   * @param {number} breedTime Chronons before the shark may breed.
   * @param {number} [energy=SIM.initialSharkEnergy] Starting energy.
   * @param {boolean} [bornThisChronon=false] True when born this chronon.
   */
  constructor(id, pos, breedTime, energy = SIM.initialSharkEnergy, bornThisChronon = false) {
    super(id, pos, breedTime, bornThisChronon);
    /** @type {number} Current energy; the shark dies at zero (AC 19). */
    this.energy = energy;
  }

  /**
   * Returns the shark type code.
   *
   * @returns {number} The {@link SHARK_TYPE} constant.
   */
  get type() {
    return SHARK_TYPE;
  }

  /**
   * Drains one unit of energy before any movement or eating (AC 18).
   * A shark reaching zero energy dies immediately without moving or
   * eating (AC 19).
   *
   * @param {import('./WatorSimulation.js').WatorSimulation} sim Owning simulation.
   * @returns {boolean} False when the shark starved, true otherwise.
   */
  preAct(sim) {
    this.energy -= SIM.sharkEnergyCostPerChronon;
    if (this.energy <= 0) {
      sim.removeEntity(this);
      return false;
    }
    return true;
  }

  /**
   * Selects a random adjacent fish cell when one exists (AC 20);
   * otherwise a random adjacent empty cell (AC 22); otherwise stays put.
   *
   * @param {import('./WatorSimulation.js').WatorSimulation} sim Owning simulation.
   * @returns {number} Flat grid index of the destination cell.
   */
  selectDestination(sim) {
    const fishCells = sim.fishNeighbors(this.pos);
    if (fishCells.length > 0) {
      return fishCells[Math.floor(Math.random() * fishCells.length)];
    }
    const empties = sim.emptyNeighbors(this.pos);
    if (empties.length === 0) {
      return this.pos;
    }
    return empties[Math.floor(Math.random() * empties.length)];
  }

  /**
   * Devours the fish occupying the destination cell and gains energy
   * (AC 21). Only invoked after a successful move.
   *
   * @param {import('./WatorSimulation.js').WatorSimulation} sim Owning simulation.
   * @param {number} _oldPos Flat grid index of the cell moved from (unused).
   * @returns {void}
   */
  afterMove(sim, _oldPos) {
    if (sim.consumeAt(this.pos)) {
      this.energy += SIM.sharkEnergyGain;
    }
  }
}
