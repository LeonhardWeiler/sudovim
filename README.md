# sudovim
sudoku with vim motions in the browser

## How to play
You can move with vim keys (hjkl) and insert numbers with the keyboard.

You can change the difficulty with asdf keys.
The difficultys are:
- a: easy (51 numbers)
- s: medium (41 numbers)
- d: hard (31 numbers)
- f: very hard (31 numbers)

To clear a cell press x.
To solve the sudoku you can press enter and to then clear it press c.
If you want to toggle the lines you can do this with g.

## Color indications
### During the game
- The current cell is highlighted with a blue background.
- Cells with the same number are highlighted with light blue background.
- Edited cells are highlighted wiht a yellow background.

### Solved sudoku
- Empty cells are highlighted with a yellow background.
- Cells that are originally filled are gray.
- Correct cells have a green background.
- Wrong cells have a red background but the correct number is shown.

## Phylosophy
There may be more then one solution to a sudoku, because it would took to long to generate sudokus with only one solution. I wasn't happy with that so I changed it. Please don't be to mad. Speed is my number one priority.

## Links
- [github.io Link](https://LeonhardWeiler.github.io/sudovim)
- [render.com Link](https://sudovim.onrender.com)

