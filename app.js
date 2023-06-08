const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const gameOverLayer = document.querySelector(".game-over-layer");
const tryAgainButton = gameOverLayer.querySelector("button");
const scoreElement = document.querySelector("#score");

const randomNumber = (min, max) => Math.random() * (max - min) + min;

canvas.width = 400;
canvas.height = 400;

let speed = 7,
  tileCount = 20,
  head = { x: 10, y: 10 },
  tileSize = canvas.width / tileCount - 2,
  xVelocity = 0,
  yVelocity = 0,
  score = 0,
  food = { x: 5, y: 5 };
let counter = 0;

const snake = [];
let snakeLength = 1;

const draw = () => {
  changeSnakePosition();
  const isGameOver = detectColision();
  if (isGameOver) {
    return;
  }
  clearScreen();
  updateScore();
  checkEating();
  drawFood();
  drawSnake();
  setTimeout(draw, 1000 / speed);
};

const drawSnake = () => {
  ctx.fillStyle = "black";
  ctx.fillRect(head.x * tileCount, head.y * tileCount, tileSize, tileSize);

  snake.forEach((part) => {
    ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
  });

  snake.push({ x: head.x, y: head.y });
  if (snake.length > snakeLength) {
    snake.shift();
  }
};

const changeSnakePosition = () => {
  head.x += xVelocity;
  head.y += yVelocity;
};

const clearScreen = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

const checkEating = () => {
  if (food.x === head.x && food.y === head.y) {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
    snakeLength++;
    score++;
  }
};

const updateScore = () => {
  scoreElement.innerText = `SCORE: 0000${score}`.slice(-4);
  if (score && score % 10 === 0) {
    counter++;
    if (counter === 1) {
      speed += 1;
    }
    return;
  }
  counter = 0;
};

const detectColision = () => {
  if (yVelocity === 0 && xVelocity === 0) {
    return false;
  }
  let isCollision = false;
  if (head.x >= tileCount || head.x < 0 || head.y < 0 || head.y >= tileCount) {
    isCollision = true;
  }

  snake.every((part) => {
    if (part.x === head.x && part.y === head.y) {
      isCollision = true;
      return true;
    }
    return false;
  });

  return isCollision;
};

const drawFood = () => {
  ctx.fillStyle = "green";
  ctx.fillRect(food.x * tileCount, food.y * tileCount, tileSize, tileSize);
};

const keyDown = (e) => {
  if (e.keyCode === 38) {
    if (yVelocity === 1) return;
    yVelocity = -1;
    xVelocity = 0;
  }
  if (e.keyCode === 40) {
    if (yVelocity === -1) return;
    yVelocity = +1;
    xVelocity = 0;
  }
  if (e.keyCode === 37) {
    if (xVelocity === 1) return;
    yVelocity = 0;
    xVelocity = -1;
  }
  if (e.keyCode === 39) {
    if (xVelocity === -1) return;
    yVelocity = 0;
    xVelocity = +1;
  }
};

document.addEventListener("keydown", keyDown);

draw();
