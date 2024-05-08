import { solver } from "../src";
import { showPuzzle } from "./helpers";
import { puzzles } from "./puzzles";

const result = solver(puzzles[puzzles.length - 1], 2, true);

console.log(result.solved);

if (result.multipleSolutions) {
  for (const sol of result.multipleSolutions) {
    showPuzzle(JSON.parse(sol));
  }
  console.log("Multiple solutions found");
}
