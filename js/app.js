"use strict";
const randomNumber = (min, max) => Math.floor(Math.random() * (max - min) + min);
const getRandomCoordinates = (el) => {
    el.x = randomNumber(0, tileCount);
    el.y = randomNumber(0, tileCount);
};
const drawTile = (ctx, x, y, size) => ctx.fillRect(x, y, size, size);
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const gameOverLayer = document.querySelector(".game-over-layer");
const tryAgainButton = gameOverLayer.querySelector("button");
const scoreContainers = document.querySelectorAll(".score");
const timerContainer = document.getElementById("time");
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
}, timer = { seconds: 0, minutes: 0 };
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
    scoreContainers.forEach((scoreContainer) => (scoreContainer.innerText = `0000${score}`.slice(-4)));
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
const updateTimer = () => {
    const minutes = `00${timer.minutes}`.slice(-2);
    const seconds = `00${timer.seconds}`.slice(-2);
    timerContainer.innerText = `${minutes}:${seconds}`;
};
const startTimer = () => {
    if (gameOver) {
        return;
    }
    if (vx || vy) {
        if (timer.seconds && timer.seconds % 60 === 0) {
            timer.seconds = 0;
            timer.minutes++;
        }
        else {
            timer.seconds++;
        }
        updateTimer();
    }
    setTimeout(startTimer, 1000);
};
const setDirection = (direction) => {
    switch (direction) {
        case "up":
            if (vy === 1)
                return;
            vy = -1;
            vx = 0;
            break;
        case "down":
            if (vy === -1)
                return;
            vy = 1;
            vx = 0;
            break;
        case "left":
            if (vx === 1)
                return;
            vy = 0;
            vx = -1;
            break;
        case "right":
            if (vx === -1)
                return;
            vy = 0;
            vx = 1;
    }
};
window.addEventListener("keyup", function (e) {
    if (keyCodes.up.includes(e.key))
        setDirection("up");
    if (keyCodes.down.includes(e.key))
        setDirection("down");
    if (keyCodes.left.includes(e.key))
        setDirection("left");
    if (keyCodes.right.includes(e.key))
        setDirection("right");
});
startGame();
startTimer();
