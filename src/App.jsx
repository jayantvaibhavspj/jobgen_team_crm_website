import React, { useState, useEffect } from 'react';
import { useMarketingState } from './hooks/useMarketingState';
import { Icon } from './components/marketing/Icons';
import Dashboard from './components/marketing/Dashboard';
import ContentStudio from './components/marketing/ContentStudio';
import SocialHub from './components/marketing/SocialHub';
import ContentCalendar from './components/marketing/ContentCalendar';
import Workboard from './components/marketing/Workboard';
import WorkflowPlanner from './components/planner/WorkflowPlanner';
import AssetLibrary from './components/marketing/AssetLibrary';
import CompetitorRadar from './components/marketing/CompetitorRadar';
import LeadCRM from './components/marketing/LeadCRM';
import Campaigns from './components/marketing/Campaigns';
import Analytics from './components/marketing/Analytics';
import Automations from './components/marketing/Automations';
import Settings from './components/marketing/Settings';
import LoginView from './components/marketing/LoginView';
import Modals from './components/marketing/Modals';
import CommandPalette from './components/layout/CommandPalette';
import NotificationBell from './components/layout/NotificationBell';

const navigationGroups = [
  {
    title: 'WORKSPACE',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
      { id: 'studio', label: 'Content Studio', icon: 'studio' },
      { id: 'social', label: 'Social Hub', icon: 'social' },
      { id: 'calendar', label: 'Content Calendar', icon: 'calendar' }
    ]
  },
  {
    title: 'WORKFLOW & TASKS',
    items: [
      { id: 'workboard', label: 'Workboard', icon: 'workboard' },
      { id: 'planner', label: 'Workflow Planner', icon: 'planner' },
      { id: 'assets', label: 'Asset Library', icon: 'assets' }
    ]
  },
  {
    title: 'PIPELINE & GROWTH',
    items: [
      { id: 'leads', label: 'Lead CRM', icon: 'leads' },
      { id: 'campaigns', label: 'Campaigns', icon: 'campaigns' },
      { id: 'competitors', label: 'Competitor Radar', icon: 'competitors' }
    ]
  },
  {
    title: 'INTELLIGENCE',
    items: [
      { id: 'analytics', label: 'Analytics', icon: 'analytics' },
      { id: 'automations', label: 'Automations', icon: 'automations' }
    ]
  },
  {
    title: 'SYSTEM',
    items: [
      { id: 'settings', label: 'Settings', icon: 'settings' }
    ]
  }
];

