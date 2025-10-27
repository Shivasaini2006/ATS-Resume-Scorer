import React, { useState, useEffect } from 'react';
import { resumeAPI, jobAPI } from '../services/api';
import './Jobs.css';

const Jobs = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [applyingJobId, setApplyingJobId] = useState(null);

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      const response = await resumeAPI.getAll();
      setResumes(response.data);
      if (response.data.length > 0) {
        setSelectedResume(response.data[0]._id);
      }
    } catch (err) {
      console.error('Failed to load resumes:', err);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!selectedResume) {
      setError('Please select a resume first');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const params = {
        resumeId: selectedResume,
        query: searchQuery,
        location: location
      };

      const response = await jobAPI.search(params);
      setJobs(response.data.jobs);
      setMessage(`Found ${response.data.totalJobs} matching jobs`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to search jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleGetRecommended = async () => {
    if (!selectedResume) {
      setError('Please select a resume first');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await jobAPI.getRecommended({ resumeId: selectedResume });
      setJobs(response.data.jobs);
      setMessage(`Found ${response.data.totalJobs} recommended jobs`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to get recommended jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId) => {
    if (!selectedResume) {
      setError('Please select a resume first');
      return;
    }

    setApplyingJobId(jobId);
    setError('');

    try {
      await jobAPI.apply({
        jobId: jobId,
        resumeId: selectedResume,
        autoApply: false
      });
      setMessage('Application submitted successfully!');
      
      // Update the job in the list to show as applied
      setJobs(jobs.map(job => 
        job.id === jobId ? { ...job, applied: true } : job
      ));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to apply for job');
    } finally {
      setApplyingJobId(null);
    }
  };

  const getMatchScoreColor = (score) => {
    if (score >= 70) return '#28a745';
    if (score >= 50) return '#ffc107';
    return '#dc3545';
  };

  return (
    <div className="jobs-page">
      <div className="container">
        <h1>Job Search & Matching</h1>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        <div className="card">
          <h2>Search for Jobs</h2>
          
          <div className="form-group">
            <label>Select Resume</label>
            <select
              value={selectedResume}
              onChange={(e) => setSelectedResume(e.target.value)}
              disabled={resumes.length === 0}
            >
              <option value="">Select a resume</option>
              {resumes.map((resume) => (
                <option key={resume._id} value={resume._id}>
                  {resume.originalName} (Score: {resume.atsScore})
                </option>
              ))}
            </select>
            {resumes.length === 0 && (
              <p className="error">Please upload a resume first from the Dashboard</p>
            )}
          </div>

          <form onSubmit={handleSearch}>
            <div className="search-row">
              <div className="form-group">
                <label>Job Title / Keywords</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g., Software Engineer, Data Analyst"
                />
              </div>

              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., New York, Remote"
                />
              </div>
            </div>

            <div className="button-row">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || !selectedResume}
              >
                {loading ? 'Searching...' : 'Search Jobs'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleGetRecommended}
                disabled={loading || !selectedResume}
              >
                Get Recommended Jobs
              </button>
            </div>
          </form>
        </div>

        {loading && <div className="loading">Searching for jobs...</div>}

        {!loading && jobs.length > 0 && (
          <div className="jobs-list">
            <h2>Matched Jobs ({jobs.length})</h2>
            {jobs.map((job) => (
              <div key={job.id} className="job-card">
                <div className="job-header">
                  <div>
                    <h3>{job.title}</h3>
                    <p className="job-company">{job.company}</p>
                    <p className="job-location">📍 {job.location}</p>
                  </div>
                  <div className="job-match">
                    <div
                      className="match-score"
                      style={{ color: getMatchScoreColor(job.matchScore) }}
                    >
                      {job.matchScore}% Match
                    </div>
                  </div>
                </div>

                <div className="job-details">
                  {job.employmentType && (
                    <span className="job-badge">{job.employmentType}</span>
                  )}
                  {job.salary && (
                    <span className="job-badge">{job.salary}</span>
                  )}
                  {job.postedAt && (
                    <span className="job-date">
                      Posted: {new Date(job.postedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>

                {job.description && (
                  <p className="job-description">{job.description}</p>
                )}

                {job.keywords && job.keywords.length > 0 && (
                  <div className="job-keywords">
                    <strong>Required Skills:</strong>
                    <div className="keyword-tags">
                      {job.keywords.slice(0, 8).map((keyword, idx) => (
                        <span key={idx} className="keyword-tag">{keyword}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="job-actions">
                  {job.applyLink && (
                    <a
                      href={job.applyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary"
                    >
                      View Job
                    </a>
                  )}
                  <button
                    className="btn btn-primary"
                    onClick={() => handleApply(job.id)}
                    disabled={applyingJobId === job.id || job.applied}
                  >
                    {applyingJobId === job.id
                      ? 'Applying...'
                      : job.applied
                      ? 'Applied ✓'
                      : 'Apply Now'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && jobs.length === 0 && selectedResume && (
          <div className="card">
            <p className="empty-state">
              No jobs found. Try searching with different keywords or get recommended jobs.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
