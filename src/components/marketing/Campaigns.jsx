import React, { useState } from 'react';
import { Icon } from './Icons';
import CampaignDrawer from './CampaignDrawer';

export default function Campaigns({ state, openModal, showToast }) {
  const { campaigns, setCampaigns } = state;
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const filtered = campaigns.filter(c => statusFilter === 'All' || c.status === statusFilter);

  const totalBudget = campaigns.reduce((n, c) => n + Number(c.budget || 0), 0);
  const totalSpent = campaigns.reduce((n, c) => n + Number(c.spent || 0), 0);
  const activeCount = campaigns.filter(c => c.status === 'Active').length;

  const handleUpdate = (updated) => {
    setCampaigns(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  const handleDelete = (id) => {
    setCampaigns(prev => prev.filter(c => c.id !== id));
    showToast('Campaign deleted.');
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="eyebrow">Growth Engine</div>
          <h1>Campaigns</h1>
          <p className="subtitle">Execute targeted multi-channel growth campaigns.</p>
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
          <small>Growth initiatives</small>
        </div>

        <div className="card metric">
          <div className="metric-top">
            <span>Active</span>
            <span className="metric-icon"><Icon name="automations" /></span>
          </div>
          <strong>{activeCount}</strong>
          <small>Live in market</small>
        </div>

        <div className="card metric">
          <div className="metric-top">
            <span>Planned budget</span>
            <span className="metric-icon"><Icon name="analytics" /></span>
          </div>
          <strong>${totalBudget.toLocaleString()}</strong>
          <small>Total budget allocation</small>
        </div>

        <div className="card metric">
          <div className="metric-top">
            <span>Total Spent</span>
            <span className="metric-icon"><Icon name="check" /></span>
          </div>
          <strong>${totalSpent.toLocaleString()}</strong>
          <small className="positive">
            {totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}% deployed
          </small>
        </div>
      </div>

      <div className="toolbar">
        <div className="tabs">
          {['All', 'Active', 'Draft', 'Paused', 'Completed'].map(st => (
            <button
              key={st}
              className={`tab ${statusFilter === st ? 'active' : ''}`}
              onClick={() => setStatusFilter(st)}
            >
              {st} {st !== 'All' ? `(${campaigns.filter(c => c.status === st).length})` : ''}
            </button>
          ))}
        </div>
      </div>

      <div className="three-col">
        {filtered.map(c => {
          const spent = Number(c.spent || 0);
          const budget = Number(c.budget || 1);
          const burnRate = Math.min(100, Math.round((spent / budget) * 100));

          return (
            <article
              key={c.id}
              className="card campaign-card"
              onClick={() => setSelectedCampaign(c)}
              style={{ cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span className={`badge ${c.status === 'Active' ? 'success' : ''}`}>
                  {c.status}
                </span>
                <span className="muted" style={{ fontSize: '11px' }}>{c.platform}</span>
              </div>

              <h3 style={{ margin: '12px 0 6px' }}>{c.name}</h3>

              <div style={{ marginTop: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                  <span>Spend vs Budget</span>
                  <b>${spent.toLocaleString()} / ${budget.toLocaleString()}</b>
                </div>
                <div className="progress">
                  <i style={{ width: `${burnRate}%`, background: burnRate > 90 ? 'var(--error)' : 'var(--primary)' }}></i>
                </div>
              </div>

              <div className="campaign-stats" style={{ marginTop: '12px', marginBottom: 0 }}>
                <span>{c.progress || 0}% objective progress</span>
                <span className="badge small">{burnRate}% spent</span>
              </div>
            </article>
          );
        })}
      </div>

      <CampaignDrawer
        campaign={selectedCampaign}
        isOpen={Boolean(selectedCampaign)}
        onClose={() => setSelectedCampaign(null)}
        onUpdateCampaign={handleUpdate}
        onDeleteCampaign={handleDelete}
        showToast={showToast}
      />
    </div>
  );
}
