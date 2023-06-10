interface KeyCodes {
  up: string[];
  down: string[];
  left: string[];
  right: string[];
}

interface Coordinates {
  x: number;
  y: number;
}
interface Timer {
  minutes: number;
  seconds: number;
}

const randomNumber = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min) + min);

const getRandomCoordinates = (el: Coordinates): void => {
  el.x = randomNumber(0, tileCount);
  el.y = randomNumber(0, tileCount);
};

const drawTile = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
): void => ctx.fillRect(x, y, size, size);

const canvas: HTMLCanvasElement = document.querySelector("canvas")!;
const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;
const gameOverLayer: HTMLDivElement =
  document.querySelector(".game-over-layer")!;
const tryAgainButton: HTMLButtonElement =
  gameOverLayer.querySelector("button")!;
const scoreContainers: NodeListOf<HTMLSpanElement> =
  document.querySelectorAll(".score")!;
const timerContainer: HTMLSpanElement = document.getElementById("time")!;

canvas.width = 400;
canvas.height = 400;

const tileCount: number = 20,
  tileSize: number = canvas.width / tileCount - 2,
  snake: Coordinates[] = [];

const keyCodes: KeyCodes = {
  up: ["ArrowUp", "w"],
  down: ["ArrowDown", "s"],
  left: ["ArrowLeft", "a"],
  right: ["ArrowRight", "d"],
};

let speed: number = 7,
  vx: number = 0,
  vy: number = 0,
  snakeLength = 1,
  gameOver: boolean = false,
  score: number = 0,
  head: Coordinates = {
    x: randomNumber(0, tileCount),
    y: randomNumber(0, tileCount),
  },
  food: Coordinates = {
    x: randomNumber(0, tileCount),
    y: randomNumber(0, tileCount),
  },
  timer: Timer = { seconds: 0, minutes: 0 };

//Snake
const drawSnake = (): void => {
  ctx.fillStyle = "#727272";
  drawTile(ctx, head.x * tileCount, head.y * tileCount, tileSize);
  ctx.fillStyle = "black";
  snake.forEach((part) =>
    drawTile(ctx, part.x * tileCount, part.y * tileCount, tileSize),
  );
  snake.push({ x: head.x, y: head.y });
  if (snake.length > snakeLength) snake.shift();
};

const move = (): void => {
  head.x += vx;
  head.y += vy;
};

const detectCollision = (): boolean => {
  if (vy === 0 && vx === 0) {
    return false;
  }
  let isCollision = false;
  if (head.x >= tileCount || head.x < 0 || head.y < 0 || head.y >= tileCount) {
    isCollision = true;
  }

  snake.forEach((part) => {
    if (part.x === head.x && part.y === head.y) {
      isCollision = true;
    }
  });

  return isCollision;
};

const detectEating = (): void => {
  if (food.x === head.x && food.y === head.y) {
    getRandomCoordinates(food);
    snakeLength++;
    score++;
    updateScore();
  }
};

//Food

const drawFood = (): void => {
  ctx.fillStyle = "green";
  drawTile(ctx, food.x * tileCount, food.y * tileCount, tileSize);
};

//Game

const startGame = (): void => {
  move();
  gameOver = detectCollision();
  if (gameOver) {
    handleGameOverScreen(gameOver);
    return;
  }
  clearScreen();
  drawSnake();
  drawFood();
  detectEating();
  setTimeout(startGame, 1000 / speed);
};

const updateScore = (): void => {
  scoreContainers.forEach(
    (scoreContainer) => (scoreContainer.innerText = `0000${score}`.slice(-4)),
  );
  if (score && score % 10 === 0) {
    speed += 1;
  }
};

const handleGameOverScreen = (gameOver: boolean): void => {
  if (gameOver) {
    gameOverLayer.classList.add("visible");
    tryAgainButton.addEventListener("click", restartGame);
  } else {
    gameOverLayer.classList.remove("visible");
    tryAgainButton.removeEventListener("click", restartGame);
  }
};

const clearScreen = (): void =>
  ctx.clearRect(0, 0, canvas.width, canvas.height);

const restartGame = (): void => {
  gameOver = false;
  snakeLength = 1;
  snake.splice(0, snake.length);
  score = 0;
  speed = 7;
  vx = 0;
  vy = 0;
  timer.minutes = 0;
  timer.seconds = 0;
  updateScore();
  updateTimer();
  getRandomCoordinates(head);
  getRandomCoordinates(food);
  handleGameOverScreen(gameOver);
  clearScreen();
  drawSnake();
  drawFood();
  startGame();
  startTimer();
};

const updateTimer = (): void => {
  const minutes = `00${timer.minutes}`.slice(-2);
  const seconds = `00${timer.seconds}`.slice(-2);
  timerContainer.innerText = `${minutes}:${seconds}`;
};

const startTimer = (): void => {
  if (gameOver) {
    return;
  }
  if (vx || vy) {
    if (timer.seconds && timer.seconds % 60 === 0) {
      timer.seconds = 0;
      timer.minutes++;
    } else {
      timer.seconds++;
    }
    updateTimer();
  }
  setTimeout(startTimer, 1000);
};

const setDirection = (direction: string): void => {
  switch (direction) {
    case "up":
      if (vy === 1) return;
      vy = -1;
      vx = 0;
      break;
    case "down":
      if (vy === -1) return;
      vy = 1;
      vx = 0;
      break;
    case "left":
      if (vx === 1) return;
      vy = 0;
      vx = -1;
      break;
    case "right":
      if (vx === -1) return;
      vy = 0;
      vx = 1;
  }
};

window.addEventListener("keyup", function (e: KeyboardEvent) {
  if (keyCodes.up.includes(e.key)) setDirection("up");
  if (keyCodes.down.includes(e.key)) setDirection("down");
  if (keyCodes.left.includes(e.key)) setDirection("left");
  if (keyCodes.right.includes(e.key)) setDirection("right");
});

startGame();
startTimer();
