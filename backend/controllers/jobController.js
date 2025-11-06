const Job = require('../models/Job');
const jobMatcher = require('../utils/jobMatcher');
const keywordExtractor = require('../utils/keywordExtractor');

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
exports.listJobs = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, location, jobType } = req.query;

    const query = { isActive: true };

    // Search filter
    if (search) {
      query.$text = { $search: search };
    }

    // Location filter
    if (location) {
      query.location = new RegExp(location, 'i');
    }

    // Job type filter
    if (jobType) {
      query.jobType = jobType;
    }

    const jobs = await Job.find(query)
      .sort({ postedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Job.countDocuments(query);

    res.json({
      success: true,
      data: jobs,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('List jobs error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error fetching jobs' 
    });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
exports.getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ 
        success: false,
        error: 'Job not found' 
      });
    }

    res.json({
      success: true,
      data: job
    });
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error fetching job' 
    });
  }
};

// @desc    Create new job
// @route   POST /api/jobs
// @access  Private/Admin
exports.createJob = async (req, res) => {
  try {
    const jobData = req.body;

    // Extract keywords from description
    if (jobData.description) {
      jobData.keywords = keywordExtractor.extract(jobData.description);
    }

    const job = await Job.create(jobData);

    res.status(201).json({
      success: true,
      data: job
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error creating job' 
    });
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private/Admin
exports.updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ 
        success: false,
        error: 'Job not found' 
      });
    }

    // Extract keywords if description is updated
    if (req.body.description) {
      req.body.keywords = keywordExtractor.extract(req.body.description);
    }

    job = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: job
    });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error updating job' 
    });
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private/Admin
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ 
        success: false,
        error: 'Job not found' 
      });
    }

    await job.deleteOne();

    res.json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error deleting job' 
    });
  }
};

// @desc    Match resume with jobs
// @route   POST /api/jobs/match
// @access  Private
exports.matchJobs = async (req, res) => {
  try {
    const { resumeKeywords, skills } = req.body;

    if (!resumeKeywords || !Array.isArray(resumeKeywords)) {
      return res.status(400).json({ 
        success: false,
        error: 'Please provide resume keywords array' 
      });
    }

    // Get all active jobs
    const jobs = await Job.find({ isActive: true });

    // Match resume with jobs
    const matches = jobMatcher.match(resumeKeywords, jobs, skills);

    res.json({
      success: true,
      data: matches
    });
  } catch (error) {
    console.error('Match jobs error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error matching jobs' 
    });
  }
};
