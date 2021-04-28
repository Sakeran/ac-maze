"use strict";

const UnionFind = require("./UF");

const OOB_ERROR = (x, y) =>
  new Error(`Maze coordinate (${x}, ${y}) is invalid or out-of-bounds.`);

/**
 * Helper class for maze data. Meant to be associated with the construction and representation
 * of a single maze instance, it tracks the state of the maze as it is created, as well as the
 * connectedness of its tiles.
 */
class Maze {
  constructor(size) {
    this.size = size;

    this.keyFn = function (point) {
      return `${point[0]}-${point[1]}`;
    };

    // Initialize grid/union-find
    this.reset();
  }

  isInBounds(x, y) {
    return (
      typeof x === "number" &&
      typeof y === "number" &&
      x >= 0 &&
      x < this.size &&
      y >= 0 &&
      y < this.size
    );
  }

  /**
   * Resets the maze to blank.
   */
  reset() {
    this.grid = [];
    this.unionFind = new UnionFind(this.keyFn);

    // Also keep a randomized sequence of x/y pairs
    const pairSequence = [];

    for (let x = 0; x < this.size; x++) {
      this.grid.push([]);

      for (let y = 0; y < this.size; y++) {
        this.grid[x].push(false);
        this.unionFind.add([x, y]);
        pairSequence.push([x, y]);
      }
    }

    // Start/End coordinates of the maze, to be computed
    this.startCoord = null;
    this.endCoord = null;

    // Randomize sequence of every (x,y) pair.
    for (let i = pairSequence.length - 1; i > 0; i--) {
      const ridx = Math.floor(Math.random() * (i + 1));
      const p = pairSequence[i];
      pairSequence[i] = pairSequence[ridx];
      pairSequence[ridx] = p;
    }
    this.pairSequence = pairSequence;
  }

  // Point setters/getters

  getPointAt(x, y) {
    if (!this.isInBounds(x, y)) throw OOB_ERROR(x, y);

    return this.grid[x][y];
  }

  setPointAt(x, y) {
    if (!this.isInBounds(x, y)) throw OOB_ERROR(x, y);

    this.grid[x][y] = true;

    // If any adjacent tile is also set, merge the two components
    const adjacent = this.adjacentPoints(x, y);

    for (const point of adjacent) {
      if (this.getPointAt(...point)) {
        this.unionFind.merge([x, y], point);
      }
    }
  }

  clearPointAt(x, y) {
    if (!this.isInBounds(x, y)) throw OOB_ERROR(x, y);

    this.grid[x][y] = false;
  }

  adjacentPoints(x, y) {
    const points = [];

    // Up
    if (y > 0) points.push([x, y - 1]);

    // Down
    if (y < this.size - 1) points.push([x, y + 1]);

    // Left
    if (x > 0) points.push([x - 1, y]);

    // Right
    if (x < this.size - 1) points.push([x + 1, y]);

    return points;
  }

  // Maze Generation

  /**
   * Top-Level method for creating the maze.
   */
  create() {
    // Pick a maze with a high-ish number of connected components

    this.initMaze();

    while (this.unionFind.componentCount() < 550) {
      this.reset();

      this.initMaze();
    }

    // Clean up tiles unconnected to the start/end coordinates
    for (const pair of this.pairSequence) {
      if (
        this.getPointAt(...pair) &&
        !this.unionFind.hasSameGroup(this.startCoord, pair)
      ) {
        this.clearPointAt(...pair);
      }
    }
  }

  /**
   * Initializes the maze. Assumes the maze is blank.
   */
  initMaze() {
    // Pick a starting point at random.
    const startCoord = [
      Math.floor(Math.random() * this.size),
      Math.floor(Math.random() * this.size),
    ];

    // Pick an ending point which is at least (size / 3) away from the starting point
    // in either direction.
    const minDist = Math.floor(this.size / 3);

    let endCoord;
    while (true) {
      endCoord = [
        Math.floor(Math.random() * this.size),
        Math.floor(Math.random() * this.size),
      ];

      if (
        Math.abs(startCoord[0] - endCoord[0]) >= minDist &&
        Math.abs(startCoord[1] - endCoord[1]) >= minDist
      )
        break;
    }

    this.startCoord = startCoord;
    this.endCoord = endCoord;

    // Set tiles for the start/end points.
    this.setPointAt(...startCoord);
    this.setPointAt(...endCoord);

    // Continue until the start and end coordinates are merged
    // Using the randomized coordinate sequence, pick a random coordinate and "walk"
    // in a random direction until:
    // A boundary is hit, or
    // A drawn tile is hit
    // (Skips tiles already drawn on)
    for (let i = 0; i < this.pairSequence.length; i++) {
      const [x, y] = this.pairSequence[i];

      if (this.getPointAt(x, y)) continue;

      // Pick a random walk direction
      const rnd = Math.random();
      const walkLength = 1 + Math.floor(Math.random() * (this.size / 3));

      if (rnd < 0.25) {
        // Up
        this.drawWalk(x, y, 0, -1, walkLength);
      } else if (rnd < 0.5) {
        // Down
        this.drawWalk(x, y, 0, 1, walkLength);
      } else if (rnd < 0.75) {
        // Left
        this.drawWalk(x, y, -1, 0, walkLength);
      } else {
        // Right
        this.drawWalk(x, y, 1, 0, walkLength);
      }

      // Check if the start/end poitns are merged. If so, break
      if (this.unionFind.hasSameGroup(this.startCoord, this.endCoord)) {
        break;
      }
    }
  }

  /**
   * Draw a line from the position (x, y) extending 'length' number of steps, with
   * the x/y coordinates changing by dx and dy each step respectively. The walk will
   * stop before going out of bounds, or when it encounters an already-drawn tile.
   * @param {number} x
   * @param {number} y
   * @param {number} dx
   * @param {number} dy
   * @param {number} length
   */
  drawWalk(x, y, dx, dy, length) {
    let cx = x;
    let cy = y;

    while (length >= 0 && this.isInBounds(cx, cy) && !this.getPointAt(cx, cy)) {
      this.setPointAt(cx, cy);

      cx += dx;
      cy += dy;
      length -= 1;
    }
  }
}

module.exports = Maze;
