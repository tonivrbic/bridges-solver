"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

/**
 * Tries to find a neighbor by going up.
 * @returns Return 0 if a neighbor was not found, otherwise returns an object with found neighbor
 */
function traverseUp(puzzle, x, y) {
  for (let row = x - 1; row >= 0; row--) {
    if (puzzle[row][y] === "=" || puzzle[row][y] === "-") {
      return 0;
    }
    if (puzzle[row][y] > "0" && puzzle[row][y] < "9") {
      return {
        bridges: detectBridges(puzzle[row + 1][y]),
        position: [row, y],
        value: puzzle[row][y]
      };
    }
  }
  return 0;
}
/**
 * Tries to find a neighbor by going down.
 * @returns Return 0 if a neighbor was not found, otherwise returns an object with found neighbor
 */
function traverseDown(puzzle, x, y) {
  for (let row = x + 1; row < puzzle.length; row++) {
    if (puzzle[row][y] === "=" || puzzle[row][y] === "-") {
      return 0;
    }
    if (puzzle[row][y] > "0" && puzzle[row][y] < "9") {
      return {
        bridges: detectBridges(puzzle[row - 1][y]),
        position: [row, y],
        value: puzzle[row][y]
      };
    }
  }
  return 0;
}
/**
 * Tries to find a neighbor by going right.
 * @returns Return 0 if a neighbor was not found, otherwise returns an object with found neighbor
 */
function traverseRight(puzzle, x, y) {
  for (let column = y + 1; column < puzzle.length; column++) {
    if (puzzle[x][column] === "$" || puzzle[x][column] === "|") {
      return 0;
    }
    if (puzzle[x][column] > "0" && puzzle[x][column] < "9") {
      return {
        bridges: detectBridges(puzzle[x][column - 1]),
        position: [x, column],
        value: puzzle[x][column]
      };
    }
  }
  return 0;
}
/**
 * Tries to find a neighbor by going left.
 * @returns Return 0 if a neighbor was not found, otherwise returns an object with found neighbor
 */
function traverseLeft(puzzle, x, y) {
  for (let column = y - 1; column >= 0; column--) {
    if (puzzle[x][column] === "$" || puzzle[x][column] === "|") {
      return 0;
    }
    if (puzzle[x][column] > "0" && puzzle[x][column] < "9") {
      return {
        bridges: detectBridges(puzzle[x][column + 1]),
        position: [x, column],
        value: puzzle[x][column]
      };
    }
  }
  return 0;
}
/** Gets the neighbors of a node. */
function getNeighbors(node) {
  return node.neighbors.filter(n => !!n);
}
/** Gets number of bridges. */
function getBridges(node) {
  return getNeighbors(node).reduce((a, b) => a + b.bridges, 0);
}
/** Gets the number of bridges that can be added. */
function getBridgesRemaining(node) {
  return node.value - getNeighbors(node).reduce((a, b) => a + b.bridges, 0);
}
/** Updates the state of the node and its neighbors. */
function updateState(node) {
  const neighbors = getNeighbors(node);
  neighbors.filter(x => x.bridges === 2).forEach(x => (x.done = true));
  const connectedBridges = neighbors.reduce((a, b) => a + b.bridges, 0);
  if (connectedBridges === node.value) {
    node.completed = true;
    neighbors.forEach(neighbor => {
      neighbor.done = true;
      const reverseConnection = getNeighbors(neighbor.node).find(
        n => n.node.id === node.id
      );
      reverseConnection.done = true;
      reverseConnection.bridges = neighbor.bridges;
    });
  }
}
/** Updates states for all multiple nodes. */
function updateStates(nodes) {
  nodes.forEach(n => updateState(n));
}
/** Return not completed nodes from the graph. */
function getNotCompletedNodes(graph) {
  return graph.filter(n => !n.completed);
}
/**
 * Transforms the node of lower value if possible and returns the neighbors
 * to whom a connection can be made.
 *
 * For example: If the node with value 4 has a connection with two bridges to another node,
 * than we can say that this node has a value of 2.
 */