export default function App() {
  const state = useMarketingState();
  const { view, setView, theme, toggleTheme, toastMessage, isToastVisible, showToast, user, userRole, handleSignOut } = state;

  const [modalState, setModalState] = useState({ type: null, data: null });
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const openModal = (type, data = null) => {
    setModalState({ type, data });
  };

  const closeModal = () => {
    setModalState({ type: null, data: null });
  };

  if (view === 'login') {
    return (
      <LoginView
        setView={setView}
        showToast={showToast}
        user={user}
        userRole={userRole}
        onSignOut={handleSignOut}
      />
    );
  }

  // Find route title
  let currentRouteName = 'Dashboard';
  for (const group of navigationGroups) {
    const found = group.items.find(i => i.id === view);
    if (found) {
      currentRouteName = found.label;
      break;
    }
  }

  const userDisplayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Team User';

  return (
    <div className="shell">
      {/* Grouped Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">j</span>
          <span className="brand-text">
            Jobgen
            <small>Marketing OS & CRM</small>
          </span>
        </div>

        <div className="workspace">
          <small>WORKSPACE</small>
          Jobgen Team CRM <span style={{ float: 'right' }}>⌄</span>
        </div>

        {navigationGroups.map(group => (
          <div key={group.title} style={{ marginBottom: '14px' }}>
            <div className="nav-caption">{group.title}</div>
            <nav className="nav" aria-label={group.title}>
              {group.items.map(item => {
                const isActive = view === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={isActive ? 'active' : ''}
                    aria-current={isActive ? 'page' : undefined}
                    title={item.label}
                    onClick={() => setView(item.id)}
                  >
                    <Icon name={item.icon} />
                    <span className="nav-label">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        ))}

        <div className="sidebar-footer">
          <div className="local-pill">Team Collaboration · Cloud Ready</div>
          <button className="profile" type="button" onClick={() => setView('login')}>
            <span className="avatar">{userDisplayName.slice(0, 2).toUpperCase()}</span>
            <span>
              {userDisplayName}
              <small>{userRole.toUpperCase()} · Profile</small>
            </span>
            <Icon name="logout" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main">
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="breadcrumb">
              Workspace <span style={{ margin: '0 8px' }}>/</span>
              <b>{currentRouteName}</b>
            </div>

            {/* Quick Command Palette Button */}
            <button
              type="button"
              className="btn small"
              onClick={() => setIsCommandPaletteOpen(true)}
              style={{ padding: '5px 10px', fontSize: '11px', color: 'var(--muted-foreground)' }}
            >
              <Icon name="search" style={{ width: '13px', height: '13px' }} /> Search or Jump to... <kbd style={{ background: 'var(--surface)', padding: '2px 5px', borderRadius: '4px', fontSize: '9px', marginLeft: '6px' }}>Ctrl K</kbd>
            </button>
          </div>

          <div className="top-actions">
            <span className="status">✦ Realtime Team Workspace</span>

            {/* Action Required Notification Bell */}
            <NotificationBell state={state} setView={setView} openModal={openModal} />

            {/* Theme Toggle */}
            <button
              type="button"
              className="icon-btn"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              <Icon name={theme === 'light' ? 'moon' : 'sun'} />
            </button>

            {/* Profile / Auth Button */}
            <button
              type="button"
              className="icon-btn"
              onClick={() => setView('login')}
              aria-label="Manage account / profile"
            >
              <Icon name="leads" />
            </button>
          </div>
        </header>

        <div className="content" id="view">
          {view === 'dashboard' && <Dashboard state={state} setView={setView} openModal={openModal} />}
          {view === 'studio' && <ContentStudio state={state} showToast={showToast} openModal={openModal} />}
          {view === 'social' && <SocialHub state={state} showToast={showToast} openModal={openModal} setView={setView} />}
          {view === 'calendar' && <ContentCalendar state={state} openModal={openModal} showToast={showToast} />}
          {view === 'workboard' && <Workboard state={state} openModal={openModal} showToast={showToast} />}
          {view === 'planner' && (
            <WorkflowPlanner
              globalTheme={theme}
              onToggleGlobalTheme={toggleTheme}
            />
          )}
          {view === 'assets' && <AssetLibrary state={state} showToast={showToast} />}
          {view === 'competitors' && <CompetitorRadar state={state} openModal={openModal} showToast={showToast} />}
          {view === 'leads' && <LeadCRM state={state} openModal={openModal} showToast={showToast} />}
          {view === 'campaigns' && <Campaigns state={state} openModal={openModal} showToast={showToast} />}
          {view === 'analytics' && <Analytics state={state} />}
          {view === 'automations' && <Automations state={state} openModal={openModal} showToast={showToast} />}
          {view === 'settings' && <Settings state={state} openModal={openModal} showToast={showToast} setView={setView} />}
        </div>
      </main>

      {/* Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        setView={setView}
        state={state}
        openModal={openModal}
      />

      {/* Global Modals */}
      <Modals
        modalType={modalState.type}
        modalData={modalState.data}
        closeModal={closeModal}
        state={state}
        showToast={showToast}
      />

      {/* Global Toast Notification */}
      <div id="toast" className={isToastVisible ? 'visible' : ''} role="status" aria-live="polite">
        {toastMessage}
      </div>
    </div>
  );
}
