const lastDifficulty = localStorage.getItem("sudokuDifficulty") || "medium";
let showLines = localStorage.getItem("showLines") || "true";

window.addEventListener("load", () => updateSudokuGrid(lastDifficulty, showLines));

document.querySelector("#easy").addEventListener("click", () => updateSudokuGrid("easy", showLines));
document.querySelector("#medium").addEventListener("click", () => updateSudokuGrid("medium", showLines));
document.querySelector("#hard").addEventListener("click", () => updateSudokuGrid("hard", showLines));
document.querySelector("#very-hard").addEventListener("click", () => updateSudokuGrid("very-hard", showLines));

document.querySelector("#clear").addEventListener("click", () => clearSudokuGrid(showLines));
document.querySelector("#solve").addEventListener("click", () => solveSudokuGrid());
document.querySelector(".toggle-lines").addEventListener("click", () => toggleLines());

document.addEventListener("keydown", (event) => reactToKey(event, showLines));

let originalSudokuGrid;
let currentRow;
let currentCol;

function updateSudokuGrid(difficulty, showLines) {
  createSudokuGridHTML(difficulty);
  resetSudoku(showLines);
  localStorage.setItem("sudokuDifficulty", difficulty);
}

function possible(x, y, n, grid) {
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
          if (possible(x, y, n, grid)) {
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
  return array;
}

function createSudokuGrid(difficulty) {
  const grid = Array.from({ length: 9 }, () => Array(9).fill(0));
  const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);

  grid[0] = numbers;

  solveSudoku(grid);

  originalSudokuGrid = JSON.parse(JSON.stringify(grid));

  const difficultyMap = {
    easy: 30,
    medium: 40,
    hard: 50,
    "very-hard": 60,
  };

  removeCells(grid, difficultyMap[difficulty]);
  return grid;
}

function removeCells(grid, cellsToRemove) {
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
}

function createSudokuGridHTML(difficulty) {
  const grid = createSudokuGrid(difficulty);
  document.querySelectorAll(".cell").forEach((cell, index) => {
    const row = Math.floor(index / 9);
    const col = index % 9;
    const cellValue = grid[row][col];
    if (cellValue === 0) {
      cell.textContent = "";
      cell.classList.add("editable");
    } else {
      cell.textContent = cellValue;
      cell.classList.remove("editable");
    }
  });
}

function resetSudoku(showLines) {
  resetCursor();
  clearColors();
  highlightSimilar();
  if (showLines === "true") {
    highlightLines();
  }
  toggleButtonCenter(showLines);
}

function resetCursor() {
  currentRow = 4;
  currentCol = 4;
  const highlightedCell = document.querySelector(".highlight");
  if (highlightedCell) {
    highlightedCell.classList.remove("highlight");
  }
  document.querySelectorAll(".cell")[40].classList.add("highlight");
}

function clearColors() {
  document
    .querySelectorAll(".solved")
    .forEach((cell) => cell.classList.remove("solved"));
  document
    .querySelectorAll(".edited")
    .forEach((cell) => cell.classList.remove("edited"));
  document
    .querySelectorAll(".wrong")
    .forEach((cell) => cell.classList.remove("wrong"));
  document
    .querySelectorAll(".original")
    .forEach((cell) => cell.classList.remove("original"));
  document
    .querySelectorAll(".empty")
    .forEach((cell) => cell.classList.remove("empty"));
}

function highlightSimilar() {
  const highlightedCellValue = document.querySelector(".highlight").textContent;

  document.querySelectorAll(".cell").forEach((cell) => {
    cell.classList.remove("similar");

    if (
      cell.textContent === highlightedCellValue &&
      cell !== document.querySelector(".highlight") &&
      cell.textContent !== ""
    ) {
      cell.classList.add("similar");
    }
  });
}

function highlightLines() {
  const highlightedCell = document.querySelector(".highlight");
  const sudokuCells = Array.from(document.querySelectorAll(".cell"));
  const rowIndex = Math.floor(sudokuCells.indexOf(highlightedCell) / 9);
  const colIndex = sudokuCells.indexOf(highlightedCell) % 9;

  sudokuCells.forEach((cell, index) => {
    const cellRow = Math.floor(index / 9);
    const cellCol = index % 9;

    cell.classList.remove("highlight-line");

    if (cellCol === colIndex && cell !== highlightedCell) {
      cell.classList.add("highlight-line");
    } else if (cellRow === rowIndex && cell !== highlightedCell) {
      cell.classList.add("highlight-line");
    }
  });
}

