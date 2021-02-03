import { createGraph } from "./graph";
import { solveFor } from "./islands";
import { Puzzle, SolverResult } from "./models";
import { bruteForceNewConnection } from "./predict";
import { cleanGraph, getNotCompletedNodes, transformNode } from "./utils";

/**
 * Iterates through all islands and adds new bridges. This function should be called
 * multiple times until the puzzle is solved.
 */
export function solverStep(puzzle: Puzzle, depth: number) {
  if (depth < 0) {
    return false;
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
    const result = bruteForceNewConnection(graph, puzzle, depth);
    return result;
  }

  // the puzzle is solved when all nodes are completed
  return getNotCompletedNodes(graph).length === 0;
}

/**
 * Solves the bridges puzzle.
 * @param bridgesPuzzle A 2D matrix representing the puzzle where zeros represent empty spaces.
 * @param depth The recursion depth of the algorithm. Default value is 3.
 */
export function solver(bridgesPuzzle: number[][], depth: number = 3) {
  // convert the puzzle with numbers to strings
  const puzzle = bridgesPuzzle.map(row => {
    return row.map(item => item.toString());
  });

  const { solved, steps } = solveIterative(puzzle, depth);

  return { solved, solution: puzzle, steps } as SolverResult;
}

/**
 * Loops through solverSteps until the puzzle is solved.
 */
export function solveIterative(puzzle: string[][], depth: number) {
  let solved = false;
  const steps = [];
  let oldPuzzle = "";
  let newPuzzle = JSON.stringify(puzzle);

  // loop while new bridges are added to the puzzle
  while (oldPuzzle !== newPuzzle) {
    oldPuzzle = newPuzzle;

    solved = solverStep(puzzle, depth);

    newPuzzle = JSON.stringify(puzzle);

    // save a copy of the current puzzle
    steps.push(JSON.parse(newPuzzle));

    // exit loop if the puzzle is solved
    if (solved) {
      break;
    }
  }

  return { solved, steps };
}
