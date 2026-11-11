import React from 'react';

export function Tabs({ tabs = [], activeTab, onChange, className = '', style = {} }) {
  return (
    <div className={`ui-tabs ${className}`} style={style} role="tablist">
      {tabs.map(tab => {
        const id = typeof tab === 'string' ? tab : tab.id;
        const label = typeof tab === 'string' ? tab : tab.label;
        const count = typeof tab === 'object' ? tab.count : undefined;
        const isActive = activeTab === id;

        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`ui-tab ${isActive ? 'active' : ''}`}
            onClick={() => onChange?.(id)}
          >
            <span>{label}</span>
            {count !== undefined && (
              <span style={{ opacity: 0.65, fontSize: '11px', marginLeft: 5 }}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default Tabs;

