document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid');
  const startButton = document.getElementById('start-button');
  const scoreDisplay = document.getElementById('score');
  const width = 10;
  let squares = Array.from(Array(200), () => document.createElement('div'));
  grid.append(...squares);
  let currentPosition = 4;
  let currentRotation = 0;
  let timerId;
  let score = 0;
  const colors = [
      '#f57c00',
      '#ab2b2a',
      '#8b4f7a',
      '#00783e',
      '#0071a2'
  ];

  const lTetromino = [
      [1, width + 1, width * 2 + 1, 2],
      [width, width + 1, width + 2, width * 2 + 2],
      [1, width + 1, width * 2 + 1, width * 2],
      [width, width * 2, width * 2 + 1, width * 2 + 2]
  ];

  const zTetromino = [
      [0, width, width + 1, width * 2 + 1],
      [width + 1, width + 2, width * 2, width * 2 + 1],
      [0, width, width + 1, width * 2 + 1],
      [width + 1, width + 2, width * 2, width * 2 + 1]
  ];

  const tTetromino = [
      [1, width, width + 1, width + 2],
      [1, width + 1, width + 2, width * 2 + 1],
      [width, width + 1, width + 2, width * 2 + 1],
      [1, width, width + 1, width * 2 + 1]
  ];

  const oTetromino = [
      [0, 1, width, width + 1],
      [0, 1, width, width + 1],
      [0, 1, width, width + 1],
      [0, 1, width, width + 1]
  ];

  const iTetromino = [
      [1, width + 1, width * 2 + 1, width * 3 + 1],
      [width, width + 1, width + 2, width + 3],
      [1, width + 1, width * 2 + 1, width * 3 + 1],
      [width, width + 1, width + 2, width + 3]
  ];

  const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

  let random = Math.floor(Math.random() * theTetrominoes.length);
  let current = theTetrominoes[random][currentRotation];

  function draw() {
      current.forEach(index => {
          if (squares[currentPosition + index]) {
              squares[currentPosition + index].classList.add('tetromino');
              squares[currentPosition + index].style.backgroundColor = colors[random];
          }
      });
  }

  function undraw() {
      current.forEach(index => {
          if (squares[currentPosition + index]) {
              squares[currentPosition + index].classList.remove('tetromino');
              squares[currentPosition + index].style.backgroundColor = '';
          }
      });
  }

  timerId = setInterval(moveDown, 1000);

  function control(e) {
      if (e.keyCode === 37) {
          moveLeft();
      } else if (e.keyCode === 38) {
          rotate();
      } else if (e.keyCode === 39) {
          moveRight();
      } else if (e.keyCode === 40) {
          moveDown();
      }
  }
  document.addEventListener('keyup', control);

  function moveDown() {
      undraw();
      currentPosition += width;
      draw();
      freeze();
  }


  function freeze() {
      if (current.some(index => squares[currentPosition + index + width]?.classList.contains('taken') || (currentPosition + index + width >= 200))) {
          current.forEach(index => squares[currentPosition + index].classList.add('taken'));
          random = Math.floor(Math.random() * theTetrominoes.length);
          current = theTetrominoes[random][currentRotation];
          currentPosition = 4;
          draw();
          addScore();
          gameOver();
      }
  }


  function moveLeft() {
      undraw();
      const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);

      if (!isAtLeftEdge) currentPosition -= 1;

      if (current.some(index => squares[currentPosition + index]?.classList.contains('taken'))) {
          currentPosition += 1;
      }

      draw();
  }


  function moveRight() {
      undraw();
      const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);

      if (!isAtRightEdge) currentPosition += 1;

      if (current.some(index => squares[currentPosition + index]?.classList.contains('taken'))) {
          currentPosition -= 1;
      }

      draw();
  }


  function rotate() {
      undraw();
      currentRotation++;
      if (currentRotation === current.length) {
          currentRotation = 0;
      }
      current = theTetrominoes[random][currentRotation];
      draw();
  }

  startButton.addEventListener('click', () => {
      if (timerId) {
          clearInterval(timerId);
          timerId = null;
      } else {
          draw();
          timerId = setInterval(moveDown, 1000);
      }
  });

  function addScore() {
      for (let i = 0; i < 199; i += width) {
          const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];

          if (row.every(index => squares[index].classList.contains('taken'))) {
              score += 10;
              scoreDisplay.innerHTML = score;
              row.forEach(index => {
                  squares[index].classList.remove('taken');
                  squares[index].classList.remove('tetromino');
                  squares[index].style.backgroundColor = '';
              });
              const squaresRemoved = squares.splice(i, width);
              squares = squaresRemoved.concat(squares);
              squares.forEach(cell => grid.appendChild(cell));
          }
      }
  }

  // game over
  function gameOver() {
      if (current.some(index => squares[currentPosition + index]?.classList.contains('taken'))) {
          scoreDisplay.innerHTML = 'Game over';
          clearInterval(timerId);
      }
  }
});
