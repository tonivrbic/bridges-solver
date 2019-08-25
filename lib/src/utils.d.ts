import { GraphNode, Puzzle } from "./models";
export declare function traverseUp(puzzle: Puzzle, x: number, y: number): 0 | {
    bridges: number;
    position: number[];
    value: string;
};
export declare function traverseDown(puzzle: Puzzle, x: number, y: number): 0 | {
    bridges: number;
    position: number[];
    value: string;
};
export declare function traverseRight(puzzle: Puzzle, x: number, y: number): 0 | {
    bridges: number;
    position: number[];
    value: string;
};
export declare function traverseLeft(puzzle: Puzzle, x: number, y: number): 0 | {
    bridges: number;
    position: number[];
    value: string;
};
export declare function getNeighbors(node: GraphNode): import("./models").Neighbor[];
export declare function updateState(node: GraphNode): void;
export declare function updateStates(nodes: GraphNode[]): void;
export declare function getNotCompletedNodes(nodes: GraphNode[]): GraphNode[];
export declare function transformNode(node: GraphNode): {
    neighbors: import("./models").Neighbor[];
    value: number;
};
export declare function fillPuzzleWithBridge(puzzle: Puzzle, x1: number, y1: number, x2: number, y2: number, numberOfBridges: number): void;
export declare function cleanNeighbors(node: GraphNode, puzzle: Puzzle): void;
export declare function cleanGraph(graph: GraphNode[], puzzle: Puzzle): void;
export declare function getSubgraph(node: GraphNode): GraphNode[];
export declare function isGraphClosed(nodes: GraphNode[]): boolean;
