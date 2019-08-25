import { GraphNode, Puzzle } from "./models";
/**
 * Tries with brute force to find a new possible connection to make.
 */
export declare function connectGraphs(
  graph: GraphNode[],
  puzzle: Puzzle
): boolean;
