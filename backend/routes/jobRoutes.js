const express = require('express');
const router = express.Router();

// TODO: implement job endpoints
router.get('/', (req, res) => res.json({ msg: 'job routes' }));

module.exports = router;
