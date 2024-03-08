var express = require('express');
var router = express.Router();
var validator = require('validator');

var {extraction, profileExtraction} = require('../lib/extract');
var {SITE, API_KEY} = require('../lib/config');

router.get('/cite', async (req, res) => {
    try {
        let articleID = req.query.id;

        if (!articleID) {
            return res.status(400).json({
                error: 'Missing article ID'
            });
        }

        articleID = validator.escape(articleID);
        if (articleID.length !== 20) {
            return res.status(400).json({ error: 'Invalid article ID length' });
        }

        if (!validator.isNumeric(articleID)) {
            return res.status(400).json({ error: 'Invalid article ID format' });
        }

        const URL = [`${SITE}/scholar?cites=${articleID}`];
        const citations = await extraction(URL);

        res.json({citations});
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

module.exports = router;
