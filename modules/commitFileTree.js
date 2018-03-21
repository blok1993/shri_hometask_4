let express = require('express');
let router = express.Router();
let showFile = require('./showFile');

router.get('/git/cat/:param', showFile);

router.get('/commitFileTree', (req, res, next) => {});

module.exports = router;