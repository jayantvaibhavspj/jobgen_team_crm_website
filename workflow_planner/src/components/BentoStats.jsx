import React from 'react';
import { ClipboardList, CheckCircle2, Hourglass, TrendingUp } from 'lucide-react';

export default function BentoStats({ totalCount, doneCount, pendingCount, completionRate }) {
  return (
    <section className="bento-stats">
      <div className="stat-card">
        <div className="stat-header">
          <span className="stat-label">Total Tasks</span>
          <div className="stat-icon-wrapper">
            <ClipboardList size={14} />
          </div>
        </div>
        <div className="stat-val">{totalCount}</div>
        <div className="stat-subtext">Active scope</div>
      </div>

      <div className="stat-card">
        <div className="stat-header">
          <span className="stat-label">Completed</span>
          <div className="stat-icon-wrapper" style={{ color: 'var(--color-success)' }}>
            <CheckCircle2 size={14} />
          </div>
        </div>
        <div className="stat-val" style={{ color: 'var(--color-success)' }}>
          {doneCount}
        </div>
        <div className="stat-subtext">Done</div>
      </div>

      <div className="stat-card">
        <div className="stat-header">
          <span className="stat-label">Remaining</span>
          <div className="stat-icon-wrapper" style={{ color: 'var(--color-warning)' }}>
            <Hourglass size={14} />
          </div>
        </div>
        <div className="stat-val" style={{ color: 'var(--color-warning)' }}>
          {pendingCount}
        </div>
        <div className="stat-subtext">To-do</div>
      </div>

      <div className="stat-card">
        <div className="stat-header">
          <span className="stat-label">Progress</span>
          <div className="stat-icon-wrapper">
            <TrendingUp size={14} />
          </div>
        </div>
        <div className="stat-val">
          {completionRate}%
        </div>
        <div className="stat-subtext">Completion rate</div>
      </div>
    </section>
  );
}
