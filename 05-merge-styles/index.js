const fs = require('fs');

fs.open('05-merge-styles/project-dist/bundle.css', 'w', (err) => {
    if (err) throw err;
});

fs.readdir('05-merge-styles/styles', {withFileTypes: true}, (err, files) => {
    if (err) throw err;

    files.forEach(file => {
        let type = file.name.split('.')[1];
        if (type === 'css') {
            fs.readFile(`05-merge-styles/styles/${file.name}`, 'utf8', (err, data) => {
                if (err) throw err;
                fs.appendFile('05-merge-styles/project-dist/bundle.css', `${data}\n`, (err) => {
                    if (err) throw err;
                });
            })
        }
    });
})

