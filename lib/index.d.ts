interface SolverResult {
  /** True if the puzzle is solved. */
  solved: boolean;
  /** The solution of the puzzle. */
  solution?: Puzzle;
  /**
   * All intermediate state of the puzzle during the solving process.
   */
  steps?: Puzzle[];
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

export { solver };
