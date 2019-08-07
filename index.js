// @ts-check
let solver = require("./solver");
let puzzles = require("./puzzles");
// let puzzle = puzzles[puzzles.length-1];
// let puzzle = puzzles[32];
// solver(puzzle);

let results = [];
for (let i = 0; i < puzzles.length; i++) {
  let result = solver(puzzles[i]);
  results.push(result[0]);
}
results.forEach((element, i) => {
  if (element === false) {
    console.error(`${i}. not solved`);
  } else {
    console.log(`${i}. solved`);
  }
});
