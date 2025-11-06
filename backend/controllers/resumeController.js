const Resume = require('../models/Resume');
const User = require('../models/User');
const parser = require('../utils/parser');
const keywordExtractor = require('../utils/keywordExtractor');
const atsScorer = require('../utils/atsScorer');

// @desc    Upload and parse resume
// @route   POST /api/resumes/upload
// @access  Private
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        error: 'Please upload a file' 
      });
    }

    // Parse the resume
    const parsedData = await parser.parse(req.file.path);

    // Extract keywords
    const keywords = keywordExtractor.extract(parsedData.text);

    // Create resume document
    const resume = await Resume.create({
      user: req.user.id,
      filename: req.file.filename,
      originalName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      extractedText: parsedData.text,
      keywords: keywords,
      skills: parsedData.skills || [],
      education: parsedData.education || [],
      experience: parsedData.experience || []
    });

    // Add resume to user's resumes array
    await User.findByIdAndUpdate(
      req.user.id,
      { $push: { resumes: resume._id } }
    );

    res.status(201).json({
      success: true,
      data: resume
    });
  } catch (error) {
    console.error('Upload resume error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error uploading resume' 
    });
  }
};

// @desc    Get all resumes for user
// @route   GET /api/resumes
// @access  Private
exports.getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user.id })
      .sort({ uploadedAt: -1 });

    res.json({
      success: true,
      count: resumes.length,
      data: resumes
    });
  } catch (error) {
    console.error('Get resumes error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error fetching resumes' 
    });
  }
};

// @desc    Get single resume
// @route   GET /api/resumes/:id
// @access  Private
exports.getResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ 
        success: false,
        error: 'Resume not found' 
      });
    }

    // Make sure user owns resume
    if (resume.user.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false,
        error: 'Not authorized to access this resume' 
      });
    }

    res.json({
      success: true,
      data: resume
    });
  } catch (error) {
    console.error('Get resume error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error fetching resume' 
    });
  }
};

// @desc    Score resume against job description
// @route   POST /api/resumes/:id/score
// @access  Private
exports.scoreResume = async (req, res) => {
  try {
    const { jobDescription, jobTitle } = req.body;

    if (!jobDescription && !jobTitle) {
      return res.status(400).json({ 
        success: false,
        error: 'Please provide either job description or job title' 
      });
    }

    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ 
        success: false,
        error: 'Resume not found' 
      });
    }

    // Make sure user owns resume
    if (resume.user.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false,
        error: 'Not authorized to access this resume' 
      });
    }

    // Calculate ATS score with job title (preferred) or job description
    const scoreResult = atsScorer.score(resume.extractedText, jobDescription, jobTitle);

    // Update resume with new score
    resume.atsScore = scoreResult.score;
    await resume.save();

    res.json({
      success: true,
      data: {
        resumeId: resume._id,
        score: scoreResult.score,
        matchedKeywords: scoreResult.matchedKeywords,
        missingKeywords: scoreResult.missingKeywords,
        suggestions: scoreResult.suggestions,
        requiredMatched: scoreResult.requiredMatched,
        requiredTotal: scoreResult.requiredTotal,
        jobTitle: scoreResult.jobTitle
      }
    });
  } catch (error) {
    console.error('Score resume error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error scoring resume' 
    });
  }
};

// @desc    Delete resume
// @route   DELETE /api/resumes/:id
// @access  Private
exports.deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ 
        success: false,
        error: 'Resume not found' 
      });
    }

    // Make sure user owns resume
    if (resume.user.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false,
        error: 'Not authorized to delete this resume' 
      });
    }

    await resume.deleteOne();

    // Remove from user's resumes array
    await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { resumes: resume._id } }
    );

    res.json({
      success: true,
      message: 'Resume deleted successfully'
    });
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error deleting resume' 
    });
  }
};
