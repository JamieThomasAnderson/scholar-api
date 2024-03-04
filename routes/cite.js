var express = require('express');
var router = express.Router();

var scholar = require('../lib/scholar');


router.get('/cite', async (req, res, next) => {

    const url = req.query.url;

    if (!url) {
        return res.status(400).json({
            error: 'Missing URL Parameter'
        })
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
