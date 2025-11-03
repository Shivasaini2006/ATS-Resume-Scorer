const express = require('express');
const router = express.Router();

// TODO: implement user endpoints
router.get('/', (req, res) => res.json({ msg: 'user routes' }));

module.exports = router;
