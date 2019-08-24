import { puzzles } from './puzzles-copy';
import { solver2 } from './solver2';

// let stringPuzzle = puzzles[21].map(row => {
//     return row.map(item => item.toString());
// })

// solver2(stringPuzzle);

let results = [];
for (let i = 0; i < puzzles.length; i++) {
    console.log(`Solving puzzle ${i}`)
    let stringPuzzle = puzzles[i].map(row => {
        return row.map(item => item.toString());
    })
    let result = solver2(stringPuzzle);
    results.push(result);
}

let solvedNum = results.filter(x => x === true).length;
results.forEach((element, i) => {
    if (element === false) {
        console.error(`${i}. not solved`);
    } else {
        console.log(`${i}. solved`);
    }
});
console.log(`Solved ${solvedNum}/${puzzles.length}`);