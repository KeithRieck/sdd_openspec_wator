/** Base model record shared by fish and sharks. */
export class Entity {
  /** Create a model entity at a grid position. */
  constructor(id, position, type) {
    this.id = id;
    this.type = type;
    this.position = { x: position.x, y: position.y };
    this.breedAge = 0;
    this.alive = true;
  }

  /** Increase the number of chronons since the last reproduction. */
  ageBreedTimer() {
    this.breedAge += 1;
  }

  /** Mark this entity as removed from the world. */
  die() {
    this.alive = false;
  }

  /** Return whether this entity can reproduce at the given threshold. */
  isBreedReady(breedTime) {
    return this.breedAge >= breedTime;
  }
}
