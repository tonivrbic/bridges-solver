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
 * Iterates through all islands and adds new bridges. This function should be called
 * multiple times until the puzzle is solved.
 */
declare function solverStep(puzzle: Puzzle): boolean;
/**
 * Solves the bridges puzzle.
 * @param bridgesPuzzle A 2D matrix representing the puzzle where zeros represent empty spaces.
 */
declare function solver(bridgesPuzzle: number[][]): SolverResult;

export { solver, solverStep };
