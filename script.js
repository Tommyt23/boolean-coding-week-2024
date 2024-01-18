const grid = document.querySelector('.grid');
const stackbtn = document.querySelector('.stack');
const scoreCounter = document.querySelector('.score-counter');
const endGameScreen = document.querySelector('.end-game-screen');
const endGameText = document.querySelector('.end-game-text');
const playAgainbtn = document.querySelector('.play-again');

const gridMatrix = [
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [1, 1, 1, 0, 0, 0],
];

// variable to keep track of game values during play
let currentRowIndex = gridMatrix.length - 1;
let barDirection = 'right';
let barSize = 3;
let isGameOver = false;
let score = 0;
const initialSpeed = 350;
const speedDecreaseRate = 50;
let speed = initialSpeed;

function draw() {
  // make sure to reset the display
  grid.innerHTML = '';

  gridMatrix.forEach(function (rowContent) {
    rowContent.forEach(function (cellContent) {
      const cell = document.createElement('div');
      cell.classList.add('cell');

      if (cellContent === 1) {
        cell.classList.add('bar');
      }

      grid.appendChild(cell);
    });
  });
}

// game logic and controls
function endGame(isVictory) {
  if (isVictory) {
    endGameText.innerHTML = 'YOU<br>Won';
    endGameScreen.classList.add('win');
  }
  endGameScreen.classList.remove('hidden');
}

function onPlayAgain() {
  location.reload();
}

function checkwin() {
  if (currentRowIndex === 0) {
    isGameOver = true;
    clearInterval(gameInterval);
    endGame(true);
  }
}

function updateSpeed() {
  // Calculate the new speed
  speed = Math.max(initialSpeed - (8 - currentRowIndex) ** 2 * 9, 50);

  // Output the current speed to the console (for testing)
  console.log(speed);

  // Clear the existing interval
  clearInterval(gameInterval);

  // Set up a new interval with the updated speed
  gameInterval = setInterval(main, speed);
}

function checkLost() {
  const currentRow = gridMatrix[currentRowIndex];
  const prevRow = gridMatrix[currentRowIndex + 1];

  if (!prevRow) return;

  // check if atleast one accumulated stack under each element
  for (let i = 0; i < currentRow.length; i++) {
    if (currentRow[i] === 1 && prevRow[i] === 0) {
      currentRow[i] = 0;
      barSize--;
    }

    if (barSize === 0) {
      isGameOver = true;
      clearInterval(gameInterval);
      endGame(false);
    }
  }
}

function updateScore() {
  score += barSize;
  scoreCounter.innerText = score.toString().padStart(5, 0);
}

function onStack() {
  checkwin();
  checkLost();
  updateScore();
  updateSpeed();

  if (isGameOver) return;

  currentRowIndex--;
  barDirection = 'right';

  for (let i = 0; i < barSize; i++) {
    gridMatrix[currentRowIndex][i] = 1;
  }

  draw();
}

function moveRight(currentRow) {
  currentRow.pop();
  currentRow.unshift(0);
}

function moveLeft(currentRow) {
  currentRow.shift();
  currentRow.push(0);
}

function moveBar() {
  const currentRow = gridMatrix[currentRowIndex];
  // console.log(currentRow);

  if (barDirection === 'right') {
    moveRight(currentRow);
    const lastElement = currentRow[currentRow.length - 1];
    if (lastElement === 1) {
      barDirection = 'left';
    }
  } else if (barDirection === 'left') {
    moveLeft(currentRow);

    const firstElement = currentRow[0];
    if (firstElement === 1) {
      barDirection = 'right';
    }
  }
}

draw();

function main() {
  moveBar();
  draw();
}

// Events
stackbtn.addEventListener('click', onStack);
playAgainbtn.addEventListener('click', onPlayAgain);

let gameInterval = setInterval(main, speed);
