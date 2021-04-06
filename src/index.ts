import { SolverResult } from "./models";
import { solveIterative } from "./solveIterative";

/**
 * Solves the bridges puzzle.
 * @param bridgesPuzzle A 2D matrix representing the puzzle where zeros represent empty spaces.
 * @param depth The recursion depth of the algorithm. Default value is 3.
 */
export function solver(bridgesPuzzle: number[][], depth: number = 3) {
  // convert the puzzle with numbers to strings
  const puzzle = bridgesPuzzle.map(row => {
    return row.map(item => item.toString());
  });

  const result = solveIterative(puzzle, depth);

  return result as SolverResult;
}
