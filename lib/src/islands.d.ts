import { GraphNode, Neighbor, Puzzle } from "./models";
export declare const solveFor: (value: number, puzzle: string[][], node: GraphNode, neighbors: Neighbor[]) => number;
export declare function one(node: GraphNode, neighbors: Neighbor[], puzzle: Puzzle): number;
export declare function two(node: GraphNode, neighbors: Neighbor[], puzzle: Puzzle): number;
export declare function others(value: number, node: GraphNode, neighbors: Neighbor[], puzzle: Puzzle): number;
export declare function getBridgesNotCompleted(node: GraphNode): number;
export declare function getBridges(node: GraphNode): number;
export declare function getBridgesRemaining(node: GraphNode): number;
