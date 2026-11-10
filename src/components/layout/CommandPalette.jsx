import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '../marketing/Icons';

export default function CommandPalette({ isOpen, onClose, setView, state, openModal }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Build searchable items
  const views = [
    { id: 'dashboard', title: 'Dashboard', category: 'Navigation', icon: 'dashboard', action: () => setView('dashboard') },
    { id: 'leads', title: 'Lead CRM', category: 'Navigation', icon: 'leads', action: () => setView('leads') },
    { id: 'workboard', title: 'Workboard', category: 'Navigation', icon: 'workboard', action: () => setView('workboard') },
    { id: 'planner', title: 'Workflow Planner', category: 'Navigation', icon: 'planner', action: () => setView('planner') },
    { id: 'calendar', title: 'Content Calendar', category: 'Navigation', icon: 'calendar', action: () => setView('calendar') },
    { id: 'studio', title: 'Content Studio', category: 'Navigation', icon: 'studio', action: () => setView('studio') },
    { id: 'campaigns', title: 'Campaigns', category: 'Navigation', icon: 'campaigns', action: () => setView('campaigns') },
    { id: 'analytics', title: 'Analytics', category: 'Navigation', icon: 'analytics', action: () => setView('analytics') },
    { id: 'automations', title: 'Automations', category: 'Navigation', icon: 'automations', action: () => setView('automations') },
    { id: 'settings', title: 'Settings', category: 'Navigation', icon: 'settings', action: () => setView('settings') }
  ];

  const quickActions = [
    { id: 'qa-lead', title: 'Add new lead', category: 'Actions', icon: 'plus', action: () => openModal('lead-new') },
    { id: 'qa-task', title: 'Create new task', category: 'Actions', icon: 'plus', action: () => openModal('task-new') },
    { id: 'qa-event', title: 'Schedule a post', category: 'Actions', icon: 'plus', action: () => openModal('event-new') },
    { id: 'qa-theme', title: `Switch to ${state.theme === 'light' ? 'Dark' : 'Light'} mode`, category: 'Actions', icon: state.theme === 'light' ? 'moon' : 'sun', action: () => state.toggleTheme() }
  ];

  const leadItems = (state.leads || []).map(l => ({
    id: `lead-${l.id}`,
    title: `${l.name} (${l.company})`,
    category: 'Leads',
    icon: 'leads',
    desc: `$${Number(l.value || 0).toLocaleString()} · ${l.stage}`,
    action: () => {
      setView('leads');
      openModal('lead-drawer', l);
    }
  }));

  const allItems = [...views, ...quickActions, ...leadItems];
  const filtered = query.trim()
    ? allItems.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        (item.desc && item.desc.toLowerCase().includes(query.toLowerCase())) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      )
    : [...quickActions, ...views.slice(0, 5)];

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (filtered.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + (filtered.length || 1)) % (filtered.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
        onClose();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="cmd-palette-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label="Command palette">
      <div className="cmd-palette" onClick={e => e.stopPropagation()}>
        <div className="cmd-input-wrap">
          <Icon name="search" />
          <input
            ref={inputRef}
            placeholder="Type a command or search leads, tasks, views..."
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="cmd-list">
          {filtered.length > 0 ? (
            filtered.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={`cmd-item ${index === selectedIndex ? 'selected' : ''}`}
                onClick={() => {
                  item.action();
                  onClose();
                }}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <Icon name={item.icon} />
                <span>{item.title}</span>
                {item.desc ? (
                  <span className="cmd-item-desc">{item.desc}</span>
                ) : (
                  <span className="cmd-item-desc">{item.category}</span>
                )}
              </button>
            ))
          ) : (
            <div className="empty" style={{ padding: '24px' }}>
              <p className="muted small-text">No matching commands or leads found.</p>
            </div>
          )}
        </div>

        <div className="cmd-footer">
          <span>Navigation: ↑ ↓ · Select: Enter</span>
          <span>Close: Esc</span>
        </div>
      </div>
    </div>
  );
}
