import React from 'react';
import { Filter, Volume2, VolumeX } from 'lucide-react';
import { sound } from '../../utils/sound';

export default function TaskFilters({
  filterStatus,
  setFilterStatus,
  filterPriority,
  setFilterPriority,
  filterCategory,
  setFilterCategory,
  isMuted,
  onToggleSound
}) {
  const categories = ['All', 'Work', 'Personal', 'Focus', 'Urgent'];
  const priorities = ['All', 'High', 'Medium', 'Low'];
  const statuses = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Incomplete' },
    { key: 'done', label: 'Completed' }
  ];

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <span className="filter-label">
          <Filter size={13} />
          View:
        </span>
        {statuses.map((s) => (
          <button
            key={s.key}
            className={`filter-pill ${filterStatus === s.key ? 'active' : ''}`}
            onClick={() => setFilterStatus(s.key)}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="filter-group">
        <span className="filter-label">Priority:</span>
        {priorities.map((p) => {
          const val = p.toLowerCase();
          const isActive = filterPriority === val || (p === 'All' && filterPriority === 'all');
          return (
            <button
              key={p}
              className={`filter-pill ${isActive ? 'active' : ''}`}
              onClick={() => setFilterPriority(p === 'All' ? 'all' : val)}
            >
              {p}
            </button>
          );
        })}
      </div>

      <div className="filter-group">
        <span className="filter-label">Tag:</span>
        {categories.map((c) => {
          const isActive = filterCategory === c;
          return (
            <button
              key={c}
              className={`filter-pill ${isActive ? 'active' : ''}`}
              onClick={() => setFilterCategory(c)}
            >
              {c}
            </button>
          );
        })}
      </div>

      {/* Sound Mute Toggle */}
      <button
        className="btn-glass btn-icon"
        style={{ width: '32px', height: '32px', marginLeft: 'auto' }}
        onClick={onToggleSound}
        title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
      >
        {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
      </button>
    </div>
  );
}