function clearSudokuGrid(showLines) {
  document.querySelectorAll(".cell").forEach((cell) => {
    if (cell.classList.contains("editable")) {
      cell.textContent = "";
    }
  });
  resetSudoku(showLines);
}

function solveSudokuGrid() {
  const highlightedCell = document.querySelector(".highlight");
  if (!highlightedCell) {
    return;
  }
  const sudokuCells = document.querySelectorAll(".cell");
  document.querySelectorAll(".similar").forEach((cell) => {
    cell.classList.remove("similar");
  });
  document.querySelectorAll(".highlight-line").forEach((cell) => {
    cell.classList.remove("highlight-line");
  });
  highlightedCell.classList.remove("highlight");

  sudokuCells.forEach((cell) => {
    if (!cell.classList.contains("editable")) {
      cell.classList.add("original");
    }
  });

  originalSudokuGrid.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const index = rowIndex * 9 + colIndex;
      let cellValue = sudokuCells[index].textContent;
      if (cellValue === "") {
        sudokuCells[index].textContent = cell;
        sudokuCells[index].classList.add("empty");
      } else if (cellValue !== cell.toString()) {
        sudokuCells[index].textContent = cell;
        sudokuCells[index].classList.add("wrong");
      } else {
        sudokuCells[index].classList.add("solved");
      }
    });
  });
  alreadySolved = true;
}

function reactToKey(event, showLines) {
  const key = event.key;
  const keyToDifficulty= {
    a: "easy",
    s: "medium",
    d: "hard",
    f: "very-hard",
  };

  if (key === "c") {
    clearSudokuGrid(showLines);
  } else if (["a", "s", "d", "f"].includes(key)) {
    updateSudokuGrid(keyToDifficulty[key], showLines);
  }

  const highlightedCell = document.querySelector(".highlight");
  if (!highlightedCell) {
    return;
  }

  if (["h", "j", "k", "l"].includes(key) && highlightedCell) {
    moveCursor(key, highlightedCell);
    highlightSimilar();
    if (showLines === "true") {
      highlightLines();
    }
  } else if (key === "x" && highlightedCell.classList.contains("editable")) {
    clearCellValue(highlightedCell);
    highlightSimilar();
  } else if (!isNaN(key) && key >= 1 && key <= 9 && highlightedCell.classList.contains("editable")) {
    setCellValue(key, highlightedCell);
    highlightSimilar();
  } else if (key === "Enter") {
    solveSudokuGrid();
  } else if (key === "g") {
    toggleLines();
  }
}

function setCellValue(key, cell) {
  cell.textContent = key;
  cell.classList.add("edited");
}

function clearCellValue(cell) {
  cell.textContent = "";
  cell.classList.remove("edited");
}

function moveCursor(key, cell) {
  if (key === "h" && currentCol > 0) {
    currentCol--;
  } else if (key === "j" && currentRow < 8) {
    currentRow++;
  } else if (key === "k" && currentRow > 0) {
    currentRow--;
  } else if (key === "l" && currentCol < 8) {
    currentCol++;
  }

  const newIndex = currentRow * 9 + currentCol;
  cell.classList.remove("highlight");
  document.querySelectorAll(".cell")[newIndex].classList.add("highlight");
}

function toggleLines() {
  const button = document.querySelector(".box");
  const lines = document.querySelectorAll(".highlight-line");

  if (button.childNodes.length > 0) {
    showLines = "false";
    toggleButtonCenter(showLines, button);
    lines.forEach((line) => line.classList.remove("highlight-line"));
    localStorage.setItem("showLines", showLines);
  } else {
    showLines = "true";
    toggleButtonCenter(showLines, button);
    localStorage.setItem("showLines", showLines);
  }
}

function toggleButtonCenter(showLines, button = document.querySelector(".box")) {
  if (showLines === "true" && button.childNodes.length === 0) {
    const center = document.createElement("div");
    center.classList.add("box-center");
    button.appendChild(center);
    highlightLines();
  } else if (showLines === "false" && button.childNodes.length > 0) {
    button.removeChild(button.firstChild);
  }
}
