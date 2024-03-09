var express = require('express');
var router = express.Router();
var validator = require('validator');

var { extraction, profileExtraction } = require('../lib/extract');
var { SITE, API_KEY } = require('../lib/config');

router.get('/search', async (req, res) => {
  try {
    let { q: query, startYear, endYear, page } = req.query;

    if (!query) {
      return res.status(400).json({
        error: 'Missing Search Query',
      });
    }

    query = validator.escape(query);
    if (!validator.isLength(query, { min: 1, max: 100 })) {
      return res.status(400).json({ error: 'Invalid query length' });
    }

    const params = [`q=${query}`];

    if (startYear) {
      startYear = validator.escape(startYear);
      if (
        !validator.isInt(startYear, {
          min: 1900,
          max: new Date().getFullYear(),
        })
      ) {
        return res.status(400).json({ error: 'Invalid start year' });
      }
      params.push(`as_ylo=${startYear}`);
    }

    if (endYear) {
      endYear = validator.escape(endYear);
      if (
        !validator.isInt(endYear, { min: 1900, max: new Date().getFullYear() })
      ) {
        return res.status(400).json({ error: 'Invalid end year' });
      }
      params.push(`as_yhi=${endYear}`);
    }

    if (page) {
      page *= 10;
      page = validator.escape(page);
      if (!validator.isInt(page, { min: 0 })) {
        return res.status(400).json({ error: 'Invalid page number' });
      }
      params.push(`start=${page}`);
    }

    const URL = [`${SITE}/scholar?${params.join('&')}`];
    const articles = await extraction(URL);

    res.json({ articles });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

module.exports = router;
