import React from 'react';
import { Icon } from './Icons';

export default function SocialHub({ state, showToast, openModal, setView }) {
  const { connections, setConnections, events } = state;

  const toggleConnection = (platform) => {
    setConnections(prev => {
      const isConnected = !!prev[platform];
      const updated = { ...prev, [platform]: !isConnected };
      showToast(`${platform} ${!isConnected ? 'connected' : 'disconnected'} in demo.`);
      return updated;
    });
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="eyebrow">Social Operations</div>
          <h1>Social Hub</h1>
          <p className="subtitle">One workspace. Every conversation.</p>
        </div>
        <div className="actions">
          <button className="btn" onClick={() => openModal('assistant')}>
            <Icon name="studio" /> Open Assistant
          </button>
        </div>
      </div>

      <div className="metrics">
        <div className="card metric">
          <div className="metric-top">
            <span>Connected accounts</span>
            <span className="metric-icon"><Icon name="social" /></span>
          </div>
          <strong>{Object.values(connections).filter(Boolean).length}</strong>
          <small>Active social channels</small>
        </div>

        <div className="card metric">
          <div className="metric-top">
            <span>Total followers</span>
            <span className="metric-icon"><Icon name="leads" /></span>
          </div>
          <strong>12.8k</strong>
          <small>Demo audience snapshot</small>
        </div>

        <div className="card metric">
          <div className="metric-top">
            <span>Engagement rate</span>
            <span className="metric-icon"><Icon name="analytics" /></span>
          </div>
          <strong>4.6%</strong>
          <small className="positive">↑ 0.8% this month</small>
        </div>

        <div className="card metric">
          <div className="metric-top">
            <span>Scheduled posts</span>
            <span className="metric-icon"><Icon name="calendar" /></span>
          </div>
          <strong>{events.length}</strong>
          <small>Your local content plan</small>
        </div>
      </div>

      <div className="three-col">
        {['Instagram', 'Facebook', 'LinkedIn'].map(platform => {
          const isConnected = !!connections[platform];
          const logo = platform === 'Instagram' ? '◎' : platform === 'Facebook' ? 'f' : 'in';
          return (
            <section key={platform} className="card">
              <div className="provider">
                <div className="provider-logo">{logo}</div>
                <div>
                  <h2>{platform}</h2>
                  <p>{platform === 'LinkedIn' ? 'Build your professional presence' : 'Connect with your community'}</p>
                </div>
              </div>

              <span className={`badge ${isConnected ? 'success' : ''}`}>
                {isConnected ? 'Connected · demo' : 'Not connected'}
              </span>

              <p className="connection-info">
                {isConnected
                  ? 'Jobgen.ai Marketing is connected in this browser’s demo.'
                  : 'Bring your posts and your audience into one view.'}
              </p>

              <button
                className={`btn ${isConnected ? '' : 'primary'}`}
                onClick={() => toggleConnection(platform)}
              >
                {isConnected ? 'Disconnect' : `Connect ${platform}`}
              </button>
            </section>
          );
        })}
      </div>

      <div className="two-col" style={{ marginTop: '22px' }}>
        <section className="card">
          <h2>Your channels, working together</h2>
          <p className="muted small-text">Keep each channel’s voice distinct while your brand stays consistent.</p>

          {events.slice(0, 3).map(e => (
            <div key={e.id} className="row">
              <div>
                <div className="row-title">{e.title}</div>
                <div className="row-meta">{e.platform} · {e.date}</div>
              </div>
              <span className="badge">Scheduled</span>
            </div>
          ))}

          <div style={{ marginTop: '16px' }}>
            <button className="btn small" onClick={() => setView('calendar')}>Plan your next post ↗</button>
          </div>
        </section>

        <div className="card smart">
          <div className="smart-icon"><Icon name="studio" /></div>
          <span className="eyebrow">A little clarity goes a long way</span>
          <h2>A stronger social rhythm</h2>
          <p>Find content ideas, refine your channel strategy and keep the conversation going.</p>
          <button className="btn primary" onClick={() => openModal('assistant')}>
            <Icon name="studio" /> Open Assistant
          </button>
        </div>
      </div>
    </div>
  );
}

