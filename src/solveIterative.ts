import { createGraph } from "./graph";
import { solveFor } from "./islands";
import { Puzzle, SolverResult } from "./models";
import { bruteForceNewConnection } from "./predict";
import {
  cleanGraph,
  getNotCompletedNodes,
  isPuzzleCompleted,
  transformNode
} from "./utils";

/**
 * Loops through solverSteps until the puzzle is solved.
 */
export function solveIterative(
  puzzle: string[][],
  depth: number,
  checkForMultipleSolutions: boolean
) {
  let result: SolverResult;
  let steps = [];
  let oldPuzzle = "";
  let newPuzzle = JSON.stringify(puzzle);

  // loop while new bridges are added to the puzzle
  while (oldPuzzle !== newPuzzle) {
    oldPuzzle = newPuzzle;

    result = solverStep(puzzle, depth, checkForMultipleSolutions);

    if (result.solution) {
      newPuzzle = JSON.stringify(result.solution);

      // save a copy of the current puzzle
      steps.push(JSON.parse(newPuzzle));
    }

    // exit loop if the puzzle is solved
    if (result.solved) {
      break;
    }

    // exit loop if the puzzle has multiple solutions
    if (result.multipleSolutions) {
      break;
    }

    // exit loop if the puzzle is not solved and there are no new bridges to add
    if (
      result.solved === false &&
      result.solution &&
      getNotCompletedNodes(createGraph(result.solution)).length === 0
    ) {
      break;
    }
  }

  if (result.steps) {
    steps = [...steps, ...result.steps];
  }
  return { ...result, steps: steps };
}

/**
 * Iterates through all islands and adds new bridges. This function should be called
 * multiple times until the puzzle is solved.
 */
export function solverStep(
  puzzle: Puzzle,
  depth: number,
  checkForMultipleSolutions: boolean
): SolverResult {
  if (depth < 0) {
    return { solved: false };
  }
  const graph = createGraph(puzzle);

  const nodes = getNotCompletedNodes(graph);

  let newBridges = 0;
  nodes.forEach(node => {
    if (!node.completed) {
      // transform the island to an island of lower value if it has bridges
      const transformed = transformNode(node);

      newBridges += solveFor(
        transformed.value,
        puzzle,
        node,
        transformed.neighbors
      );

      // removes neighbors from graph that are no longer neighbors
      cleanGraph(graph, puzzle);
    }
  });

  // if no bridge has been added and we have multiple smaller graphs instead of one graph,
  // than try to connect those graphs into one
  if (newBridges === 0 && getNotCompletedNodes(graph).length > 0) {
    const result = bruteForceNewConnection(
      graph,
      puzzle,
      depth,
      checkForMultipleSolutions
    );
    return result;
  }

  // the puzzle is solved when all nodes are completed
  return { solved: isPuzzleCompleted(graph), solution: puzzle };
}
