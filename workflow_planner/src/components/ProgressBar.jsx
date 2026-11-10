import React from 'react';

export default function ProgressBar({ completionRate }) {
  return (
    <div className="progress-container">
      <span className="progress-text">Scope Completion</span>
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${completionRate}%` }}
        />
      </div>
      <span className="progress-text">{completionRate}%</span>
    </div>
  );
}

