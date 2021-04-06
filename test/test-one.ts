import { solver } from "../src";
import { puzzles } from "./puzzles";

const result = solver(puzzles[puzzles.length - 1]);

console.log(result.solved);
