import React, { useState, useEffect } from 'react';
import { useMarketingState } from './hooks/useMarketingState';
import Sidebar, { navigationSections } from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import MobileNav from './components/layout/MobileNav';
import CommandPalette from './components/layout/CommandPalette';
import Modals from './components/marketing/Modals';

// Page Views
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

export default function App() {
  const state = useMarketingState();
  const {
    view,
    setView,
    theme,
    toggleTheme,
    toastMessage,
    isToastVisible,
    showToast,
    user,
    userRole,
    handleSignOut
  } = state;

  const [modalState, setModalState] = useState({ type: null, data: null });
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  // Sidebar collapsible state with localStorage persistence
  // Default: false (Page opens fully expanded by default; when collapsed once, expands on hover; when opened with button, stays open)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    try {
      const stored = localStorage.getItem('jobgen_sidebar_collapsed_v2');
      if (stored !== null) return stored === 'true';
    } catch {}
    return false; // Default: fully open on first visit / reload!
  });

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem('jobgen_sidebar_collapsed_v2', String(next));
      } catch {}
      return next;
    });
  };

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

  // Find human-readable route name
  let currentRouteName = 'Dashboard';
  for (const group of navigationSections) {
    const found = group.items.find(i => i.id === view);
    if (found) {
      currentRouteName = found.label;
      break;
    }
  }

  return (
    <div className={`app-shell ${isSidebarCollapsed ? 'sidebar-collapsed' : ''} ${isSidebarCollapsed && isSidebarHovered ? 'sidebar-hover-expanded' : ''}`}>
      {/* 240px Clean Collapsible Sidebar */}
      <Sidebar
        view={view}
        setView={setView}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebarCollapse}
        user={user}
        userRole={userRole}
        onHoverChange={setIsSidebarHovered}
      />

      {/* Main Content Area */}
      <main className="main" style={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Topbar */}
        <Topbar
          currentRouteName={currentRouteName}
          theme={theme}
          toggleTheme={toggleTheme}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          state={state}
          setView={setView}
          openModal={openModal}
        />

        {/* Page Content Container */}
        <div className="app-content" id="view" style={{ flex: 1 }}>
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

      {/* Mobile Bottom Tab Bar */}
      <MobileNav
        view={view}
        setView={setView}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Global Command Palette (Ctrl+K) */}
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
