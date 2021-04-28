function drawBall(state) {
  const ctx = state.ballCanvas.getContext("2d");

  const { ballX, ballY } = state;
  const { BALL_COLOR, BALL_RADIUS } = state.settings;

  ctx.clearRect(0, 0, 1024, 1024);

  ctx.fillStyle = BALL_COLOR;
  ctx.beginPath();
  ctx.arc(ballX, ballY, BALL_RADIUS, 0, Math.PI * 2);
  ctx.fill();
}

module.exports = drawBall;
