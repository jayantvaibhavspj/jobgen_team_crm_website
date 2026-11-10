import React from 'react';
import { Icon } from './Icons';

export default function CompetitorRadar({ state, openModal, showToast }) {
  const { competitors, setCompetitors } = state;

  const handleDelete = (id) => {
    if (window.confirm('Delete this competitor?')) {
      setCompetitors(prev => prev.filter(c => c.id !== id));
      showToast('Competitor removed from watchlist.');
    }
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="eyebrow">Market Intelligence</div>
          <h1>Competitor Radar</h1>
          <p className="subtitle">Stay curious. Keep your own edge.</p>
        </div>
        <div className="actions">
          <button className="btn primary" onClick={() => openModal('competitor-new')}>
            <Icon name="plus" /> Add competitor
          </button>
        </div>
      </div>

      <div className="metrics">
        <div className="card metric">
          <div className="metric-top">
            <span>Tracking</span>
            <span className="metric-icon"><Icon name="competitors" /></span>
          </div>
          <strong>{competitors.length}</strong>
          <small>Brands on your radar</small>
        </div>

        <div className="card metric">
          <div className="metric-top">
            <span>Content signals</span>
            <span className="metric-icon"><Icon name="studio" /></span>
          </div>
          <strong>18</strong>
          <small>Mock activity this week</small>
        </div>

        <div className="card metric">
          <div className="metric-top">
            <span>Avg. engagement</span>
            <span className="metric-icon"><Icon name="analytics" /></span>
          </div>
          <strong>3.2%</strong>
          <small>Demo comparison</small>
        </div>

        <div className="card metric">
          <div className="metric-top">
            <span>Opportunities</span>
            <span className="metric-icon"><Icon name="automations" /></span>
          </div>
          <strong>6</strong>
          <small>Ideas worth exploring</small>
        </div>
      </div>

      <div className="two-col">
        <section className="card">
          <div className="card-head">
            <div>
              <h2>Market watchlist</h2>
              <p>Local notes and mock activity. No live tracking.</p>
            </div>
          </div>

          {competitors.length > 0 ? (
            competitors.map(c => (
              <div key={c.id} className="row">
                <div>
                  <h3>{c.name}</h3>
                  <p className="muted small-text" style={{ marginBottom: 0 }}>{c.notes}</p>
                  <div className="row-meta">
                    <a href={c.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                      {c.url}
                    </a>
                  </div>
                </div>
                <button className="icon-btn" onClick={() => handleDelete(c.id)} title="Delete competitor">
                  <Icon name="trash" />
                </button>
              </div>
            ))
          ) : (
            <div className="empty">
              <Icon name="competitors" />
              <h3>A fresh perspective starts here</h3>
              <p>Add a brand to your watchlist.</p>
            </div>
          )}
        </section>

        <div className="card smart">
          <div className="smart-icon"><Icon name="studio" /></div>
          <span className="eyebrow">Competitive Intelligence</span>
          <h2>Turn signals into ideas</h2>
          <p>Look for storytelling patterns and gaps your brand can thoughtfully fill.</p>
          <button className="btn primary" onClick={() => openModal('assistant')}>
            <Icon name="studio" /> Open Assistant
          </button>
        </div>
      </div>
    </div>
  );
}
