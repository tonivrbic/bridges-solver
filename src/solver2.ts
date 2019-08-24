import { createGraph } from "./createGraph";
import { Puzzle } from "./models";
import { getNotCompletedNodes, transformNode, showPuzzle, cleanGraph, getSubgraph, updateState, updateStates } from "./utils";
import { solveFor } from "./islands";
import { testGraph } from "./testGraph";


export function solverStep(puzzle: Puzzle) {
    let graph = createGraph(puzzle);

    let nodes = getNotCompletedNodes(graph);

    let newBridges = 0;
    nodes.forEach(node => {
        if (!node.completed) {
            let transformed = transformNode(node);

            newBridges += solveFor(transformed.value, puzzle, node, transformed.neighbors);

            cleanGraph(graph, puzzle);

            // showPuzzle(puzzle);
        }
    });


    if (newBridges === 0 && getSubgraph(graph[0]).length < graph.length) {
        let bridgeAdded = testGraph(graph, puzzle);
        if (bridgeAdded) {
            console.log('Test added one bridge')
        }
    }

    return getNotCompletedNodes(graph).length === 0;
}

export function solver2(puzzle: Puzzle) {
    let solved = false;
    let stepCount = 1;
    let oldPuzzle = '';
    let newPuzzle = JSON.stringify(puzzle);
    console.log(`Initial puzzle:`)
    showPuzzle(puzzle);
    while (oldPuzzle !== newPuzzle) {
        oldPuzzle = newPuzzle;
        // here goes solving

        solved = solverStep(puzzle);

        console.log(`Puzzle iteration ${stepCount}:`)
        showPuzzle(puzzle);

        stepCount++;
        newPuzzle = JSON.stringify(puzzle)
    }

    if (solved) {
        console.log('%c SOLVED', 'color: green;')
    } else {
        console.log('%c NOT SOLVED', 'color: red;')
    }

    return solved;
}

// export const solver = puzzleEmpty => {
//     const puzzle = cloneDeep(puzzleEmpty);
//     let islands = 0;
//     let oldBridges = 0;
//     let newBridges = 0;
//     const solvedIslands = 0;
//     const doneIslands = puzzle.map(row => row.map(item => false));
//     const grid = [];
//     puzzle.forEach((row, i) => {
//         row.forEach((item, j) => {
//             if (item > 0) {
//                 islands++;
//                 grid.push({
//                     position: [i, j],
//                     up: 0,
//                     right: 0,
//                     down: 0,
//                     left: 0,
//                     value: item,
//                     sum: 0,
//                     done: false
//                 });
//             }
//         });
//     });
//     const graphNodes = grid.map((item, index) => {
//         const up = traverseUp(item.position[0], item.position[1]);
//         const right = traverseRight(item.position[0], item.position[1]);
//         const down = traverseDown(item.position[0], item.position[1]);
//         const left = traverseLeft(item.position[0], item.position[1]);
//         const neighbors = [];
//         for (const i of [up, right, down, left]) {
//             if (i === 0) {
//                 neighbors.push(null);
//             } else {
//                 // @ts-ignore
//                 neighbors.push({
//                     bridges: 0,
//                     position: (i as any).position,
//                     done: false,
//                     node: {}
//                 });
//             }
//         }
//         return {
//             value: item.value,
//             position: item.position,
//             completed: false,
//             id: index,
//             neighbors
//         } as GraphNode;
//     });
//     graphNodes.forEach(item => {
//         item.neighbors.forEach((v, i) => {
//             if (v !== null) {
//                 const node = graphNodes.find(
//                     n =>
//                         n.position[0] === v.position[0] && n.position[1] === v.position[1]
//                 );
//                 item.neighbors[i].node = node;
//             }
//         });
//     });
//     let oldPuzzle = '';
//     let currentPuzzle = puzzleToString();
//     while (oldPuzzle !== currentPuzzle) {
//         oldPuzzle = puzzleToString();
//         graphNodes
//             .filter(gn => gn.completed === false)
//             .forEach(gn => {
//                 let count = gn.neighbors.filter(n => n !== null && !n.node.completed)
//                     .length;
//                 const completed = gn.neighbors
//                     .filter(n => n !== null && n.node.completed)
//                     .map(n => n.bridges)
//                     .reduce((a, b) => a + b, 0);
//                 const sum = gn.neighbors
//                     .filter(n => n !== null)
//                     .map(n => n.bridges)
//                     .reduce((a, b) => a + b, 0);
//                 const incomplete = gn.neighbors
//                     .filter(n => n !== null && n.done === false)
//                     .map(n => n.bridges)
//                     .reduce((a, b) => a + b, 0);
//                 if (gn.value === sum) {
//                     count = 0;
//                 }
//                 const neigboringValues = gn.neighbors
//                     .filter(n => n !== null && !n.done)
//                     .map(v => v.node.value)
//                     .reduce((a, b) => a + b, 0);
//                 const neighborWithOne = gn.neighbors.filter(
//                     n => n !== null && !n.done && n.node.value === 1
//                 )[0];