function transformNode(node) {
  let value = node.value;
  const allNeighbors = getNeighbors(node);
  const activeNeighbors = allNeighbors.filter(x => x.done === false);
  allNeighbors.filter(x => x.done === true).forEach(x => (value -= x.bridges));
  return {
    neighbors: activeNeighbors,
    value
  };
}
/** Adds bridges to the puzzle. */
function fillPuzzleWithBridge(puzzle, x1, y1, x2, y2, numberOfBridges) {
  if (numberOfBridges === 0) {
    return;
  }
  let sign = "";
  if (x1 === x2) {
    sign = numberOfBridges === 2 ? "=" : "-";
    for (let j = Math.min(y1, y2) + 1; j <= Math.max(y1, y2) - 1; j++) {
      if (puzzle[x1][j] === "=") {
        break;
      }
      if (puzzle[x1][j] === "-" && sign === "-");
      puzzle[x1][j] = sign;
    }
  } else if (y1 === y2) {
    sign = numberOfBridges === 2 ? "$" : "|";
    for (let i = Math.min(x1, x2) + 1; i <= Math.max(x1, x2) - 1; i++) {
      if (puzzle[i][y1] === "$") {
        break;
      }
      if (puzzle[i][y1] === "|" && sign === "|");
      puzzle[i][y1] = sign;
    }
  }
}
/** Finds index of the neighbor. */
function calculateIndex(index) {
  if (index === 2) {
    return 0;
  } else if (index === 3) {
    return 1;
  } else {
    return index + 2;
  }
}
/** Traverses the puzzle and cleans up neighbors from graph that are no longer neighbors. */
function cleanNeighbors(node, puzzle) {
  const newNeighbors = [
    traverseUp(puzzle, node.position[0], node.position[1]),
    traverseRight(puzzle, node.position[0], node.position[1]),
    traverseDown(puzzle, node.position[0], node.position[1]),
    traverseLeft(puzzle, node.position[0], node.position[1])
  ];
  for (let i = 0; i < newNeighbors.length; i++) {
    const element = newNeighbors[i];
    if (element === 0 && node.neighbors[i] !== null) {
      const neighborIndex = calculateIndex(i);
      node.neighbors[i].node.neighbors[neighborIndex] = null;
      node.neighbors[i] = null;
    }
  }
  if (node.completed) {
    for (let i = 0; i < node.neighbors.length; i++) {
      if (node.neighbors[i] !== null && node.neighbors[i].bridges === 0) {
        const ni = calculateIndex(i);
        node.neighbors[i].node.neighbors[ni] = null;
        node.neighbors[i] = null;
      }
    }
  }
}
/** For all nodes traverses the puzzle and cleans up neighbors from graph that are no longer neighbors. */
function cleanGraph(graph, puzzle) {
  updateStates(graph);
  graph.forEach(node => cleanNeighbors(node, puzzle));
}
/** Clamp a value between min and max. */
function clamp(min, max, value) {
  return Math.max(min, Math.min(value, max));
}
/** Detects bridge characters in the puzzle. */
function detectBridges(field) {
  if (field === "=" || field === "$") {
    return 2;
  }
  if (field === "-" || field === "|") {
    return 1;
  }
  return 0;
}

/**
 * Create a graph from the puzzle.
 */
function createGraph(puzzle) {
  const extractedIslands = extractIslands(puzzle);
  const nodes = createNodes(puzzle, extractedIslands);
  connectNodes(nodes);
  updateStates(nodes);
  return nodes;
}
/**
 * Extract islands from the puzzle.
 */
function extractIslands(puzzle) {
  const islands = [];
  puzzle.forEach((row, i) => {
    row.forEach((item, j) => {
      if (item > "0" && item < "9") {
        islands.push({
          position: [i, j],
          value: item
        });
      }
    });
  });
  return islands;
}
/**
 * Creates nodes for the graph from extracted islands.
 */
function createNodes(puzzle, extractedIslands) {
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
          position: i.position
        });
      }
    }
    return {
      completed: false,
      id: index,
      neighbors,
      position: item.position,
      value: +item.value
    };
  });
}
/**
 * Creates connections between nodes.
 */
function connectNodes(graphNodes) {
  graphNodes.forEach(item => {
    item.neighbors.forEach((v, i) => {
      if (v !== null) {
        const node = graphNodes.find(
          n =>
            n.position[0] === v.position[0] && n.position[1] === v.position[1]
        );
        item.neighbors[i].node = node;
      }
    });
  });
}

