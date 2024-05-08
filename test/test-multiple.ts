import { readFileSync } from "node:fs";
import { solver } from "../src";

const puzzles = [];

for (const level of ["easy", "medium", "hard"]) {
  console.log(`Testing ${level}`);
  for (let i = 1; i <= 50; i++) {
    if (![1, 29, 47].includes(i)) continue;

    const item = JSON.parse(
      readFileSync(`./test/app-puzzles/${level}/${i}.json`, "utf-8"),
    );

    const result = solver(item.puzzle, 3, true);

    if (result.multipleSolutions) {
      // for (const sol of result.multipleSolutions) {
      //   showPuzzle(JSON.parse(sol));
      // }
      console.log(`Multiple solutions found for ${i}`);
    } else {
      console.log(`✅ ${i}`);
    }
  }
}
