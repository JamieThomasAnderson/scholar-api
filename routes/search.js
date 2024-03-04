var express = require('express');
var router = express.Router();

var scholar = require('../lib/scholar');
var {SITE} = require('../lib/config');



router.get('/search', async (req, res) => {

    const query = req.query.search;
    if (!query) {
        return res.status(400).json({
            error: 'Missing Search Query'
        })
    }


    try {
      const articles = await scholar(SITE + '/scholar?q='+ query);
      res.json({articles});
    }

    catch (error) {
      throw error;
    }
})


module.exports = router;
