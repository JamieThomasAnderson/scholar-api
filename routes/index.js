var express = require('express');
var router = express.Router();

var scholar = require('../lib/scholar');
var {URL_PATTERN} = require('../lib/config');


router.get('/', async (req, res, next) => {

    const url = req.query.url;

    if (!URL_PATTERN.test(url)) {
      return res.status(400).json({
        error: 'Invalid URL format'
      });
    }

    try {
      const articles = await scholar(url);
      res.json({ articles });
    }
    
    catch (error) {
      next(error);
    }
})


module.exports = router;
