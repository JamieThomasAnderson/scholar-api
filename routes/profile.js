var express = require('express');
var router = express.Router();
var validator = require('validator');

var { extraction, profileExtraction } = require('../lib/extract');
var { SITE, API_KEY } = require('../lib/config');

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
      return res.status(400).json({ error: 'Invalid user ID length' });
    }

    const URL = [`${SITE}/citations?user=${userID}`];
    const profile = await profileExtraction(URL);

    res.json({ profile });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

module.exports = router;
