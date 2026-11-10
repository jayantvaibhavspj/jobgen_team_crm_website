import { useState, useEffect } from 'react';

const key = name => `jobgen-vanilla:${name}`;
function read(name, fallback) {
  try {
    const val = localStorage.getItem(key(name));
    return val !== null ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}
function save(name, value) {
  try {
    localStorage.setItem(key(name), JSON.stringify(value));
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

const defaultTasks = [
  { id: 'task-1', title: 'Finalize LinkedIn carousel copy', description: 'Refine the hooks and CTA for our hiring insights carousel.', status: 'review', priority: 'High', assignee: 'Sarah', due: today },
  { id: 'task-2', title: 'Review Instagram reel concepts', description: 'Choose the strongest creative direction for this week.', status: 'in_progress', priority: 'High', assignee: 'Alex', due: today },
  { id: 'task-3', title: 'Prepare October campaign brief', description: 'Align messaging, audience and creative deliverables.', status: 'todo', priority: 'Medium', assignee: 'You', due: dateOffset(1) }
];

const defaultEvents = [
  { id: 'event-1', title: 'Hiring insights carousel', platform: 'LinkedIn', date: today, time: '09:30', caption: 'Great teams start with a better hiring experience.' },
  { id: 'event-2', title: 'Behind the scenes at Jobgen', platform: 'Instagram', date: dateOffset(1), time: '14:00', caption: 'Meet the people making hiring more human.' },
  { id: 'event-3', title: 'Product spotlight', platform: 'Facebook', date: dateOffset(3), time: '11:00', caption: 'A smarter way to connect talent and opportunity.' }
];

const defaultLeads = [
  { id: 'lead-1', name: 'Olivia Martin', company: 'Northstar Talent', stage: 'New', value: 2400 },
  { id: 'lead-2', name: 'James Wilson', company: 'Brightside HR', stage: 'Contacted', value: 3600 },
  { id: 'lead-3', name: 'Priya Shah', company: 'Orbit Technologies', stage: 'Qualified', value: 5200 },
  { id: 'lead-4', name: 'Ethan Brooks', company: 'GrowthWorks', stage: 'Won', value: 1800 }
];

const defaultCampaigns = [
  { id: 'campaign-1', name: 'The future of hiring', status: 'Active', platform: 'LinkedIn', progress: 68, budget: 2400 },
  { id: 'campaign-2', name: 'Meet your next opportunity', status: 'Active', platform: 'Instagram', progress: 42, budget: 1800 },
  { id: 'campaign-3', name: 'Talent without limits', status: 'Draft', platform: 'Facebook', progress: 15, budget: 1200 }
];

const defaultCompetitors = [
  { id: 'competitor-1', name: 'TalentFlow', url: 'https://example.com', notes: 'Focuses on hiring teams and recruitment insights.' },
  { id: 'competitor-2', name: 'Hirewise', url: 'https://example.com', notes: 'Product-led storytelling and career advice.' }
];

const defaultRules = [
  { id: 'rule-1', name: 'Welcome new leads', trigger: 'New lead added', action: 'Prepare a welcome message', enabled: true, runs: 24 },
  { id: 'rule-2', name: 'Content review reminder', trigger: 'Task moved to Review', action: 'Prepare a review reminder', enabled: true, runs: 12 },
  { id: 'rule-3', name: 'Weekly performance digest', trigger: 'Every Monday at 09:00', action: 'Prepare analytics summary', enabled: false, runs: 4 }
];

export function useMarketingState() {
  const [view, setView] = useState('dashboard');
  const [theme, setTheme] = useState(() => read('theme', 'light'));
  const [tasks, setTasks] = useState(() => read('tasks', defaultTasks));
  const [events, setEvents] = useState(() => read('events', defaultEvents));
  const [assets, setAssets] = useState(() => read('assets', []));
  const [connections, setConnections] = useState(() => read('connections', {}));
  const [preferences, setPreferences] = useState(() => read('preferences', { platform: 'LinkedIn', tone: 'Professional' }));
  const [leads, setLeads] = useState(() => read('leads', defaultLeads));
  const [campaigns, setCampaigns] = useState(() => read('campaigns', defaultCampaigns));
  const [competitors, setCompetitors] = useState(() => read('competitors', defaultCompetitors));
  const [rules, setRules] = useState(() => read('rules', defaultRules));

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

  // Sync theme
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    save('theme', theme);
    try {
      localStorage.setItem('wp_theme', theme);
    } catch {}
  }, [theme]);

  // Persist items
  useEffect(() => { save('tasks', tasks); }, [tasks]);
  useEffect(() => { save('events', events); }, [events]);
  useEffect(() => { save('assets', assets); }, [assets]);
  useEffect(() => { save('connections', connections); }, [connections]);
  useEffect(() => { save('preferences', preferences); }, [preferences]);
  useEffect(() => { save('leads', leads); }, [leads]);
  useEffect(() => { save('campaigns', campaigns); }, [campaigns]);
  useEffect(() => { save('competitors', competitors); }, [competitors]);
  useEffect(() => { save('rules', rules); }, [rules]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setIsToastVisible(true);
    setTimeout(() => setIsToastVisible(false), 3500);
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const resetAllData = () => {
    for (const name of ['theme', 'tasks', 'events', 'assets', 'connections', 'preferences', 'leads', 'campaigns', 'competitors', 'rules', 'profile', 'wp_tasks', 'wp_theme']) {
      try { localStorage.removeItem(key(name)); } catch {}
    }
    window.location.reload();
  };

  return {
    view, setView,
    theme, setTheme, toggleTheme,
    tasks, setTasks,
    events, setEvents,
    assets, setAssets,
    connections, setConnections,
    preferences, setPreferences,
    leads, setLeads,
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
