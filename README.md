# Hashi Puzzle solver

This package allows you to solve the popular japanese puzzle **Hashiwokakero** (also known as Bridges, and Hashi). An application that implements this package is available at https://hashi-puzzles.com and the solver is available [here](https://hashi-puzzles.com/solve).

## Links 

### Solver 
You can play with the solver on the Hashi Puzzles application at the following link:
- [Hashi Puzzles App](https://hashi-puzzles.com/solve)

###  Generator 
Also, I have a hashi **generator** library that is available on
- [Hashi Puzzles App](https://hashi-puzzles.com/generator)
- [Github](https://github.com/tonivrbic/bridges-generator)
- [npm](https://www.npmjs.com/package/bridges-generator) 

## Installation

Install the package with npm.

```
npm install bridges-solver
```

## Usage instructions

```javascript
import { solver } from "bridges-solver";

const puzzle = [
  [0, 2, 0, 5, 0, 0, 2],
  [0, 0, 0, 0, 0, 0, 0],
  [4, 0, 2, 0, 2, 0, 4],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 5, 0, 2, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [4, 0, 0, 0, 0, 0, 3]
];

const result = solver(puzzle);
```

Simply import the solver and pass a matrix representing the puzzle where zeros represent empty spaces in the puzzle.

### Result

The solver function returns a result object with the solved status, final solution and the intermediate puzzles (steps). The intermediate puzzles can be used to create an animation for the solving process or to help with debugging.

```typescript
interface SolverResult {
  solved: boolean;
  solution: Puzzle;
  steps: Puzzle[];
}
```

The solution of the above puzzle:

```javascript
[
  ["0", "2", "=", "5", "-", "-", "2"],
  ["0", "0", "0", "$", "0", "0", "|"],
  ["4", "=", "2", "$", "2", "=", "4"],
  ["$", "0", "0", "$", "0", "0", "|"],
  ["$", "1", "-", "5", "=", "2", "|"],
  ["$", "0", "0", "0", "0", "0", "|"],
  ["4", "=", "=", "=", "=", "=", "3"]
];
```

The solution contains special characters for the vertical and horizontal bridges:

| Character | Meaning                |
| --------- | ---------------------- |
| \|        | one vertical bridge    |
| \$        | two vertical bridges   |
| -         | one horizontal bridge  |
| =         | two horizontal bridges |

# Building

To build the package run the following script:

```
npm run build
```
