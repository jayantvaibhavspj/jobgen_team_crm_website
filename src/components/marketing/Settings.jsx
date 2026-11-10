import React, { useState } from 'react';
import { Icon } from './Icons';
import { dataLayer } from '../../lib/data';
import { isSupabaseConfigured } from '../../lib/supabase';

export default function Settings({ state, openModal, showToast, setView }) {
  const {
    theme,
    toggleTheme,
    preferences,
    setPreferences,
    connections,
    setConnections,
    resetAllData,
    teamMembers = [],
    setTeamMembers,
    user,
    userRole
  } = state;

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [isImporting, setIsImporting] = useState(false);

  const isAdmin = userRole === 'admin';

  const toggleConnection = (platform) => {
    setConnections(prev => {
      const isConnected = !!prev[platform];
      const updated = { ...prev, [platform]: !isConnected };
      showToast(`${platform} ${!isConnected ? 'connected' : 'disconnected'}.`);
      return updated;
    });
  };

  const handleRoleChange = async (memberId, newRole) => {
    if (!isAdmin) {
      showToast('Only workspace admins can modify member roles.');
      return;
    }
    try {
      await dataLayer.updateMemberRole(memberId, newRole);
      setTeamMembers(prev => prev.map(m => m.id === memberId ? { ...m, role: newRole } : m));
      showToast('Team member role updated.');
    } catch (err) {
      showToast('Failed to update role: ' + err.message);
    }
  };

  const handleInvite = (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    const newMember = {
      id: `tm-${Date.now()}`,
      full_name: inviteEmail.split('@')[0],
      email: inviteEmail.trim(),
      role: inviteRole
    };

    setTeamMembers(prev => [...prev, newMember]);
    setInviteEmail('');
    showToast(`Invite sent to ${inviteEmail}.`);
  };

  const handleOneTimeImport = async () => {
    if (!isSupabaseConfigured) {
      showToast('Supabase is not configured in .env. Configure VITE_SUPABASE_URL first.');
      return;
    }
    if (!window.confirm('Upload your local data (leads, tasks, campaigns) to your shared Supabase workspace?')) {
      return;
    }

    setIsImporting(true);
    try {
      const res = await dataLayer.importLocalStorageToSupabase();
      showToast(`Successfully uploaded ${res.importedCount} items to Supabase!`);
    } catch (err) {
      showToast('Import error: ' + err.message);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="eyebrow">Workspace Configuration</div>
          <h1>Settings</h1>
          <p className="subtitle">Team collaboration, role management, cloud sync, and workspace preferences.</p>
        </div>
        <div className="actions">
          <button className="btn" onClick={() => openModal('assistant')}>
            <Icon name="studio" /> Open Assistant
          </button>
        </div>
      </div>

      {/* TEAM MEMBERS & ROLES */}
      <section className="card" style={{ marginBottom: '22px' }}>
        <div className="card-head">
          <div>
            <h2>Team Members & Access Control</h2>
            <p>Collaborate across shared leads, calendar posts, and sprint taskboards.</p>
          </div>
          <span className="badge primary">{teamMembers.length} Members</span>
        </div>

        <div className="crm-table-wrap">
          <table className="crm-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map(m => (
                <tr key={m.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="avatar" style={{ width: '26px', height: '26px', fontSize: '11px' }}>
                        {m.full_name?.slice(0, 2).toUpperCase() || 'TM'}
                      </span>
                      <b>{m.full_name}</b>
                    </div>
                  </td>
                  <td className="muted">{m.email}</td>
                  <td>
                    {isAdmin ? (
                      <select
                        value={m.role}
                        onChange={e => handleRoleChange(m.id, e.target.value)}
                        style={{ width: '110px', padding: '5px 8px' }}
                      >
                        <option value="admin">Admin</option>
                        <option value="member">Member</option>
                      </select>
                    ) : (
                      <span className={`badge ${m.role === 'admin' ? 'primary' : ''}`}>
                        {m.role}
                      </span>
                    )}
                  </td>
                  <td>
                    <span className="muted small-text">Active in workspace</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Invite Member Form */}
        <form onSubmit={handleInvite} style={{ marginTop: '20px', display: 'flex', gap: '10px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '220px' }}>
            <label>Invite teammate by email</label>
            <input
              type="email"
              placeholder="teammate@jobgen.ai"
              value={inviteEmail}
              onChange={e => setInviteEmail(e.target.value)}
              required
            />
          </div>

          <div style={{ width: '140px' }}>
            <label>Assigned role</label>
            <select value={inviteRole} onChange={e => setInviteRole(e.target.value)}>
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit" className="btn primary" style={{ height: '38px' }}>
            Send invite
          </button>
        </form>
      </section>

      {/* CLOUD MIGRATION / ONE-TIME IMPORT */}
      <section className="card" style={{ marginBottom: '22px' }}>
        <div className="card-head">
          <div>
            <h2>Cloud Synchronization (Supabase)</h2>
            <p>Upload offline demo records from your browser to the shared cloud database.</p>
          </div>
          <span className={`badge ${isSupabaseConfigured ? 'success' : 'warning'}`}>
            {isSupabaseConfigured ? 'Supabase Connected' : 'Offline / LocalStorage Mode'}
          </span>
        </div>

        <p className="muted small-text">
          Have existing demo leads, campaigns or tasks saved in this browser? Click below to migrate them to your Supabase workspace so your teammates can see them immediately.
        </p>

        <div style={{ marginTop: '16px' }}>
          <button
            type="button"
            className="btn primary"
            onClick={handleOneTimeImport}
            disabled={isImporting}
          >
            {isImporting ? 'Uploading to cloud...' : '✦ Import LocalStorage Data to Supabase'}
          </button>
        </div>
      </section>

      {/* PREFERENCES & INTEGRATIONS */}
      <div className="two-col equal">
        <section className="card">
          <h2>Preferences</h2>

          <div className="setting-row">
            <div>
              <h3>Appearance</h3>
              <p>Toggle light or dark interface theme.</p>
            </div>
            <select
              value={theme}
              onChange={toggleTheme}
              style={{ width: '145px' }}
            >
              <option value="light">Light Mode</option>
              <option value="dark">Dark Mode</option>
            </select>
          </div>

          <div className="setting-row">
            <div>
              <h3>Default platform</h3>
              <p>Preferred content channel.</p>
            </div>
            <select
              value={preferences.platform}
              onChange={e => {
                setPreferences(prev => ({ ...prev, platform: e.target.value }));
                showToast('Default platform updated.');
              }}
              style={{ width: '145px' }}
            >
              <option>LinkedIn</option>
              <option>Instagram</option>
              <option>Facebook</option>
            </select>
          </div>

          <div className="setting-row">
            <div>
              <h3>Brand tone</h3>
              <p>Default generative tone of voice.</p>
            </div>
            <select
              value={preferences.tone}
              onChange={e => {
                setPreferences(prev => ({ ...prev, tone: e.target.value }));
                showToast('Brand tone updated.');
              }}
              style={{ width: '145px' }}
            >
              <option>Professional</option>
              <option>Friendly</option>
              <option>Bold</option>
              <option>Inspirational</option>
            </select>
          </div>
        </section>

        <section className="card">
          <h2>Integrations</h2>
          {['Instagram', 'Facebook', 'LinkedIn', 'AI Assistant'].map(p => {
            const isConnected = !!connections[p];
            return (
              <div key={p} className="setting-row">
                <div>
                  <h3>{p}</h3>
                  <p>
                    {p === 'AI Assistant'
                      ? 'Simulated locally · prompt suggestions ready'
                      : isConnected ? 'Connected in workspace' : 'Not connected'}
                  </p>
                </div>
                {p === 'AI Assistant' ? (
                  <button className="btn small" onClick={() => openModal('assistant')}>Try assistant</button>
                ) : (
                  <button
                    className={`btn small ${isConnected ? '' : 'primary'}`}
                    onClick={() => toggleConnection(p)}
                  >
                    {isConnected ? 'Disconnect' : 'Connect'}
                  </button>
                )}
              </div>
            );
          })}
        </section>
      </div>

      <div className="two-col equal" style={{ marginTop: '22px' }}>
        <section className="card">
          <h2>Workspace Session</h2>
          <div className="setting-row">
            <div>
              <h3>{user?.email || 'Demo Workspace User'}</h3>
              <p>Role: {userRole.toUpperCase()}</p>
            </div>
            <button className="btn small" onClick={() => setView('login')}>Manage Auth</button>
          </div>
        </section>

        <section className="card">
          <h2>Reset Browser Data</h2>
          <p className="muted small-text">
            Clears local cached state and resets to initial defaults. Cloud records will remain in Supabase.
          </p>
          <button
            className="btn danger small"
            onClick={() => {
              if (window.confirm('Reset local demo cache?')) resetAllData();
            }}
          >
            Reset local cache
          </button>
        </section>
      </div>
    </div>
  );
}