//                 // if there are islands with numbers 1 and 2, make a connection to the island 2 with one bridge

//                 if (count === 2 && neigboringValues === 3 && sum === 0) {
//                     // if(neigboringValues === 3){

//                     gn.neighbors.forEach((neighbor, index) => {
//                         if (
//                             neighbor !== null &&
//                             !neighbor.done &&
//                             neighbor.node.value !== 1
//                         ) {
//                             setBridges(gn, neighbor, 1, index);
//                         }
//                     });
//                     // }
//                 } else if (count === 1) {
//                     const neighbor = gn.neighbors.filter(n => n !== null && !n.done)[0];
//                     if (neighbor && !neighbor.done) {
//                         // if a bridge already exists with the neigbor, make two bridges
//                         // if it does not exist make one bridge
//                         const index = gn.neighbors.findIndex(n => n !== null && !n.done);
//                         // if (neighbor.bridges === 1 || (sum === 0 && gn.value === 2)) {
//                         // neighbor.bridges = 2;
//                         // neighbor.done = true;
//                         setBridges(gn, neighbor, gn.value - sum + incomplete, index);
//                         // } else {
//                         // setBridges(gn, neighbor, 1, index);
//                         // }
//                     }
//                 } else if (count === 2 && gn.value - sum + incomplete > 2) {
//                     const bridges = Math.floor((gn.value - sum + incomplete) / 2);
//                     if (bridges > 0) {
//                         gn.neighbors.forEach((neighbor, index) => {
//                             if (neighbor !== null && !neighbor.done) {
//                                 setBridges(gn, neighbor, bridges, index);
//                             }
//                         });
//                     }
//                 } else if (
//                     count === 2 &&
//                     gn.value === 2 &&
//                     sum === 0 &&
//                     (neigboringValues === 3 || neigboringValues === 4)
//                 ) {
//                     const neighboringValues = gn.neighbors
//                         .filter(n => n !== null && !n.done)
//                         .map(v => v.node.value)
//                         .reduce((a, b) => a + b);
//                     if (neighboringValues === 3) {
//                         // if there are neighbors with 1 and 2, and the curent island is 2
//                         // than create one bridge to the neighbor with 2
//                         const neighbor = gn.neighbors
//                             .filter(n => n !== null && !n.done)
//                             .filter(n => n.node.value === 2)[0];
//                         const index = gn.neighbors.findIndex(
//                             n => n !== null && n.node.value === 2 && !n.done
//                         );
//                         // neighbor.bridges = 1;
//                         setBridges(gn, neighbor, 1, index);
//                     } else if (neighboringValues === 4) {
//                         // two islands with number 2 can't be connected with two bridges
//                         // than make a connection with one bridge to two islands
//                         const filteredNeighbors = gn.neighbors.filter(
//                             n => n !== null && !n.done
//                         );
//                         if (filteredNeighbors[0].node.value === 2) {
//                             gn.neighbors.forEach((neighbor, index) => {
//                                 if (neighbor !== null) {
//                                     setBridges(gn, neighbor, 1, index);
//                                 }
//                             });
//                         } else {
//                             // if 1 and 3 connect one bridge to 3
//                             gn.neighbors.forEach((neighbor, index) => {
//                                 if (neighbor !== null && neighbor.node.value === 3) {
//                                     setBridges(gn, neighbor, 1, index);
//                                 }
//                             });
//                         }
//                     }
//                 } else if (
//                     gn.value === 2 &&
//                     count === 2 &&
//                     sum === 0 &&
//                     neigboringValues > 4 &&
//                     gn.neighbors.filter(n => n !== null && n.node.value === 1).length ===
//                     1
//                 ) {
//                     // if 1 and any other number connect one bridge to the other than one
//                     gn.neighbors.forEach((neighbor, index) => {
//                         if (neighbor !== null && neighbor.node.value !== 1) {
//                             setBridges(gn, neighbor, 1, index);
//                         }
//                     });
//                 } else if (count === 2 && gn.value === 1) {
//                     // island with 1 can not have a neighbor with 1
//                     const filteredNeighbors = gn.neighbors.filter(
//                         n => n !== null && n.node.value !== 1 && !n.done
//                     );
//                     if (filteredNeighbors.length === 1) {
//                         const index = gn.neighbors.findIndex(
//                             n => n !== null && n.node.value !== 1 && !n.done
//                         );
//                         setBridges(gn, filteredNeighbors[0], 1, index);
//                     } else {
//                         let newGraph = cloneDeep(graphNodes);
//                         let node = newGraph.find(v => v.id === gn.id);
//                         for (let i = 0; i < node.neighbors.length; i++) {
//                             const element = node.neighbors[i];

