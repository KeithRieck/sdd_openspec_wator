/**
 * Toroidal grid helper backed by a flat array.
 */
export default class Grid {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.cells = new Array(width * height).fill(null);
  }

  index(x, y) {
    const wx = ((x % this.width) + this.width) % this.width;
    const wy = ((y % this.height) + this.height) % this.height;
    return wy * this.width + wx;
  }

  coords(index) {
    const x = index % this.width;
    const y = Math.floor(index / this.width);
    return { x, y };
  }

  getCell(x, y) {
    return this.cells[this.index(x, y)];
  }

  setCell(x, y, value) {
    this.cells[this.index(x, y)] = value;
  }

  neighbors4(x, y) {
    return [
      { x: x, y: y - 1 },
      { x: x + 1, y: y },
      { x: x, y: y + 1 },
      { x: x - 1, y: y }
    ].map(({ x, y }) => ({
      x: ((x % this.width) + this.width) % this.width,
      y: ((y % this.height) + this.height) % this.height
    }));
  }

  clear() {
    this.cells.fill(null);
  }
}
