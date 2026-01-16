# sudovim

Sudoku with Vim motions in the browser

## How to play

You can move using the Vim keys (hjkl) and insert numbers with your keyboard.

You can change the difficulty using the **asdf** keys:

* **a**: easy (51 numbers)
* **s**: medium (41 numbers)
* **d**: hard (31 numbers)
* **f**: very hard (31 numbers)

To clear a cell, press **x**.
To solve the Sudoku, press **Enter**, and to clear it afterward, press **c**.
To toggle the grid lines, press **g**.

---

## Color indications

### During the game

* The current cell is highlighted with a blue background.
* Cells with the same number are highlighted in light blue.
* Edited cells are highlighted in yellow.

### Solved Sudoku

* Empty cells are highlighted in yellow.
* Originally filled cells are gray.
* Correct cells have a green background.
* Incorrect cells are red, but the correct number is shown.

---

## Philosophy

A Sudoku may have more than one solution because generating puzzles with only one solution would take too long. I wasn’t happy with that, so I changed it. Please don’t be too strict—speed is my top priority.

---

## Links

* [GitHub.io Link](https://LeonhardWeiler.github.io/sudovim)
* [Render.com Link](https://sudovim.onrender.com)
