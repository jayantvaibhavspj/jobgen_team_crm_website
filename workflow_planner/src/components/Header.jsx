import React from 'react';
import { CheckSquare, Search, Sun, Moon, Database } from 'lucide-react';
import { getFormattedCurrentDate } from '../utils/dateUtils';

export default function Header({
  searchQuery,
  setSearchQuery,
  theme,
  toggleTheme,
  onOpenBackup
}) {
  return (
    <header className="header-glass">
      <div className="brand-section">
        <div className="brand-icon">
          <CheckSquare size={20} />
        </div>
        <div className="brand-title">
          <h1>Work Planner</h1>
          <div className="brand-sub">{getFormattedCurrentDate()}</div>
        </div>
      </div>

      <div className="top-actions">
        {/* Search */}
        <div className="search-box">
          <span className="search-icon">
            <Search size={14} strokeWidth={2} />
          </span>
          <input
            type="text"
            id="task-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
          />
          <span className="search-shortcut">/</span>
        </div>

        {/* Theme Toggle */}
        <button
          className="btn-glass btn-icon"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Backup Modal Trigger */}
        <button
          className="btn-glass btn-icon"
          onClick={onOpenBackup}
          title="Backup & Restore Data"
        >
          <Database size={16} />
        </button>
      </div>
    </header>
  );
}
