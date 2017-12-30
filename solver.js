// @ts-check

let puzzles = require("./puzzles");
let puzzle = puzzles[0];

let islands = 0;
let solvedIslands = 0;
let doneIslands = puzzle.map(row => row.map(item => false));
let grid = [];
puzzle.forEach((row, i) => {
  row.forEach((item, j) => {
    if (item > 0) {
      islands++;
      grid.push({
        position: [i, j],
        up: 0,
        right: 0,
        down: 0,
        left: 0,
        value: item,
        sum: 0,
        done: false
      });
    }
  });
});
let graphNodes = grid.map(item => {
  let up = traverseUp(item.position[0], item.position[1]);
  let right = traverseRight(item.position[0], item.position[1]);
  let down = traverseDown(item.position[0], item.position[1]);
  let left = traverseLeft(item.position[0], item.position[1]);
  let neighbors = [];
  for (const i of [up, right, down, left]) {
    if (i === 0) {
      neighbors.push(null);
    } else {
      neighbors.push({
        bridges: 0,
        position: i.position,
        done: false,
        node: {}
      });
    }
  }
  return {
    value: item.value,
    position: item.position,
    completed: false,
    neighbors: neighbors
  };
});
graphNodes.forEach(item => {
  item.neighbors.forEach((v, i) => {
    if (v !== null) {
      let node = graphNodes.find(
        n => n.position[0] === v.position[0] && n.position[1] === v.position[1]
      );
      item.neighbors[i].node = node;
    }
  });
});
let t = 8;
while (t--) {
  graphNodes.filter(gn => gn.completed === false).forEach(gn => {
    let count = gn.neighbors.filter(n => n !== null && !n.node.completed)
      .length;
    let completed = gn.neighbors
      .filter(n => n !== null && n.node.completed)
      .map(n => n.bridges)
      .reduce((a, b) => a + b, 0);
    let sum = gn.neighbors
      .filter(n => n !== null)
      .map(n => n.bridges)
      .reduce((a, b) => a + b, 0);
    // sum += completed;
    let incomplete = gn.neighbors
      .filter(n => n !== null && n.done === false)
      .map(n => n.bridges)
      .reduce((a, b) => a + b, 0);
    if (gn.value === sum) {
      count = 0;
    }

    // if there are islands with numbers 1 and 2, make a connection to the island 2 with one bridge
    if (count === 2) {
      let neigboringValues = gn.neighbors
        .filter(n => n !== null && !n.done)
        .map(v => v.node.value)
        .reduce((a, b) => a + b, 0);
      if (neigboringValues === 3) {
        gn.neighbors.forEach((neighbor, index) => {
          if (
            neighbor !== null &&
            !neighbor.done &&
            neighbor.node.value === 2
          ) {
            setBridges(gn, neighbor, 1, index);
          }
        });
      }
    }

    if (count === 1) {
      let neighbor = gn.neighbors.filter(n => n !== null && !n.done)[0];
      if (!neighbor.done) {
        // if a bridge already exists with the neigbor, make two bridges
        // if it does not exist make one bridge
        let index = gn.neighbors.findIndex(n => n !== null && !n.done);
        if (neighbor.bridges === 1) {
          // neighbor.bridges = 2;
          // neighbor.done = true;
          setBridges(gn, neighbor, 2, index);
        } else {
          setBridges(gn, neighbor, 1, index);
        }
      }
    } else if (count === 2 && gn.value - sum + incomplete > 2) {
      let bridges = Math.floor((gn.value - sum + incomplete) / 2);
      if (bridges > 0) {
        gn.neighbors.forEach((neighbor, index) => {
          if (neighbor !== null && !neighbor.done) {
            setBridges(gn, neighbor, bridges, index);
          }
        });
      }
    } else if (count === 2 && gn.value === 2) {
      let neighboringValues = gn.neighbors
        .filter(n => n !== null && !n.done)
        .map(v => v.node.value)
        .reduce((a, b) => a + b);
      if (neighboringValues === 3) {
        // if therea are neighbors with 1 and 2, and the curent island is 2
        // than create one bridge to the neighbor with 2
        let neighbor = gn.neighbors
          .filter(n => n !== null && !n.done)
          .filter(n => n.node.value === 2)[0];
        let index = gn.neighbors.findIndex(
          n => n !== null && n.node.value === 2 && !n.done
        );
        //neighbor.bridges = 1;
        setBridges(gn, neighbor, 1, index);
      } else if (neighboringValues === 4) {
        // two islands with number 2 can't be connected with two bridges
        // than make a connection with one bridge to two islands
        let filteredNeighbors = gn.neighbors.filter(n => n !== null && !n.done);
        if (filteredNeighbors[0].node.value === 2) {
          gn.neighbors.forEach((neighbor, index) => {
            if (neighbor !== null) {
              setBridges(gn, neighbor, 1, index);
            }
          });
        }
      }
    } else if (count === 2 && gn.value === 1) {
      // island with 1 can not have a neighbor with 1
      let filteredNeighbors = gn.neighbors.filter(
        n => n !== null && n.node.value !== 1 && !n.done
      );
      if (filteredNeighbors.length === 1) {
        let index = gn.neighbors.findIndex(
          n => n !== null && n.node.value !== 1 && !n.done
        );
        setBridges(gn, filteredNeighbors[0], 1, index);
      }
    } else if (
      ((gn.value === 5 || gn.value === 6) && count === 3) ||
      ((gn.value === 7 || gn.value === 8) && count === 4)
    ) {
      // let sum = gn.neighbors
      //   .filter(n => n !== null && !n.done)
      //   .map(n => n.bridges)
      //   .reduce((a, b) => a + b, 0);
      let bridges = Math.floor((gn.value - sum + incomplete) / count);
      gn.neighbors.forEach((neighbor, index) => {
        if (neighbor !== null && !neighbor.done) {
          setBridges(gn, neighbor, bridges, index);
        }
      });
    }
    // else if (gridItem.value === 5 && gridItem.sum === 3 && count === 2) {
    //   neighbors.filter(n => n !== 0).forEach(neighbor => {
    //     fillPuzzleWithBridge(
    //       i,
    //       j,
    //       neighbor.position[0],
    //       neighbor.position[1],
    //       2
    //     );
    //   });
    // }
  });
  // fill grid with lines
  graphNodes.forEach(gn => {
    gn.neighbors.forEach((neighbor, index) => {
      if (neighbor !== null) {
        fillPuzzleWithBridge(
          gn.position[0],
          gn.position[1],
          neighbor.position[0],
          neighbor.position[1],
          neighbor.bridges
        );
      }
    });
  });
  showGrid();
  graphNodes.forEach(gn => {
    cleanNeighbors(gn);
  });
  let completedIslands = graphNodes.filter(gn => gn.completed).length;
  if (islands === completedIslands) {
    console.log("SOLVED---------");
    break;
  }
}
function cleanNeighbors(gn) {
  let newNeighbors = [
    traverseUp(gn.position[0], gn.position[1]),
    traverseRight(gn.position[0], gn.position[1]),
    traverseDown(gn.position[0], gn.position[1]),
    traverseLeft(gn.position[0], gn.position[1])
  ];
  for (let i = 0; i < newNeighbors.length; i++) {
    const element = newNeighbors[i];
    if (element === 0 && gn.neighbors[i] !== null) {
      let neighborIndex = calculateIndex(i);
      console.log(`cleaned ${gn.position} from ${i}`);
      gn.neighbors[i].node.neighbors[neighborIndex] = null;
      gn.neighbors[i] = null;
    }
  }
  let sum = gn.neighbors
    .filter(n => n !== null)
    .map(n => n.bridges)
    .reduce((a, b) => a + b, 0);
  if (gn.value === sum) {
    gn.neighbors.forEach((n, i) => {
      if (n !== null) {
        n.done = true;
        let ni = calculateIndex(i);
        n.node.neighbors[ni].done = true;
      }
    });
    gn.completed = true;
    console.log(`completed ${gn.position}`);
  }
  if (gn.completed) {
    for (let i = 0; i < gn.neighbors.length; i++) {
      if (gn.neighbors[i] !== null && gn.neighbors[i].bridges === 0) {
        let ni = calculateIndex(i);
        gn.neighbors[i].node.neighbors[ni] = null;
        gn.neighbors[i] = null;
      }
    }
  }
}

