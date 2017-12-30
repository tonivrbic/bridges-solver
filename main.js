let puzzles = require("./puzzles");
let puzzle = puzzles[6];

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
let t = 8;
//let keys = Object.keys(grid[0][0]);
console.time("solving");
while (t--) {
  grid.forEach(gridItem => {
    if (!gridItem.done) {
      let i = gridItem.position[0];
      let j = gridItem.position[1];
      let neighbors = [
        traverseUp(i, j),
        traverseRight(i, j),
        traverseDown(i, j),
        traverseLeft(i, j)
      ].map(n => {
        if (n && doneIslands[n.position[0]][n.position[1]] === true) {
          return 0;
        }
        return n;
      });

      // find incomplete connections between islands
      let { up, right, down, left } = gridItem;
      let arr = [up, right, down, left];
      let completedBridges = 0;
      for (let index = 0; index < arr.length; index++) {
        if (arr[index] > 0 && neighbors[index] === 0) {
          completedBridges += arr[index];
        }
      }
      let incomplete = gridItem.sum - completedBridges;

      // check if neighbor is done
      let count = neighbors.filter(v => v !== 0).length;

      // if there are islands with numbers 1 and 2, make a connection to the island 2 with one bridge
      if (count === 2) {
        let filteredNeighbors = neighbors.filter(n => n !== 0);
        let neigboringValues = neighbors
          .filter(n => n !== 0)
          .map(v => v.value)
          .reduce((a, b) => a + b);
        if (neigboringValues === 3) {
          let neighbor =
            filteredNeighbors[0].value === 2
              ? filteredNeighbors[0]
              : filteredNeighbors[1];
          fillPuzzleWithBridge(
            i,
            j,
            neighbor.position[0],
            neighbor.position[1],
            1
          );
        }
      }

      if (count === 1) {
        let index = neighbors.findIndex(v => v !== 0);
        if (gridItem.value >= 2 && neighbors[index].value > 2) {
          let { up, right, down, left } = gridItem;
          let arr = [up, right, down, left];
          let bridge = 0;
          // if a bridge already exists with the neigbor, make two bridges
          // if it does not exist make one bridge
          if (arr[index] === 1) {
            bridge = 2;
          } else {
            bridge = 1;
          }
          fillPuzzleWithBridge(
            i,
            j,
            neighbors[index].position[0],
            neighbors[index].position[1],
            bridge
          );
        } else {
          fillPuzzleWithBridge(
            i,
            j,
            neighbors[index].position[0],
            neighbors[index].position[1],
            gridItem.value - gridItem.sum
          );
        }
        //grid[i][j].done = true;
      } else if (
        count === 2 &&
        gridItem.value - gridItem.sum + incomplete > 2
      ) {
        let bridges = Math.floor(
          (gridItem.value - gridItem.sum + incomplete) / 2
        );
        if (bridges > 0) {
          neighbors.filter(n => n !== 0).forEach(neighbor => {
            fillPuzzleWithBridge(
              i,
              j,
              neighbor.position[0],
              neighbor.position[1],
              bridges
            );
          });
        }
        // } else if (count === 2 && gridItem.value === 2 && gridItem.sum === 1) {
        //   // do not make a connection that will seperate islands
        //   if (neighbors.filter(n => n !== 0).some(n => n.value === 1)) {
        //     neighbors
        //       .filter(n => n !== 0)
        //       .filter(n => n.value !== 1)
        //       .forEach(neighbor => {
        //         fillPuzzleWithBridge(
        //           i,
        //           j,
        //           neighbor.position[0],
        //           neighbor.position[1],
        //           1
        //         );
        //       });
        //   }
      } else if (count === 2 && gridItem.value === 3 && gridItem.sum === 1) {
        // do not make a connection that will seperate islands
        if (neighbors.filter(n => n !== 0).some(n => n.value === 2)) {
          neighbors
            .filter(n => n !== 0)
            .filter(n => n.value !== 2)
            .forEach(neighbor => {
              // fillPuzzleWithBridge(
              //   i,
              //   j,
              //   neighbor.position[0],
              //   neighbor.position[1],
              //   1
              // );
            });
        }
      } else if (count === 2 && gridItem.value === 2) {
        let neighboringValues = neighbors
          .filter(n => n !== 0)
          .map(v => v.value)
          .reduce((a, b) => a + b);
        if (neighboringValues === 3) {
          let filteredNeighbors = neighbors.filter(n => n !== 0);
          let neighbor =
            filteredNeighbors[0].value === 2
              ? filteredNeighbors[1]
              : filteredNeighbors[0];
          fillPuzzleWithBridge(
            i,
            j,
            neighbor.position[0],
            neighbor.position[1],
            1
          );
        } else if (neighboringValues === 4) {
          // two islands with number 2 can't be connected with two bridges
          let filteredNeighbors = neighbors.filter(n => n !== 0);
          if (filteredNeighbors[0].value === 2) {
            neighbors.filter(n => n !== 0).forEach(neighbor => {
              fillPuzzleWithBridge(
                i,
                j,
                neighbor.position[0],
                neighbor.position[1],
                1
              );
            });
          }
        }
      } else if (count === 2 && gridItem.value === 1) {
        // island with 1 can not have a neighbor with 1
        let filteredNeighbors = neighbors.filter(n => n !== 0 && n.value !== 1);
        if (filteredNeighbors.length === 1) {
          fillPuzzleWithBridge(
            i,
            j,
            filteredNeighbors[0].position[0],
            filteredNeighbors[0].position[1],
            1
          );
        }
      } else if (
        ((gridItem.value === 5 || gridItem.value === 6) && count === 3) ||
        ((gridItem.value === 7 || gridItem.value === 8) && count === 4)
      ) {
        neighbors.filter(n => n !== 0).forEach(neighbor => {
          fillPuzzleWithBridge(
            i,
            j,
            neighbor.position[0],
            neighbor.position[1],
            Math.floor((gridItem.value - gridItem.sum) / count)
          );
        });
      } else if (gridItem.value === 5 && gridItem.sum === 3 && count === 2) {
        neighbors.filter(n => n !== 0).forEach(neighbor => {
          fillPuzzleWithBridge(
            i,
            j,
            neighbor.position[0],
            neighbor.position[1],
            2
          );
        });
      }

      //markIslandsAsDone();
    }
  });
  showGrid();
  if (markIslandsAsDone()) {
    console.log("==============SOLVED==================");
    break;
  }
}
console.timeEnd("solving");

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

