// script.js
const puzzleBoard = document.getElementById('puzzle-board');
const message = document.getElementById('message');
let tiles = [], size = 3, emptyTile;

function startGame() {
    message.innerText = '';
    tiles = [];
    size = 3; // Change this for different grid sizes, e.g., 4 for a 4x4 grid
    initTiles();
    shuffleTiles();
    renderBoard();
}

function initTiles() {
    // Create ordered tiles with the last tile empty
    for (let i = 0; i < size * size - 1; i++) {
        tiles.push(i);
    }
    tiles.push(null); // Empty tile
    emptyTile = tiles.length - 1;
}

function shuffleTiles() {
    // Shuffle using Fisher-Yates and ensure solvability
    for (let i = tiles.length - 2; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }
    emptyTile = tiles.indexOf(null);
    if (!isSolvable()) [tiles[0], tiles[1]] = [tiles[1], tiles[0]];
}

function renderBoard() {
    puzzleBoard.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    puzzleBoard.style.gridTemplateRows = `repeat(${size}, 1fr)`;
    puzzleBoard.innerHTML = '';

    tiles.forEach((tile, index) => {
        const tileElement = document.createElement('div');
        tileElement.classList.add('tile');
        if (tile === null) {
            tileElement.classList.add('empty');
        } else {
            // Calculate background position for each tile based on index
            const row = Math.floor(tile / size);
            const col = tile % size;
            tileElement.style.backgroundPosition = `-${col * (300 / size)}px -${row * (300 / size)}px`;
            tileElement.addEventListener('click', () => moveTile(index));
        }
        puzzleBoard.appendChild(tileElement);
    });
}

function moveTile(index) {
    const emptyRow = Math.floor(emptyTile / size);
    const emptyCol = emptyTile % size;
    const row = Math.floor(index / size);
    const col = index % size;

    // Check if the tile is adjacent to the empty space
    const canMove = Math.abs(emptyRow - row) + Math.abs(emptyCol - col) === 1;
    if (canMove) {
        [tiles[emptyTile], tiles[index]] = [tiles[index], tiles[emptyTile]];
        emptyTile = index;
        renderBoard();
        if (checkWin()) message.innerText = "Congratulations! You solved Lwazilwethu's image puzzle!";
    }
}

function checkWin() {
    for (let i = 0; i < tiles.length - 1; i++) {
        if (tiles[i] !== i) return false;
    }
    return true;
}

function isSolvable() {
    let inversions = 0;
    for (let i = 0; i < tiles.length - 1; i++) {
        for (let j = i + 1; j < tiles.length - 1; j++) {
            if (tiles[i] > tiles[j]) inversions++;
        }
    }
    const gridWidth = Math.sqrt(tiles.length);
    if (gridWidth % 2 === 1) {
        return inversions % 2 === 0;
    } else {
        const emptyRowFromBottom = Math.floor(emptyTile / gridWidth) + 1;
        return (inversions + emptyRowFromBottom) % 2 === 1;
    }
}