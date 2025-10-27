import React, { useState, useEffect } from 'react';
import { jobAPI } from '../services/api';
import './Applications.css';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const response = await jobAPI.getApplications();
      setApplications(response.data);
    } catch (err) {
      setError('Failed to load applications');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: '#ffc107',
      applied: '#007bff',
      rejected: '#dc3545',
      interviewing: '#28a745'
    };

    return (
      <span
        className="status-badge"
        style={{ backgroundColor: statusColors[status] || '#6c757d' }}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return <div className="loading">Loading applications...</div>;
  }

  return (
    <div className="applications-page">
      <div className="container">
        <h1>My Applications</h1>

        {error && <div className="alert alert-error">{error}</div>}

        {applications.length === 0 ? (
          <div className="card">
            <p className="empty-state">
              You haven't applied to any jobs yet. Visit the Jobs page to find and apply to opportunities.
            </p>
          </div>
        ) : (
          <div className="applications-list">
            {applications.map((app) => (
              <div key={app.id} className="application-card">
                <div className="application-header">
                  <div>
                    <h3>{app.job?.title}</h3>
                    <p className="application-company">{app.job?.company}</p>
                    <p className="application-location">📍 {app.job?.location}</p>
                  </div>
                  {getStatusBadge(app.status)}
                </div>

                <div className="application-details">
                  <div className="detail-item">
                    <strong>Resume:</strong> {app.resume?.name}
                  </div>
                  <div className="detail-item">
                    <strong>Match Score:</strong>{' '}
                    <span style={{ color: app.matchScore >= 70 ? '#28a745' : '#ffc107' }}>
                      {app.matchScore}%
                    </span>
                  </div>
                  <div className="detail-item">
                    <strong>ATS Score:</strong> {app.resume?.atsScore}/100
                  </div>
                  <div className="detail-item">
                    <strong>Applied:</strong> {new Date(app.appliedAt).toLocaleString()}
                  </div>
                  {app.autoApplied && (
                    <div className="detail-item">
                      <span className="auto-badge">🤖 Auto-Applied</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Applications;
