'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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
function getNeighbors(node) {
    return node.neighbors.filter(n => !!n);
}
function updateState(node) {
    const neighbors = getNeighbors(node);
    neighbors.filter(x => x.bridges === 2).forEach(x => (x.done = true));
    const connectedBridges = neighbors.reduce((a, b) => a + b.bridges, 0);
    if (connectedBridges === node.value) {
        node.completed = true;
        neighbors.forEach(neighbor => {
            neighbor.done = true;
            const reverseConnection = getNeighbors(neighbor.node).find(n => n.node.id === node.id);
            reverseConnection.done = true;
            reverseConnection.bridges = neighbor.bridges;
        });
    }
}
function updateStates(nodes) {
    nodes.forEach(n => updateState(n));
}
function getNotCompletedNodes(nodes) {
    return nodes.filter(n => !n.completed);
}
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
            if (puzzle[x1][j] === "-" && sign === "-") ;
            puzzle[x1][j] = sign;
        }
    }
    else if (y1 === y2) {
        sign = numberOfBridges === 2 ? "$" : "|";
        for (let i = Math.min(x1, x2) + 1; i <= Math.max(x1, x2) - 1; i++) {
            if (puzzle[i][y1] === "$") {
                break;
            }
            if (puzzle[i][y1] === "|" && sign === "|") ;
            puzzle[i][y1] = sign;
        }
    }
}
function calculateIndex(index) {
    if (index === 2) {
        return 0;
    }
    else if (index === 3) {
        return 1;
    }
    else {
        return index + 2;
    }
}
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
function cleanGraph(graph, puzzle) {
    updateStates(graph);
    graph.forEach(node => cleanNeighbors(node, puzzle));
}
function getSubgraph(node) {
    const toVisit = [];
    const visitedNodes = [];
    const visitedNodeIds = [];
    toVisit.push(node);
    visitedNodeIds.push(node.id);
    visitedNodes.push(node);
    while (toVisit.length > 0) {
        const popped = toVisit.pop();
        popped.neighbors.forEach(neighbor => {
            if (neighbor !== null &&
                neighbor.bridges > 0 &&
                visitedNodeIds.indexOf(neighbor.node.id) === -1) {
                toVisit.push(neighbor.node);
                visitedNodeIds.push(neighbor.node.id);
                visitedNodes.push(neighbor.node);
            }
        });
    }
    return visitedNodes;
}
function isGraphClosed(nodes) {
    return nodes.every(x => x.completed === true);
}
function detectBridges(field) {
    if (field === "=" || field === "$") {
        return 2;
    }
    if (field === "-" || field === "|") {
        return 1;
    }
    return 0;
}

