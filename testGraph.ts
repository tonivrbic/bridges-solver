import { GraphNode, Puzzle, Neighbor } from "./models";
import { getNeighbors, getNotCompletedNodes, getSubgraph, isGraphClosed, transformNode, cleanGraph, updateStates } from "./utils";
import { createGraph } from "./createGraph";
import { one, two, solveFor, getBridgesRemaining } from "./islands";

export function testGraph(nodes: GraphNode[], puzzle: Puzzle) {
    for (const node of getNotCompletedNodes(nodes)) {
        let results: { neighbor: Neighbor; openGraph: boolean; }[] = [];
        for (const neighbor of getNeighbors(node)) {
            let result = tryToConnect(puzzle, node, neighbor)
            results.push({ neighbor, openGraph: result });

        }

        if (results.length > 1 && results.filter(x => x.openGraph).length === 1) {
            oneOrTwo(node, results.find(x => x.openGraph === true).neighbor, puzzle);
            return true;
        }
    }

    return false;
}

function oneOrTwo(node: GraphNode, neighbor: Neighbor, puzzle: string[][]) {
    let transformed = transformNode(node);
    let value = node.value -
        getNeighbors(node).reduce((a, b) => a + b.bridges, 0)
        + neighbor.bridges;
    return solveFor(value, puzzle, node, [neighbor]);
    // return solveFor(transformed.value, puzzle, node, [neighbor]);


    // if (node.value === 1) {
    //     return one(node, [neighbor], puzzle);
    // }
    // if (node.value === 2) {
    //     return two(node, [neighbor], puzzle);
    // }
}

function tryToConnect(puzzle: Puzzle, node: GraphNode, neighbor: Neighbor) {
    let puzzleClone = clone(puzzle);
    let clonedGraph = createGraph(puzzleClone);
    let clonedNode = clonedGraph.find(x => x.id === node.id);
    let clonedNeighbor = getNeighbors(clonedNode).find(x => x.node.id === neighbor.node.id);

    let bridgeAdded = oneOrTwo(clonedNode, clonedNeighbor, puzzleClone);
    cleanGraph(clonedGraph, puzzleClone);

    // if (bridgeAdded === 0) {
    //     return false;
    // }

    let subgraph = getSubgraph(clonedNode);
    if (subgraph.length < clonedGraph.length && isGraphClosed(subgraph)) {
        return false;
    }

    return true;
}

function clone(puzzle: string[][]) {
    return JSON.parse(JSON.stringify(puzzle));
}

