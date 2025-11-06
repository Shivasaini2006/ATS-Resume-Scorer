const express = require('express');
const router = express.Router();
const { 
  uploadResume, 
  getResumes, 
  getResume, 
  scoreResume, 
  deleteResume 
} = require('../controllers/resumeController');
const authMiddleware = require('../middleware/authMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware');

// All resume routes are protected
router.use(authMiddleware);

router.post('/upload', uploadMiddleware, uploadResume);
router.get('/', getResumes);
router.get('/:id', getResume);
router.post('/:id/score', scoreResume);
router.delete('/:id', deleteResume);

module.exports = router;
