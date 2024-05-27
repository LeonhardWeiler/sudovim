function possible(y, x, n, grid) {
  for (let i = 0; i < 9; i++) {
    if (grid[y][i] === n || grid[i][x] === n) {
      return false;
    }
  }

  const subgridStartX = Math.floor(x / 3) * 3;
  const subgridStartY = Math.floor(y / 3) * 3;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[subgridStartY + i][subgridStartX + j] === n) {
        return false;
      }
    }
  }
  return true;
}

function solveSudoku(grid) {
  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 9; x++) {
      if (grid[y][x] === 0) {
        for (let n = 1; n <= 9; n++) {
          if (possible(y, x, n, grid)) {
            grid[y][x] = n;
            if (solveSudoku(grid)) {
              return true;
            }
            grid[y][x] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

let originalSudokuGrid;

function createSudokuGrid(difficulty) {
  const grid = Array.from({ length: 9 }, () => Array(9).fill(0));
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  shuffle(numbers);
  for (let i = 0; i < 9; i++) {
    grid[0][i] = numbers[i];
  }
  solveSudoku(grid);

  const difficultyMap = {
    "easy": 30,
    "medium": 40,
    "hard": 50,
    "very-hard": 60
  };

  const cellsToRemove = difficultyMap[difficulty];
  let cellsRemoved = 0;
  while (cellsRemoved < cellsToRemove) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if (grid[row][col] !== 0) {
      const temp = grid[row][col];
      grid[row][col] = 0;
      const tempGrid = JSON.parse(JSON.stringify(grid));
      if (!solveSudoku(tempGrid)) {
        grid[row][col] = temp;
      } else {
        cellsRemoved++;
      }
    }
  }

  originalSudokuGrid = JSON.parse(JSON.stringify(grid));
  return grid;
}

function createSudokuGridHTML(grid) {
  const sudokuCells = document.querySelectorAll('.sudoku__cell');
  const middleCellIndex = 40;
  sudokuCells.forEach((cell, index) => {
    const row = Math.floor(index / 9);
    const col = index % 9;
    const cellValue = grid[row][col];
    cell.textContent = cellValue === 0 ? '' : cellValue;
    if (cellValue === 0) {
      cell.classList.add('editable');
    } else {
      cell.classList.remove('editable');
    }
  });
  sudokuCells[middleCellIndex].classList.add('highlight');
}

function updateSudokuGrid(difficulty) {
  const sudokuGrid = createSudokuGrid(difficulty);
  createSudokuGridHTML(sudokuGrid);
  clearColors();
  resetCursor();
  localStorage.setItem('sudokuDifficulty', difficulty);
}

const lastDifficulty = localStorage.getItem('sudokuDifficulty') || 'medium';

window.addEventListener('load', () => updateSudokuGrid(lastDifficulty));
document.querySelector("#easy").addEventListener("click", () => updateSudokuGrid('easy'));
document.querySelector("#medium").addEventListener("click", () => updateSudokuGrid('medium'));
document.querySelector("#hard").addEventListener("click", () => updateSudokuGrid('hard'));
document.querySelector("#very-hard").addEventListener("click", () => updateSudokuGrid('very-hard'));
document.querySelector("#clear").addEventListener("click", () => clearSudokuGrid());
document.querySelector("#solve").addEventListener("click", solveSudokuGrid);
document.addEventListener('keydown', event => cursorHighlight(event));

function resetCursor() {
  currentRow = 4;
  currentCol = 4;
  document.querySelectorAll('.sudoku__cell').forEach(cell => {
    cell.classList.remove('highlight');
  });
  document.querySelectorAll('.sudoku__cell')[currentRow * 9 + currentCol].classList.add('highlight');
}

function clearColors() {
  const sudokuCells = document.querySelectorAll('.solved');
  const editedCells = document.querySelectorAll('.edited');
  sudokuCells.forEach(cell => cell.classList.remove('solved'));
  editedCells.forEach(cell => cell.classList.remove('edited'));
}

function clearSudokuGrid() {
  const sudokuCells = document.querySelectorAll('.solved');
  if (sudokuCells.length > 0) {
    sudokuCells.forEach(cell => {
      cell.textContent = '';
      cell.classList.remove('solved');
    });
  }
}

function solveSudokuGrid() {
  const sudokuCells = document.querySelectorAll('.sudoku__cell');
  const grid = [];
  let index = 0;
  for (let i = 0; i < 9; i++) {
    const row = [];
    for (let j = 0; j < 9; j++) {
      const cellValue = sudokuCells[index].textContent.trim();
      row.push(parseInt(cellValue) || 0);
      index++;
    }
    grid.push(row);
  }
  if (solveSudoku(grid)) {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (sudokuCells[i * 9 + j].textContent !== grid[i][j].toString()) {
          sudokuCells[i * 9 + j].textContent = grid[i][j];
          sudokuCells[i * 9 + j].classList.add('solved');
        }
      }
    }
  } else {
    alert('sudoku is wrong!');
  }
}

let currentRow = 4;
let currentCol = 4;

function cursorHighlight(event) {
  const highlightedCell = document.querySelector('.highlight');
  const sudokuCells = document.querySelectorAll('.sudoku__cell');
  const key = event.key;

  if (key === 'h' && currentCol > 0) {
    currentCol--;
  } else if (key === 'j' && currentRow < 8) {
    currentRow++;
  } else if (key === 'k' && currentRow > 0) {
    currentRow--;
  } else if (key === 'l' && currentCol < 8) {
    currentCol++;
  } else if (!isNaN(key) && key >= 1 && key <= 9 && highlightedCell.classList.contains('editable')) {
      highlightedCell.textContent = key;
      highlightedCell.classList.add('edited');
  } else if ((key === 'Backspace' || key === 'Delete' || key === 'x') && highlightedCell.classList.contains('editable')) {
      highlightedCell.textContent = '';
      highlightedCell.classList.remove('edited');
  }

  const newIndex = currentRow * 9 + currentCol;
  highlightedCell.classList.remove('highlight');
  sudokuCells[newIndex].classList.add('highlight');
}
