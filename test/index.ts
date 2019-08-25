import { solver } from "../src/main";
import { SolverResult } from "../src/models";
import { getSize, showResult, showSummary } from "./helpers";
import { puzzles } from "./puzzles";

const results: SolverResult[] = [];

for (let i = 0; i < puzzles.length; i++) {
  const size = getSize(puzzles[i]);
  const start = new Date().getTime();

  const result = solver(puzzles[i]);

  const duration = new Date().getTime() - start;

  results.push(result);

  showResult(result, i, size, duration);
}

showSummary(results, puzzles.length);
