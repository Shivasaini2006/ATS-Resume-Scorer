const express = require('express');
const router = express.Router();
const { 
  listJobs, 
  getJob, 
  createJob, 
  updateJob, 
  deleteJob,
  matchJobs 
} = require('../controllers/jobController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.get('/', listJobs);
router.get('/:id', getJob);

// Protected routes (job matching requires auth)
router.post('/match', authMiddleware, matchJobs);

// Admin routes (for now, just protected - add admin middleware later)
router.post('/', authMiddleware, createJob);
router.put('/:id', authMiddleware, updateJob);
router.delete('/:id', authMiddleware, deleteJob);

module.exports = router;