//                             if (element !== null && !element.done) {
//                                 const bridgesLeft =
//                                     element.node.value -
//                                     element.node.neighbors
//                                         .filter(n => n !== null)
//                                         .map(n => n.bridges)
//                                         .reduce((a, b) => a + b, 0);
//                                 if (bridgesLeft === 1) {
//                                     console.log('testing graph with 1');
//                                     setBridges(node, element, 1, i);
//                                     newGraph.forEach(value => {
//                                         cleanNeighbors(value);
//                                     });
//                                     const nodeIds = numberOfGraphNodes(node);
//                                     let allDone = true;
//                                     nodeIds.forEach(id => {
//                                         if (!newGraph.find(v => v.id === id).completed) {
//                                             allDone = false;
//                                         }
//                                     });
//                                     if (allDone && nodeIds.length !== islands) {
//                                         const index = gn.neighbors.findIndex(
//                                             v => v !== null && v.node.id !== element.node.id
//                                         );
//                                         console.log(
//                                             'bridge to graph that does not complete with 1'
//                                         );
//                                         setBridges(gn, gn.neighbors[index], 1, index);
//                                         break;
//                                     }
//                                     newGraph = cloneDeep(graphNodes);
//                                     node = newGraph.find(v => v.id === gn.id);
//                                 }
//                             }
//                         }
//                     }
//                 } else if (count === 2 && gn.value - sum + incomplete === 2) {
//                     const bridges = Math.floor((gn.value - sum + incomplete) / 2);
//                     if (bridges > 0) {
//                         const left = [];
//                         gn.neighbors.forEach((neighbor, index) => {
//                             if (neighbor !== null && !neighbor.done) {
//                                 left.push(
//                                     neighbor.node.value -
//                                     neighbor.node.neighbors
//                                         .filter(n => n !== null)
//                                         .map(n => n.bridges)
//                                         .reduce((a, b) => a + b, 0)
//                                 );
//                                 // setBridges(gn, neighbor, bridges, index);
//                             }
//                         });
//                         const bridgesToNeighbors = gn.neighbors
//                             .filter(v => v !== null && !v.done)
//                             .map(v => v.bridges)
//                             .reduce((a, b) => a + b, 0);
//                         // if (
//                         //   gn.value === 2 &&
//                         //   gn.neighbors
//                         //     .filter(n => n !== null && !n.done)
//                         //     .some(n => n.node.value === 2)
//                         // ) {
//                         //   gn.neighbors.forEach((neighbor, index) => {
//                         //     if (neighbor !== null && !neighbor.done) {
//                         //       setBridges(gn, neighbor, 1, index);
//                         //     }
//                         //   });
//                         // } else
//                         if (left[0] === 1 && left[1] === 1 && bridgesToNeighbors === 0) {
//                             gn.neighbors.forEach((neighbor, index) => {
//                                 if (neighbor !== null && !neighbor.done) {
//                                     setBridges(gn, neighbor, 1, index);
//                                 }
//                             });
//                         } else if (
//                             left.some(v => v === 1) &&
//                             left.some(v => v >= 2) &&
//                             bridgesToNeighbors === 0
//                             // && gn.value > 2
//                         ) {
//                             gn.neighbors.forEach((neighbor, index) => {
//                                 if (neighbor !== null && !neighbor.done) {
//                                     const bridgesLeft =
//                                         neighbor.node.value -
//                                         neighbor.node.neighbors
//                                             .filter(n => n !== null)
//                                             .map(n => n.bridges)
//                                             .reduce((a, b) => a + b, 0);
//                                     if (bridgesLeft >= 2) {
//                                         setBridges(gn, neighbor, 1, index);
//                                     }
//                                 }
//                             });
//                         } else {
//                             let newGraph = cloneDeep(graphNodes);
//                             let node = newGraph.find(v => v.id === gn.id);
//                             // if (node.value === 2 && count === 2) {
//                             if (count === 2) {
//                                 console.log('---testing graph');
//                                 for (let i = 0; i < node.neighbors.length; i++) {
//                                     const element = node.neighbors[i];

