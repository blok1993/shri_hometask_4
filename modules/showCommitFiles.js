let gitSpawn = require('./gitSpawn');
let config = require('../config');

const showCommitFiles = (req, res) => {
    let commitHash = req.params.param;
    let filesForAnotherCommit = req.params['0'] === "initialSecretValue";
    let relPath = (filesForAnotherCommit ? "." : req.params['0']) || ".";

    //Получаем список всех файлов у конкретного коммита
    gitSpawn(['ls-tree', '-r', commitHash, relPath]).then((treeInfo) => {
        let treeArray = treeInfo.replace(/\t/g, " ").split('\n');
        let finalTreeArray = [];
        let tempDirArray = [];

        //Избавляемся от последнего пустого элемента массива
        treeArray.pop();

        treeArray.forEach((el) => {
            let filePath = (relPath === "." ? el.split(" ")[3] : el.split(" ")[3].split(relPath + "/")[1]);

            if (filePath.indexOf('/') > -1) {
                let dirName = filePath.split('/')[0];

                if (tempDirArray.indexOf(dirName) === -1) {
                    finalTreeArray.push({
                        dirName: dirName,
                        filePath: relPath + "/" + dirName
                    });

                    tempDirArray.push(dirName);
                }
            } else {
                finalTreeArray.push({
                    hash: el.split(" ")[2],
                    filePath: filePath,
                    str: el
                });
            }
        });

        let prevArr = relPath.split('/');
        prevArr.pop();
        let prevDir = prevArr.length === 0 ? "" : prevArr.join('/');

        if (relPath === "." && !filesForAnotherCommit) {
            res.redirect("/");
        } else {
            res.render('commitFileTree', { commitHash: commitHash, fileTree: finalTreeArray, prevDir: prevDir});
        }
    }, (err) => {
        console.log(err);
    });
};

module.exports = showCommitFiles;