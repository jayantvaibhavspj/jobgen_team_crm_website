import React from 'react';
import { Icon } from './Icons';

export default function Campaigns({ state, openModal, showToast }) {
  const { campaigns, setCampaigns } = state;

  const totalBudget = campaigns.reduce((n, c) => n + Number(c.budget || 0), 0);
  const activeCount = campaigns.filter(c => c.status === 'Active').length;
  const completedCount = campaigns.filter(c => c.status === 'Completed').length;

  const handleStatusChange = (id, newStatus) => {
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
    showToast(`Campaign status updated to ${newStatus}.`);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this campaign?')) {
      setCampaigns(prev => prev.filter(c => c.id !== id));
      showToast('Campaign deleted.');
    }
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="eyebrow">Growth Engine</div>
          <h1>Campaigns</h1>
          <p className="subtitle">Give your next big idea a clear direction.</p>
        </div>
        <div className="actions">
          <button className="btn primary" onClick={() => openModal('campaign-new')}>
            <Icon name="plus" /> New campaign
          </button>
        </div>
      </div>

      <div className="metrics">
        <div className="card metric">
          <div className="metric-top">
            <span>Total campaigns</span>
            <span className="metric-icon"><Icon name="campaigns" /></span>
          </div>
          <strong>{campaigns.length}</strong>
          <small>Ideas with a plan</small>
        </div>

        <div className="card metric">
          <div className="metric-top">
            <span>Active</span>
            <span className="metric-icon"><Icon name="automations" /></span>
          </div>
          <strong>{activeCount}</strong>
          <small>Making an impact</small>
        </div>

        <div className="card metric">
          <div className="metric-top">
            <span>Planned budget</span>
            <span className="metric-icon"><Icon name="analytics" /></span>
          </div>
          <strong>${totalBudget.toLocaleString()}</strong>
          <small>Local demo budgets</small>
        </div>

        <div className="card metric">
          <div className="metric-top">
            <span>Completed</span>
            <span className="metric-icon"><Icon name="check" /></span>
          </div>
          <strong>{completedCount}</strong>
          <small>A moment to celebrate</small>
        </div>
      </div>

      <div className="three-col">
        {campaigns.map(c => (
          <article key={c.id} className="card campaign-card">
            <span className={`badge ${c.status === 'Active' ? 'success' : ''}`}>
              {c.status}
            </span>
            <h3>{c.name}</h3>
            <p className="muted small-text">{c.platform} · Brand awareness</p>

            <div className="progress">
              <i style={{ width: `${c.progress || 0}%` }}></i>
            </div>

            <div className="campaign-stats">
              <span>{c.progress || 0}% plan progress</span>
              <span>${Number(c.budget || 0).toLocaleString()} budget</span>
            </div>

            <div className="field">
              <label>Status</label>
              <select
                value={c.status}
                onChange={e => handleStatusChange(c.id, e.target.value)}
              >
                <option>Draft</option>
                <option>Active</option>
                <option>Paused</option>
                <option>Completed</option>
              </select>
            </div>

            <div className="actions">
              <button className="btn small" onClick={() => openModal('campaign-edit', c)}>Edit campaign</button>
              <button className="icon-btn" onClick={() => handleDelete(c.id)} title="Delete campaign">
                <Icon name="trash" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