function setBridges(head, neighbor, bridges, index) {
  if (bridges === 0) {
    return;
  }
  neighbor.bridges = bridges;
  let neighborIndex = calculateIndex(index);
  neighbor.node.neighbors[neighborIndex].bridges = bridges;
  if (bridges === 2) {
    neighbor.done = true;
    neighbor.node.neighbors[neighborIndex].done = true;
    console.log(
      `done ${neighbor.node.neighbors[neighborIndex].position} to ${index}`
    );
  }
  let sum = head.neighbors
    .filter(n => n !== null)
    .map(n => n.bridges)
    .reduce((a, b) => a + b, 0);
  if (head.value === sum) {
    neighbor.done = true;
    head.neighbors.forEach((n, i) => {
      if (n !== null) {
        n.done = true;
        let ni = calculateIndex(i);
        n.node.neighbors[ni].done = true;
      }
    });
    head.completed = true;
    console.log(`completed ${head.position}`);
  }
  console.log(
    `${bridges} from ${
      neighbor.node.neighbors[neighborIndex].position
    } to ${index}`
  );
}

function calculateIndex(index) {
  if (index === 2) {
    return 0;
  } else if (index === 3) {
    return 1;
  } else {
    return index + 2;
  }
}

// ----------------  UTIL --------------------------
function traverseUp(x, y) {
  for (let row = x - 1; row >= 0; row--) {
    if (puzzle[row][y] === "=" || puzzle[row][y] === "-") {
      return 0;
    }
    if (puzzle[row][y] > 0) {
      return { position: [row, y], value: puzzle[row][y] };
    }
  }
  return 0;
}

