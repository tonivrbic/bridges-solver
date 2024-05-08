import type { GraphNode, Neighbor, Puzzle } from "./models";
import {
  clamp,
  cleanNeighbors,
  fillPuzzleWithBridge,
  getBridges,
  getBridgesRemaining,
  getNeighbors,
  transformNode,
  updateState,
} from "./utils";

/**
 * Tries to connect the node to its neighbors.
 * @param value The current value of the island.
 */
export const solveFor = (
  value: number,
  puzzle: Puzzle,
  node: GraphNode,
  neighbors: Neighbor[],
) => {
  if (value === 1) {
    return one(node, neighbors, puzzle);
  }
  if (value === 2) {
    return two(node, neighbors, puzzle);
  }
  return others(value, node, neighbors, puzzle);
};

/** Connect a node represented as 1 to its neighbors. */
function one(node: GraphNode, neighbors: Neighbor[], puzzle: Puzzle) {
  // make a connection with 1 bridge to the neighbor
  if (neighbors.length === 1) {
    return connectTo(node, neighbors, 1, puzzle);
  }

  // make a connection to one bridge that has not the value 1
  if (
    node.value === 1 &&
    neighbors.filter((x) => x.node.value > 1).length === 1
  ) {
    return connectTo(
      node,
      neighbors.filter((x) => x.node.value > 1),
      1,
      puzzle,
    );
  }

  return 0;
}

/** Connect a node represented as 2 to its neighbors. */
function two(node: GraphNode, neighbors: Neighbor[], puzzle: Puzzle) {
  // make a connection with 2 bridges to the neighbor
  if (neighbors.length === 1) {
    const bridges =
      getBridgesRemaining(neighbors[0].node) + neighbors[0].bridges;
    return connectTo(node, neighbors, bridges === 1 ? 1 : 2, puzzle);
  }

  // in a situation where an island with 2 has two neighbors with values of 2, than connect
  // to those neighbors with one bridge
  if (
    node.value === 2 &&
    neighbors.length === 2 &&
    neighbors.every((x) => x.node.value === 2)
  ) {
    return connectTo(node, neighbors, 1, puzzle);
  }

  const unique = new Set(neighbors.map((x) => getBridgesRemaining(x.node)));

  // in a situation where both neighbors are missing one bridge, than connect to them
  if (
    neighbors.length === 2 &&
    unique.size === 1 &&
    unique.has(1) &&
    neighbors.every((x) => x.bridges === 0)
  ) {
    return connectTo(node, neighbors, 1, puzzle);
  }

  // in a situation where an island with 2 has one neighbor with 1 and one neighbor with more than 1,
  // than connect with one bridge to the neighbor with more than 1
  if (
    neighbors.length === 2 &&
    unique.size === 2 &&
    unique.has(1) &&
    neighbors.every((x) => x.bridges === 0)
  ) {
    const neighborWithTwo = neighbors.find(
      (x) => getBridgesRemaining(x.node) !== 1,
    );
    return connectTo(node, [neighborWithTwo], 1, puzzle);
  }

  // in a situation where an island with 2 has one neighbor whit value 2
  // and the other with a value more than 2, than connect with one bridge to the larger
  if (
    neighbors.length === 2 &&
    unique.size === 2 &&
    neighbors.some((x) => x.node.value === 2) &&
    neighbors.some((x) => x.node.value > 2) &&
    neighbors.every((x) => x.bridges === 0)
  ) {
    const largerNeighbor = neighbors.find((x) => x.node.value > 2);
    return connectTo(node, [largerNeighbor], 1, puzzle);
  }

  return 0;
}

/** Connect all nodes other than 1 and 2 to its neighbors. */
function others(
  value: number,
  node: GraphNode,
  neighbors: Neighbor[],
  puzzle: Puzzle,
) {
  // a 3 with two neighbors, a 5 with 3 neighbors and a 7 with four neighbors connect with one bridge
  // a 4 with two neighbors, a 6 with 3 neighbors and a 8 with four neighbors connect with two bridges
  if (neighbors.length === Math.ceil(value / 2)) {
    return connectTo(node, neighbors, value % 2 === 0 ? 2 : 1, puzzle);
  }

  const { one: neighborsWithValueOne, other: neighborsWithoutValueOne } =
    separateNeighbors(neighbors);

  // connect to all remaining with one bridge
  if (neighbors.length === neighborsWithValueOne.length) {
    return connectTo(node, neighborsWithValueOne, 1, puzzle, true);
  }

  // if there is a 4 with three neighbors where one has 1, than connect to others
  // if there is a 6 with four neighbors where one has 1, than connect to others
  if (
    ((value === 4 && neighbors.length === 3) ||
      (value === 6 && neighbors.length === 4)) &&
    neighborsWithValueOne.length === 1
  ) {
    return connectTo(node, neighborsWithoutValueOne, 1, puzzle);
  }

  const canAddOneBridge = neighbors.filter(
    (x) => clamp(1, 2, getBridgesRemaining(x.node) - x.bridges) === 1,
  );
  const canAddTwoBridges = neighbors.filter(
    (x) => clamp(1, 2, getBridgesRemaining(x.node) - x.bridges) !== 1,
  );

  // if connecting to every neighbor completes the island (only when the neighbors can
  // receive one bridge)
  if (
    canAddOneBridge.length === neighbors.length &&
    value - getBridges(node) === neighbors.length
  ) {
    return connectTo(node, neighbors, 1, puzzle, true);
  }

  /**
   * In a situation like this:
   * 3-2 3-3
   * |     |
   * |   1 |
   * | 3   4
   * |   2 |
   * 2 1 | |
   *  1--4-3
   *
   * The 3 in the middle must have at least one connection to the
   * 4 on the right.
   */
  if (
    value === neighbors.length &&
    canAddTwoBridges.length === 1 &&
    canAddOneBridge.length === value - 1 &&
    getBridges(node) === 0
  ) {
    return connectTo(node, canAddTwoBridges, 1, puzzle);
  }

  return 0;
}

/**
 * Separates neighbors based on the number of bridges that can be connected to them.
 */
function separateNeighbors(neighbors: Neighbor[]) {
  const onlyOne: Neighbor[] = [];
  const moreThanOne: Neighbor[] = [];
  for (const neighbor of neighbors) {
    if (transformNode(neighbor.node).value === 1) {
      onlyOne.push(neighbor);
    } else {
      moreThanOne.push(neighbor);
    }
  }
  return { one: onlyOne, other: moreThanOne };
}

/**
 * Connect an island to supplied neighbors with specified number of bridges.
 * @param node Island that connects.
 * @param neighbors List of neighbors to whom a connection will be made
 * @param bridges Number of bridges
 * @param puzzle The current puzzle
 * @param append Add the bridge to the already existing bridge instead of overriding it.
 */
function connectTo(
  node: GraphNode,
  neighbors: Neighbor[],
  bridges: number,
  puzzle: Puzzle,
  append = false,
) {
  let connections = 0;
  for (const neighbor of neighbors) {
    if (append) {
      neighbor.bridges += bridges;
      connections += bridges;
    } else {
      connections += bridges - neighbor.bridges;
      neighbor.bridges = bridges;
    }

    // set the bridge from the other direction
    const reverseConnection = getNeighbors(neighbor.node).find(
      (n) => n.node.id === node.id,
    );
    reverseConnection.bridges = neighbor.bridges;

    fillPuzzleWithBridge(
      puzzle,
      node.position[0],
      node.position[1],
      neighbor.position[0],
      neighbor.position[1],
      bridges,
    );
  }

  updateState(node);
  cleanNeighbors(node, puzzle);

  return connections;
}
