const Maze = require("./Maze");
const drawMaze = require("./drawMaze");
const drawBall = require("./drawBall");

function initGameState(mazeCanvas, ballCanvas, settings) {
  // Create new maze
  const maze = new Maze(30)
  maze.create();

  // PLace ball at start
  let ballX = (1 + maze.startCoord[0] + 0.5) * settings.SQUARE_SIZE;
  let ballY = (1 + maze.startCoord[1] + 0.5) * settings.SQUARE_SIZE;

  const state = {
    maze,
    mazeCanvas,
    ballCanvas,
    settings,

    ballX,
    ballY,
  };

  // Draw initial maze grid.
  drawMaze(state);

  // Draw initial ball placement
  drawBall(state);

  return state;
}

module.exports = initGameState;
