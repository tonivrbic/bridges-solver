import { GraphNode, Neighbor } from "./models";
/**
 * Tries to connect the node to its neighbors.
 * @param value The current value of the island.
 */
export declare const solveFor: (
  value: number,
  puzzle: string[][],
  node: GraphNode,
  neighbors: Neighbor[]
) => number;
