var express = require('express');
var router = express.Router();
var validator = require('validator');

var { extraction } = require('../lib/extract');
var { SITE } = require('../lib/config');

router.get('/cite', async (req, res) => {
    try {
        let { id: articleID, startYear, endYear, page } = req.query;

        if (!articleID) {
            return res.status(400).json({
                error: 'Missing article ID',
            });
        }

        articleID = validator.escape(articleID);
        if (!validator.isLength(articleID, { min: 1, max: 25 })) {
            return res.status(400).json({
                error: 'Invalid ID length',
            });
        }

        if (!validator.isNumeric(articleID)) {
            return res.status(400).json({
                error: 'Invalid article ID format',
            });
        }

        const params = [`cites=${articleID}`];


        if (startYear) {
            startYear = validator.escape(startYear);
            if (
                !validator.isInt(startYear, {
                    min: 1900,
                    max: new Date().getFullYear(),
                })
            ) {
                return res.status(400).json({
                    error: 'Invalid start year',
                });
            }
            params.push(`as_ylo=${startYear}`);
        }

        if (endYear) {
            endYear = validator.escape(endYear);
            if (
                !validator.isInt(endYear, {
                    min: 1900,
                    max: new Date().getFullYear(),
                })
            ) {
                return res.status(400).json({
                    error: 'Invalid end year',
                });
            }
            params.push(`as_yhi=${endYear}`);
        }

        if (page) {
            page *= 10;
            page = String(page);
            page = validator.escape(page);
            if (!validator.isInt(page, { min: 0 })) {
                return res.status(400).json({
                    error: 'Invalid page number',
                });
            }
            params.push(`start=${page}`);
        }

        const URL = [`${SITE}/scholar?${params.join('&')}`];
        const citations = await extraction(URL);

        if (citations.length === 0) {
            return res.status(404).json({
                error: 'No citations found',
            });
        }

        res.json({ citations });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

module.exports = router;
