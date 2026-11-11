import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Sparkles,
  Share2,
  Calendar,
  Kanban,
  CheckSquare,
  FolderOpen,
  Users,
  Megaphone,
  Radio,
  BarChart3,
  Zap,
  Settings as SettingsIcon,
  ChevronDown,
  Star,
  LogOut,
  Lock,
  Unlock
} from 'lucide-react';
import { Avatar } from '../ui/Avatar';

export const navigationSections = [
  {
    title: 'Overview',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'analytics', label: 'Analytics', icon: BarChart3 }
    ]
  },
  {
    title: 'Create',
    items: [
      { id: 'studio', label: 'Content Studio', icon: Sparkles },
      { id: 'calendar', label: 'Content Calendar', icon: Calendar },
      { id: 'social', label: 'Social Hub', icon: Share2 }
    ]
  },
  {
    title: 'Work',
    items: [
      { id: 'workboard', label: 'Workboard', icon: Kanban },
      { id: 'planner', label: 'Workflow Planner', icon: CheckSquare },
      { id: 'assets', label: 'Asset Library', icon: FolderOpen }
    ]
  },
  {
    title: 'Grow',
    items: [
      { id: 'leads', label: 'Lead CRM', icon: Users },
      { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
      { id: 'competitors', label: 'Competitor Radar', icon: Radio }
    ]
  },
  {
    title: 'Account',
    items: [
      { id: 'automations', label: 'Automations', icon: Zap },
      { id: 'settings', label: 'Settings', icon: SettingsIcon }
    ]
  }
];

export default function Sidebar({
  view,
  setView,
  isCollapsed,
  onToggleCollapse,
  user,
  userRole = 'Admin',
  onHoverChange
}) {
  const [isHovered, setIsHovered] = useState(false);
  const isExpanded = !isCollapsed || isHovered;

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (onHoverChange) onHoverChange(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (onHoverChange) onHoverChange(false);
  };

  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem('jobgen_favorites');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('jobgen_favorites', JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  const toggleFavorite = (e, id) => {
    e.stopPropagation();
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Collect all items for favorite lookups
  const allNavItems = navigationSections.flatMap(sec => sec.items);
  const favoriteItems = allNavItems.filter(item => favorites.includes(item.id));

  const userDisplayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Jayant Vaibhav';

  return (
    <aside
      className={`app-sidebar ${isCollapsed ? 'is-collapsed' : ''} ${isHovered ? 'is-hovered' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label="Main Navigation"
    >
      {/* Workspace Selector Dropdown Header */}
      <div className="sidebar-top-box">
        {isExpanded ? (
          <div className="sidebar-workspace-card">
            <span className="sidebar-workspace-label">WORKSPACE</span>
            <div className="sidebar-workspace-select">
              <div className="sidebar-workspace-brand">
                <img src="/logo.png" alt="Jobgen" className="sidebar-logo-icon" />
                <span className="sidebar-workspace-name">Jobgen.ai Marketing</span>
              </div>
              <ChevronDown size={14} className="sidebar-workspace-chevron" />
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="sidebar-workspace-collapsed"
            onClick={onToggleCollapse}
            title="Click to pin sidebar open"
            aria-label="Click to pin sidebar open"
          >
            <img src="/logo.png" alt="Jobgen" className="sidebar-logo-collapsed" />
          </button>
        )}

        {isExpanded && (
          <button
            type="button"
            className={`sidebar-collapse-btn ${isCollapsed ? 'is-unlocked' : 'is-locked'}`}
            onClick={onToggleCollapse}
            title={isCollapsed ? 'Lock sidebar open (stay open)' : 'Unlock sidebar (auto-hover mode)'}
            aria-label={isCollapsed ? 'Lock sidebar open (stay open)' : 'Unlock sidebar (auto-hover mode)'}
          >
            {isCollapsed ? <Unlock size={14} /> : <Lock size={14} />}
          </button>
        )}
      </div>

      {/* Nav List */}
      <div className="sidebar-nav-container">
        {/* Pinned Favorites Section */}
        {favoriteItems.length > 0 && (
          <div className="sidebar-group">
            <div className="sidebar-group-title">Favorites</div>
            <nav>
              {favoriteItems.map(item => {
                const IconComp = item.icon;
                const isActive = view === item.id;
                return (
                  <button
                    key={`fav-${item.id}`}
                    type="button"
                    className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => setView(item.id)}
                    title={!isExpanded ? item.label : undefined}
                  >
                    <span className="sidebar-nav-icon"><IconComp size={18} /></span>
                    <span className="sidebar-nav-label">{item.label}</span>
                    <button
                      type="button"
                      className="sidebar-pin-btn pinned"
                      onClick={(e) => toggleFavorite(e, item.id)}
                      title="Unpin from favorites"
                    >
                      <Star size={13} fill="currentColor" />
                    </button>
                  </button>
                );
              })}
            </nav>
          </div>
        )}

        {/* Grouped Navigation Sections */}
        {navigationSections.map(sec => (
          <div key={sec.title} className="sidebar-group">
            <div className="sidebar-group-title">{sec.title}</div>
            <nav>
              {sec.items.map(item => {
                const IconComp = item.icon;
                const isActive = view === item.id;
                const isPinned = favorites.includes(item.id);

                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => setView(item.id)}
                    title={!isExpanded ? item.label : undefined}
                  >
                    <span className="sidebar-nav-icon"><IconComp size={18} /></span>
                    <span className="sidebar-nav-label">{item.label}</span>
                    <button
                      type="button"
                      className={`sidebar-pin-btn ${isPinned ? 'pinned' : ''}`}
                      onClick={(e) => toggleFavorite(e, item.id)}
                      title={isPinned ? 'Unpin' : 'Pin to favorites'}
                    >
                      <Star size={13} fill={isPinned ? 'currentColor' : 'none'} />
                    </button>
                  </button>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Footer Profile */}
      <div className="sidebar-footer-card">
        <button
          type="button"
          className="sidebar-user-pill"
          onClick={() => setView('login')}
          title="Account profile & sign out"
        >
          <Avatar name={userDisplayName} size="sm" />
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{userDisplayName}</span>
            <span className="sidebar-user-role">{userRole}</span>
          </div>
          <LogOut size={14} style={{ color: 'var(--sidebar-text-muted)' }} />
        </button>
      </div>
    </aside>
  );
}

