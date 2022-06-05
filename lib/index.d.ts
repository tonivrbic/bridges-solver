interface SolverResult {
  /** True if the puzzle is solved. */
  solved: boolean;
  /** The solution of the puzzle. */
  solution?: Puzzle;
  /**
   * All intermediate state of the puzzle during the solving process.
   */
  steps?: Puzzle[];
  /** List of all solutions if the puzzle has multiple solutions. */
  multipleSolutions?: Set<string>;
}
/** Alias for Puzzle */
declare type Puzzle = string[][];

/**
 * Solves the bridges puzzle.
 * @param bridgesPuzzle A 2D matrix representing the puzzle where zeros represent empty spaces.
 * @param depth The recursion depth of the algorithm. Default value is 2.
 * @param checkForMultipleSolutions Whether to check for multiple solutions. Default value is false.
 * This option can be time intensive when set to true.
 */
declare function solver(
  bridgesPuzzle: number[][],
  depth?: number,
  checkForMultipleSolutions?: boolean
): SolverResult;

export { solver };
