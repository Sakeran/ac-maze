function drawMaze(state) {
  const ctx = state.mazeCanvas.getContext("2d");

  const maze = state.maze;
  const [startX, startY] = maze.startCoord;
  const [endX, endY] = maze.endCoord;
  const grid = state.maze.grid;

  const {
    TILE_COLOR,
    GAP_COLOR,
    SQUARE_SIZE,
    START_COLOR,
    END_COLOR,
  } = state.settings;

  ctx.fillStyle = GAP_COLOR;
  ctx.fillRect(0, 0, 1024, 1024);

  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[x].length; y++) {
      if (startX == x && startY == y) {
        ctx.fillStyle = START_COLOR;
      } else if (endX == x && endY == y) {
        ctx.fillStyle = END_COLOR;
      } else {
        ctx.fillStyle = grid[x][y]
          ? TILE_COLOR
          : GAP_COLOR;
      }
      ctx.fillRect(
        SQUARE_SIZE * (1 + x),
        SQUARE_SIZE * (1 + y),
        SQUARE_SIZE,
        SQUARE_SIZE
      );
    }
  }
}

module.exports = drawMaze;
