import React from 'react';

export default function JobCard({ job }) {
  return (
    <div className="job-card">
      <h4>{job?.title || 'Job Title'}</h4>
    </div>
  );
}
