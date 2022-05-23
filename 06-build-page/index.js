const fs = require('fs');
const fsPromises = fs.promises;

const createIndexHTML = () => {
    return new Promise((resolve, reject) => {
        fs.open('06-build-page/project-dist/index.html', 'w', (err) => {
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        });
    })
}

const readTemplate = () => {
    return new Promise((resolve, reject) => {
        fs.readFile(`06-build-page/template.html`, 'utf8', (err, index) => {
            if (err) {
                reject(err)
            } else {
                resolve(index)
            }
        })
    })
}

const readComponents = (index) => {
    return new Promise((resolve, reject) => {
        fs.readdir('06-build-page/components', {withFileTypes: true}, (err, files) => {
            if (err) {
                reject(err)
            } else {
                resolve({files, index})
            }
        })
    })
}

const prepareComponent = (index, file) => {
    return new Promise((resolve, reject) => {
        fs.readFile(`06-build-page/components/${file.name}`, 'utf8', (err, data) => {
            if (err) {
                reject(err)
            } else {
                let name = `{{${file.name.split('.')[0]}}}`;
                index = index.replace(name, data);
                resolve(index)
            }
        })
    })
}

const prepareTemplate = ({files, index}) => {
    return new Promise((resolve, reject) => {
        const promises = [];

        files.forEach(file => {
            promises.push(index => prepareComponent(index, file))
        });

        let result = Promise.resolve(index);

        for (let func of promises) {
            result = result.then(func);
        }

        resolve(result)
    })
}

const writeIndex = (result) => {
    return new Promise((resolve, reject) => {
        fs.writeFile('06-build-page/project-dist/index.html', result, (err) => {
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        });
    })
}

const createStyleCSS = () => {
    return new Promise((resolve, reject) => {
        fs.open('06-build-page/project-dist/style.css', 'w', (err) => {
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        });
    })
}

const readStyles = () => {
    return new Promise((resolve, reject) => {
        fs.readdir('06-build-page/styles', {withFileTypes: true}, (err, files) => {
            if (err) {
                reject(err)
            } else {
                resolve(files)
            }
        })
    })
}

const writeStylesPart = (file) => {
    return new Promise((resolve, reject) => {
        let type = file.name.split('.')[1];
        if (type === 'css') {
            fs.readFile(`06-build-page/styles/${file.name}`, 'utf8', (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    fs.appendFile('06-build-page/project-dist/style.css', `${data}\n`, (err) => {
                        if (err) {
                            reject(err)
                        } else {
                            resolve()
                        }
                    });
                }
            })
        } else {
            resolve()
        }
    })
}

const writeStyles = (files) => {
    return new Promise((resolve, reject) => {
        const promises = [];

        files.forEach(file => {
            promises.push(() => writeStylesPart(file))
        });

        let result = Promise.resolve();

        for (let func of promises) {
            result = result.then(func);
        }

        resolve(result)
    })
}

const createAssetsDir = () => {
    return fsPromises.mkdir('06-build-page/project-dist/assets', {recursive: true})
}

const readAssets = () => {
    return new Promise((resolve, reject) => {
        fs.readdir('06-build-page/assets', {withFileTypes: true}, (err, folders) => {
            if (err) {
                reject(err)
            } else {
                resolve(folders)
            }
        })
    })
}

const readAssetsFiles = (folder) => {
    return new Promise((resolve, reject) => {
        fs.readdir(`06-build-page/assets/${folder}`, {withFileTypes: true}, (err, files) => {
            if (err) {
                reject(err)
            } else {
                resolve({files, folder})
            }
        })
    })
}

const copyFile = ({file, folder}) => {
    return new Promise((resolve, reject) => {
        fs.copyFile(`06-build-page/assets/${folder}/${file.name}`, `06-build-page/project-dist/assets/${folder}/${file.name}`, function (err) {
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        });
    })
}

const copyFiles = ({files, folder}) => {
    return new Promise((resolve, reject) => {
        const promises = [];

        files.forEach(file => {
            promises.push(() => copyFile({file, folder}));
        });

        let result = Promise.resolve();

        for (let func of promises) {
            result = result.then(func);
        }

        resolve()
    })
}

const createFolder = (folder) => {
    return fsPromises.mkdir(`06-build-page/project-dist/assets/${folder}`, {recursive: true})
        .then(() => Promise.resolve(folder))
}

const copyFolder = (folder) => {
    return createFolder(folder)
        .then(readAssetsFiles)
        .then(copyFiles)
}

const copyFolders = (folders) => {
    return new Promise((resolve, reject) => {
        const promises = [];

        folders.forEach(folder => {
            promises.push(() => copyFolder(folder.name))
        });

        let result = Promise.resolve();

        for (let func of promises) {
            result = result.then(func);
        }

        resolve()
    })
}

const buildAppToDir = () => {
    createIndexHTML()
        .then(readTemplate)
        .then(readComponents)
        .then(prepareTemplate)
        .then(writeIndex);

    createStyleCSS()
        .then(readStyles)
        .then(writeStyles)

    createAssetsDir()
        .then(readAssets)
        .then(copyFolders)
}

fsPromises.mkdir('06-build-page/project-dist', {recursive: true}).then(function () {
    buildAppToDir()

}).catch(function () {
});