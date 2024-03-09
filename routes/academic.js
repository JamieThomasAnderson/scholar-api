var express = require('express');
var router = express.Router();
var validator = require('validator');

var {
  extraction,
  profileExtraction,
  academicExtraction,
} = require('../lib/extract');
var { SITE, API_KEY } = require('../lib/config');

router.get('/academic', async (req, res) => {
  try {
    let query = req.query.q;

    if (!query) {
      return res.status(400).json({
        error: 'Missing user ID',
      });
    }

    query = validator.escape(query);
    if (!validator.isLength(query, { min: 1, max: 30 })) {
      return res.status(400).json({ error: 'Invalid Query length' });
    }

    const URL = [
      `${SITE}/citations?view_op=search_authors&mauthors=${query.split(' ').join('+')}`,
    ];
    const profiles = await academicExtraction(URL);

    res.json({ profiles });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

module.exports = router;
