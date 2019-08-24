import { puzzles } from './puzzles-copy';
import { solver2 } from './solver2';

let stringPuzzle = puzzles[18].map(row => {
    return row.map(item => item.toString());
})

solver2(stringPuzzle);

let results: {
    solved: boolean;
    solution: string[][];
}[] = [];
for (let i = 0; i < puzzles.length; i++) {
    // console.log(`Solving puzzle ${i}`)
    let stringPuzzle = puzzles[i].map(row => {
        return row.map(item => item.toString());
    })
    let start = new Date().getTime();
    let result = solver2(stringPuzzle);
    let duration = new Date().getTime() - start;
    results.push(result);

    let size = getSize(stringPuzzle);
    if (result.solved === false) {
        console.log(`%c ❌ ${i}. not solved ${size.rows}x${size.columns}`, 'color: red;');
    } else {
        console.log(`%c ✔ ${i}. solved ${size.rows}x${size.columns} in ${duration}ms`, 'color: green;');
    }
}

let solvedNum = results.filter(x => x.solved === true).length;
console.log(`Solved ${solvedNum}/${puzzles.length}`);

function getSize(puzzle: string[][]) {
    return {
        rows: puzzle.length,
        columns: puzzle[0].length
    }
}