import type { SolverResult } from "./models";
import { solveIterative } from "./solveIterative";

/**
 * Solves the bridges puzzle.
 * @param bridgesPuzzle A 2D matrix representing the puzzle where zeros represent empty spaces.
 * @param depth The recursion depth of the algorithm. Default value is 2.
 * @param checkForMultipleSolutions Whether to check for multiple solutions. Default value is false.
 * This option can be time intensive when set to true.
 */
export function solver(
  bridgesPuzzle: number[][],
  depth = 2,
  checkForMultipleSolutions = false,
) {
  // convert the puzzle with numbers to strings
  const puzzle = bridgesPuzzle.map((row) => {
    return row.map((item) => item.toString());
  });

  const result = solveIterative(puzzle, depth, checkForMultipleSolutions);

  return result as SolverResult;
}
