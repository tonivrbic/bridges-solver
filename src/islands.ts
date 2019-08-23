import { GraphNode, Neighbor, Puzzle } from "./models";
import { updateState, fillPuzzleWithBridge, getNeighbors, cleanNeighbors } from "./utils";


export const solveFor = (value: number, puzzle: Puzzle, node: GraphNode, neighbors: Neighbor[]) => {
    if (value === 1) {
        return one(node, neighbors, puzzle);
    } else if (value === 2) {
        return two(node, neighbors, puzzle);
    } else {
        return others(value, node, neighbors, puzzle);
    }
}


export function one(node: GraphNode, neighbors: Neighbor[], puzzle: Puzzle) {

    // make a connection with 1 bridge to the neighbor
    if (neighbors.length === 1) {
        return connectTo(node, neighbors, 1, puzzle);
    }

    // make a connection to one bridge that has not the value 1
    if (neighbors.filter(x => x.node.value > 1).length === 1) {
        return connectTo(node, neighbors.filter(x => x.node.value > 1), 1, puzzle);
    }

    return 0;
}

export function two(node: GraphNode, neighbors: Neighbor[], puzzle: Puzzle) {

    // make a connection with 2 bridges to the neighbor
    if (neighbors.length === 1) {
        let bridges = getBridgesRemaining(neighbors[0]) + neighbors[0].bridges;
        return connectTo(node, neighbors, bridges === 1 ? 1 : 2, puzzle);
    }

    if (neighbors.length === 2 && neighbors.every(x => x.node.value === 2)) {
        return connectTo(node, neighbors, 1, puzzle);
    }

    let unique = new Set(neighbors.map(x => getBridgesRemaining(x)))
    if (neighbors.length === 2 && unique.size === 1 && unique.has(1) && neighbors.every(x => x.bridges === 0)) {
        return connectTo(node, neighbors, 1, puzzle);
    }

    if (neighbors.length === 2 && unique.size === 2 && unique.has(1) && neighbors.every(x => x.bridges === 0)) {
        let neighborWithTwo = neighbors.find(x => getBridgesRemaining(x) !== 1);
        return connectTo(node, [neighborWithTwo], 1, puzzle);
    }
    return 0;
}

export function others(value: number, node: GraphNode, neighbors: Neighbor[], puzzle: Puzzle) {
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

export function getBridgesNotCompleted(node: GraphNode) {
    return getNeighbors(node).filter(x => !x.done).reduce((a, b) => a + b.bridges, 0);
}

export function getBridges(node: GraphNode) {
    return getNeighbors(node).reduce((a, b) => a + b.bridges, 0);
}

export function getBridgesRemaining(x: Neighbor) {
    return x.node.value - getNeighbors(x.node).reduce((a, b) => a + b.bridges, 0);
}


function dynamicConnect(value: number, node: GraphNode, neighbors: Neighbor[], puzzle: Puzzle) {
    if (neighbors.length === Math.ceil(value / 2)) {
        return connectTo(node, neighbors, value % 2 === 0 ? 2 : 1, puzzle);
    }

    // if there is a 4 with three neighbors where one has 1, than connect to others
    // if there is a 6 with four neighbors where one has 1, than connect to others
    let unique = new Set(neighbors.map(x => getBridgesRemaining(x)))
    let neighborsWithoutOne = neighbors.filter(x => getBridgesRemaining(x) !== 1)
    let neighborsWithOne = neighbors.filter(x => getBridgesRemaining(x) === 1)

    // connect to all remaining with one bridge
    if (unique.size === 1 &&
        unique.has(1) &&
        neighborsWithOne.length === value &&
        getBridges(node) === 0) {
        return connectTo(node, neighborsWithOne, 1, puzzle, true);
    }

    if (
        unique.size > 1 &&
        value === 4 &&
        getBridges(node) === 0 &&
        neighborsWithOne.length >= 1 &&
        neighborsWithoutOne.length >= 1) {
        return connectTo(node, neighborsWithoutOne, 1, puzzle);
    }


    // if (unique.size === 1 && unique.has(1) && value - getBridges(node) === neighbors.length) {
    //     return connectTo(node, neighborsWithOne, 1, puzzle, true);
    // }

    return 0;

}

function connectTo(node: GraphNode, neighbors: Neighbor[], bridges: number, puzzle: Puzzle, append = false) {
    let connections = 0;
    neighbors.forEach(neighbor => {
        if (append) {
            neighbor.bridges += bridges;
            connections += bridges;
        } else {
            connections += bridges - neighbor.bridges;
            neighbor.bridges = bridges;
        }
        let reverseConnection = getNeighbors(neighbor.node).find(n => n.node.id === node.id);
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