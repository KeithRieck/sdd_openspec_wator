import { Entity } from './Entity.js';

/** A green prey entity in the Wa-Tor model. */
export class Fish extends Entity {
  /** Create a fish with a model-only entity record. */
  constructor(id, position) {
    super(id, position, 'fish');
  }
}