/**
 * Tries to connect the node to its neighbors.
 * @param value The current value of the island.
 */
const solveFor = (value, puzzle, node, neighbors) => {
  if (value === 1) {
    return one(node, neighbors, puzzle);
  } else if (value === 2) {
    return two(node, neighbors, puzzle);
  } else {
    return others(value, node, neighbors, puzzle);
  }
};
/** Connect a node represented as 1 to its neighbors. */
function one(node, neighbors, puzzle) {
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
function two(node, neighbors, puzzle) {
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
  // in a situation where an island with 2 has one neighbor whit value 2
  // and the other with a value more than 2, than connect with one bridge to the larger
  if (
    neighbors.length === 2 &&
    unique.size === 2 &&
    neighbors.some(x => x.node.value === 2) &&
    neighbors.some(x => x.node.value > 2) &&
    neighbors.every(x => x.bridges === 0)
  ) {
    const largerNeighbor = neighbors.find(x => x.node.value > 2);
    return connectTo(node, [largerNeighbor], 1, puzzle);
  }
  return 0;
}
/** Connect all nodes other than 1 and 2 to its neighbors. */
function others(value, node, neighbors, puzzle) {
  // a 3 with two neighbors, a 5 with 3 neighbors and a 7 with four neighbors connect with one bridge
  // a 4 with two neighbors, a 6 with 3 neighbors and a 8 with four neighbors connect with two bridges
  if (neighbors.length === Math.ceil(value / 2)) {
    return connectTo(node, neighbors, value % 2 === 0 ? 2 : 1, puzzle);
  }
  const {
    one: neighborsWithValueOne,
    other: neighborsWithoutValueOne
  } = separateNeighbors(neighbors);
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
    x => clamp(1, 2, getBridgesRemaining(x.node) - x.bridges) === 1
  );
  const canAddTwoBridges = neighbors.filter(
    x => clamp(1, 2, getBridgesRemaining(x.node) - x.bridges) !== 1
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
function separateNeighbors(neighbors) {
  const onlyOne = [];
  const moreThanOne = [];
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
function connectTo(node, neighbors, bridges, puzzle, append = false) {
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

/**
 * Tries with brute force to find a new possible connection to make.
 */
function bruteForceNewConnection(graph, puzzle, depth) {
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
function tryToConnect(puzzle, node, neighbor, depth) {
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
function connectToNeighbor(node, neighbor, puzzle) {
  const value = node.value - getBridges(node) + neighbor.bridges;
  return solveFor(value, puzzle, node, [neighbor]);
}
/**
 * Clones the puzzle.
 */
function clone(puzzle) {
  return JSON.parse(JSON.stringify(puzzle));
}

/**
 * Loops through solverSteps until the puzzle is solved.
 */
function solveIterative(puzzle, depth) {
  let result;
  let steps = [];
  let oldPuzzle = "";
  let newPuzzle = JSON.stringify(puzzle);
  // loop while new bridges are added to the puzzle
  while (oldPuzzle !== newPuzzle) {
    oldPuzzle = newPuzzle;
    result = solverStep(puzzle, depth);
    if (result.solution) {
      newPuzzle = JSON.stringify(result.solution);
      // save a copy of the current puzzle
      steps.push(JSON.parse(newPuzzle));
    }
    // exit loop if the puzzle is solved
    if (result.solved) {
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
function solverStep(puzzle, depth) {
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
    const result = bruteForceNewConnection(graph, puzzle, depth);
    return result;
  }
  // the puzzle is solved when all nodes are completed
  return { solved: getNotCompletedNodes(graph).length === 0, solution: puzzle };
}

/**
 * Solves the bridges puzzle.
 * @param bridgesPuzzle A 2D matrix representing the puzzle where zeros represent empty spaces.
 * @param depth The recursion depth of the algorithm. Default value is 3.
 */
function solver(bridgesPuzzle, depth = 3) {
  // convert the puzzle with numbers to strings
  const puzzle = bridgesPuzzle.map(row => {
    return row.map(item => item.toString());
  });
  const result = solveIterative(puzzle, depth);
  return result;
}

exports.solver = solver;
