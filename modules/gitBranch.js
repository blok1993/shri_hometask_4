let gitSpawn = require('./gitSpawn');
let config = require('../config');
let fs = require('fs');

const gitBranch = (res) => {
    gitSpawn(['branch']).then((branchInfo) => {
        let branchArray = branchInfo.split('\n');
        let finalBranchArray = [];

        //Избавляемся от последнего пустого элемента массива
        branchArray.pop();
        console.log(branchArray);

        for(let i = 0; i < branchArray.length; i++) {
            if(branchArray[i][0] === "*") {
                finalBranchArray.push({
                    current: true,
                    name: branchArray[i].split(" ")[1]
                });
            } else {
                finalBranchArray.push({
                    current: false,
                    name: branchArray[i].trim()
                });
            }
        }

        gitSpawn(['log', '--pretty=format:%H - %an, %ad : %s']).then((commitsInfo) => {
            let commitsArray = commitsInfo.split("\n");
            let endCommitsArray = [];

            commitsArray.forEach((el) => {
                endCommitsArray.push({
                    commitHash: el.split(' -')[0],
                    str: el
                });
            });

            gitSpawn(['ls-tree', '-r', 'HEAD']).then((treeInfo) => {
                let treeArray = treeInfo.replace(/\t/g, " ").split('\n');
                let finalTreeArray = [];
                let interactiveTree = [];

                //Избавляемся от последнего пустого элемента массива
                treeArray.pop();

                treeArray.forEach((el) => {
                    finalTreeArray.push({
                        hash: el.split(" ")[2],
                        filePath: el.split(" ")[3],
                        str: el
                    });
                });

                //Формирование объекта для текущего уровня дерева файлов, с возможностью переходов по директориям
                let interactiveFileTree = [];

                fs.readdirSync(config.get('repoPath')).forEach(function (file) {
                    let newPath = config.get('repoPath') + "/" + file;
                    let stat = fs.statSync(newPath);

                    interactiveFileTree.push({
                        dir: stat.isDirectory(),
                        relPath: newPath,
                        name: file
                    });
                });

                res.render('index', { branchName: finalBranchArray, commits: endCommitsArray, fileTree: finalTreeArray, interactiveFileTree: interactiveFileTree});
            });
        });
    });
};

module.exports = gitBranch;