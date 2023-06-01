const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const randomNumber = (min, max) => Math.random() * (max - min) + min;

canvas.width = 300;
canvas.height = 600;

const dimension = 10;
const startingSnakePosition = {
  x: randomNumber(0, canvas.width - dimension),
  y: randomNumber(0, canvas.height - dimension),
};
let vx = 0,
  vy = 0,
  lastKey = "",
  speed = 2,
  direction = "";

const keyCodes = {
  up: ["ArrowUp", "w"],
  down: ["ArrowDown", "s"],
  left: ["ArrowLeft", "a"],
  right: ["ArrowRight", "d"],
};

const moveUp = () => {
  if (keyCodes.down.includes(lastKey)) return;
  direction = "up";
};

const moveDown = () => {
  if (keyCodes.up.includes(lastKey)) return;
  direction = "down";
};

const moveLeft = () => {
  if (keyCodes.right.includes(lastKey)) return;
  direction = "left";
};

const moveRight = () => {
  if (keyCodes.left.includes(lastKey)) return;
  direction = "right";
};

const moveSnake = () => {
  switch (direction) {
    case "down":
      // vx = vx;
      vy += speed;
      break;
    case "up":
      // vx = vx;
      vy -= speed;
      break;
    case "right":
      vx += speed;
      // vy = vy;
      break;
    case "left":
      vx -= speed;
      // vy = vy;
      break;
  }
};

const updateSnake = (context) => {
  context.fillStyle = "black";
  moveSnake();
  context.fillRect(
    startingSnakePosition.x + vx,
    startingSnakePosition.y + vy,
    10,
    10,
  );
};

const drawSnake = (context) => {
  context.fillStyle = "black";
  context.fillRect(startingSnakePosition.x, startingSnakePosition.y, 10, 10);
  updateSnake(context);
};

window.addEventListener("keyup", function (e) {
  if (keyCodes.up.includes(e.key)) moveUp();
  if (keyCodes.down.includes(e.key)) moveDown();
  if (keyCodes.left.includes(e.key)) moveLeft();
  if (keyCodes.right.includes(e.key)) moveRight();
  lastKey = e.key;
});

(function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSnake(ctx, vx, vy);
  requestAnimationFrame(animate);
})();
