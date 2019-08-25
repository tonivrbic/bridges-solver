/**
 * The island as a node in the graph.
 */
export interface GraphNode {
  id: number;
  completed: boolean;
  position: number[];
  value: number;
  neighbors: Neighbor[];
}
/**
 * An islands neighbor in the graph.
 */
export interface Neighbor {
  bridges: number;
  position: number[];
  done: boolean;
  node: GraphNode;
}
export interface ExtractedIsland {
  position: number[];
  value: string;
}
/**
 * The result of the solver function.
 */
export interface SolverResult {
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
export declare type Puzzle = string[][];
