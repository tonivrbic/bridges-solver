import { GraphNode, Neighbor, Puzzle } from "./models";
import {
  clamp,
  cleanNeighbors,
  fillPuzzleWithBridge,
  getBridges,
  getBridgesRemaining,
  getNeighbors,
  transformNode,
  updateState
} from "./utils";

/**
 * Tries to connect the node to its neighbors.
 * @param value The current value of the island.
 */
export const solveFor = (
  value: number,
  puzzle: Puzzle,
  node: GraphNode,
  neighbors: Neighbor[]
) => {
  if (value === 1) {
    return one(node, neighbors, puzzle);
  } else if (value === 2) {
    return two(node, neighbors, puzzle);
  } else {
    return others(value, node, neighbors, puzzle);
  }
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
    neighbors.filter(x => x.node.value > 1).length === 1
  ) {
    return connectTo(node, neighbors.filter(x => x.node.value > 1), 1, puzzle);
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
    neighbors.every(x => x.node.value === 2)
  ) {
    return connectTo(node, neighbors, 1, puzzle);
  }

  const unique = new Set(neighbors.map(x => getBridgesRemaining(x.node)));

  // in a situation where both neighbors are missing one bridge, than connect to them
  if (
    neighbors.length === 2 &&
    unique.size === 1 &&
    unique.has(1) &&
    neighbors.every(x => x.bridges === 0)
  ) {
    return connectTo(node, neighbors, 1, puzzle);
  }

  // in a situation where an island with 2 has one neighbor with 1 and one neighbor with more than 1,
  // than connect with one bridge to the neighbor with more than 1
  if (
    neighbors.length === 2 &&
    unique.size === 2 &&
    unique.has(1) &&
    neighbors.every(x => x.bridges === 0)
  ) {
    const neighborWithTwo = neighbors.find(
      x => getBridgesRemaining(x.node) !== 1
    );
    return connectTo(node, [neighborWithTwo], 1, puzzle);
  }

  return 0;
}

function others(
  value: number,
  node: GraphNode,
  neighbors: Neighbor[],
  puzzle: Puzzle
) {
  // a 3 with two neighbors, a 5 with 3 neighbors and a 7 with four neighbors connect with one bridge
  // a 4 with two neighbors, a 6 with 3 neighbors and a 8 with four neighbors connect with two bridges
  if (neighbors.length === Math.ceil(value / 2)) {
    return connectTo(node, neighbors, value % 2 === 0 ? 2 : 1, puzzle);
  }

  const {
    one: neighborsWithOne,
    other: neighborsWithoutOne
  } = separateNeighbors(neighbors);

  // connect to all remaining with one bridge
  if (neighbors.length === neighborsWithOne.length) {
    return connectTo(node, neighborsWithOne, 1, puzzle, true);
  }

  // if there is a 4 with three neighbors where one has 1, than connect to others
  // if there is a 6 with four neighbors where one has 1, than connect to others
  if (
    ((value === 4 && neighbors.length === 3) ||
      (value === 6 && neighbors.length === 4)) &&
    neighborsWithOne.length === 1
  ) {
    return connectTo(node, neighborsWithoutOne, 1, puzzle);
  }

  if (
    value === 4 &&
    getBridgesRemaining(node) >= 3 &&
    neighbors.length === 3 &&
    neighborsWithOne.length > 1
  ) {
    return connectTo(node, neighborsWithoutOne, 1, puzzle);
  }

  const remainingWithOne = neighbors.filter(
    x => clamp(1, 2, getBridgesRemaining(x.node) - x.bridges) === 1
  );
  const remainingWithoutOne = neighbors.filter(
    x => clamp(1, 2, getBridgesRemaining(x.node) - x.bridges) !== 1
  );
  const canAdd = new Set(
    neighbors.map(x => clamp(1, 2, getBridgesRemaining(x.node) - x.bridges))
  );

  if (
    canAdd.size === 1 &&
    canAdd.has(1) &&
    value - getBridges(node) === neighbors.length
  ) {
    return connectTo(node, neighbors, 1, puzzle, true);
  }

  if (
    value === 3 &&
    canAdd.size === 2 &&
    neighbors.length === 3 &&
    remainingWithOne.length === 2 &&
    getBridges(node) === 0
  ) {
    return connectTo(node, remainingWithoutOne, 1, puzzle);
  }

  return 0;
}

/**
 * Separates neighbors based on the number of bridges that can be connected to them.
 */
function separateNeighbors(neighbors: Neighbor[]) {
  const onlyOne: Neighbor[] = [];
  const moreThanOne: Neighbor[] = [];
  neighbors.forEach(neighbor => {
    if (transformNode(neighbor.node).value === 1) {
      onlyOne.push(neighbor);
    } else {
      moreThanOne.push(neighbor);
    }
  });
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
  append = false
) {
  let connections = 0;
  neighbors.forEach(neighbor => {
    if (append) {
      neighbor.bridges += bridges;
      connections += bridges;
    } else {
      connections += bridges - neighbor.bridges;
      neighbor.bridges = bridges;
    }

    // set the bridge from the other direction
    const reverseConnection = getNeighbors(neighbor.node).find(
      n => n.node.id === node.id
    );
    reverseConnection.bridges = neighbor.bridges;

    fillPuzzleWithBridge(
      puzzle,
      node.position[0],
      node.position[1],
      neighbor.position[0],
      neighbor.position[1],
      bridges
    );
  });

  updateState(node);
  cleanNeighbors(node, puzzle);

  return connections;
}
