const Resume = require('../models/Resume');
const { parseResume } = require('../utils/resumeParser');
const { calculateATSScore, extractSkills, generateImprovements } = require('../utils/atsScorer');
const fs = require('fs').promises;

/**
 * Upload and analyze resume
 */
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a resume file' });
    }

    // Parse resume
    const extractedText = await parseResume(req.file.path, req.file.mimetype);

    // Calculate ATS score
    const analysis = calculateATSScore(extractedText);
    const skills = extractSkills(extractedText);
    const improvements = generateImprovements(analysis, extractedText);

    // Save resume to database
    const resume = new Resume({
      userId: req.userId,
      filename: req.file.filename,
      originalName: req.file.originalname,
      filePath: req.file.path,
      extractedText,
      atsScore: analysis.score,
      keywords: {
        matched: analysis.matched,
        missing: analysis.missing
      },
      analysis: {
        totalWords: analysis.totalWords,
        skills: skills,
        sections: [],
        experience: [],
        education: []
      },
      improvements: improvements
    });

    await resume.save();

    res.status(201).json({
      message: 'Resume uploaded and analyzed successfully',
      resume: {
        id: resume._id,
        filename: resume.originalName,
        atsScore: resume.atsScore,
        keywords: resume.keywords,
        analysis: resume.analysis,
        improvements: resume.improvements,
        createdAt: resume.createdAt
      }
    });
  } catch (error) {
    console.error('Upload resume error:', error);
    // Clean up uploaded file on error
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }
    res.status(500).json({ error: error.message || 'Failed to process resume' });
  }
};

/**
 * Get all resumes for user
 */
const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.userId })
      .select('-extractedText -filePath')
      .sort({ createdAt: -1 });

    res.json(resumes);
  } catch (error) {
    console.error('Get resumes error:', error);
    res.status(500).json({ error: 'Failed to fetch resumes' });
  }
};

/**
 * Get single resume by ID
 */
const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.userId
    }).select('-extractedText');

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    res.json(resume);
  } catch (error) {
    console.error('Get resume error:', error);
    res.status(500).json({ error: 'Failed to fetch resume' });
  }
};

/**
 * Delete resume
 */
const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    // Delete file from disk
    try {
      await fs.unlink(resume.filePath);
    } catch (unlinkError) {
      console.error('Error deleting file:', unlinkError);
    }

    // Delete from database
    await Resume.deleteOne({ _id: req.params.id });

    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({ error: 'Failed to delete resume' });
  }
};

/**
 * Re-analyze resume
 */
const reanalyzeResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    // Recalculate ATS score
    const analysis = calculateATSScore(resume.extractedText);
    const skills = extractSkills(resume.extractedText);
    const improvements = generateImprovements(analysis, resume.extractedText);

    // Update resume
    resume.atsScore = analysis.score;
    resume.keywords = {
      matched: analysis.matched,
      missing: analysis.missing
    };
    resume.analysis.totalWords = analysis.totalWords;
    resume.analysis.skills = skills;
    resume.improvements = improvements;

    await resume.save();

    res.json({
      message: 'Resume re-analyzed successfully',
      resume: {
        id: resume._id,
        atsScore: resume.atsScore,
        keywords: resume.keywords,
        analysis: resume.analysis,
        improvements: resume.improvements
      }
    });
  } catch (error) {
    console.error('Reanalyze resume error:', error);
    res.status(500).json({ error: 'Failed to re-analyze resume' });
  }
};

module.exports = {
  uploadResume,
  getResumes,
  getResumeById,
  deleteResume,
  reanalyzeResume
};