//                                     if (element !== null && !element.done) {
//                                         const bridgesLeft =
//                                             element.node.value -
//                                             element.node.neighbors
//                                                 .filter(n => n !== null)
//                                                 .map(n => n.bridges)
//                                                 .reduce((a, b) => a + b, 0);
//                                         if (bridgesLeft === 2 || bridgesLeft === 1) {
//                                             console.log('-----test graph', i);
//                                             setBridges(node, element, 2, i);
//                                             newGraph.forEach(value => {
//                                                 cleanNeighbors(value);
//                                             });
//                                             const nodeIds = numberOfGraphNodes(node);
//                                             let allDone = true;
//                                             nodeIds.forEach(id => {
//                                                 if (!newGraph.find(v => v.id === id).completed) {
//                                                     allDone = false;
//                                                 }
//                                             });
//                                             if (allDone && nodeIds.length !== islands) {
//                                                 const index = gn.neighbors.findIndex(
//                                                     v =>
//                                                         v !== null &&
//                                                         v.node.id !== element.node.id &&
//                                                         !v.done
//                                                 );
//                                                 console.log('---done testing graph');
//                                                 console.log('bridge to graph that does not complete');
//                                                 const bridges =
//                                                     gn.neighbors[index].bridges === 1 ? 2 : 1;
//                                                 setBridges(gn, gn.neighbors[index], bridges, index);
//                                                 break;
//                                             }
//                                             newGraph = cloneDeep(graphNodes);
//                                             node = newGraph.find(v => v.id === gn.id);
//                                         }
//                                     }
//                                 }
//                                 console.log('---exiting test graph');
//                             }
//                         }
//                     }
//                 } else if (
//                     ((gn.value === 5 || gn.value === 6) &&
//                         count === 3 &&
//                         count === gn.neighbors.filter(n => n !== null).length) ||
//                     ((gn.value === 7 || gn.value === 8) && count === 4)
//                 ) {
//                     const bridges = Math.floor((gn.value - sum + incomplete) / count);
//                     gn.neighbors.forEach((neighbor, index) => {
//                         if (neighbor !== null && !neighbor.done) {
//                             setBridges(gn, neighbor, bridges, index);
//                         }
//                     });
//                 } else if (gn.value === 5 && sum === 3 && count === 2) {
//                     gn.neighbors.forEach((neighbor, index) => {
//                         if (neighbor !== null && !neighbor.done) {
//                             setBridges(gn, neighbor, 2, index);
//                         }
//                     });
//                 } else if (
//                     (count === 3 && gn.value === 3) ||
//                     (count === 4 && gn.value === 4) ||
//                     (count === 4 && gn.value === 6)
//                 ) {
//                     const left = [];
//                     gn.neighbors.forEach((neighbor, index) => {
//                         if (neighbor !== null && !neighbor.done && neighbor.bridges === 0) {
//                             left.push({
//                                 value:
//                                     neighbor.node.value -
//                                     neighbor.node.neighbors
//                                         .filter(n => n !== null)
//                                         .map(n => n.bridges)
//                                         .reduce((a, b) => a + b, 0),
//                                 index
//                             });
//                         }
//                     });
//                     if (left.length === count && left.every(v => v.value === 1)) {
//                         gn.neighbors.forEach((neighbor, index) => {
//                             if (neighbor !== null && !neighbor.done) {
//                                 setBridges(gn, neighbor, 1, index);
//                             }
//                         });
//                     } else if (
//                         count === 3 &&
//                         left.length === count &&
//                         left.filter(v => v.value === 1).length === 2 &&
//                         left.filter(v => v.value > 1).length === 1
//                     ) {
//                         const bigNeighbor = left.find(v => v.value > 1);
//                         setBridges(
//                             gn,
//                             gn.neighbors[bigNeighbor.index],
//                             1,
//                             bigNeighbor.index
//                         );
//                     } else if (
//                         count === 4 &&
//                         gn.value === 6 &&
//                         left.filter(v => v.value === 1).length === 2
//                     ) {
//                         left
//                             .filter(v => v.value === 1)
//                             .forEach(v => {
//                                 setBridges(gn, gn.neighbors[v.index], 1, v.index);
//                             });
//                     }
//                 } else if (gn.value === 4 && count === 3 && gn.value - sum > 2) {
//                     const left = [];
//                     gn.neighbors.forEach((neighbor, index) => {
//                         if (neighbor !== null && !neighbor.done) {
//                             const neighborBridges = neighbor.bridges;
//                             left.push({
//                                 value:
//                                     // neighborBridges +
//                                     neighbor.node.value -
//                                     neighbor.node.neighbors
//                                         .filter(n => n !== null)
//                                         .map(n => n.bridges)
//                                         .reduce((a, b) => a + b, 0),
//                                 index
//                             });
//                         }
//                     });
//                     if (
//                         sum === 0 &&
//                         gn.neighbors
//                             .filter(n => n !== null && !n.done)
//                             .some(n => n.node.value === 1)
//                     ) {
//                         gn.neighbors.forEach((neighbor, index) => {
//                             if (
//                                 neighbor !== null &&
//                                 !neighbor.done &&
//                                 neighbor.node.value !== 1
//                             ) {
//                                 console.log('setting from 4 with 3 neighbors where one is 1');
//                                 setBridges(gn, neighbor, 1, index);
//                             }
//                         });
//                     } else if (
//                         sum === 0 &&
//                         left.some(v => v.value === 1) &&
//                         left.filter(v => v.value === 1).length === 1
//                         // && _.uniq(left.map(v => v.value)).length === count
//                     ) {
//                         const neighborWithOne = left.find(v => v.value === 1);
//                         gn.neighbors.forEach((neighbor, index) => {
//                             if (
//                                 neighbor !== null &&
//                                 !neighbor.done &&
//                                 index !== neighborWithOne.index
//                             ) {
//                                 console.log(
//                                     'setting from 4 with 3 neighbors where one is 1 left'
//                                 );
//                                 setBridges(gn, neighbor, 1, index);
//                             }
//                         });
//                     } else if (left.every(v => v.value === 1)) {
//                         gn.neighbors.forEach((neighbor, index) => {
//                             if (neighbor !== null && !neighbor.done) {
//                                 console.log(
//                                     'setting from 4 with 3 neighbors where every needs 1'
//                                 );
//                                 setBridges(gn, neighbor, 1, index);
//                             }
//                         });
//                     }
//                 } else if (gn.value === 5 && count === 3 && gn.value - sum > 2) {
//                     const left = [];
//                     gn.neighbors.forEach((neighbor, index) => {
//                         if (neighbor !== null && !neighbor.done) {
//                             const neighborBridges = neighbor.bridges;
//                             left.push({
//                                 value:
//                                     // neighborBridges +
//                                     neighbor.node.value -
//                                     neighbor.node.neighbors
//                                         .filter(n => n !== null)
//                                         .map(n => n.bridges)
//                                         .reduce((a, b) => a + b, 0),
//                                 index
//                             });
//                         }
//                     });
//                     if (
//                         left.some(v => v.value === 1) &&
//                         left.filter(v => v.value === 1).length === 2
//                         // && _.uniq(left.map(v => v.value)).length === count
//                     ) {
//                         const neighborWithoutOne = left.find(v => v.value !== 1);
//                         gn.neighbors.forEach((neighbor, index) => {
//                             if (
//                                 neighbor !== null &&
//                                 !neighbor.done &&
//                                 index === neighborWithoutOne.index
//                             ) {
//                                 console.log(
//                                     'setting from 5 with 3 neighbors where two are left with 1'
//                                 );
//                                 setBridges(gn, neighbor, 1, index);
//                             }
//                         });
//                     }
//                 } else if (gn.value === 6 && count === 3 && sum === 2) {
//                     const bridgesLeft =
//                         gn.value -
//                         gn.neighbors
//                             .filter(n => n !== null && n.done)
//                             .map(n => n.bridges)
//                             .reduce((a, b) => a + b, 0);
//                     const left = [];
//                     gn.neighbors.forEach((neighbor, index) => {
//                         if (neighbor !== null && !neighbor.done && neighbor.bridges === 0) {
//                             left.push({
//                                 value:
//                                     neighbor.node.value -
//                                     neighbor.node.neighbors
//                                         .filter(n => n !== null)
//                                         .map(n => n.bridges)
//                                         .reduce((a, b) => a + b, 0),
//                                 index
//                             });
//                         }
//                     });
//                     if (
//                         bridgesLeft === 4 &&
//                         left.filter(v => v.value === 1).length === 1
//                     ) {
//                         left
//                             .filter(v => v.value !== 1)
//                             .forEach(v => {
//                                 setBridges(gn, gn.neighbors[v.index], 1, v.index);
//                             });
//                     }
//                 } else if (gn.value === 6 && completed === 1 && count === 3) {
//                     gn.neighbors.forEach((neighbor, index) => {
//                         if (neighbor !== null && !neighbor.done) {
//                             setBridges(gn, neighbor, 1, index);
//                         }
//                     });
//                 }
//             });
//         // fill grid with lines
//         graphNodes.forEach(gn => {
//             gn.neighbors.forEach((neighbor, index) => {
//                 if (neighbor !== null) {
//                     fillPuzzleWithBridge(
//                         gn.position[0],
//                         gn.position[1],
//                         neighbor.position[0],
//                         neighbor.position[1],
//                         neighbor.bridges
//                     );
//                 }
//             });
//         });
//         graphNodes.forEach(gn => {
//             cleanNeighbors(gn);
//         });
//         const completedIslands = graphNodes.filter(gn => gn.completed).length;
//         // traverse graph
//         if (oldBridges !== newBridges) {
//             oldBridges = newBridges;
//         } else {
//             const graphs = [];
//             const graphRoots = [];
//             for (const gn of graphNodes) {
//                 if (gn.completed) {
//                     continue;
//                 }
//                 const visitedNodes = numberOfGraphNodes(gn);
//                 visitedNodes.sort();
//                 const length = graphs.filter(
//                     a1 =>
//                         a1.length == visitedNodes.length &&
//                         a1.every((v, i) => v === visitedNodes[i])
//                 ).length;
//                 if (length === 0) {
//                     graphs.push(visitedNodes);
//                     graphRoots.push(gn.id);
//                 }
//             }
//             const uniqueGraphs = [...graphs.map(v => v.length)];
//             const indexOfMax = uniqueGraphs.indexOf(Math.max(...uniqueGraphs));
//             const uniqueWithoutMax = [...uniqueGraphs];
//             uniqueWithoutMax[indexOfMax] = 0;
//             const indexOfSecondMax = uniqueWithoutMax.indexOf(
//                 Math.max(...uniqueWithoutMax)
//             );
//             const indexOfMin = uniqueGraphs.indexOf(Math.min(...uniqueGraphs));
//             const uniqueWithoutMin = [...uniqueGraphs];
//             uniqueWithoutMin[indexOfMin] = 0;
//             const indexOfSecondMin = uniqueWithoutMin.indexOf(
//                 Math.min(...uniqueWithoutMin)
//             );
//             if (uniqueGraphs.length === 4) {
//                 graphNodes
//                     .filter(
//                         gn =>
//                             !gn.completed &&
//                             (gn.id === graphRoots[indexOfMin] ||
//                                 gn.id === graphRoots[indexOfSecondMin]) &&
//                             graphRoots.some(v => v === gn.id)
//                     )
//                     .forEach(gn => {
//                         const bigNeighbor = gn.neighbors.filter(
//                             n =>
//                                 n !== null &&
//                                 (n.node.id === graphRoots[indexOfMax] ||
//                                     n.node.id === graphRoots[indexOfSecondMax])
//                         );
//                         if (bigNeighbor.length === 1) {
//                             const index = gn.neighbors.findIndex(
//                                 n =>
//                                     n !== null &&
//                                     (n.node.id === graphRoots[indexOfMax] ||
//                                         n.node.id === graphRoots[indexOfSecondMax])
//                             );
//                             console.log('GRAPH:');
//                             setBridges(gn, bigNeighbor[0], 1, index);
//                         }
//                     });
//             } else if (uniqueGraphs.length === 3) {
//             }
//             graphNodes.forEach(gn => {
//                 cleanNeighbors(gn);
//             });
//         }
//         // fill grid with lines
//         graphNodes.forEach(gn => {
//             gn.neighbors.forEach((neighbor, index) => {
//                 if (neighbor !== null) {
//                     fillPuzzleWithBridge(
//                         gn.position[0],
//                         gn.position[1],
//                         neighbor.position[0],
//                         neighbor.position[1],
//                         neighbor.bridges
//                     );
//                 }
//             });
//         });
//         showGrid();


