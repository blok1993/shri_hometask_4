let express = require('express');
let router = express.Router();
let gitSpawn = require('./gitSpawn');

const showFile = function (req, res) {
    let file = req.params.param;

    gitSpawn(['cat-file', 'blob', file]).then((result) => {
        res.render('fileContent', { fileContent: result });
    }, (err) => {
        console.log(err);
    });
};

module.exports = showFile;