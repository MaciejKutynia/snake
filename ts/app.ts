interface StartingSnakePosition {
  x: number;
  y: number;
}

interface KeyCodes {
  up: string[];
  down: string[];
  left: string[];
  right: string[];
}

const canvas: HTMLCanvasElement = document.querySelector("canvas")!;
const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;
const gameOverLayer: HTMLDivElement =
  document.querySelector(".game-over-layer")!;
const tryAgainButton: HTMLButtonElement =
  gameOverLayer.querySelector("button")!;

const randomNumber = (min: number, max: number): number =>
  Math.random() * (max - min) + min;

canvas.width = 300;
canvas.height = 600;

const dimension: number = 10;

const keyCodes: KeyCodes = {
  up: ["ArrowUp", "w"],
  down: ["ArrowDown", "s"],
  left: ["ArrowLeft", "a"],
  right: ["ArrowRight", "d"],
};

class Snake {
  context: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  direction: string;
  dimension: number;
  startingSnakePosition: StartingSnakePosition;
  vx: number;
  vy: number;
  speed: number;
  snakeBody: [];

  constructor(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    this.context = context;
    this.canvas = canvas;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.direction = "";
    this.dimension = 10;
    this.startingSnakePosition = {
      x: randomNumber(0, canvas.width - this.dimension),
      y: randomNumber(0, canvas.height - this.dimension),
    };
    this.vx = 0;
    this.vy = 0;
    this.speed = 2;
    this.snakeBody = [];
  }
  private move(): { vx: number; vy: number } {
    switch (this.direction) {
      case "up":
        return { vx: this.vx, vy: (this.vy -= this.speed) };
      case "down":
        return { vx: this.vx, vy: (this.vy += this.speed) };
      case "left":
        return { vx: (this.vx -= this.speed), vy: this.vy };
      case "right":
        return { vx: (this.vx += this.speed), vy: this.vy };
      default:
        return { vx: this.vx, vy: this.vy };
    }
  }
  draw(): boolean {
    const { vx, vy } = this.move();
    const isGameOver = this.detectCollision(vx, vy);
    this.context.fillStyle = "black";
    this.context.fillRect(
      this.startingSnakePosition.x + vx,
      this.startingSnakePosition.y + vy,
      this.dimension,
      this.dimension,
    );
    return isGameOver;
  }
  private detectCollision(vx: number, vy: number): boolean {
    const { x, y } = this.startingSnakePosition;
    if (
      vx + x >= this.width - this.dimension ||
      vx + x <= 0 ||
      vy + y >= this.height - this.dimension ||
      vy + y <= 0
    ) {
      this.direction = "";
      this.speed = 0;
      return true;
    }
    return false;
  }
  moveUp(): void {
    if (keyCodes.down.includes(lastKey)) return;
    this.direction = "up";
  }

  moveDown(): void {
    if (keyCodes.up.includes(lastKey)) return;
    this.direction = "down";
  }

  moveLeft(): void {
    if (keyCodes.right.includes(lastKey)) return;
    this.direction = "left";
  }

  moveRight(): void {
    if (keyCodes.left.includes(lastKey)) return;
    this.direction = "right";
  }
}

let lastKey: string = "",
  snake = new Snake(ctx, canvas);

window.addEventListener("keyup", function (e) {
  if (keyCodes.up.includes(e.key)) snake.moveUp();
  if (keyCodes.down.includes(e.key)) snake.moveDown();
  if (keyCodes.left.includes(e.key)) snake.moveLeft();
  if (keyCodes.right.includes(e.key)) snake.moveRight();
  lastKey = e.key;
});

(function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const isGameOver = snake.draw();
  if (isGameOver) {
    gameOverLayer.classList.add("visible");
  }
  if (!isGameOver) {
    requestAnimationFrame(animate);
  }
})();
