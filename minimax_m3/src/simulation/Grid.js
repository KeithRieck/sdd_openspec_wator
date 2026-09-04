/**
 * Toroidal grid that owns the 2D cell array and the bookkeeping for placing,
 * removing, and locating entities by id. The grid is intentionally ignorant
 * of entity types — it stores opaque references with an id field and lets
 * the simulation engine drive behavior.
 *
 * Coordinates are integer (x, y) pairs in the range [0, width) x [0, height).
 * Edges wrap: moving north from y=0 lands on y=height-1, etc.
 */
export default class Grid {
    /**
     * Create a grid of the given dimensions. The grid is empty until
     * `place()` is called.
     *
     * @param {number} width - Number of columns.
     * @param {number} height - Number of rows.
     */
    constructor(width, height) {
        this.width = width;
        this.height = height;
        /** @type {Array<Array<object|null>>} Flat 2D array indexed as [x][y]. */
        this.cells = new Array(width);
        for (let x = 0; x < width; x++) {
            this.cells[x] = new Array(height).fill(null);
        }
    }

    /**
     * Return the entity at the given cell, or null if empty.
     *
     * @param {number} x - Column.
     * @param {number} y - Row.
     * @returns {object|null} The entity in the cell, or null.
     */
    cellAt(x, y) {
        return this.cells[x][y];
    }

    /**
     * Place an entity into the given cell. Overwrites any existing entity
     * in that cell without warning — callers are expected to have removed
     * the previous occupant first if they need that behavior.
     *
     * @param {object} entity - Entity to place; must have an id field.
     * @param {number} x - Target column.
     * @param {number} y - Target row.
     */
    place(entity, x, y) {
        this.cells[x][y] = entity;
        entity.x = x;
        entity.y = y;
    }

    /**
     * Remove an entity from the grid by reference. No-op if the entity is
     * not currently placed (or its cell has already been overwritten).
     *
     * @param {object} entity - Entity to remove.
     */
    remove(entity) {
        const current = this.cells[entity.x][entity.y];
        if (current === entity) {
            this.cells[entity.x][entity.y] = null;
        }
    }

    /**
     * Return the four orthogonal neighbor coordinates of the given cell,
     * wrapping toroidally at all four edges.
     *
     * @param {number} x - Column.
     * @param {number} y - Row.
     * @returns {Array<{x:number,y:number}>} Always exactly four entries.
     */
    orthogonalNeighbors(x, y) {
        const w = this.width;
        const h = this.height;
        return [
            { x: (x + 1) % w, y },
            { x: (x - 1 + w) % w, y },
            { x, y: (y + 1) % h },
            { x, y: (y - 1 + h) % h }
        ];
    }

    /**
     * Locate the entity with the given id, scanning every cell. Used during
     * the chronon iteration to resolve snapshot ids back to live references
     * after shuffling. O(width * height); acceptable for the 100x70 grid.
     *
     * @param {number} id - Entity id to find.
     * @returns {object|null} The entity, or null if not found.
     */
    findById(id) {
        for (let x = 0; x < this.width; x++) {
            const col = this.cells[x];
            for (let y = 0; y < this.height; y++) {
                const e = col[y];
                if (e && e.id === id) {
                    return e;
                }
            }
        }
        return null;
    }
}
