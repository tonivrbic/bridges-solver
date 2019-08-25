import { Puzzle, SolverResult } from "./models";
/**
 * Iterates through all islands and adds new bridges. This function should be called
 * multiple times until the puzzle is solved.
 */
export declare function solverStep(puzzle: Puzzle): boolean;
/**
 * Solves the bridges puzzle.
 * @param bridgesPuzzle A 2D matrix representing the puzzle where zeros represent empty spaces.
 */
export declare function solver(bridgesPuzzle: number[][]): SolverResult;
