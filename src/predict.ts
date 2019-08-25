import { createGraph } from "./graph";
import { solveFor } from "./islands";
import { GraphNode, Neighbor, Puzzle } from "./models";
import {
  cleanGraph,
  getNeighbors,
  getNotCompletedNodes,
  getSubgraph,
  isGraphClosed
} from "./utils";

export function testGraph(nodes: GraphNode[], puzzle: Puzzle) {
  for (const node of getNotCompletedNodes(nodes)) {
    const results: { neighbor: Neighbor; openGraph: boolean }[] = [];
    for (const neighbor of getNeighbors(node)) {
      const result = tryToConnect(puzzle, node, neighbor);
      results.push({ neighbor, openGraph: result });
    }

    if (results.length > 1 && results.filter(x => x.openGraph).length === 1) {
      oneOrTwo(node, results.find(x => x.openGraph === true).neighbor, puzzle);
      return true;
    }
  }

  return false;
}

function oneOrTwo(node: GraphNode, neighbor: Neighbor, puzzle: string[][]) {
  const value =
    node.value -
    getNeighbors(node).reduce((a, b) => a + b.bridges, 0) +
    neighbor.bridges;
  return solveFor(value, puzzle, node, [neighbor]);
  // return solveFor(transformed.value, puzzle, node, [neighbor]);

  // if (node.value === 1) {
  //     return one(node, [neighbor], puzzle);
  // }
  // if (node.value === 2) {
  //     return two(node, [neighbor], puzzle);
  // }
}

function tryToConnect(puzzle: Puzzle, node: GraphNode, neighbor: Neighbor) {
  const puzzleClone = clone(puzzle);
  const clonedGraph = createGraph(puzzleClone);
  const clonedNode = clonedGraph.find(x => x.id === node.id);

  const clonedNeighbor = getNeighbors(clonedNode).find(
    x => x.node.id === neighbor.node.id
  );

  oneOrTwo(clonedNode, clonedNeighbor, puzzleClone);
  cleanGraph(clonedGraph, puzzleClone);

  // if (bridgeAdded === 0) {
  //     return false;
  // }

  const subgraph = getSubgraph(clonedNode);
  if (subgraph.length < clonedGraph.length && isGraphClosed(subgraph)) {
    return false;
  }

  return true;
}

function clone(puzzle: string[][]) {
  return JSON.parse(JSON.stringify(puzzle));
}
