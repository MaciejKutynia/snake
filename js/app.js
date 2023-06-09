"use strict";
const randomNumber = (min, max) => Math.floor(Math.random() * (max - min) + min);
const getRandomCoordinates = (element) => {
    element.x = randomNumber(0, tileCount);
    element.y = randomNumber(0, tileCount);
};
const drawTile = (ctx, x, y, size) => ctx.fillRect(x, y, size, size);
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const gameOverLayer = document.querySelector(".game-over-layer");
const tryAgainButton = gameOverLayer.querySelector("button");
const scoreContainer = document.querySelector("#score");
canvas.width = 400;
canvas.height = 400;
const tileCount = 20, tileSize = canvas.width / tileCount - 2, snake = [];
const keyCodes = {
    up: ["ArrowUp", "w"],
    down: ["ArrowDown", "s"],
    left: ["ArrowLeft", "a"],
    right: ["ArrowRight", "d"],
};
let speed = 7, vx = 0, vy = 0, snakeLength = 1, gameOver = false, score = 0, head = {
    x: randomNumber(0, tileCount),
    y: randomNumber(0, tileCount),
}, food = {
    x: randomNumber(0, tileCount),
    y: randomNumber(0, tileCount),
};
//Snake
const drawSnake = () => {
    ctx.fillStyle = "#727272";
    drawTile(ctx, head.x * tileCount, head.y * tileCount, tileSize);
    ctx.fillStyle = "black";
    snake.forEach((part) => drawTile(ctx, part.x * tileCount, part.y * tileCount, tileSize));
    snake.push({ x: head.x, y: head.y });
    if (snake.length > snakeLength)
        snake.shift();
};
const move = () => {
    head.x += vx;
    head.y += vy;
};
const detectCollision = () => {
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
const detectEating = () => {
    if (food.x === head.x && food.y === head.y) {
        getRandomCoordinates(food);
        snakeLength++;
        score++;
        updateScore();
    }
};
//Food
const drawFood = () => {
    ctx.fillStyle = "green";
    drawTile(ctx, food.x * tileCount, food.y * tileCount, tileSize);
};
//Game
const startGame = () => {
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
const updateScore = () => {
    scoreContainer.innerText = `0000${score}`.slice(-4);
    if (score && score % 10 === 0) {
        speed += 1;
    }
};
const handleGameOverScreen = (gameOver) => {
    if (gameOver) {
        gameOverLayer.classList.add("visible");
        tryAgainButton.addEventListener("click", restartGame);
    }
    else {
        gameOverLayer.classList.remove("visible");
        tryAgainButton.removeEventListener("click", restartGame);
    }
};
const clearScreen = () => ctx.clearRect(0, 0, canvas.width, canvas.height);
const restartGame = () => {
    gameOver = false;
    snakeLength = 1;
    snake.splice(0, snake.length);
    score = 0;
    speed = 7;
    vx = 0;
    vy = 0;
    updateScore();
    getRandomCoordinates(head);
    getRandomCoordinates(food);
    clearScreen();
    drawSnake();
    drawFood();
    handleGameOverScreen(gameOver);
    startGame();
};
window.addEventListener("keyup", function (e) {
    if (keyCodes.up.includes(e.key)) {
        if (vy === 1)
            return;
        vy = -1;
        vx = 0;
    }
    if (keyCodes.down.includes(e.key)) {
        if (vy === -1)
            return;
        vy = 1;
        vx = 0;
    }
    if (keyCodes.left.includes(e.key)) {
        if (vx === 1)
            return;
        vy = 0;
        vx = -1;
    }
    if (keyCodes.right.includes(e.key)) {
        if (vx === -1)
            return;
        vy = 0;
        vx = 1;
    }
});
startGame();
