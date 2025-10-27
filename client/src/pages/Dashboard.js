import React, { useState, useEffect } from 'react';
import { resumeAPI } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [selectedResume, setSelectedResume] = useState(null);

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      const response = await resumeAPI.getAll();
      setResumes(response.data);
    } catch (err) {
      console.error('Failed to load resumes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      setSelectedFile(file);
      setError('');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a file');
      return;
    }

    setUploading(true);
    setError('');
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('resume', selectedFile);

      const response = await resumeAPI.upload(formData);
      setMessage('Resume uploaded and analyzed successfully!');
      setSelectedFile(null);
      setSelectedResume(response.data.resume);
      loadResumes();
      
      // Reset file input
      document.getElementById('resume-file').value = '';
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      try {
        await resumeAPI.delete(id);
        setMessage('Resume deleted successfully');
        loadResumes();
        if (selectedResume?.id === id) {
          setSelectedResume(null);
        }
      } catch (err) {
        setError('Failed to delete resume');
      }
    }
  };

  const handleReanalyze = async (id) => {
    try {
      const response = await resumeAPI.reanalyze(id);
      setMessage('Resume re-analyzed successfully');
      setSelectedResume(response.data.resume);
      loadResumes();
    } catch (err) {
      setError('Failed to re-analyze resume');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#28a745';
    if (score >= 60) return '#ffc107';
    return '#dc3545';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <div className="container">
        <h1>Dashboard</h1>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        <div className="dashboard-grid">
          {/* Upload Section */}
          <div className="upload-section">
            <div className="card">
              <h2>Upload Resume</h2>
              <form onSubmit={handleUpload}>
                <div className="form-group">
                  <label>Select Resume (PDF or DOCX, max 5MB)</label>
                  <input
                    id="resume-file"
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleFileSelect}
                    disabled={uploading}
                  />
                  {selectedFile && (
                    <p className="file-info">Selected: {selectedFile.name}</p>
                  )}
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={uploading || !selectedFile}
                >
                  {uploading ? 'Uploading...' : 'Upload & Analyze'}
                </button>
              </form>
            </div>

            {/* Resume List */}
            <div className="card">
              <h2>Your Resumes</h2>
              {resumes.length === 0 ? (
                <p>No resumes uploaded yet. Upload your first resume to get started!</p>
              ) : (
                <div className="resume-list">
                  {resumes.map((resume) => (
                    <div
                      key={resume._id}
                      className={`resume-item ${selectedResume?.id === resume._id ? 'active' : ''}`}
                      onClick={() => setSelectedResume({
                        id: resume._id,
                        filename: resume.originalName,
                        atsScore: resume.atsScore,
                        keywords: resume.keywords,
                        improvements: resume.improvements,
                        analysis: resume.analysis,
                        createdAt: resume.createdAt
                      })}
                    >
                      <div className="resume-info">
                        <h4>{resume.originalName}</h4>
                        <p>Uploaded: {new Date(resume.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="resume-score" style={{ color: getScoreColor(resume.atsScore) }}>
                        {resume.atsScore}
                      </div>
                      <div className="resume-actions">
                        <button
                          className="btn-icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReanalyze(resume._id);
                          }}
                          title="Re-analyze"
                        >
                          🔄
                        </button>
                        <button
                          className="btn-icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(resume._id);
                          }}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Analysis Section */}
          <div className="analysis-section">
            {selectedResume ? (
              <>
                <div className="card">
                  <h2>ATS Score Analysis</h2>
                  <div className="score-display">
                    <div
                      className="score-circle"
                      style={{ borderColor: getScoreColor(selectedResume.atsScore) }}
                    >
                      <span className="score-value">{selectedResume.atsScore}</span>
                      <span className="score-label">{getScoreLabel(selectedResume.atsScore)}</span>
                    </div>
                  </div>
                  <p className="score-description">
                    Your resume scored {selectedResume.atsScore}/100 on our ATS compatibility test.
                  </p>
                </div>

                <div className="card">
                  <h2>Keywords Analysis</h2>
                  <div className="keywords-section">
                    <div className="keywords-matched">
                      <h3>✅ Matched Keywords ({selectedResume.keywords?.matched?.length || 0})</h3>
                      <div className="keyword-tags">
                        {selectedResume.keywords?.matched?.slice(0, 15).map((keyword, idx) => (
                          <span key={idx} className="keyword-tag matched">{keyword}</span>
                        ))}
                      </div>
                      {selectedResume.keywords?.matched?.length > 15 && (
                        <p className="more-keywords">
                          +{selectedResume.keywords.matched.length - 15} more
                        </p>
                      )}
                    </div>

                    <div className="keywords-missing">
                      <h3>❌ Missing Keywords ({selectedResume.keywords?.missing?.length || 0})</h3>
                      <div className="keyword-tags">
                        {selectedResume.keywords?.missing?.slice(0, 10).map((keyword, idx) => (
                          <span key={idx} className="keyword-tag missing">{keyword}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h2>Improvement Suggestions</h2>
                  <ul className="improvements-list">
                    {selectedResume.improvements?.map((improvement, idx) => (
                      <li key={idx}>{improvement}</li>
                    ))}
                  </ul>
                </div>

                {selectedResume.analysis?.skills && (
                  <div className="card">
                    <h2>Detected Skills</h2>
                    <div className="keyword-tags">
                      {selectedResume.analysis.skills.map((skill, idx) => (
                        <span key={idx} className="keyword-tag">{skill}</span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="card">
                <p className="empty-state">
                  Select a resume from the list or upload a new one to see the analysis.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
