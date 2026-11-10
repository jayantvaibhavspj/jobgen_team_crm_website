import React from 'react';

export default function StatusFilter({ filterStatus, setFilterStatus, totalCount, doneCount }) {
  const pendingCount = totalCount - doneCount;

  return (
    <div className="status-filter-bar">
      <div className="status-segmented">
        <button
          className={`status-segment-btn ${filterStatus === 'all' ? 'active' : ''}`}
          onClick={() => setFilterStatus('all')}
        >
          All ({totalCount})
        </button>
        <button
          className={`status-segment-btn ${filterStatus === 'active' ? 'active' : ''}`}
          onClick={() => setFilterStatus('active')}
        >
          To-do ({pendingCount})
        </button>
        <button
          className={`status-segment-btn ${filterStatus === 'done' ? 'active' : ''}`}
          onClick={() => setFilterStatus('done')}
        >
          Done ({doneCount})
        </button>
      </div>
    </div>
  );
}

