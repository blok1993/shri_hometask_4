let fs = require('fs');

const showInteractiveFilesTree = (req, res) => {
    let path = '.' + req.params[0];
    let interactiveFileTree = [];

    fs.readdirSync(path).forEach((file) => {
        let newPath = path + "/" + file;
        let stat = fs.statSync(newPath);

        interactiveFileTree.push({
            dir: stat.isDirectory(),
            relPath: newPath,
            name: file
        });
    });

    //Формируем путь к родительской директории
    let prevArr = path.split('/');
    prevArr.pop();
    let prevDir = prevArr.join('/');

    //Выше директории с локальным репозиторием не даем подняться
    if(prevDir !== '.') {
        res.render('interactiveFilesTree', { prevDir: prevDir, interactiveFileTree: interactiveFileTree });
    } else {
        res.redirect('/');
    }
};

module.exports = showInteractiveFilesTree;