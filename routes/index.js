let express = require('express');
let router = express.Router();

let gitSpawn = require('../modules/gitSpawn');
let showFile = require('../modules/showFile');
let showCommitFiles = require('../modules/showCommitFiles');
let gitBranch = require('../modules/gitBranch');
let showInteractiveFilesTree = require('../modules/interactiveFilesTree');
let readFileByFs = require('../modules/readFileByFs');

const checkout = function(req, res) {
    let branch = req.params.branch;

    gitSpawn(['checkout', branch]).then((err) => {
        console.log(err);
    }, (result) => {
        gitBranch(res);
    });
};

router.get('/git/show/:param', showCommitFiles);
router.get('/git/cat/:param', showFile);
router.get('/git/:action/:branch', checkout);

router.get('/nextdir*', showInteractiveFilesTree);

router.get('/readFileByFs*', readFileByFs);

router.get('/', (req, res, next) => {
    gitBranch(res);
});

module.exports = router;