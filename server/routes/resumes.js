const express = require('express');
const router = express.Router();
const {
  uploadResume,
  getResumes,
  getResumeById,
  deleteResume,
  reanalyzeResume
} = require('../controllers/resumeController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// All routes are protected
router.post('/upload', auth, upload.single('resume'), uploadResume);
router.get('/', auth, getResumes);
router.get('/:id', auth, getResumeById);
router.delete('/:id', auth, deleteResume);
router.post('/:id/reanalyze', auth, reanalyzeResume);

module.exports = router;
