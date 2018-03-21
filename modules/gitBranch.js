let gitSpawn = require('./gitSpawn');
let config = require('../config');

const gitBranch = (res) => {
    gitSpawn(['branch']).then((branchInfo) => {
        let branchArray = branchInfo.split('\n');
        let finalBranchArray = [];

        //Избавляемся от последнего пустого элемента массива
        branchArray.pop();

        for(let i = 0; i < branchArray.length; i++) {
            if (branchArray[i][0] === "*") {
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
                let tempDirArray = [];

                //Избавляемся от последнего пустого элемента массива
                treeArray.pop();

                treeArray.forEach((el) => {
                    let filePath = el.split(" ")[3];

                    if (filePath.indexOf('/') > -1) {
                        let dirName = filePath.split('/')[0];

                        if (tempDirArray.indexOf(dirName) === -1) {
                            finalTreeArray.push({
                                filePath: dirName
                            });

                            tempDirArray.push(dirName);
                        }
                    } else {
                        finalTreeArray.push({
                            hash: el.split(" ")[2],
                            filePath: el.split(" ")[3],
                            str: el
                        });
                    }
                });

                res.render('index', { branchName: finalBranchArray, commits: endCommitsArray, fileTree: finalTreeArray});
            });
        });
    });
};

module.exports = gitBranch;