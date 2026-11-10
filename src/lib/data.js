import { supabase, isSupabaseConfigured } from './supabase';

const STORAGE_PREFIX = 'jobgen-vanilla:';

function readLocal(key, fallback) {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function writeLocal(key, value) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (err) {
    console.warn('localStorage write failed:', err);
  }
}

// Default seed data for offline / fallback mode
export const defaultLeads = [
  {
    id: 'lead-1',
    name: 'Olivia Martin',
    company: 'Northstar Talent',
    email: 'olivia@northstar.io',
    phone: '+1 (555) 234-5678',
    stage: 'New',
    value: 2400,
    probability: 20,
    source: 'LinkedIn',
    notes: 'Interested in executive search tooling.',
    assigned_to_name: 'Jayant Vaibhav',
    follow_up_date: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
    created_at: new Date(Date.now() - 5 * 86400000).toISOString()
  },
  {
    id: 'lead-2',
    name: 'James Wilson',
    company: 'Brightside HR',
    email: 'james@brightside.com',
    phone: '+1 (555) 987-6543',
    stage: 'Contacted',
    value: 3600,
    probability: 40,
    source: 'Website',
    notes: 'Demo booked for Thursday.',
    assigned_to_name: 'Sarah Connor',
    follow_up_date: new Date(Date.now() + 1 * 86400000).toISOString().split('T')[0],
    created_at: new Date(Date.now() - 10 * 86400000).toISOString()
  },
  {
    id: 'lead-3',
    name: 'Priya Shah',
    company: 'Orbit Technologies',
    email: 'priya@orbit.tech',
    phone: '+1 (555) 345-6789',
    stage: 'Qualified',
    value: 5200,
    probability: 70,
    source: 'Referral',
    notes: 'Contract review stage with legal.',
    assigned_to_name: 'Jayant Vaibhav',
    follow_up_date: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0],
    created_at: new Date(Date.now() - 15 * 86400000).toISOString()
  },
  {
    id: 'lead-4',
    name: 'Ethan Brooks',
    company: 'GrowthWorks',
    email: 'ethan@growthworks.co',
    phone: '+1 (555) 456-7890',
    stage: 'Won',
    value: 1800,
    probability: 100,
    source: 'Campaign',
    notes: 'Closed annual subscription.',
    assigned_to_name: 'Alex Rivera',
    follow_up_date: null,
    created_at: new Date(Date.now() - 20 * 86400000).toISOString()
  }
];

export const defaultTeamMembers = [
  { id: 'tm-1', full_name: 'Jayant Vaibhav', email: 'jayant@jobgen.ai', role: 'admin' },
  { id: 'tm-2', full_name: 'Sarah Connor', email: 'sarah@jobgen.ai', role: 'member' },
  { id: 'tm-3', full_name: 'Alex Rivera', email: 'alex@jobgen.ai', role: 'member' }
];

