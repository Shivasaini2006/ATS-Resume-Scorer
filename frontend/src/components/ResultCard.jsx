import React from 'react';

export default function ResultCard({ result }) {
  return (
    <div className="result-card">
      <h3>{result?.title || 'Result'}</h3>
    </div>
  );
}
