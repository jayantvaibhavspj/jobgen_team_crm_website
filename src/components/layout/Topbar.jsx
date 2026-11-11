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
      {/* Left: Mobile Brand Logo + Breadcrumbs & Quick Search Trigger */}
      <div className="topbar-left-wrap">
        <button
          type="button"
          className="mobile-brand-mark"
          onClick={() => setView('dashboard')}
          title="Jobgen Dashboard"
          aria-label="Jobgen Dashboard"
        >
          <img src="/logo.png" alt="Jobgen" />
        </button>

        <div className="app-breadcrumb">
          <span className="breadcrumb-parent">Workspace</span>
          <ChevronRight size={14} className="breadcrumb-sep" />
          <span className="app-breadcrumb-current">{currentRouteName}</span>
        </div>

        <button
          type="button"
          className="app-cmd-btn"
          onClick={onOpenCommandPalette}
          title="Search anything (Ctrl+K)"
        >
          <Search size={14} style={{ color: 'var(--text-muted)' }} />
          <span className="cmd-btn-text">Search or jump to...</span>
          <kbd className="cmd-btn-kbd">Ctrl K</kbd>
        </button>
      </div>

      {/* Right: Actions & User Info */}
      <div className="topbar-right-wrap">
        <span className="topbar-status-badge">
          <span className="status-dot" />
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
          style={{ background: 'transparent', border: 0, padding: 0, cursor: 'pointer', display: 'grid', placeItems: 'center' }}
          title={`Signed in as ${userDisplayName}`}
        >
          <Avatar name={userDisplayName} size="sm" />
        </button>
      </div>
    </header>
  );
}