//         if (
//             islands === completedIslands &&
//             numberOfGraphNodes(graphNodes[0]).length === islands
//         ) {
//             console.log('--------SOLVED---------');
//             return { solved: true, puzzle };
//         }

//         currentPuzzle = puzzleToString();
//     }



//     return { solved: false, puzzle };

//     function numberOfGraphNodes(gn) {
//         const toVisit = [];
//         const visitedNodes = [];
//         toVisit.push(gn);
//         visitedNodes.push(gn.id);
//         while (toVisit.length > 0) {
//             const popped = toVisit.pop();
//             popped.neighbors.forEach(neighbor => {
//                 if (
//                     neighbor !== null &&
//                     neighbor.bridges > 0 &&
//                     visitedNodes.indexOf(neighbor.node.id) === -1
//                 ) {
//                     toVisit.push(neighbor.node);
//                     visitedNodes.push(neighbor.node.id);
//                 }
//             });
//         }
//         return visitedNodes;
//     }

//     function cleanNeighbors(gn) {
//         const newNeighbors = [
//             traverseUp(gn.position[0], gn.position[1]),
//             traverseRight(gn.position[0], gn.position[1]),
//             traverseDown(gn.position[0], gn.position[1]),
//             traverseLeft(gn.position[0], gn.position[1])
//         ];
//         for (let i = 0; i < newNeighbors.length; i++) {
//             const element = newNeighbors[i];
//             if (element === 0 && gn.neighbors[i] !== null) {
//                 const neighborIndex = calculateIndex(i);
//                 console.log(`cleaned ${gn.position} from ${i}`);
//                 gn.neighbors[i].node.neighbors[neighborIndex] = null;
//                 gn.neighbors[i] = null;
//             }
//         }
//         const sum = gn.neighbors
//             .filter(n => n !== null)
//             .map(n => n.bridges)
//             .reduce((a, b) => a + b, 0);
//         if (gn.value === sum) {
//             gn.neighbors.forEach((n, i) => {
//                 if (n !== null) {
//                     n.done = true;
//                     const ni = calculateIndex(i);
//                     n.node.neighbors[ni].done = true;
//                 }
//             });
//             gn.completed = true;
//         }
//         if (gn.completed) {
//             for (let i = 0; i < gn.neighbors.length; i++) {
//                 if (gn.neighbors[i] !== null && gn.neighbors[i].bridges === 0) {
//                     const ni = calculateIndex(i);
//                     gn.neighbors[i].node.neighbors[ni] = null;
//                     gn.neighbors[i] = null;
//                 }
//             }
//         }
//     }