function fillPuzzleWithBridge(x1, y1, x2, y2, numberOfBridges) {
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

function markIslandsAsDone() {
  grid.forEach(gridItem => {
    if (!gridItem.done) {
      let i = gridItem.position[0];
      let j = gridItem.position[1];
      if (j > 0) {
        switch (puzzle[i][j - 1]) {
          case "=":
            gridItem.left = 2;
            break;
          case "-":
            gridItem.left = 1;
        }
      }
      if (j < puzzle.length - 1) {
        switch (puzzle[i][j + 1]) {
          case "=":
            gridItem.right = 2;
            break;
          case "-":
            gridItem.right = 1;
        }
      }
      if (i < puzzle.length - 1) {
        switch (puzzle[i + 1][j]) {
          case "$":
            gridItem.down = 2;
            break;
          case "|":
            gridItem.down = 1;
        }
      }
      if (i > 0) {
        switch (puzzle[i - 1][j]) {
          case "$":
            gridItem.up = 2;
            break;
          case "|":
            gridItem.up = 1;
        }
      }
      let sum = gridItem.up + gridItem.right + gridItem.down + gridItem.left;
      gridItem.sum = sum;
      if (sum === gridItem.value) {
        gridItem.done = true;
        doneIslands[i][j] = true;
        console.log(i, j, "done");
        solvedIslands++;
      }
    }
  });
  return islands === solvedIslands;
}
