import React from 'react';
import { Search, Sun, Moon, ChevronRight } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import NotificationBell from './NotificationBell';

export default function Topbar({
  currentRouteName = 'Dashboard',
  theme = 'light',
  toggleTheme,
  onOpenCommandPalette,
  state,
  setView,
  openModal
}) {
  const userDisplayName = state.user?.user_metadata?.full_name || state.user?.email?.split('@')[0] || 'Jayant Vaibhav';

  return (
    <header className="app-topbar">
      {/* Left: Breadcrumbs & Quick Search Trigger */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
        <div className="app-breadcrumb">
          <span>Workspace</span>
          <ChevronRight size={14} style={{ opacity: 0.5 }} />
          <span className="app-breadcrumb-current">{currentRouteName}</span>
        </div>

        <button
          type="button"
          className="app-cmd-btn"
          onClick={onOpenCommandPalette}
          title="Search anything (Ctrl+K)"
        >
          <Search size={13} style={{ color: 'var(--text-muted)' }} />
          <span>Search or jump to...</span>
          <kbd style={{ background: 'var(--bg-muted)', padding: '2px 5px', borderRadius: '4px', fontSize: '10px', color: 'var(--text-secondary)' }}>
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Right: Actions & User Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <span className="status" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-success)', display: 'inline-block' }} />
          Team Workspace
        </span>

        {/* Notifications */}
        <NotificationBell state={state} setView={setView} openModal={openModal} />

        {/* Theme Toggle */}
        <button
          type="button"
          className="ui-icon-btn bordered"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </button>

        {/* Profile Avatar Button */}
        <button
          type="button"
          onClick={() => setView('login')}
          style={{ background: 'transparent', border: 0, padding: 0, cursor: 'pointer' }}
          title={`Signed in as ${userDisplayName}`}
        >
          <Avatar name={userDisplayName} size="sm" />
        </button>
      </div>
    </header>
  );
}
