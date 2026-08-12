/**
 * Base entity class for Wa-Tor simulation
 * @class Entity
 */
export class Entity {
    #id;
    #type;
    #x;
    #y;
    #breedAge;
    #isAlive;
    #bornThisChronon;

    /**
     * Create an entity
     * @param {number} id - Unique identifier
     * @param {string} type - Entity type
     * @param {number} x - X position
     * @param {number} y - Y position
     */
    constructor(id, type, x, y) {
        this.#id = id;
        this.#type = type;
        this.#x = x;
        this.#y = y;
        this.#breedAge = 0;
        this.#isAlive = true;
        this.#bornThisChronon = false;
    }

    getId() { return this.#id; }
    getType() { return this.#type; }
    getX() { return this.#x; }
    getY() { return this.#y; }
    getBreedAge() { return this.#breedAge; }
    isAlive() { return this.#isAlive; }
    isBornThisChronon() { return this.#bornThisChronon; }

    setPosition(x, y) {
        this.#x = x;
        this.#y = y;
    }

    ageOneChronon() {
        if (this.#isAlive) {
            this.#breedAge++;
        }
    }

    canBreed(breedTime) {
        return this.#breedAge >= breedTime;
    }

    resetBreedAge() {
        this.#breedAge = 0;
    }

    markBornThisChronon() {
        this.#bornThisChronon = true;
    }

    clearBornFlag() {
        this.#bornThisChronon = false;
    }

    kill() {
        this.#isAlive = false;
    }

    /**
     * Act method to be overridden by subclasses
     * @abstract
     */
    act(sim) {
        throw new Error('act must be implemented by subclass');
    }
}
