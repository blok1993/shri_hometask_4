let express = require('express');
let router = express.Router();
let gitSpawn = require('./gitSpawn');

const showCommitFiles = (req, res) => {
    let commitHash = req.params.param;

    //Получаем список всех файлов у конкретного коммита
    gitSpawn(['ls-tree', '-r', commitHash]).then((treeInfo) => {
        let treeArray = treeInfo.replace(/\t/g, " ").split('\n');
        let finalTreeArray = [];

        //Избавляемся от последнего пустого элемента массива
        treeArray.pop();

        treeArray.forEach((el) => {
            finalTreeArray.push({
                hash: el.split(" ")[2],
                filePath: el.split(" ")[3],
                str: el
            });
        });

        res.render('commitFileTree', { commitHash: commitHash, fileTree: finalTreeArray });
    }, (err) => {
        console.log(err);
    });
};

module.exports = showCommitFiles;