import { createGraph } from "./graph";
import { solveFor } from "./islands";
import { GraphNode, Neighbor, Puzzle, SolverResult } from "./models";
import { solveIterative } from "./solveIterative";
import {
  cleanGraph,
  getBridges,
  getNeighbors,
  getNotCompletedNodes
} from "./utils";

/**
 * Tries with brute force to find a new possible connection to make.
 */
export function bruteForceNewConnection(
  graph: GraphNode[],
  puzzle: Puzzle,
  depth: number
): SolverResult {
  for (const node of getNotCompletedNodes(graph)) {
    for (const neighbor of getNeighbors(node)) {
      const result = tryToConnect(puzzle, node, neighbor, depth);
      if (result.solved === true) {
        return result;
      }
    }
  }

  return { solved: false };
}

/**
 * Tries to make a connection form the node to the neighbor.
 * @returns Returns false if the connection created a non final closed graph, otherwise true
 */
function tryToConnect(
  puzzle: Puzzle,
  node: GraphNode,
  neighbor: Neighbor,
  depth: number
): SolverResult {
  if (depth < 0) {
    return { solved: false };
  }

  const puzzleClone = clone(puzzle);
  const graph = createGraph(puzzleClone);
  const testNode = graph.find(x => x.id === node.id);
  const testNeighbor = getNeighbors(testNode).find(
    x => x.node.id === neighbor.node.id
  );

  connectToNeighbor(testNode, testNeighbor, puzzleClone);
  cleanGraph(graph, puzzleClone);

  const result = solveIterative(puzzleClone, --depth);

  return result;
}

/**
 * Connects to neighbor.
 */
function connectToNeighbor(
  node: GraphNode,
  neighbor: Neighbor,
  puzzle: string[][]
) {
  const value = node.value - getBridges(node) + neighbor.bridges;
  return solveFor(value, puzzle, node, [neighbor]);
}

/**
 * Clones the puzzle.
 */
function clone(puzzle: string[][]) {
  return JSON.parse(JSON.stringify(puzzle));
}
