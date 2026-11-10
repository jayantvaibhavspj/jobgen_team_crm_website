import React from 'react';
import { Icon } from './Icons';

export default function Settings({ state, openModal, showToast, setView }) {
  const { theme, toggleTheme, preferences, setPreferences, connections, setConnections, resetAllData } = state;

  const toggleConnection = (platform) => {
    setConnections(prev => {
      const isConnected = !!prev[platform];
      const updated = { ...prev, [platform]: !isConnected };
      showToast(`${platform} ${!isConnected ? 'connected' : 'disconnected'}.`);
      return updated;
    });
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all demo workspace data?')) {
      resetAllData();
    }
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="eyebrow">Workspace Preferences</div>
          <h1>Settings</h1>
          <p className="subtitle">A unified workspace that works the way you do.</p>
        </div>
        <div className="actions">
          <button className="btn" onClick={() => openModal('assistant')}>
            <Icon name="studio" /> Open Assistant
          </button>
        </div>
      </div>

      <div className="two-col equal">
        <section className="card">
          <h2>Preferences</h2>

          <div className="setting-row">
            <div>
              <h3>Appearance</h3>
              <p>A little light. A little focus.</p>
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
              <p>Start your next post here.</p>
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
              <p>Your go-to content voice.</p>
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
                      ? 'Simulated locally · no API key required'
                      : isConnected ? 'Connected in demo mode' : 'Not connected'}
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
          <h2>Workspace</h2>
          <div className="setting-row">
            <div>
              <h3>Jobgen.ai Marketing & Workflow Planner</h3>
              <p>Unified Marketing CRM and Daily Sprint Planner</p>
            </div>
            <span className="badge success">Single Unified App</span>
          </div>

          <div className="setting-row">
            <div>
              <h3>Demo Sign-in</h3>
              <p>View the sign-in and profile screen.</p>
            </div>
            <button className="btn small" onClick={() => setView('login')}>Open login</button>
          </div>
        </section>

        <section className="card">
          <h2>Your browser data</h2>
          <p className="muted small-text">
            Tasks, events, planner items, metadata and preferences stay securely in this browser.
          </p>
          <button className="btn danger small" onClick={handleReset}>
            Reset demo data
          </button>
        </section>
      </div>
    </div>
  );
}