function createGraph(puzzle) {
    const extractedIslands = extractIslands(puzzle);
    const nodes = createNodes(puzzle, extractedIslands);
    connectNodes(nodes);
    updateStates(nodes);
    return nodes;
}
function extractIslands(puzzle) {
    const islands = [];
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
function createNodes(puzzle, extractedIslands) {
    return extractedIslands.map((item, index) => {
        const up = traverseUp(puzzle, item.position[0], item.position[1]);
        const right = traverseRight(puzzle, item.position[0], item.position[1]);
        const down = traverseDown(puzzle, item.position[0], item.position[1]);
        const left = traverseLeft(puzzle, item.position[0], item.position[1]);
        const neighbors = [];
        for (const i of [up, right, down, left]) {
            if (typeof i === "number") {
                neighbors.push(null);
            }
            else {
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
        };
    });
}
function connectNodes(graphNodes) {
    graphNodes.forEach(item => {
        item.neighbors.forEach((v, i) => {
            if (v !== null) {
                const node = graphNodes.find(n => n.position[0] === v.position[0] && n.position[1] === v.position[1]);
                item.neighbors[i].node = node;
            }
        });
    });
}

const solveFor = (value, puzzle, node, neighbors) => {
    if (value === 1) {
        return one(node, neighbors, puzzle);
    }
    else if (value === 2) {
        return two(node, neighbors, puzzle);
    }
    else {
        return others(value, node, neighbors, puzzle);
    }
};
function one(node, neighbors, puzzle) {
    // make a connection with 1 bridge to the neighbor
    if (neighbors.length === 1) {
        return connectTo(node, neighbors, 1, puzzle);
    }
    // make a connection to one bridge that has not the value 1
    if (node.value === 1 &&
        neighbors.filter(x => x.node.value > 1).length === 1) {
        return connectTo(node, neighbors.filter(x => x.node.value > 1), 1, puzzle);
    }
    return 0;
}
function two(node, neighbors, puzzle) {
    // make a connection with 2 bridges to the neighbor
    if (neighbors.length === 1) {
        const bridges = getBridgesRemaining(neighbors[0].node) + neighbors[0].bridges;
        return connectTo(node, neighbors, bridges === 1 ? 1 : 2, puzzle);
    }
    if (node.value === 2 &&
        neighbors.length === 2 &&
        neighbors.every(x => x.node.value === 2)) {
        return connectTo(node, neighbors, 1, puzzle);
    }
    const unique = new Set(neighbors.map(x => getBridgesRemaining(x.node)));
    if (neighbors.length === 2 &&
        unique.size === 1 &&
        unique.has(1) &&
        neighbors.every(x => x.bridges === 0)) {
        return connectTo(node, neighbors, 1, puzzle);
    }
    if (neighbors.length === 2 &&
        unique.size === 2 &&
        unique.has(1) &&
        neighbors.every(x => x.bridges === 0)) {
        const neighborWithTwo = neighbors.find(x => getBridgesRemaining(x.node) !== 1);
        return connectTo(node, [neighborWithTwo], 1, puzzle);
    }
    return 0;
}
function others(value, node, neighbors, puzzle) {
    // let bridgesRemaining = neighbors.map(x => getBridgesRemaining(x));
    // let unique = new Set(bridgesRemaining);
    // if (unique.size === 1 && unique.has(1)
    //     && getBridges(node) === 0
    // ) {
    //     let bridgesCount = 0;
    //     // neighbors.forEach(neighbor => {
    //     bridgesCount += connectTo(node, neighbors, 1, puzzle);
    //     // })
    //     return bridgesCount;
    // }
    // make a connection with 1 bridge to all two neighbors
    return dynamicConnect(value, node, neighbors, puzzle);
}
function getBridges(node) {
    return getNeighbors(node).reduce((a, b) => a + b.bridges, 0);
}
function getBridgesRemaining(node) {
    return node.value - getNeighbors(node).reduce((a, b) => a + b.bridges, 0);
}
function dynamicConnect(value, node, neighbors, puzzle) {
    if (neighbors.length === Math.ceil(value / 2)) {
        return connectTo(node, neighbors, value % 2 === 0 ? 2 : 1, puzzle);
    }
    // if there is a 4 with three neighbors where one has 1, than connect to others
    // if there is a 6 with four neighbors where one has 1, than connect to others
    const unique = new Set(neighbors.map(x => getBridgesRemaining(x.node)));
    // let neighborsWithoutOne = neighbors.filter(x => getBridgesRemaining(x.node) !== 1)
    // let neighborsWithOne = neighbors.filter(x => getBridgesRemaining(x.node) === 1)
    const { one: neighborsWithOne, other: neighborsWithoutOne } = seperateNeighbors(neighbors);
    const remainingWithOne = neighbors.filter(x => clamp(1, 2, getBridgesRemaining(x.node) - x.bridges) === 1);
    const remainingWithoutOne = neighbors.filter(x => clamp(1, 2, getBridgesRemaining(x.node) - x.bridges) !== 1);
    const canAdd = new Set(neighbors.map(x => clamp(1, 2, getBridgesRemaining(x.node) - x.bridges)));
    // connect to all remaining with one bridge
    if (neighbors.length === neighborsWithOne.length
    // && getBridges(node) === 0
    ) {
        return connectTo(node, neighborsWithOne, 1, puzzle, true);
    }
    if (((value === 4 && neighbors.length === 3) ||
        (value === 6 && neighbors.length === 4)) &&
        neighborsWithOne.length === 1
    // && getBridges(node) < 2
    ) {
        return connectTo(node, neighborsWithoutOne, 1, puzzle);
    }
    if (value === 4 &&
        getBridgesRemaining(node) >= 3 &&
        neighbors.length === 3 &&
        neighborsWithOne.length > 1) {
        return connectTo(node, neighborsWithoutOne, 1, puzzle);
    }
    if (canAdd.size === 1 &&
        canAdd.has(1) &&
        value - getBridges(node) === neighbors.length) {
        return connectTo(node, neighbors, 1, puzzle, true);
    }
    if (value === 3 &&
        canAdd.size === 2 &&
        neighbors.length === 3 &&
        remainingWithOne.length === 2 &&
        getBridges(node) === 0) {
        return connectTo(node, remainingWithoutOne, 1, puzzle);
    }
    // if (unique.size === 1 && unique.has(1) && value - getBridges(node) === neighbors.length) {
    //     return connectTo(node, neighborsWithOne, 1, puzzle, true);
    // }
    return 0;
}
function clamp(min, max, value) {
    return Math.max(min, Math.min(value, max));
}
function seperateNeighbors(neighbors) {
    const onlyOne = [];
    const moreThanOne = [];
    neighbors.forEach(neighbor => {
        if (transformNode(neighbor.node).value === 1
        // neighbor.node.value === 1 ||
        // (getNeighbors(neighbor.node).filter(x => !x.done).length === 1
        //     && getBridgesRemaining(neighbor.node) === 1)
        ) {
            onlyOne.push(neighbor);
        }
        else {
            moreThanOne.push(neighbor);
        }
    });
    return { one: onlyOne, other: moreThanOne };
}
function connectTo(node, neighbors, bridges, puzzle, append = false) {
    let connections = 0;
    neighbors.forEach(neighbor => {
        if (append) {
            neighbor.bridges += bridges;
            connections += bridges;
        }
        else {
            connections += bridges - neighbor.bridges;
            neighbor.bridges = bridges;
        }
        const reverseConnection = getNeighbors(neighbor.node).find(n => n.node.id === node.id);
        if (!!reverseConnection) {
            reverseConnection.bridges = neighbor.bridges;
        }
        fillPuzzleWithBridge(puzzle, node.position[0], node.position[1], neighbor.position[0], neighbor.position[1], bridges);
        // updateState(x.node);
    });
    updateState(node);
    cleanNeighbors(node, puzzle);
    return connections;
}

function testGraph(nodes, puzzle) {
    for (const node of getNotCompletedNodes(nodes)) {
        const results = [];
        for (const neighbor of getNeighbors(node)) {
            const result = tryToConnect(puzzle, node, neighbor);
            results.push({ neighbor, openGraph: result });
        }
        if (results.length > 1 && results.filter(x => x.openGraph).length === 1) {
            oneOrTwo(node, results.find(x => x.openGraph === true).neighbor, puzzle);
            return true;
        }
    }
    return false;
}
function oneOrTwo(node, neighbor, puzzle) {
    const value = node.value -
        getNeighbors(node).reduce((a, b) => a + b.bridges, 0) +
        neighbor.bridges;
    return solveFor(value, puzzle, node, [neighbor]);
    // return solveFor(transformed.value, puzzle, node, [neighbor]);
    // if (node.value === 1) {
    //     return one(node, [neighbor], puzzle);
    // }
    // if (node.value === 2) {
    //     return two(node, [neighbor], puzzle);
    // }
}
function tryToConnect(puzzle, node, neighbor) {
    const puzzleClone = clone(puzzle);
    const clonedGraph = createGraph(puzzleClone);
    const clonedNode = clonedGraph.find(x => x.id === node.id);
    const clonedNeighbor = getNeighbors(clonedNode).find(x => x.node.id === neighbor.node.id);
    oneOrTwo(clonedNode, clonedNeighbor, puzzleClone);
    cleanGraph(clonedGraph, puzzleClone);
    // if (bridgeAdded === 0) {
    //     return false;
    // }
    const subgraph = getSubgraph(clonedNode);
    if (subgraph.length < clonedGraph.length && isGraphClosed(subgraph)) {
        return false;
    }
    return true;
}
function clone(puzzle) {
    return JSON.parse(JSON.stringify(puzzle));
}

function solverStep(puzzle) {
    const graph = createGraph(puzzle);
    const nodes = getNotCompletedNodes(graph);
    let newBridges = 0;
    nodes.forEach(node => {
        if (!node.completed) {
            const transformed = transformNode(node);
            newBridges += solveFor(transformed.value, puzzle, node, transformed.neighbors);
            cleanGraph(graph, puzzle);
        }
    });
    if (newBridges === 0 && getSubgraph(graph[0]).length < graph.length) {
        testGraph(graph, puzzle);
    }
    return getNotCompletedNodes(graph).length === 0;
}
function solver(bridgesPuzzle) {
    const puzzle = bridgesPuzzle.map(row => {
        return row.map(item => item.toString());
    });
    let solved = false;
    const steps = [];
    let oldPuzzle = "";
    let newPuzzle = JSON.stringify(puzzle);
    while (oldPuzzle !== newPuzzle) {
        oldPuzzle = newPuzzle;
        solved = solverStep(puzzle);
        newPuzzle = JSON.stringify(puzzle);
        steps.push(JSON.parse(newPuzzle));
        if (solved) {
            break;
        }
    }
    return { solved, solution: puzzle, steps };
}

exports.solver = solver;
exports.solverStep = solverStep;
