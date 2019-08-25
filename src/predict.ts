import { createGraph } from "./graph";
import { solveFor } from "./islands";
import { GraphNode, Neighbor, Puzzle } from "./models";
import {
  cleanGraph,
  getBridges,
  getNeighbors,
  getNotCompletedNodes,
  getSubGraph,
  isGraphClosed
} from "./utils";

/**
 * Tries with brute force to find a new possible connection to make.
 */
export function connectGraphs(graph: GraphNode[], puzzle: Puzzle) {
  for (const node of getNotCompletedNodes(graph)) {
    const results: { neighbor: Neighbor; openGraph: boolean }[] = [];
    for (const neighbor of getNeighbors(node)) {
      const result = tryToConnect(puzzle, node, neighbor);
      results.push({ neighbor, openGraph: result });
    }

    // after trying all connections from a node to its neighbor and only one of the connections
    // resulted in a non closed final graph, than use that connection and return
    if (results.length > 1 && results.filter(x => x.openGraph).length === 1) {
      connectToNeighbor(
        node,
        results.find(x => x.openGraph === true).neighbor,
        puzzle
      );
      return true;
    }
  }

  return false;
}

/**
 * Tries to make a connection form the node to the neighbor.
 * @returns Returns false if the connection created a non final closed graph, otherwise true
 */
function tryToConnect(puzzle: Puzzle, node: GraphNode, neighbor: Neighbor) {
  const puzzleClone = clone(puzzle);
  const graph = createGraph(puzzleClone);
  const testNode = graph.find(x => x.id === node.id);
  const testNeighbor = getNeighbors(testNode).find(
    x => x.node.id === neighbor.node.id
  );

  connectToNeighbor(testNode, testNeighbor, puzzleClone);
  cleanGraph(graph, puzzleClone);

  // if the created connection resulted in a closed graph return false
  const subGraph = getSubGraph(testNode);
  if (subGraph.length < graph.length && isGraphClosed(subGraph)) {
    return false;
  }

  return true;
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
