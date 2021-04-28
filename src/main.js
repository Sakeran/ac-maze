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
initGameState(mazeCanvas, ballCanvas, SETTINGS);
