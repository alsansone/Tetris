document.addEventListener('DOMContentLoaded', () => {
    // board setup
    const grid = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));
    const scoreDisplay = document.querySelector('#score');
    const startBtn = document.querySelector('#start-button');
    const width = 10;
    let nextRandom = 0;
    let score = 0;
    let timerId;
    // piece color
    const colors = [
        'blue',
        'orange',
        'green',
        'red',
        'purple',
        'cyan',
        'yellow'
    ];

    // tetris pieces
    const jPiece = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2]
    ];

    const lPiece = [
        [0, 1, width + 1, width * 2 + 1],
        [width, width * 2, width + 1, width + 2],
        [1, width + 1, width * 2 + 1, width * 2 + 2],
        [width * 2, width * 2 + 1, width * 2 + 2, width + 2]
    ];

    const sPiece = [
        [width * 2, width * 2 + 1, width + 1, width + 2],
        [0, width, width + 1, width * 2 + 1],
        [width * 2, width * 2 + 1, width + 1, width + 2],
        [0, width, width + 1, width * 2 + 1],
    ];

    const zPiece = [
        [width, width + 1, width * 2 + 1, width * 2 + 2],
        [width + 1, width * 2 + 1, width + 2, 2],
        [width, width + 1, width * 2 + 1, width * 2 + 2],
        [width + 1, width * 2 + 1, width + 2, 2]
    ];

    const tPiece = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
    ];

    const iPiece = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3]
    ];

    const oPiece = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
    ];
    // array of tetrominoes
    const theTetrominoes = [lPiece, jPiece, sPiece, zPiece, tPiece, iPiece, oPiece];

    let currentPosition = 4;
    let currentRotation = 0;

    // randomlly select a tetromino
    let random = Math.floor(Math.random() * theTetrominoes.length);
    let current = theTetrominoes[random][currentRotation];

    // draw the tetromino
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino');
            squares[currentPosition + index].style.backgroundColor = colors[random];
        });
    }

    // undraw the tetromino
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino');
            squares[currentPosition + index].style.backgroundColor = '';
        });
    }

    // tetromino drop interval
    //timerId = setInterval(moveDown, 1000);

    // keycode functions
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

    // move piece down
    function moveDown() {
        undraw();
        currentPosition += width;
        draw();
        freeze();
    }

    // stop piece when reaches bottom or another piece
    function freeze() {
        if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'));
            // restart draw
            random = nextRandom;
            nextRandom = Math.floor(Math.random() * theTetrominoes.length);
            current = theTetrominoes[random][currentRotation];
            currentPosition = 4;
            draw();
            displayShape();
            addScore();
            gameOver();
        }
    }
    // move piece left
    function moveLeft() {
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);

        if (!isAtLeftEdge) currentPosition -= 1;

        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1;
        }

        draw();
    }
    // move piece right
    function moveRight() {
        undraw();
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);

        if (!isAtRightEdge) currentPosition += 1;

        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1;
        }

        draw();
    }

    // rotate the piece
    function rotate() {
        undraw();
        currentRotation++;
        if (currentRotation === current.length) {
            currentRotation = 0;
        }
        current = theTetrominoes[random][currentRotation];
        draw();
    }

    // next-up
    const displaySquares = document.querySelectorAll('.mini-grid div');
    const displayWidth = 4;
    const displayIndex = 0;
    // position of each piece at rotation 0
    const pieceUpNext = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2], // J
        [0, 1, displayWidth + 1, displayWidth * 2 + 1], // L
        [displayWidth * 2, displayWidth * 2 + 1, displayWidth + 1, displayWidth + 2], // S
        [displayWidth, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 2 + 2], // Z
        [1, displayWidth, displayWidth + 1, displayWidth + 2], // T
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1], // I
        [0, 1, displayWidth, displayWidth + 1], // O
    ];

    // display next-up piece
    function displayShape() {
        // remove all traces of the particular piece from the grid
        displaySquares.forEach(square => {
            square.classList.remove('tetromino');
            square.style.backgroundColor = '';
        })
        pieceUpNext[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetromino');
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom];
        })
    }

    // start button
    startBtn.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        } else {
            draw();
            timerId = setInterval(moveDown, 1000);
            nextRandom = Math.floor(Math.random() * theTetrominoes.length);
            displayShape();
        }
    })

    // calculate score and update display
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
                })
                const squaresRemoved = squares.splice(i, width);
                squares = squaresRemoved.concat(squares);
                squares.forEach(cell => grid.appendChild(cell));
            }
        }
    }

    // end game
    function gameOver() {
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = ' GameOver';
            clearInterval(timerId);
        }
    }
});