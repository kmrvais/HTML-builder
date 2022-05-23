const fs = require('fs');

fs.readdir('03-files-in-folder/secret-folder', {withFileTypes: true}, (err, files) => {
    if (err) throw err;

    files.forEach(file => {
        let name = file.name.split('.')[0];
        let type = file.name.split('.')[1];
        let size;
        if (file.isFile()) {
            fs.stat(`03-files-in-folder/secret-folder/${file.name}`, (error, stats) => {
                if (error) {
                    console.log(error);
                }
                else {
                    size = stats.size
                    console.log(name + ' - ' + type + ' - ' + size + 'byte')
                }
            });
        }
    });
})
