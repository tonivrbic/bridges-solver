import { traverseUp, traverseRight, traverseDown, traverseLeft, getNeighbors, updateStates } from "./utils";
import { Puzzle, ExtractedIsland, GraphNode } from "./models";

export function createGraph(puzzle: Puzzle) {
    let islands = 0;
    const extractedIslands = extractIslands(puzzle);

    let nodes = createNodes(puzzle, extractedIslands);

    connectNodes(nodes);

    updateStates(nodes);

    return nodes;
}

function extractIslands(puzzle: Puzzle) {
    let islands: ExtractedIsland[] = [];
    puzzle.forEach((row, i) => {
        row.forEach((item, j) => {
            if (item > '0' && item < '9') {
                islands.push({
                    position: [i, j],
                    value: item
                });
            }
        });
    });
    return islands;
}

function createNodes(puzzle: Puzzle, extractedIslands: ExtractedIsland[]) {
    return extractedIslands.map((item, index) => {
        const up = traverseUp(puzzle, item.position[0], item.position[1]);
        const right = traverseRight(puzzle, item.position[0], item.position[1]);
        const down = traverseDown(puzzle, item.position[0], item.position[1]);
        const left = traverseLeft(puzzle, item.position[0], item.position[1]);
        const neighbors = [];
        for (const i of [up, right, down, left]) {
            if (typeof i === 'number') {
                neighbors.push(null);
            }
            else {
                neighbors.push({
                    bridges: i.bridges,
                    position: i.position,
                    done: false,
                    node: {}
                });
            }
        }
        return {
            value: +item.value,
            position: item.position,
            completed: false,
            id: index,
            neighbors
        } as GraphNode;
    });
}

function connectNodes(graphNodes: GraphNode[]) {
    graphNodes.forEach(item => {
        item.neighbors.forEach((v, i) => {
            if (v !== null) {
                const node = graphNodes.find(n => n.position[0] === v.position[0] && n.position[1] === v.position[1]);
                item.neighbors[i].node = node;
            }
        });
    });
}