//     function setBridges(head, neighbor, bridges, index) {
//         if (bridges === 0) {
//             return;
//         }
//         if (neighbor.bridges !== bridges) {
//             newBridges++;
//         }
//         neighbor.bridges = bridges;
//         const neighborIndex = calculateIndex(index);
//         neighbor.node.neighbors[neighborIndex].bridges = bridges;
//         if (bridges === 2) {
//             neighbor.done = true;
//             neighbor.node.neighbors[neighborIndex].done = true;
//             console.log(
//                 `done ${neighbor.node.neighbors[neighborIndex].position} to ${index}`
//             );
//         }
//         const sum = head.neighbors
//             .filter(n => n !== null)
//             .map(n => n.bridges)
//             .reduce((a, b) => a + b, 0);
//         if (head.value === sum) {
//             neighbor.done = true;
//             head.neighbors.forEach((n, i) => {
//                 if (n !== null) {
//                     n.done = true;
//                     const ni = calculateIndex(i);
//                     n.node.neighbors[ni].done = true;
//                 }
//             });
//             head.completed = true;
//             console.log(`completed ${head.position}`);
//         }

//         const neighborSum = neighbor.node.neighbors
//             .filter(n => n !== null)
//             .map(n => n.bridges)
//             .reduce((a, b) => a + b, 0);
//         if (neighbor.node.value === neighborSum) {
//             neighbor.node.neighbors.forEach((n, i) => {
//                 if (n !== null) {
//                     n.done = true;
//                     const ni = calculateIndex(i);
//                     n.node.neighbors[ni].done = true;
//                 }
//             });
//             neighbor.node.completed = true;
//             console.log(`completed ${neighbor.node.position}`);
//         }

