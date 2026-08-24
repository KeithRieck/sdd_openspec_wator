/**
 * Flat toroidal grid plus the living-entity map.
 *
 * Species classes mutate occupancy only through this façade.
 * wator-simulation requirements 1, 3, and 10.
 */
export default class WatorWorld {
    /**
     * @param {number} width - Column count.
     * @param {number} height - Row count.
     */
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.grid = new Array(width * height).fill(null);
        this.entities = new Map();
        this.nextEntityId = 1;
    }

    /**
     * Allocate the next occupant identity.
     *
     * @returns {number}
     */
    createId() {
        const id = this.nextEntityId;
        this.nextEntityId += 1;
        return id;
    }

    /**
     * Flat-array index for a cell.
     *
     * @param {number} x - Column.
     * @param {number} y - Row.
     * @returns {number}
     */
    index(x, y) {
        return y * this.width + x;
    }

    /**
     * Wrap a coordinate onto the torus. wator-simulation requirement 1.
     *
     * @param {number} x - Column, possibly outside the board.
     * @param {number} y - Row, possibly outside the board.
     * @returns {{x: number, y: number}}
     */
    wrap(x, y) {
        const width = this.width;
        const height = this.height;
        return {
            x: ((x % width) + width) % width,
            y: ((y % height) + height) % height
        };
    }

    /**
     * Occupant at a cell, or null for empty water.
     *
     * @param {number} x - Column.
     * @param {number} y - Row.
     * @returns {import('./Entity.js').default|null}
     */
    get(x, y) {
        return this.grid[this.index(x, y)];
    }

    /**
     * Orthogonal wrapped neighbors. wator-simulation requirement 3.
     *
     * @param {number} x - Column.
     * @param {number} y - Row.
     * @returns {{x: number, y: number}[]}
     */
    neighbors(x, y) {
        return [
            this.wrap(x, y - 1),
            this.wrap(x + 1, y),
            this.wrap(x, y + 1),
            this.wrap(x - 1, y)
        ];
    }

    /**
     * Adjacent empty cells.
     *
     * @param {number} x - Column.
     * @param {number} y - Row.
     * @returns {{x: number, y: number}[]}
     */
    emptyNeighbors(x, y) {
        return this.neighbors(x, y).filter((cell) => this.get(cell.x, cell.y) === null);
    }

    /**
     * Adjacent cells occupied by fish.
     *
     * @param {number} x - Column.
     * @param {number} y - Row.
     * @returns {{x: number, y: number}[]}
     */
    fishNeighbors(x, y) {
        return this.neighbors(x, y).filter((cell) => {
            const occupant = this.get(cell.x, cell.y);
            return occupant !== null && occupant.type === 'fish';
        });
    }

    /**
     * Choose one cell at random, or null when the list is empty.
     *
     * @param {{x: number, y: number}[]} cells - Candidate destinations.
     * @returns {{x: number, y: number}|null}
     */
    pick(cells) {
        if (cells.length === 0) {
            return null;
        }
        return cells[Math.floor(Math.random() * cells.length)];
    }

    /**
     * Place an already-constructed occupant.
     *
     * @param {import('./Entity.js').default} entity - Occupant to insert.
     */
    spawn(entity) {
        this.entities.set(entity.id, entity);
        this.grid[this.index(entity.x, entity.y)] = entity;
    }

    /**
     * Move an occupant to an empty or just-cleared cell.
     *
     * @param {import('./Entity.js').default} entity - Occupant to move.
     * @param {number} x - Destination column.
     * @param {number} y - Destination row.
     */
    move(entity, x, y) {
        this.grid[this.index(entity.x, entity.y)] = null;
        entity.x = x;
        entity.y = y;
        this.grid[this.index(x, y)] = entity;
    }

    /**
     * Remove an occupant from the grid and the identity map.
     *
     * @param {import('./Entity.js').default} entity - Occupant to delete.
     */
    remove(entity) {
        const current = this.grid[this.index(entity.x, entity.y)];
        if (current === entity) {
            this.grid[this.index(entity.x, entity.y)] = null;
        }
        this.entities.delete(entity.id);
    }
}
