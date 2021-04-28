const Maze = require("./Maze");
const drawMaze = require("./drawMaze");
const drawBall = require("./drawBall");

function getMouseCanvasCoordinates(canvas, evt) {
  const rect = canvas.getBoundingClientRect();

  const x = evt.clientX - rect.left;
  const y = evt.clientY - rect.top;

  return { x, y };
}

function getPixelAt(canvas, x, y) {
  const data = canvas.getContext("2d").getImageData(x, y, 1, 1).data;

  return `rgb(${data[0]},${data[1]},${data[2]})`;
}

function initGameState(mazeCanvas, ballCanvas, settings) {
  // Create new maze
  const maze = new Maze(30);
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

    ballDown: false,

    onComplete(cb) {
      state.completedCallback = cb;
    },

    onDown(e) {
      e.preventDefault();

      // Check if the ball was clicked on.
      const { x, y } = getMouseCanvasCoordinates(ballCanvas, e);

      const pixel = getPixelAt(ballCanvas, x, y);
      if (pixel === "rgb(0,0,0)") return;

      state.ballDown = true;
    },

    onUp() {
      state.ballDown = false;
    },

    onMove(e) {
      if (!state.ballDown) return;

      e.preventDefault();

      // If the pointer is too far away from the ball, release it.
      const coords = getMouseCanvasCoordinates(mazeCanvas, e);
      const dist = Math.sqrt(
        (coords.x - state.ballX) * (coords.x - state.ballX) +
          (coords.y - state.ballY) * (coords.y - state.ballY)
      );

      if (dist > 2 * state.settings.BALL_RADIUS) {
        state.ballDown = false;
        return;
      }

      // Consider the ball's next position

      const dx = Math.min(e.movementX, 10);
      const dy = Math.min(e.movementY, 10);

      // Check the pixel at the new location. If black, ignore the move.
      const newX = state.ballX + dx;
      const newY = state.ballY + dy;

      const pixel = getPixelAt(mazeCanvas, newX, newY);
      if (pixel === "rgb(0,0,0)") return;

      // If the pixel, is red, we've reached the end.
      if (pixel === "rgb(170,60,60)") {

        if (state.completed) return;
        state.completed = true;
        state.completedCallback && state.completedCallback();
        return;
      }

      state.ballX += dx;
      state.ballY += dy;

      requestAnimationFrame(() => drawBall(state));
    },
  };

  // Draw initial maze grid.
  drawMaze(state);

  // Draw initial ball placement
  drawBall(state);

  return state;
}

module.exports = initGameState;
