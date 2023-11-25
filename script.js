document.addEventListener('DOMContentLoaded', function () {
    const playerNamesContainer = document.getElementById('playerNames');
    const startGameBtn = document.getElementById('startGameBtn');
    const board = document.getElementById('board');
    const restartBtn = document.getElementById('restartBtn');
    const winnerModal = document.getElementById('winnerModal');
    const winnerText = document.getElementById('winnerText');
    const newGameBtn = document.getElementById('newGameBtn');
    const closeBtn = document.querySelector('.close');
    const playerScoreDisplay = document.getElementById('playerScore');
    const computerScoreDisplay = document.getElementById('computerScore');
    const gameTitle = document.querySelector('.game-title');
    const choiceModal = document.getElementById('choiceModal');
    const chooseXBtn = document.getElementById('chooseXBtn');
    const chooseOBtn = document.getElementById('chooseOBtn');

    let currentPlayer = 'X';
    let cells = Array.from({ length: 9 });
    let player1Name = 'Player 1'; // Default name if not provided
    let player2Name = 'Computer'; // Default name for the computer player
    let playerScore = 0;
    let computerScore = 0;

    restartBtn.style.display = 'none';
    playerScoreDisplay.style.display = 'none';
    computerScoreDisplay.style.display = 'none';
    // gameTitle.style.display = 'none'; 

    gameTitle.style.display = 'none'; // Initially hide the game title
    choiceModal.style.display = 'block'; // Display the choice modal initially

    chooseXBtn.addEventListener('click', function () {
        currentPlayer = 'X';
        choiceModal.style.display = 'none';
        showGameElements();
    });

    chooseOBtn.addEventListener('click', function () {
        currentPlayer = 'O';
        choiceModal.style.display = 'none';
        showGameElements();
    });


    startGameBtn.addEventListener('click', function () {
        player1Name = document.getElementById('player1').value.trim() || 'Player 1';

        playerNamesContainer.style.display = 'none';
        board.style.display = 'grid';

        initializeGame(player1Name, player2Name);
        
        // Show the restart button and player scores after starting the game
        restartBtn.style.display = 'inline-block';
        playerScoreDisplay.style.display = 'inline-block';
        computerScoreDisplay.style.display = 'inline-block';
        playerScoreDisplay.textContent = `${player1Name}: 0`;
        gameTitle.style.display = 'block';
    });

    restartBtn.addEventListener('click', resetGame);
    newGameBtn.addEventListener('click', function () {
        resetGame();
        winnerModal.style.display = 'none';
    });

    closeBtn.addEventListener('click', function () {
        winnerModal.style.display = 'none';
    });

    function initializeGame(player1, player2) {
        cells.forEach((cell, index) => {
            cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.index = index;
            cell.addEventListener('click', handleCellClick);
            board.appendChild(cell);
        });

        playerScoreDisplay.textContent = `${player1}: 0`;
        computerScoreDisplay.textContent = `${player2}: 0`;
    }

    function handleCellClick(event) {
        const clickedCell = event.target;
        const index = clickedCell.dataset.index;

        if (cells[index] || checkWinner()) return;

        cells[index] = currentPlayer;
        clickedCell.textContent = currentPlayer;

        if (checkWinner()) {
            if (currentPlayer === 'X') {
                playerScore++;
                playerScoreDisplay.textContent = `${player1Name}: ${playerScore}`;
            } else {
                computerScore++;
                computerScoreDisplay.textContent = `${player2Name}: ${computerScore}`;
            }

            winnerText.textContent = `${currentPlayer} wins!`;
            winnerModal.style.display = 'block';
        } else if (cells.every(cell => cell)) {
            winnerText.textContent = "It's a draw!";
            winnerModal.style.display = 'block';
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            if (currentPlayer === 'O') {
                makeComputerMove();
            }
        }
    }

    function makeComputerMove() {
        const winningMove = findWinningMove();
        if (winningMove !== null) {
            cells[winningMove] = 'O';
            document.querySelector(`.cell[data-index="${winningMove}"]`).textContent = 'O';
        } else {
            const blockingMove = findBlockingMove();
            if (blockingMove !== null) {
                cells[blockingMove] = 'O';
                document.querySelector(`.cell[data-index="${blockingMove}"]`).textContent = 'O';
            } else {
                makeRandomMove();
            }
        }

        if (checkWinner()) {
            computerScore++;
            computerScoreDisplay.textContent = `${player2Name}: ${computerScore}`;

            winnerText.textContent = `${player2Name} wins!`;
            winnerModal.style.display = 'block';
        } else if (cells.every(cell => cell)) {
            winnerText.textContent = "It's a draw!";
            winnerModal.style.display = 'block';
        } else {
            currentPlayer = 'X';
        }
    }

    function findWinningMove() {
        for (let i = 0; i < cells.length; i++) {
            if (!cells[i]) {
                cells[i] = 'O';
                if (checkWinner()) {
                    cells[i] = null;
                    return i;
                }
                cells[i] = null;
            }
        }
        return null;
    }

    function findBlockingMove() {
        for (let i = 0; i < cells.length; i++) {
            if (!cells[i]) {
                cells[i] = 'X';
                if (checkWinner()) {
                    cells[i] = null;
                    return i;
                }
                cells[i] = null;
            }
        }
        return null;
    }

    function makeRandomMove() {
        const emptyCells = cells.reduce((acc, cell, index) => {
            if (!cell) {
                acc.push(index);
            }
            return acc;
        }, []);

        if (emptyCells.length > 0) {
            const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            cells[randomIndex] = 'O';
            document.querySelector(`.cell[data-index="${randomIndex}"]`).textContent = 'O';
        }
    }

    function resetGame() {
        cells = Array.from({ length: 9 });
        currentPlayer = 'X';
        document.querySelectorAll('.cell').forEach(cell => {
            cell.textContent = '';
        });
    }

    function checkWinner() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        return winPatterns.some(pattern => {
            const [a, b, c] = pattern;
            return cells[a] && cells[a] === cells[b] && cells[a] === cells[c];
        });
    }
});
