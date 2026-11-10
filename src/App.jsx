import React, { useState } from 'react';
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

const routes = [
  ['dashboard', 'Dashboard'],
  ['studio', 'Content Studio'],
  ['social', 'Social Hub'],
  ['calendar', 'Content Calendar'],
  ['workboard', 'Workboard'],
  ['planner', 'Workflow Planner'],
  ['assets', 'Asset Library'],
  ['competitors', 'Competitor Radar'],
  ['leads', 'Lead CRM'],
  ['campaigns', 'Campaigns'],
  ['analytics', 'Analytics'],
  ['automations', 'Automations'],
  ['settings', 'Settings']
];

export default function App() {
  const state = useMarketingState();
  const { view, setView, theme, toggleTheme, toastMessage, isToastVisible, showToast } = state;

  const [modalState, setModalState] = useState({ type: null, data: null });

  const openModal = (type, data = null) => {
    setModalState({ type, data });
  };

  const closeModal = () => {
    setModalState({ type: null, data: null });
  };

  if (view === 'login') {
    return <LoginView setView={setView} showToast={showToast} />;
  }

  const currentRouteName = routes.find(r => r[0] === view)?.[1] || 'Dashboard';

  return (
    <div className="shell">
      {/* Unified Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">j</span>
          <span className="brand-text">
            Jobgen
            <small>Marketing OS</small>
          </span>
        </div>

        <div className="workspace">
          <small>WORKSPACE</small>
          Jobgen.ai Marketing <span style={{ float: 'right' }}>⌄</span>
        </div>

        <div className="nav-caption">WORKSPACE</div>

        <nav className="nav" aria-label="Main navigation">
          {routes.map(([id, label]) => {
            const isActive = view === id;
            return (
              <button
                key={id}
                type="button"
                className={isActive ? 'active' : ''}
                aria-current={isActive ? 'page' : undefined}
                title={label}
                onClick={() => setView(id)}
              >
                <Icon name={id} />
                <span className="nav-label">{label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="local-pill">Single Unified App · Local-First</div>
          <button className="profile" type="button" onClick={() => setView('login')}>
            <span className="avatar">JM</span>
            <span>
              Jobgen Marketing
              <small>Workspace admin · Profile</small>
            </span>
            <Icon name="logout" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main">
        <header className="topbar">
          <div className="breadcrumb">
            Workspace <span style={{ margin: '0 9px' }}>/</span>
            <b>{currentRouteName}</b>
          </div>

          <div className="top-actions">
            <span className="status">✦ All systems connected in one place</span>
            <button
              className="icon-btn"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              <Icon name={theme === 'light' ? 'moon' : 'sun'} />
            </button>
            <button
              className="icon-btn"
              onClick={() => setView('login')}
              aria-label="Open profile / login"
            >
              <Icon name="leads" />
            </button>
          </div>
        </header>

        <div className="content" id="view">
          {view === 'dashboard' && <Dashboard state={state} setView={setView} openModal={openModal} />}
          {view === 'studio' && <ContentStudio state={state} showToast={showToast} openModal={openModal} />}
          {view === 'social' && <SocialHub state={state} showToast={showToast} openModal={openModal} setView={setView} />}
          {view === 'calendar' && <ContentCalendar state={state} openModal={openModal} />}
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
