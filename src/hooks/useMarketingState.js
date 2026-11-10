import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { dataLayer, defaultLeads, defaultTeamMembers } from '../lib/data';
import { triggerCompletionConfetti } from '../utils/confetti';

export const VIEW_IDS = [
  'dashboard',
  'studio',
  'social',
  'calendar',
  'workboard',
  'planner',
  'assets',
  'competitors',
  'leads',
  'campaigns',
  'analytics',
  'automations',
  'settings',
  'login'
];

const STORAGE_PREFIX = 'jobgen-vanilla:';

function readLocal(name, fallback) {
  try {
    const val = localStorage.getItem(STORAGE_PREFIX + name);
    return val !== null ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

function saveLocal(name, value) {
  try {
    localStorage.setItem(STORAGE_PREFIX + name, JSON.stringify(value));
  } catch (e) {
    console.warn('LocalStorage save failed:', e);
  }
}

export function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export const today = dateKey(new Date());
export const dateOffset = days => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return dateKey(d);
};
export const uid = () => window.crypto?.randomUUID?.() || `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;

export function useMarketingState() {
  // 1. URL Routing with History API
  const getInitialView = () => {
    const path = window.location.pathname.replace(/^\//, '').toLowerCase();
    if (VIEW_IDS.includes(path)) return path;
    const urlParams = new URLSearchParams(window.location.search);
    const paramView = urlParams.get('view')?.toLowerCase();
    if (VIEW_IDS.includes(paramView)) return paramView;
    return 'dashboard';
  };

  const [view, setViewState] = useState(getInitialView);

  const setView = useCallback((nextView) => {
    if (!VIEW_IDS.includes(nextView)) return;
    setViewState(nextView);
    const newPath = `/${nextView}`;
    if (window.location.pathname !== newPath) {
      window.history.pushState({ view: nextView }, '', newPath);
    }
  }, []);

  useEffect(() => {
    const handlePopState = (event) => {
      const stateView = event.state?.view;
      if (stateView && VIEW_IDS.includes(stateView)) {
        setViewState(stateView);
      } else {
        const path = window.location.pathname.replace(/^\//, '').toLowerCase();
        setViewState(VIEW_IDS.includes(path) ? path : 'dashboard');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // 2. Auth State
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState('member');

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser(session.user);
          fetchUserRole(session.user.id);
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        const currentUser = session?.user || null;
        setUser(currentUser);
        if (currentUser) {
          fetchUserRole(currentUser.id);
        } else {
          setUserRole('member');
        }
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  const fetchUserRole = async (userId) => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
      if (data?.role) setUserRole(data.role);
    } catch {}
  };

  const handleSignOut = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setUserRole('member');
    setView('login');
    showToast('Signed out of workspace.');
  };

  // 3. Core State
  const [theme, setTheme] = useState(() => readLocal('theme', 'light'));
  const [tasks, setTasksState] = useState(() => readLocal('tasks', []));
  const [events, setEventsState] = useState(() => readLocal('events', []));
  const [leads, setLeadsState] = useState(() => readLocal('leads', defaultLeads));
  const [teamMembers, setTeamMembers] = useState(() => readLocal('team_members', defaultTeamMembers));
  const [campaigns, setCampaignsState] = useState(() => readLocal('campaigns', []));
  const [competitors, setCompetitorsState] = useState(() => readLocal('competitors', []));
  const [rules, setRulesState] = useState(() => readLocal('rules', []));
  const [assets, setAssets] = useState(() => readLocal('assets', []));
  const [connections, setConnections] = useState(() => readLocal('connections', {}));
  const [preferences, setPreferences] = useState(() => readLocal('preferences', { platform: 'LinkedIn', tone: 'Professional' }));

  const [taskSearch, setTaskSearch] = useState('');
  const [taskPriority, setTaskPriority] = useState('All');
  const [assetSearch, setAssetSearch] = useState('');
  const [assetTab, setAssetTab] = useState('All');
  const [analyticsRange, setAnalyticsRange] = useState(30);
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));

  const [studio, setStudio] = useState({
    file: null,
    url: null,
    platform: null,
    tone: null,
    notes: '',
    output: null,
    loading: false,
    variant: 0
  });

  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setIsToastVisible(true);
    setTimeout(() => setIsToastVisible(false), 3500);
  }, []);

  // Theme Sync
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    saveLocal('theme', theme);
    try { localStorage.setItem('wp_theme', theme); } catch {}
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // 4. Initial Fetch from Data Layer (Supabase or Local)
  useEffect(() => {
    let isMounted = true;
    dataLayer.fetchLeads().then(data => {
      if (isMounted && data?.length) setLeadsState(data);
    });
    dataLayer.fetchTeamMembers().then(data => {
      if (isMounted && data?.length) setTeamMembers(data);
    });
    return () => { isMounted = false; };
  }, [user]);

  // 5. Supabase Realtime Subscription for Leads
  useEffect(() => {
    if (!dataLayer.isOnline()) return;

    const unsubscribe = dataLayer.subscribeToChanges(
      'leads',
      (newLead) => {
        setLeadsState(prev => {
          if (prev.some(l => l.id === newLead.id)) return prev;
          return [newLead, ...prev];
        });
      },
      (updatedLead) => {
        setLeadsState(prev => prev.map(l => l.id === updatedLead.id ? { ...l, ...updatedLead } : l));
      },
      (deletedLead) => {
        setLeadsState(prev => prev.filter(l => l.id !== deletedLead.id));
      }
    );

    return () => unsubscribe();
  }, []);

  // 6. Optimistic Updates with Rollback
  const previousLeadsRef = useRef(leads);
  const setLeads = useCallback(async (actionOrValue) => {
    const nextLeads = typeof actionOrValue === 'function' ? actionOrValue(leads) : actionOrValue;
    previousLeadsRef.current = leads;
    setLeadsState(nextLeads);
    saveLocal('leads', nextLeads);

    // Check for Automations trigger
    checkAutomations(leads, nextLeads);

    if (dataLayer.isOnline()) {
      try {
        // Sync modified / added lead to Supabase
        const target = nextLeads.find((l, i) => JSON.stringify(l) !== JSON.stringify(leads[i])) || nextLeads[0];
        if (target) {
          await dataLayer.saveLead(target);
        }
      } catch (err) {
        console.error('Lead sync failed, rolling back:', err);
        setLeadsState(previousLeadsRef.current);
        saveLocal('leads', previousLeadsRef.current);
        showToast('Sync failed: changes were rolled back.');
      }
    }
  }, [leads, showToast]);

  // 7. Active Automation Engine
  const checkAutomations = (oldLeads, newLeads) => {
    const newLeadRule = rules.find(r => r.name === 'Welcome new leads' && r.enabled);
    const wonLeadRule = rules.find(r => r.name.toLowerCase().includes('won') || r.action.toLowerCase().includes('won'));

    // Check if a new lead was added
    if (newLeads.length > oldLeads.length) {
      const added = newLeads.find(l => !oldLeads.some(old => old.id === l.id));
      if (added && newLeadRule) {
        // Run automation: follow-up date 2 days out
        added.follow_up_date = dateOffset(2);
        dataLayer.addTimelineEntry({
          lead_id: added.id,
          title: '⚡ Automation: New lead follow-up created',
          note: 'Scheduled follow-up for 2 days out and generated welcome outreach reminder.',
          type: 'automation'
        });
        showToast(`⚡ Automation ran for new lead: ${added.name}`);
      }
    }

    // Check if moved to Won
    newLeads.forEach(nl => {
      const old = oldLeads.find(ol => ol.id === nl.id);
      if (old && old.stage !== 'Won' && nl.stage === 'Won') {
        dataLayer.addTimelineEntry({
          lead_id: nl.id,
          title: '🎉 Automation: Deal Won Celebration',
          note: `Lead closed for $${Number(nl.value || 0).toLocaleString()}! Initiated client onboarding flow.`,
          type: 'automation'
        });
        triggerCompletionConfetti();
        showToast(`🎉 Deal Won! Automation initiated onboarding for ${nl.name}`);
      }
    });
  };

  // State setters with local persistence
  const setTasks = useCallback((val) => {
    setTasksState(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      saveLocal('tasks', next);
      return next;
    });
  }, []);

  const setEvents = useCallback((val) => {
    setEventsState(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      saveLocal('events', next);
      return next;
    });
  }, []);

  const setCampaigns = useCallback((val) => {
    setCampaignsState(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      saveLocal('campaigns', next);
      return next;
    });
  }, []);

  const setCompetitors = useCallback((val) => {
    setCompetitorsState(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      saveLocal('competitors', next);
      return next;
    });
  }, []);

  const setRules = useCallback((val) => {
    setRulesState(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      saveLocal('rules', next);
      return next;
    });
  }, []);

  const resetAllData = () => {
    for (const name of ['theme', 'tasks', 'events', 'assets', 'connections', 'preferences', 'leads', 'campaigns', 'competitors', 'rules', 'team_members', 'wp_tasks', 'wp_theme']) {
      try { localStorage.removeItem(STORAGE_PREFIX + name); } catch {}
    }
    window.location.reload();
  };

  return {
    view, setView,
    user, userRole, handleSignOut,
    theme, setTheme, toggleTheme,
    tasks, setTasks,
    events, setEvents,
    assets, setAssets,
    connections, setConnections,
    preferences, setPreferences,
    leads, setLeads,
    teamMembers, setTeamMembers,
    campaigns, setCampaigns,
    competitors, setCompetitors,
    rules, setRules,
    taskSearch, setTaskSearch,
    taskPriority, setTaskPriority,
    assetSearch, setAssetSearch,
    assetTab, setAssetTab,
    analyticsRange, setAnalyticsRange,
    month, setMonth,
    studio, setStudio,
    toastMessage, isToastVisible, showToast,
    resetAllData
  };
}
