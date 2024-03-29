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
  depth: number,
  checkForMultipleSolutions: boolean
): SolverResult {
  let solutions = new Set<string>();
  let notCompetedNodes = getNotCompletedNodes(graph);
  for (const node of notCompetedNodes) {
    for (const neighbor of getNeighbors(node)) {
      const result = tryToConnect(
        puzzle,
        node,
        neighbor,
        depth,
        checkForMultipleSolutions
      );
      if (result.solved === true) {
        if (!checkForMultipleSolutions) {
          return result;
        }

        if (result.solution) {
          solutions.add(JSON.stringify(result.solution));
        }

        if (result.multipleSolutions) {
          for (const solution of result.multipleSolutions) {
            solutions.add(solution);
          }
        }
      }
    }
  }

  if (solutions.size === 1) {
    return {
      solved: true,
      solution: JSON.parse(solutions.values().next().value)
    };
  }

  if (solutions.size > 1) {
    return {
      solved: true,
      multipleSolutions: solutions
    };
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
  depth: number,
  checkForMultipleSolutions: boolean
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

  const result = solveIterative(
    puzzleClone,
    --depth,
    checkForMultipleSolutions
  );

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