function traverseDown(x, y) {
  for (let row = x + 1; row < puzzle.length; row++) {
    if (puzzle[row][y] === "=" || puzzle[row][y] === "-") {
      return 0;
    }
    if (puzzle[row][y] > 0) {
      return { position: [row, y], value: puzzle[row][y] };
    }
  }
  return 0;
}

function traverseRight(x, y) {
  for (let column = y + 1; column < puzzle.length; column++) {
    if (puzzle[x][column] === "$" || puzzle[x][column] === "|") {
      return 0;
    }
    if (puzzle[x][column] > 0) {
      return { position: [x, column], value: puzzle[x][column] };
    }
  }
  return 0;
}

function traverseLeft(x, y) {
  for (let column = y - 1; column >= 0; column--) {
    if (puzzle[x][column] === "$" || puzzle[x][column] === "|") {
      return 0;
    }
    if (puzzle[x][column] > 0) {
      return { position: [x, column], value: puzzle[x][column] };
    }
  }
  return 0;
}

function fillPuzzleWithBridge(x1, y1, x2, y2, numberOfBridges) {
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
        //sign = "=";
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
        //sign = "$";
      }
      puzzle[i][y1] = sign;
    }
  }
}

function showGrid() {
  console.log("----------------------------------");
  let display = [];
  puzzle.forEach(row => display.push(" ".repeat(row.length)));

  for (let i = 0; i < puzzle.length; i++) {
    for (let j = 0; j < puzzle.length; j++) {
      if (
        puzzle[i][j] > 0 ||
        puzzle[i][j] === "=" ||
        puzzle[i][j] === "-" ||
        puzzle[i][j] === "$" ||
        puzzle[i][j] === "|"
      ) {
        // place value inside string at correct position
        display[i] =
          display[i].slice(0, j) +
          puzzle[i][j] +
          display[i].slice(j + 1, puzzle.length);
      }
    }
  }
  display.forEach(row => console.log(row));
  console.log("------------");
}
