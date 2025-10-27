const express = require('express');
const router = express.Router();
const {
  searchMatchedJobs,
  getRecommendedJobs,
  applyForJob,
  getApplications
} = require('../controllers/jobController');
const auth = require('../middleware/auth');

// All routes are protected
router.get('/search', auth, searchMatchedJobs);
router.get('/recommended', auth, getRecommendedJobs);
router.post('/apply', auth, applyForJob);
router.get('/applications', auth, getApplications);

module.exports = router;
