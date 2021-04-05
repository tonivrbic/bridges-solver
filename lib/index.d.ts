interface SolverResult {
  /** True if the puzzle is solved. */
  solved: boolean;
  /** The solution of the puzzle. */
  solution: Puzzle;
  /**
   * All intermediate state of the puzzle during the solving process.
   */
  steps: Puzzle[];
}
/** Alias for Puzzle */
declare type Puzzle = string[][];

/**
 * Solves the bridges puzzle.
 * @param bridgesPuzzle A 2D matrix representing the puzzle where zeros represent empty spaces.
 * @param depth The recursion depth of the algorithm. Default value is 3.
 */
declare function solver(
  bridgesPuzzle: number[][],
  depth?: number
): SolverResult;
/**
 * Loops through solverSteps until the puzzle is solved.
 */
declare function solveIterative(
  puzzle: string[][],
  depth: number
): {
  solved: any;
  steps: any[];
};
/**
 * Iterates through all islands and adds new bridges. This function should be called
 * multiple times until the puzzle is solved.
 */
declare function solverStep(
  puzzle: Puzzle,
  depth: number
):
  | {
      solved: boolean;
    }
  | {
      puzzle: Puzzle;
      solved: boolean;
      steps?: any[];
    };

export { solveIterative, solver, solverStep };
