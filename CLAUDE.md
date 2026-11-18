# sudovim

Sudoku in the browser, played with Vim keys. Plain static site: `index.html`,
`style.css`, `script.js`, no build step, no dependencies, no tests, no CI.

## Run

Open `index.html` in a browser, or serve the folder:

```sh
python3 -m http.server
```

## Check

No automated checks. Load the page, play a round with the keys from `README.md`
and watch the browser console for errors.

## Notes

- Puzzles are generated in `script.js`; they may have more than one solution (see `README.md`).
- Difficulty and grid-line setting persist in `localStorage`.
- GitHub Pages serves `main`; `README.md` also links a Render copy.