//         console.log(
//             `${bridges} from ${neighbor.node.neighbors[neighborIndex].position} to ${index}`
//         );

//         graphNodes.forEach(gn => {
//             cleanNeighbors(gn);
//         });
//     }

//     function calculateIndex(index) {
//         if (index === 2) {
//             return 0;
//         } else if (index === 3) {
//             return 1;
//         } else {
//             return index + 2;
//         }
//     }

//     // ----------------  UTIL --------------------------


//     function traverseUp(x: number, y: number) {
//         for (let row = x - 1; row >= 0; row--) {
//             if (puzzle[row][y] === '=' || puzzle[row][y] === '-') {
//                 return 0;
//             }
//             if (puzzle[row][y] > 0) {
//                 return { position: [row, y], value: puzzle[row][y] };
//             }
//         }
//         return 0;
//     }

//     function traverseDown(x, y) {
//         for (let row = x + 1; row < puzzle.length; row++) {
//             if (puzzle[row][y] === '=' || puzzle[row][y] === '-') {
//                 return 0;
//             }
//             if (puzzle[row][y] > 0) {
//                 return { position: [row, y], value: puzzle[row][y] };
//             }
//         }
//         return 0;
//     }

//     function traverseRight(x, y) {
//         for (let column = y + 1; column < puzzle.length; column++) {
//             if (puzzle[x][column] === '$' || puzzle[x][column] === '|') {
//                 return 0;
//             }
//             if (puzzle[x][column] > 0) {
//                 return { position: [x, column], value: puzzle[x][column] };
//             }
//         }
//         return 0;
//     }