export const dataLayer = {
  // Check backend availability
  isOnline() {
    return isSupabaseConfigured && Boolean(supabase);
  },

  // LEADS
  async fetchLeads() {
    if (this.isOnline()) {
      const { data, error } = await supabase
        .from('leads')
        .select(`
          *,
          assigned_profile:assigned_to(id, full_name, email),
          creator:created_by(id, full_name)
        `)
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data.map(l => ({
          ...l,
          assigned_to_name: l.assigned_profile?.full_name || l.assigned_to_name || 'Unassigned'
        }));
      }
    }
    return readLocal('leads', defaultLeads);
  },

  async saveLead(lead) {
    if (this.isOnline()) {
      // Clean relational fields for insert/update
      const { assigned_profile, creator, assigned_to_name, ...cleanLead } = lead;
      if (cleanLead.id && !cleanLead.id.startsWith('id-') && !cleanLead.id.startsWith('lead-')) {
        const { data, error } = await supabase
          .from('leads')
          .update(cleanLead)
          .eq('id', cleanLead.id)
          .select()
          .single();
        if (error) throw error;
        return data;
      } else {
        delete cleanLead.id;
        const { data, error } = await supabase
          .from('leads')
          .insert(cleanLead)
          .select()
          .single();
        if (error) throw error;
        return data;
      }
    }
    const current = readLocal('leads', defaultLeads);
    const existingIndex = current.findIndex(l => l.id === lead.id);
    let updated;
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = { ...updated[existingIndex], ...lead };
    } else {
      updated = [{ ...lead, id: lead.id || `lead-${Date.now()}` }, ...current];
    }
    writeLocal('leads', updated);
    return lead;
  },

  async deleteLead(id) {
    if (this.isOnline() && !id.startsWith('lead-') && !id.startsWith('id-')) {
      const { error } = await supabase.from('leads').delete().eq('id', id);
      if (error) throw error;
      return true;
    }
    const current = readLocal('leads', defaultLeads);
    writeLocal('leads', current.filter(l => l.id !== id));
    return true;
  },

  // TIMELINE
  async fetchLeadTimeline(leadId) {
    if (this.isOnline() && !leadId.startsWith('lead-') && !leadId.startsWith('id-')) {
      const { data, error } = await supabase
        .from('lead_timeline')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false });
      if (!error && data) return data;
    }
    const all = readLocal('lead_timeline', []);
    return all.filter(item => item.lead_id === leadId);
  },

  async addTimelineEntry(entry) {
    if (this.isOnline() && entry.lead_id && !entry.lead_id.startsWith('lead-') && !entry.lead_id.startsWith('id-')) {
      const { data, error } = await supabase
        .from('lead_timeline')
        .insert(entry)
        .select()
        .single();
      if (!error && data) return data;
    }
    const current = readLocal('lead_timeline', []);
    const newEntry = { ...entry, id: `tl-${Date.now()}`, created_at: new Date().toISOString() };
    writeLocal('lead_timeline', [newEntry, ...current]);
    return newEntry;
  },

  // TEAM MEMBERS
  async fetchTeamMembers() {
    if (this.isOnline()) {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, role, avatar_url')
        .order('full_name', { ascending: true });
      if (!error && data && data.length > 0) return data;
    }
    return readLocal('team_members', defaultTeamMembers);
  },

  async updateMemberRole(profileId, newRole) {
    if (this.isOnline()) {
      const { data, error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', profileId)
        .select()
        .single();
      if (error) throw error;
      return data;
    }
    const members = readLocal('team_members', defaultTeamMembers).map(m =>
      m.id === profileId ? { ...m, role: newRole } : m
    );
    writeLocal('team_members', members);
    return { id: profileId, role: newRole };
  },

  // REALTIME SUBSCRIPTION
  subscribeToChanges(table, onInsert, onUpdate, onDelete) {
    if (!this.isOnline()) return () => {};

    const channel = supabase
      .channel(`realtime_${table}_${Date.now()}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table },
        (payload) => {
          if (payload.eventType === 'INSERT') onInsert?.(payload.new);
          if (payload.eventType === 'UPDATE') onUpdate?.(payload.new);
          if (payload.eventType === 'DELETE') onDelete?.(payload.old);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  // ONE-TIME IMPORT FROM LOCALSTORAGE TO SUPABASE
  async importLocalStorageToSupabase() {
    if (!this.isOnline()) {
      throw new Error('Supabase is not configured. Connect your Supabase project in .env first.');
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('You must be signed in to import data.');

    const { data: profile } = await supabase
      .from('profiles')
      .select('workspace_id')
      .eq('id', user.id)
      .single();

    const workspaceId = profile?.workspace_id;
    if (!workspaceId) throw new Error('Workspace not found for current user.');

    const localLeads = readLocal('leads', []);
    const localTasks = readLocal('tasks', []);
    const localEvents = readLocal('events', []);
    const localCampaigns = readLocal('campaigns', []);
    const localCompetitors = readLocal('competitors', []);

    let importedCount = 0;

    if (localLeads.length > 0) {
      const formattedLeads = localLeads.map(l => ({
        workspace_id: workspaceId,
        name: l.name,
        company: l.company,
        email: l.email || null,
        phone: l.phone || null,
        stage: ['New', 'Contacted', 'Qualified', 'Won', 'Lost'].includes(l.stage) ? l.stage : 'New',
        value: Number(l.value) || 0,
        probability: Number(l.probability) || 20,
        source: l.source || 'Website',
        notes: l.notes || '',
        created_by: user.id
      }));
      const { error } = await supabase.from('leads').insert(formattedLeads);
      if (!error) importedCount += formattedLeads.length;
    }

    if (localTasks.length > 0) {
      const formattedTasks = localTasks.map(t => ({
        workspace_id: workspaceId,
        title: t.title,
        description: t.description || '',
        priority: ['High', 'Medium', 'Low'].includes(t.priority) ? t.priority : 'Medium',
        status: ['backlog', 'todo', 'in_progress', 'review', 'done'].includes(t.status) ? t.status : 'todo',
        assignee: t.assignee || 'You',
        due: t.due || null,
        created_by: user.id
      }));
      const { error } = await supabase.from('tasks').insert(formattedTasks);
      if (!error) importedCount += formattedTasks.length;
    }

    return { importedCount };
  }
};
