const initGameState = require("./js/initGameState");

// SETTINGS
const SETTINGS = {
  SQUARE_SIZE: 32,
  TILE_COLOR: "white",
  GAP_COLOR: "black",
  START_COLOR: "#3CAAAA",
  END_COLOR: "#AA3C3C",
  BALL_COLOR: "#1D5123",
  BALL_RADIUS: 12,
};

// Elements
const mazeCanvas = document.getElementById("maze");
const ballCanvas = document.getElementById("ball");

// Create Initial game state
let state;

function setupGame() {
  state = initGameState(mazeCanvas, ballCanvas, SETTINGS);
  state.onComplete(() => setupGame());
}
setupGame();

// Listeners
ballCanvas.addEventListener("pointerdown", (e) => state.onDown(e));
ballCanvas.addEventListener("pointerup", (e) => state.onUp(e));
ballCanvas.addEventListener("pointermove", (e) => state.onMove(e));
