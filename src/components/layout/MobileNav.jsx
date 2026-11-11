import React, { useState } from 'react';
import {
  LayoutDashboard,
  Kanban,
  Users,
  CheckSquare,
  Menu,
  X,
  Sparkles,
  Calendar,
  Share2,
  FolderOpen,
  Megaphone,
  Radio,
  BarChart3,
  Zap,
  Settings as SettingsIcon,
  Sun,
  Moon
} from 'lucide-react';
import { navigationSections } from './Sidebar';

export default function MobileNav({ view, setView, theme, toggleTheme }) {
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const primaryTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'workboard', label: 'Workboard', icon: Kanban },
    { id: 'leads', label: 'Lead CRM', icon: Users },
    { id: 'planner', label: 'Planner', icon: CheckSquare }
  ];

  const handleSelectView = (id) => {
    setView(id);
    setIsMoreOpen(false);
  };

  return (
    <>
      {/* Fixed Bottom Tab Bar */}
      <nav className="mobile-bottom-bar" aria-label="Mobile Navigation">
        {primaryTabs.map(tab => {
          const IconComp = tab.icon;
          const isActive = view === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              className={`mobile-tab-item ${isActive ? 'active' : ''}`}
              onClick={() => handleSelectView(tab.id)}
            >
              <IconComp size={20} />
              <span>{tab.label}</span>
            </button>
          );
        })}

        <button
          type="button"
          className={`mobile-tab-item ${isMoreOpen ? 'active' : ''}`}
          onClick={() => setIsMoreOpen(true)}
          aria-label="More navigation items"
        >
          <Menu size={20} />
          <span>More</span>
        </button>
      </nav>

      {/* "More" Sheet Modal */}
      {isMoreOpen && (
        <div className="mobile-sheet-backdrop" onClick={() => setIsMoreOpen(false)}>
          <div
            className="mobile-bottom-sheet"
            onClick={e => e.stopPropagation()}
          >
            <div className="mobile-sheet-handle" />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img src="/logo.png" alt="Jobgen" style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
                <h2 style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--font-bold)', margin: 0, color: 'var(--text-primary)' }}>
                  Workspace Navigation
                </h2>
              </div>
              <button
                type="button"
                className="ui-icon-btn bordered"
                onClick={() => setIsMoreOpen(false)}
                aria-label="Close menu"
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '4px' }}>
              {navigationSections.map(sec => (
                <div key={sec.title} style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '10px', fontWeight: 'var(--font-bold)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                    {sec.title}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                    {sec.items.map(item => {
                      const IconComp = item.icon;
                      const isActive = view === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelectView(item.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px 12px',
                            borderRadius: 'var(--radius-md)',
                            border: isActive ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                            background: isActive ? 'var(--primary-soft)' : 'var(--bg-subtle)',
                            color: isActive ? 'var(--primary)' : 'var(--text-primary)',
                            fontSize: 'var(--text-sm)',
                            fontWeight: isActive ? 'var(--font-bold)' : 'var(--font-medium)',
                            cursor: 'pointer',
                            textAlign: 'left',
                            minHeight: '44px'
                          }}
                        >
                          <IconComp size={18} style={{ flexShrink: 0 }} />
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>Theme appearance</span>
              <button
                type="button"
                className="ui-btn ui-btn-secondary ui-btn-sm"
                onClick={toggleTheme}
                style={{ minHeight: '36px', padding: '6px 14px' }}
              >
                {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
                <span>{theme === 'light' ? 'Dark mode' : 'Light mode'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

