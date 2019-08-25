// tslint:disable: no-console
import "colors";
import { Puzzle, SolverResult } from "../src/models";

export function showResult(
  result: {
    solved: boolean;
    solution: string[][];
    steps: any[];
  },
  puzzleIndex: number,
  size: {
    columns: number;
    rows: number;
  },
  duration: number
) {
  if (result.solved === false) {
    console.log(
      `❌ ${puzzleIndex}. not solved ${size.rows}x${size.columns}`.red
    );
    result.steps.forEach((step, i) => {
      console.log(`Iteration ${i + 1}`);
      showPuzzle(step);
    });
  } else {
    console.log(
      `✔ ${puzzleIndex}. solved ${size.rows}x${size.columns} in ${duration}ms`
        .green
    );
  }
}

export function showSummary(results: SolverResult[], puzzlesCount: number) {
  const solvedNum = results.filter(x => x.solved === true).length;
  console.log(`Solved ${solvedNum}/${puzzlesCount}`.underline.bold);
}

export function getSize(puzzle: number[][]) {
  return {
    columns: puzzle[0].length,
    rows: puzzle.length
  };
}

function showPuzzle(puzzle: Puzzle) {
  console.log("----------------------------------");
  const display = [];
  puzzle.forEach(row => display.push(" ".repeat(row.length)));
  for (let i = 0; i < puzzle.length; i++) {
    for (let j = 0; j < puzzle.length; j++) {
      if (
        (puzzle[i][j] > "0" && puzzle[i][j] < "9") ||
        puzzle[i][j] === "=" ||
        puzzle[i][j] === "-" ||
        puzzle[i][j] === "$" ||
        puzzle[i][j] === "|"
      ) {
        // place value inside string at correct position
        display[i] =
          display[i].slice(0, j) +
          puzzle[i][j] +
          display[i].slice(j + 1, puzzle.length);
      }
    }
  }
  display.forEach(row => console.log(row));
  console.log("----------------------------------");
  return display;
}
