let inputDir = { x: 0, y: 0 };
const foodSound = new Audio('music/food.mp3');
const gameOverSound = new Audio('music/gameover.mp3');
const moveSound = new Audio('music/move.mp3');
const musicSound = new Audio('music/music.mp3');
let speed = 9;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [{ x: 13, y: 15 }];
let food = { x: 6, y: 7 };

// Game Functions
function main(ctime) {
    window.requestAnimationFrame(main);

    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(snake) {
    // If you bump into yourself
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    // If you bump into walls
    if (snake[0].x >= 18 || snake[0].x < 0 || snake[0].y >= 18 || snake[0].y < 0) {
        return true;
    }
    return false;
}

function gameEngine() {
    // Check for collision
    if (isCollide(snakeArr)) {
        gameOverSound.play();
        musicSound.pause();
        inputDir = { x: 0, y: 0 };
        alert("Game Over! Press OK to restart.");
        snakeArr = [{ x: 13, y: 15 }];
        score = 0;
        speed = 9;
        return;
    }

    // Check if the snake has eaten the food
    if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
        foodSound.play();
        score += 1;
        if (score > highscoreval) {
            highscoreval = score;
            localStorage.setItem("highscore", JSON.stringify(highscoreval));
            highscoreBox.innerHTML = "HighScore: " + highscoreval;
        }
        scoreBox.innerHTML = "Score: " + score;
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
        // Generate new food position
        let a = 2;
        let b = 16;
        food = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) };
    }

    // Moving the snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Display the snake and food
    const board = document.getElementById('board');
    board.innerHTML = "";

    snakeArr.forEach((e, index) => {
        const snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        snakeElement.classList.add(index === 0 ? 'head' : 'snake');
        board.appendChild(snakeElement);
    });

    const foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

// Main logic starts here
musicSound.play();
let highscore = localStorage.getItem("highscore");
let highscoreval = highscore === null ? 0 : JSON.parse(highscore);
highscoreBox.innerHTML = "HighScore: " + highscoreval;

window.requestAnimationFrame(main);

window.addEventListener('keydown', e => {
    moveSound.play();
    switch (e.key) {
        case "ArrowUp":
            if (inputDir.y === 0) { // Prevent reverse direction
                inputDir = { x: 0, y: -1 };
            }
            break;

        case "ArrowDown":
            if (inputDir.y === 0) { // Prevent reverse direction
                inputDir = { x: 0, y: 1 };
            }
            break;

        case "ArrowLeft":
            if (inputDir.x === 0) { // Prevent reverse direction
                inputDir = { x: -1, y: 0 };
            }
            break;

        case "ArrowRight":
            if (inputDir.x === 0) { // Prevent reverse direction
                inputDir = { x: 1, y: 0 };
            }
            break;

        default:
            break;
    }
    console.log('Input Direction:', inputDir); // Debug: log input direction
});
