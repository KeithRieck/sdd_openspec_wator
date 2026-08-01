import { Entity } from './Entity.js';

/** A blue predator entity with starvation energy. */
export class Shark extends Entity {
  /** Create a shark with its configured initial energy. */
  constructor(id, position, initialEnergy) {
    super(id, position, 'shark');
    this.energy = initialEnergy;
  }
}
