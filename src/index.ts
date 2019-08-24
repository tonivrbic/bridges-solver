import { puzzles } from './puzzles-copy';
import { solver2 } from './solver2';
import { showPuzzle } from './utils';

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
        console.log(`%c❌ ${i}. not solved ${size.rows}x${size.columns}`, 'color: red;');
        result.steps.forEach((step, i) => {
            console.log(`Iteration ${i + 1}`);
            showPuzzle(step)
        })
    } else {
        console.log(`%c✔ ${i}. solved ${size.rows}x${size.columns} in ${duration}ms`, 'color: green;');
    }
}

let solvedNum = results.filter(x => x.solved === true).length;
console.log(`%cSolved ${solvedNum}/${puzzles.length} ${solvedNum === puzzles.length ? '🎉🥳🎈' : '😥'}`, 'font-weight: bold;');

function getSize(puzzle: string[][]) {
    return {
        rows: puzzle.length,
        columns: puzzle[0].length
    }
}