import { createGraph } from "./graph";
import { solveFor } from "./islands";
import { Puzzle, SolverResult } from "./models";
import { testGraph } from "./predict";
import {
  cleanGraph,
  getNotCompletedNodes,
  getSubgraph,
  transformNode
} from "./utils";

export function solverStep(puzzle: Puzzle) {
  const graph = createGraph(puzzle);

  const nodes = getNotCompletedNodes(graph);

  let newBridges = 0;
  nodes.forEach(node => {
    if (!node.completed) {
      const transformed = transformNode(node);

      newBridges += solveFor(
        transformed.value,
        puzzle,
        node,
        transformed.neighbors
      );

      cleanGraph(graph, puzzle);
    }
  });

  if (newBridges === 0 && getSubgraph(graph[0]).length < graph.length) {
    testGraph(graph, puzzle);
  }

  return getNotCompletedNodes(graph).length === 0;
}

export function solver(bridgesPuzzle: number[][]) {
  const puzzle = bridgesPuzzle.map(row => {
    return row.map(item => item.toString());
  });

  let solved = false;
  const steps = [];
  let oldPuzzle = "";
  let newPuzzle = JSON.stringify(puzzle);
  while (oldPuzzle !== newPuzzle) {
    oldPuzzle = newPuzzle;
    solved = solverStep(puzzle);
    newPuzzle = JSON.stringify(puzzle);
    steps.push(JSON.parse(newPuzzle));

    if (solved) {
      break;
    }
  }

  return { solved, solution: puzzle, steps } as SolverResult;
}
