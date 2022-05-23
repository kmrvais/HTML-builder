const fs = require('fs');
const fsPromises = fs.promises;

fsPromises.mkdir('04-copy-directory/files-copy', { recursive: true }).then(function() {

    fs.readdir('04-copy-directory/files-copy', {withFileTypes: true}, (err, files) => {

        files.forEach(file => {
            fs.unlink(`04-copy-directory/files-copy/${file.name}`, function(err){
                if (err) throw err;
            });
        });
    });

    fs.readdir('04-copy-directory/files', {withFileTypes: true}, (err, files) => {
        if (err) throw err;

        files.forEach(file => {
            fs.copyFile(`04-copy-directory/files/${file.name}`, `04-copy-directory/files-copy/${file.name}`, function (err) {
                if (err) throw err;
            });
        });
    })

}).catch(function() {});

