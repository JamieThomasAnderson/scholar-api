var express = require('express');
var router = express.Router();
var validator = require('validator');

var { profileExtraction } = require('../lib/extract');
var { SITE } = require('../lib/config');

router.get('/profile', async (req, res) => {
    try {
        let userID = req.query.user;

        if (!userID) {
            return res.status(400).json({
                error: 'Missing user ID',
            });
        }

        userID = validator.escape(userID);
        if (!validator.isLength(userID, { min: 1, max: 20 })) {
            return res.status(400).json({
                error: 'Invalid user ID length',
            });
        }

        const URL = [`${SITE}/citations?user=${userID}`];
        const profile = await profileExtraction(URL);

        if (profile.profile.name === 'Google Scholar Citations') {
            return res.status(404).json({
                error: 'No articles found',
            });
        }

        res.json({ profile });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

module.exports = router;
