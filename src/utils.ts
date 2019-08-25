import { GraphNode, Puzzle } from "./models";

export function traverseUp(puzzle: Puzzle, x: number, y: number) {
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

export function traverseDown(puzzle: Puzzle, x: number, y: number) {
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

export function traverseRight(puzzle: Puzzle, x: number, y: number) {
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

export function traverseLeft(puzzle: Puzzle, x: number, y: number) {
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

export function getNeighbors(node: GraphNode) {
  return node.neighbors.filter(n => !!n);
}

export function getBridgesNotCompleted(node: GraphNode) {
  return getNeighbors(node)
    .filter(x => !x.done)
    .reduce((a, b) => a + b.bridges, 0);
}

export function getBridges(node: GraphNode) {
  return getNeighbors(node).reduce((a, b) => a + b.bridges, 0);
}

export function getBridgesRemaining(node: GraphNode) {
  return node.value - getNeighbors(node).reduce((a, b) => a + b.bridges, 0);
}

export function updateState(node: GraphNode) {
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

export function updateStates(nodes: GraphNode[]) {
  nodes.forEach(n => updateState(n));
}

export function getNotCompletedNodes(nodes: GraphNode[]) {
  return nodes.filter(n => !n.completed);
}

export function transformNode(node: GraphNode) {
  let value = node.value;
  const allNeighbors = getNeighbors(node);
  const activeNeighbors = allNeighbors.filter(x => x.done === false);
  allNeighbors.filter(x => x.done === true).forEach(x => (value -= x.bridges));

  return {
    neighbors: activeNeighbors,
    value
  };
}

export function fillPuzzleWithBridge(
  puzzle: Puzzle,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  numberOfBridges: number
) {
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
      if (puzzle[x1][j] === "-" && sign === "-") {
        // sign = "=";
      }
      puzzle[x1][j] = sign;
    }
  } else if (y1 === y2) {
    sign = numberOfBridges === 2 ? "$" : "|";
    for (let i = Math.min(x1, x2) + 1; i <= Math.max(x1, x2) - 1; i++) {
      if (puzzle[i][y1] === "$") {
        break;
      }
      if (puzzle[i][y1] === "|" && sign === "|") {
        // sign = "$";
      }
      puzzle[i][y1] = sign;
    }
  }
}

function calculateIndex(index: number) {
  if (index === 2) {
    return 0;
  } else if (index === 3) {
    return 1;
  } else {
    return index + 2;
  }
}

export function cleanNeighbors(node: GraphNode, puzzle: Puzzle) {
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
      // console.log(`cleaned ${node.position} from ${i}`);
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

export function cleanGraph(graph: GraphNode[], puzzle: Puzzle) {
  updateStates(graph);
  graph.forEach(node => cleanNeighbors(node, puzzle));
}

export function getSubGraph(node: GraphNode) {
  const toVisit: GraphNode[] = [];
  const visitedNodes: GraphNode[] = [];
  const visitedNodeIds: number[] = [];
  toVisit.push(node);
  visitedNodeIds.push(node.id);
  visitedNodes.push(node);
  while (toVisit.length > 0) {
    const popped = toVisit.pop();
    popped.neighbors.forEach(neighbor => {
      if (
        neighbor !== null &&
        neighbor.bridges > 0 &&
        visitedNodeIds.indexOf(neighbor.node.id) === -1
      ) {
        toVisit.push(neighbor.node);
        visitedNodeIds.push(neighbor.node.id);
        visitedNodes.push(neighbor.node);
      }
    });
  }
  return visitedNodes;
}

export function isGraphClosed(nodes: GraphNode[]) {
  return nodes.every(x => x.completed === true);
}

export function clamp(min: number, max: number, value: number) {
  return Math.max(min, Math.min(value, max));
}

function detectBridges(field: string) {
  if (field === "=" || field === "$") {
    return 2;
  }
  if (field === "-" || field === "|") {
    return 1;
  }
  return 0;
}
