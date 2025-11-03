const express = require('express');
const router = express.Router();

// TODO: implement resume endpoints
router.get('/', (req, res) => res.json({ msg: 'resume routes' }));

module.exports = router;
