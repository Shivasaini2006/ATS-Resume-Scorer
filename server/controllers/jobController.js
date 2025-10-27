const Job = require('../models/Job');
const Resume = require('../models/Resume');
const Application = require('../models/Application');
const Notification = require('../models/Notification');
const { searchJobs } = require('../utils/jobSearch');
const { calculateMatchScore } = require('../utils/atsScorer');

/**
 * Search and match jobs based on resume
 */
const searchMatchedJobs = async (req, res) => {
  try {
    const { resumeId, query, location } = req.query;

    if (!resumeId) {
      return res.status(400).json({ error: 'Resume ID is required' });
    }

    // Get resume
    const resume = await Resume.findOne({
      _id: resumeId,
      userId: req.userId
    });

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    // Search for jobs
    const searchQuery = query || resume.analysis.skills.join(' ');
    const jobs = await searchJobs(searchQuery, location);

    // Calculate match scores
    const matchedJobs = jobs.map(job => {
      const jobKeywords = [
        ...(job.job_required_skills || []),
        ...(job.job_title?.split(' ') || [])
      ];
      
      const matchScore = calculateMatchScore(resume.keywords.matched, jobKeywords);

      return {
        id: job.job_id,
        title: job.job_title,
        company: job.employer_name,
        location: `${job.job_city || ''}, ${job.job_state || ''}, ${job.job_country || ''}`.trim(),
        description: job.job_description?.substring(0, 300) + '...',
        employmentType: job.job_employment_type,
        applyLink: job.job_apply_link,
        postedAt: job.job_posted_at_datetime_utc,
        salary: job.job_min_salary && job.job_max_salary 
          ? `$${job.job_min_salary} - $${job.job_max_salary}`
          : null,
        matchScore,
        keywords: job.job_required_skills || []
      };
    });

    // Sort by match score
    matchedJobs.sort((a, b) => b.matchScore - a.matchScore);

    // Save top jobs to database
    for (const jobData of matchedJobs.slice(0, 10)) {
      await Job.findOneAndUpdate(
        { externalId: jobData.id },
        {
          title: jobData.title,
          company: jobData.company,
          location: jobData.location,
          description: jobData.description,
          jobType: jobData.employmentType,
          salary: jobData.salary,
          externalId: jobData.id,
          externalUrl: jobData.applyLink,
          keywords: jobData.keywords
        },
        { upsert: true, new: true }
      );
    }

    res.json({
      totalJobs: matchedJobs.length,
      jobs: matchedJobs
    });
  } catch (error) {
    console.error('Search jobs error:', error);
    res.status(500).json({ error: 'Failed to search jobs' });
  }
};

/**
 * Get recommended jobs
 */
const getRecommendedJobs = async (req, res) => {
  try {
    const { resumeId } = req.query;

    if (!resumeId) {
      return res.status(400).json({ error: 'Resume ID is required' });
    }

    // Get resume
    const resume = await Resume.findOne({
      _id: resumeId,
      userId: req.userId
    });

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    // Get jobs from database
    const jobs = await Job.find().sort({ createdAt: -1 }).limit(20);

    // Calculate match scores
    const recommendedJobs = jobs.map(job => {
      const matchScore = calculateMatchScore(resume.keywords.matched, job.keywords);
      
      return {
        id: job._id,
        title: job.title,
        company: job.company,
        location: job.location,
        description: job.description,
        jobType: job.jobType,
        salary: job.salary,
        externalUrl: job.externalUrl,
        matchScore,
        keywords: job.keywords,
        createdAt: job.createdAt
      };
    });

    // Sort by match score and filter
    const filteredJobs = recommendedJobs
      .filter(job => job.matchScore >= 30)
      .sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      totalJobs: filteredJobs.length,
      jobs: filteredJobs
    });
  } catch (error) {
    console.error('Get recommended jobs error:', error);
    res.status(500).json({ error: 'Failed to get recommended jobs' });
  }
};

/**
 * Apply for a job
 */
const applyForJob = async (req, res) => {
  try {
    const { jobId, resumeId, autoApply } = req.body;

    if (!jobId || !resumeId) {
      return res.status(400).json({ error: 'Job ID and Resume ID are required' });
    }

    // Verify resume ownership
    const resume = await Resume.findOne({
      _id: resumeId,
      userId: req.userId
    });

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    // Get job
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      userId: req.userId,
      jobId: jobId,
      resumeId: resumeId
    });

    if (existingApplication) {
      return res.status(400).json({ error: 'Already applied for this job' });
    }

    // Calculate match score
    const matchScore = calculateMatchScore(resume.keywords.matched, job.keywords);

    // Create application
    const application = new Application({
      userId: req.userId,
      resumeId: resumeId,
      jobId: jobId,
      matchScore: matchScore,
      autoApplied: autoApply || false,
      status: 'applied'
    });

    await application.save();

    // Create notification
    const notification = new Notification({
      userId: req.userId,
      type: 'application_status',
      title: 'Application Submitted',
      message: `Your application for ${job.title} at ${job.company} has been submitted.`,
      jobId: jobId
    });

    await notification.save();

    res.status(201).json({
      message: 'Application submitted successfully',
      application: {
        id: application._id,
        jobTitle: job.title,
        company: job.company,
        matchScore: application.matchScore,
        status: application.status,
        appliedAt: application.appliedAt
      }
    });
  } catch (error) {
    console.error('Apply for job error:', error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
};

/**
 * Get user applications
 */
const getApplications = async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.userId })
      .populate('jobId')
      .populate('resumeId', 'originalName atsScore')
      .sort({ appliedAt: -1 });

    const formattedApplications = applications.map(app => ({
      id: app._id,
      job: {
        id: app.jobId._id,
        title: app.jobId.title,
        company: app.jobId.company,
        location: app.jobId.location
      },
      resume: {
        id: app.resumeId._id,
        name: app.resumeId.originalName,
        atsScore: app.resumeId.atsScore
      },
      matchScore: app.matchScore,
      status: app.status,
      autoApplied: app.autoApplied,
      appliedAt: app.appliedAt
    }));

    res.json(formattedApplications);
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
};

module.exports = {
  searchMatchedJobs,
  getRecommendedJobs,
  applyForJob,
  getApplications
};
