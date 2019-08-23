export interface GraphNode {
    id: number;
    completed: boolean;
    position: number[];
    value: number;
    neighbors: Neighbor[];
}

export interface Neighbor {
    bridges: number;
    position: number[];
    done: boolean;
    node: GraphNode;
}

export interface ExtractedIsland {
    position: number[];
    value: string;
}

export type Puzzle = string[][];
