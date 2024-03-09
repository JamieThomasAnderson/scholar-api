var express = require('express');
var router = express.Router();
var validator = require('validator');

var { academicExtraction } = require('../lib/extract');
var { SITE } = require('../lib/config');

router.get('/scholar', async (req, res) => {
    try {
        let query = req.query.q;

        if (!query) {
            return res.status(400).json({
                error: 'Missing profile query',
            });
        }

        query = validator.escape(query);
        if (!validator.isLength(query, { min: 1, max: 30 })) {
            return res.status(400).json({
                error: 'Invalid Query length',
            });
        }
        query = query.split(' ').join('+');
        const URL = [
            `${SITE}/citations?view_op=search_authors&mauthors=${query}`,
        ];
        const profiles = await academicExtraction(URL);

        if (profiles.length === 0) {
            return res.status(404).json({
                error: 'No profiles found',
            });
        }

        res.json({ profiles });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

module.exports = router;
