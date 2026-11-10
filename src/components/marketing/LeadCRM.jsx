import React from 'react';
import { Icon } from './Icons';

const stages = ['New', 'Contacted', 'Qualified', 'Won'];

export default function LeadCRM({ state, openModal, showToast }) {
  const { leads, setLeads } = state;

  const totalValue = leads.reduce((sum, l) => sum + Number(l.value || 0), 0);
  const qualifiedCount = leads.filter(l => l.stage === 'Qualified').length;
  const wonCount = leads.filter(l => l.stage === 'Won').length;

  const handleStageChange = (id, newStage) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, stage: newStage } : l));
    showToast(`Lead stage updated to ${newStage}.`);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this lead?')) {
      setLeads(prev => prev.filter(l => l.id !== id));
      showToast('Lead deleted.');
    }
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="eyebrow">Customer Acquisition</div>
          <h1>Lead CRM</h1>
          <p className="subtitle">Build relationships, not just a list.</p>
        </div>
        <div className="actions">
          <button className="btn primary" onClick={() => openModal('lead-new')}>
            <Icon name="plus" /> Add lead
          </button>
        </div>
      </div>

      <div className="metrics">
        <div className="card metric">
          <div className="metric-top">
            <span>Total leads</span>
            <span className="metric-icon"><Icon name="leads" /></span>
          </div>
          <strong>{leads.length}</strong>
          <small>Local pipeline records</small>
        </div>

        <div className="card metric">
          <div className="metric-top">
            <span>Qualified</span>
            <span className="metric-icon"><Icon name="check" /></span>
          </div>
          <strong>{qualifiedCount}</strong>
          <small>Ready for a conversation</small>
        </div>

        <div className="card metric">
          <div className="metric-top">
            <span>Pipeline value</span>
            <span className="metric-icon"><Icon name="analytics" /></span>
          </div>
          <strong>${totalValue.toLocaleString()}</strong>
          <small>Estimated opportunity</small>
        </div>

        <div className="card metric">
          <div className="metric-top">
            <span>Won</span>
            <span className="metric-icon"><Icon name="campaigns" /></span>
          </div>
          <strong>{wonCount}</strong>
          <small>Relationships converted</small>
        </div>
      </div>

      <div className="lead-board">
        {stages.map(stage => {
          const stageLeads = leads.filter(l => l.stage === stage);
          return (
            <section key={stage} className="lead-column">
              <div className="column-head">
                <span>{stage}</span>
                <span className="badge">{stageLeads.length}</span>
              </div>

              {stageLeads.map(lead => (
                <article key={lead.id} className="card lead-card">
                  <h3>{lead.name}</h3>
                  <p>{lead.company}</p>
                  <strong>${Number(lead.value || 0).toLocaleString()}</strong>

                  <div style={{ marginTop: '13px' }}>
                    <select
                      value={lead.stage}
                      onChange={e => handleStageChange(lead.id, e.target.value)}
                    >
                      {stages.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div className="actions" style={{ marginTop: '10px' }}>
                    <button className="btn small" onClick={() => openModal('lead-edit', lead)}>Edit</button>
                    <button className="icon-btn" onClick={() => handleDelete(lead.id)} title="Delete lead">
                      <Icon name="trash" />
                    </button>
                  </div>
                </article>
              ))}

              {stageLeads.length === 0 && (
                <p className="muted small-text" style={{ textAlign: 'center', marginTop: '20px' }}>
                  No leads in {stage}
                </p>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
