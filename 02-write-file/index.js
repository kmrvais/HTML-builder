const fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

fs.open('02-write-file/text.txt', 'w', (err) => {
    if (err) throw err;
});

const addToFile = (answer) => {
    if (answer === 'exit') {
        rl.close()
    }

    fs.appendFile('02-write-file/text.txt', `${answer}\n`, (err) => {
        if (err) throw err;
    });
}

rl.on('line', addToFile)

rl.question("what is your cat's name?\n", addToFile)

rl.on('close', function () {
    this.write('goodbye')
    process.exit(0);
})

