import type { ExtractedIsland, GraphNode, Puzzle } from "./models";
import {
  traverseDown,
  traverseLeft,
  traverseRight,
  traverseUp,
  updateStates,
} from "./utils";

/**
 * Create a graph from the puzzle.
 */
export function createGraph(puzzle: Puzzle) {
  const extractedIslands = extractIslands(puzzle);

  const nodes = createNodes(puzzle, extractedIslands);

  connectNodes(nodes);

  updateStates(nodes);

  return nodes;
}

/**
 * Extract islands from the puzzle.
 */
function extractIslands(puzzle: Puzzle) {
  const islands: ExtractedIsland[] = [];
  puzzle.forEach((row, i) => {
    row.forEach((item, j) => {
      if (item > "0" && item < "9") {
        islands.push({
          position: [i, j],
          value: item,
        });
      }
    });
  });
  return islands;
}

/**
 * Creates nodes for the graph from extracted islands.
 */
function createNodes(puzzle: Puzzle, extractedIslands: ExtractedIsland[]) {
  return extractedIslands.map((item, index) => {
    const up = traverseUp(puzzle, item.position[0], item.position[1]);
    const right = traverseRight(puzzle, item.position[0], item.position[1]);
    const down = traverseDown(puzzle, item.position[0], item.position[1]);
    const left = traverseLeft(puzzle, item.position[0], item.position[1]);

    // get neighbors of node
    const neighbors = [];
    for (const i of [up, right, down, left]) {
      if (typeof i === "number") {
        neighbors.push(null);
      } else {
        neighbors.push({
          bridges: i.bridges,
          done: false,
          node: {},
          position: i.position,
        });
      }
    }

    return {
      completed: false,
      id: index,
      neighbors,
      position: item.position,
      value: +item.value,
    } as GraphNode;
  });
}

/**
 * Creates connections between nodes.
 */
function connectNodes(graphNodes: GraphNode[]) {
  for (const item of graphNodes) {
    for (let i = 0; i < item.neighbors.length; i++) {
      const v = item.neighbors[i];
      if (v !== null) {
        const node = graphNodes.find(
          (n) =>
            n.position[0] === v.position[0] && n.position[1] === v.position[1],
        );
        item.neighbors[i].node = node;
      }
    }
  }
}
