import React from 'react';
import { Clock, Calendar, CalendarDays } from 'lucide-react';

export default function ScopeSelector({ scope, setScope, tabCounts, resetPeriod }) {
  const tabs = [
    { key: 'day', label: 'Today', icon: Clock, count: tabCounts.day },
    { key: 'week', label: 'This Week', icon: Calendar, count: tabCounts.week },
    { key: 'month', label: 'This Month', icon: CalendarDays, count: tabCounts.month }
  ];

  const handleScopeChange = (newScope) => {
    setScope(newScope);
    resetPeriod();
  };

  return (
    <nav className="scope-nav">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = scope === tab.key;
        return (
          <button
            key={tab.key}
            className={`scope-btn ${isActive ? 'active' : ''}`}
            onClick={() => handleScopeChange(tab.key)}
          >
            <Icon size={16} />
            {tab.label}
            <span className="count-tag">{tab.count}</span>
          </button>
        );
      })}
    </nav>
  );
}

