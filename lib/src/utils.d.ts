import { GraphNode, Puzzle } from "./models";
/**
 * Tries to find a neighbor by going up.
 * @returns Return 0 if a neighbor was not found, otherwise returns an object with found neighbor
 */
export declare function traverseUp(
  puzzle: Puzzle,
  x: number,
  y: number
):
  | 0
  | {
      bridges: number;
      position: number[];
      value: string;
    };
/**
 * Tries to find a neighbor by going down.
 * @returns Return 0 if a neighbor was not found, otherwise returns an object with found neighbor
 */
export declare function traverseDown(
  puzzle: Puzzle,
  x: number,
  y: number
):
  | 0
  | {
      bridges: number;
      position: number[];
      value: string;
    };
/**
 * Tries to find a neighbor by going right.
 * @returns Return 0 if a neighbor was not found, otherwise returns an object with found neighbor
 */
export declare function traverseRight(
  puzzle: Puzzle,
  x: number,
  y: number
):
  | 0
  | {
      bridges: number;
      position: number[];
      value: string;
    };
/**
 * Tries to find a neighbor by going left.
 * @returns Return 0 if a neighbor was not found, otherwise returns an object with found neighbor
 */
export declare function traverseLeft(
  puzzle: Puzzle,
  x: number,
  y: number
):
  | 0
  | {
      bridges: number;
      position: number[];
      value: string;
    };
/** Gets the neighbors of a node. */
export declare function getNeighbors(
  node: GraphNode
): import("./models").Neighbor[];
/** Gets number of not completed bridges.  */
export declare function getBridgesNotCompleted(node: GraphNode): number;
/** Gets number of bridges. */
export declare function getBridges(node: GraphNode): number;
/** Gets the number of bridges that can be added. */
export declare function getBridgesRemaining(node: GraphNode): number;
/** Updates the state of the node and its neighbors. */
export declare function updateState(node: GraphNode): void;
/** Updates states for all multiple nodes. */
export declare function updateStates(nodes: GraphNode[]): void;
/** Return not completed nodes from the graph. */
export declare function getNotCompletedNodes(graph: GraphNode[]): GraphNode[];
/**
 * Transforms the node of lower value if possible and returns the neighbors
 * to whom a connection can be made.
 *
 * For example: If the node with value 4 has a connection with two bridges to another node,
 * than we can say that this node has a value of 2.
 */
export declare function transformNode(
  node: GraphNode
): {
  neighbors: import("./models").Neighbor[];
  value: number;
};
/** Adds bridges to the puzzle. */
export declare function fillPuzzleWithBridge(
  puzzle: Puzzle,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  numberOfBridges: number
): void;
/** Traverses the puzzle and cleans up neighbors from graph that are no longer neighbors. */
export declare function cleanNeighbors(node: GraphNode, puzzle: Puzzle): void;
/** For all nodes traverses the puzzle and cleans up neighbors from graph that are no longer neighbors. */
export declare function cleanGraph(graph: GraphNode[], puzzle: Puzzle): void;
/** From a starting nodes finds all the nodes that are connected in a graph. */
export declare function getSubGraph(node: GraphNode): GraphNode[];
/** Return true if a graph is closed i.e. every node is complete */
export declare function isGraphClosed(nodes: GraphNode[]): boolean;
/** Clamp a value between min and max. */
export declare function clamp(min: number, max: number, value: number): number;
