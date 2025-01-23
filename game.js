const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game parameters
const basketWidth = 100;
const basketHeight = 60;
const fruitWidth = 30;
const fruitHeight = 30;
let basketX = canvas.width / 2 - basketWidth / 2;
const basketSpeed = 10;
let fruits = [];
let score = 0;
let lives = 3;
const fruitSpeed = 5;

// Load images
const basketImage = new Image();
basketImage.src = 'basket.png';  // Make sure to add your basket image
const appleImage = new Image();
appleImage.src = 'apple.png';  // Make sure to add your apple image
const bananaImage = new Image();
bananaImage.src = 'banana.png';  // Make sure to add your banana image

// Handle keyboard inputs
let leftPressed = false;
let rightPressed = false;

document.addEventListener('keydown', (e) => {
  if (e.key === 'a') leftPressed = true;
  if (e.key === 'd') rightPressed = true;
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'a') leftPressed = false;
  if (e.key === 'd') rightPressed = false;
});

// Function to draw the basket
function drawBasket() {
  ctx.drawImage(basketImage, basketX, canvas.height - basketHeight - 10, basketWidth, basketHeight);
}

// Function to draw the fruits
function drawFruits() {
  fruits.forEach((fruit) => {
    ctx.drawImage(fruit.image, fruit.x, fruit.y, fruitWidth, fruitHeight);
  });
}

// Function to move fruits down
function moveFruits() {
  fruits.forEach((fruit, index) => {
    fruit.y += fruitSpeed;
    if (fruit.y > canvas.height) {
      fruits.splice(index, 1);  // Remove fruit when it falls off screen
      lives--;
      if (lives === 0) {
        alert('Game Over!');
        resetGame();
      }
    }
  });
}

// Function to check for collisions with the basket
function checkCollisions() {
  fruits.forEach((fruit, index) => {
    if (
      fruit.x + fruitWidth > basketX &&
      fruit.x < basketX + basketWidth &&
      fruit.y + fruitHeight > canvas.height - basketHeight - 10 &&
      fruit.y < canvas.height - basketHeight - 10 + basketHeight
    ) {
      fruits.splice(index, 1);  // Remove the fruit
      score++;
    }
  });
}

// Function to spawn fruits
function spawnFruits() {
  if (Math.random() < 0.02) {
    const x = Math.random() * (canvas.width - fruitWidth);
    const fruit = Math.random() < 0.5 ? appleImage : bananaImage;  // Randomly choose apple or banana
    fruits.push({ x, y: -fruitHeight, image: fruit });
  }
}

// Function to update the game state
function updateGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear the canvas

  // Move basket based on key presses
  if (leftPressed && basketX > 0) basketX -= basketSpeed;
  if (rightPressed && basketX < canvas.width - basketWidth) basketX += basketSpeed;

  // Draw and move everything
  drawBasket();
  drawFruits();
  moveFruits();
  checkCollisions();
  spawnFruits();
  drawScoreAndLives();
}

// Function to draw score and lives
function drawScoreAndLives() {
  ctx.font = '20px Arial';
  ctx.fillStyle = '#000';
  ctx.fillText(`Score: ${score}`, 10, 30);
  ctx.fillText(`Lives: ${lives}`, canvas.width - 100, 30);
}

// Reset game when game over
function resetGame() {
  score = 0;
  lives = 3;
  basketX = canvas.width / 2 - basketWidth / 2;
  fruits = [];
}

// Game loop
function gameLoop() {
  updateGame();
  requestAnimationFrame(gameLoop);
}

gameLoop();
