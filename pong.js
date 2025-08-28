const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const paddleWidth = 15, paddleHeight = 100;
const ballSize = 15;
let playerY = canvas.height / 2 - paddleHeight / 2;
let computerY = canvas.height / 2 - paddleHeight / 2;
let playerScore = 0, computerScore = 0;

// Ball properties
let ball = {
  x: canvas.width / 2 - ballSize / 2,
  y: canvas.height / 2 - ballSize / 2,
  vx: 5 * (Math.random() > 0.5 ? 1 : -1),
  vy: 3 * (Math.random() > 0.5 ? 1 : -1)
};

function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawBall() {
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(ball.x + ballSize / 2, ball.y + ballSize / 2, ballSize / 2, 0, Math.PI * 2);
  ctx.fill();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Draw paddles
  drawRect(10, playerY, paddleWidth, paddleHeight, '#0ff');
  drawRect(canvas.width - paddleWidth - 10, computerY, paddleWidth, paddleHeight, '#f00');
  // Draw ball
  drawBall();
}

function resetBall() {
  ball.x = canvas.width / 2 - ballSize / 2;
  ball.y = canvas.height / 2 - ballSize / 2;
  ball.vx = 5 * (Math.random() > 0.5 ? 1 : -1);
  ball.vy = 3 * (Math.random() > 0.5 ? 1 : -1);
}

function updateScore() {
  document.getElementById('playerScore').textContent = playerScore;
  document.getElementById('computerScore').textContent = computerScore;
}

function gameLoop() {
  // Move ball
  ball.x += ball.vx;
  ball.y += ball.vy;

  // Wall collision
  if (ball.y <= 0 || ball.y + ballSize >= canvas.height) {
    ball.vy *= -1;
  }

  // Left paddle collision (player)
  if (
    ball.x <= 10 + paddleWidth &&
    ball.y + ballSize >= playerY &&
    ball.y <= playerY + paddleHeight
  ) {
    ball.vx *= -1;
    // Add a little randomness to vertical velocity
    ball.vy += (Math.random() - 0.5) * 2;
    ball.x = 10 + paddleWidth; // Prevent sticking
  }

  // Right paddle collision (computer)
  if (
    ball.x + ballSize >= canvas.width - paddleWidth - 10 &&
    ball.y + ballSize >= computerY &&
    ball.y <= computerY + paddleHeight
  ) {
    ball.vx *= -1;
    ball.vy += (Math.random() - 0.5) * 2;
    ball.x = canvas.width - paddleWidth - 10 - ballSize; // Prevent sticking
  }

  // Score check
  if (ball.x < 0) {
    computerScore++;
    updateScore();
    resetBall();
  } else if (ball.x + ballSize > canvas.width) {
    playerScore++;
    updateScore();
    resetBall();
  }

  // Computer AI: follow the ball
  const compCenter = computerY + paddleHeight / 2;
  if (compCenter < ball.y + ballSize / 2 - 10) {
    computerY += 4;
  } else if (compCenter > ball.y + ballSize / 2 + 10) {
    computerY -= 4;
  }
  // Clamp computer paddle within canvas
  computerY = Math.max(0, Math.min(canvas.height - paddleHeight, computerY));

  draw();
  requestAnimationFrame(gameLoop);
}

// Mouse control for player paddle
canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  playerY =
    e.clientY - rect.top - paddleHeight / 2;
  // Clamp within canvas
  playerY = Math.max(0, Math.min(canvas.height - paddleHeight, playerY));
});

// Keyboard control
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowUp') {
    playerY -= 30;
  } else if (e.key === 'ArrowDown') {
    playerY += 30;
  }
  // Clamp within canvas
  playerY = Math.max(0, Math.min(canvas.height - paddleHeight, playerY));
});

// Initial draw and start game loop
updateScore();
draw();
requestAnimationFrame(gameLoop);
