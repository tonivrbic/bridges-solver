import { solver } from "../src";
import { SolverResult } from "../src/models";
import { getSize, showPuzzle, showResult, showSummary } from "./helpers";
import { puzzles } from "./puzzles";

const results: SolverResult[] = [];

for (let i = 0; i < puzzles.length; i++) {
  const size = getSize(puzzles[i]);
  const start = new Date().getTime();

  const result = solver(puzzles[i]);

  const duration = new Date().getTime() - start;

  results.push(result);

  showResult(result, i, size, duration);

  if (result.multipleSolutions) {
    for (const sol of result.multipleSolutions) {
      showPuzzle(JSON.parse(sol));
    }
  }
}

showSummary(results, puzzles.length);

if (results.some(x => !x.solved)) {
  throw new Error("Test did not pass");
}