//     function traverseLeft(x, y) {
//         for (let column = y - 1; column >= 0; column--) {
//             if (puzzle[x][column] === '$' || puzzle[x][column] === '|') {
//                 return 0;
//             }
//             if (puzzle[x][column] > 0) {
//                 return { position: [x, column], value: puzzle[x][column] };
//             }
//         }
//         return 0;
//     }

//     function fillPuzzleWithBridge(x1, y1, x2, y2, numberOfBridges) {
//         if (numberOfBridges === 0) {
//             return;
//         }
//         let sign = '';
//         if (x1 === x2) {
//             sign = numberOfBridges === 2 ? '=' : '-';
//             for (let j = Math.min(y1, y2) + 1; j <= Math.max(y1, y2) - 1; j++) {
//                 if (puzzle[x1][j] === '=') {
//                     break;
//                 }
//                 if (puzzle[x1][j] === '-' && sign === '-') {
//                     // sign = "=";
//                 }
//                 puzzle[x1][j] = sign;
//             }
//         } else if (y1 === y2) {
//             sign = numberOfBridges === 2 ? '$' : '|';
//             for (let i = Math.min(x1, x2) + 1; i <= Math.max(x1, x2) - 1; i++) {
//                 if (puzzle[i][y1] === '$') {
//                     break;
//                 }
//                 if (puzzle[i][y1] === '|' && sign === '|') {
//                     // sign = "$";
//                 }
//                 puzzle[i][y1] = sign;
//             }
//         }
//     }

//     function showGrid() {
//         console.log('----------------------------------');
//         const display = [];
//         puzzle.forEach(row => display.push(' '.repeat(row.length)));

//         for (let i = 0; i < puzzle.length; i++) {
//             for (let j = 0; j < puzzle.length; j++) {
//                 if (
//                     puzzle[i][j] > 0 ||
//                     puzzle[i][j] === '=' ||
//                     puzzle[i][j] === '-' ||
//                     puzzle[i][j] === '$' ||
//                     puzzle[i][j] === '|'
//                 ) {
//                     // place value inside string at correct position
//                     display[i] =
//                         display[i].slice(0, j) +
//                         puzzle[i][j] +
//                         display[i].slice(j + 1, puzzle.length);
//                 }
//             }
//         }
//         display.forEach(row => console.log(row));
//         console.log('------------');
//         return display;
//     }

//     function puzzleToString() {
//         const display = [];
//         puzzle.forEach(row => display.push(' '.repeat(row.length)));

//         for (let i = 0; i < puzzle.length; i++) {
//             for (let j = 0; j < puzzle.length; j++) {
//                 if (
//                     puzzle[i][j] > 0 ||
//                     puzzle[i][j] === '=' ||
//                     puzzle[i][j] === '-' ||
//                     puzzle[i][j] === '$' ||
//                     puzzle[i][j] === '|'
//                 ) {
//                     // place value inside string at correct position
//                     display[i] =
//                         display[i].slice(0, j) +
//                         puzzle[i][j] +
//                         display[i].slice(j + 1, puzzle.length);
//                 }
//             }
//         }
//         return JSON.stringify(display);
//     }
// };