var express = require('express');
var router = express.Router();

var scholarExtraction = require('../lib/extract');



router.get('/', async (req, res, next) => {
    res.sendStatus(200);
})


module.exports = router;
