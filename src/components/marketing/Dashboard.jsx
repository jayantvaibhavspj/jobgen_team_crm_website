import React from 'react';
import { Icon } from './Icons';
import { today } from '../../hooks/useMarketingState';

export default function Dashboard({ state, setView, openModal }) {
  const { tasks = [], events = [], leads = [], campaigns = [] } = state;

  const priorityTasks = tasks.filter(t => t.priority === 'High' && t.status !== 'done').slice(0, 3);
  const upcomingEvents = events
    .slice()
    .sort((a, b) => ((a.date || '') + (a.time || '')).localeCompare((b.date || '') + (b.time || '')))
    .slice(0, 3);

  // Real pipeline breakdown
  const stages = ['New', 'Contacted', 'Qualified', 'Won'];
  const stageCounts = {
    New: leads.filter(l => l.stage === 'New').length,
    Contacted: leads.filter(l => l.stage === 'Contacted').length,
    Qualified: leads.filter(l => l.stage === 'Qualified').length,
    Won: leads.filter(l => l.stage === 'Won').length
  };

  const totalPipelineValue = leads
    .filter(l => l.stage !== 'Lost')
    .reduce((sum, l) => sum + Number(l.value || 0), 0);

  const weightedForecast = leads
    .filter(l => l.stage !== 'Lost')
    .reduce((sum, l) => {
      const prob = l.stage === 'Won' ? 100 : Number(l.probability || 20);
      return sum + (Number(l.value || 0) * prob) / 100;
    }, 0);

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="eyebrow">Your team workspace</div>
          <h1>Good morning, team ☀</h1>
          <p className="subtitle">Realtime team pipeline, scheduled campaigns, and priority tasks.</p>
        </div>
        <div className="actions">
          <button className="btn small" onClick={() => setView('leads')}>
            <Icon name="leads" /> View CRM
          </button>
          <button className="btn primary" onClick={() => setView('studio')}>
            <Icon name="plus" /> Create content
          </button>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="metrics">
        <div className="card metric">
          <div className="metric-top">
            <span>Tasks due today</span>
            <span className="metric-icon"><Icon name="workboard" /></span>
          </div>
          <strong>{tasks.filter(t => t.due === today && t.status !== 'done').length}</strong>
          <small>{tasks.filter(t => t.priority === 'High').length} high-priority</small>
        </div>

        <div className="card metric">
          <div className="metric-top">
            <span>Scheduled posts</span>
            <span className="metric-icon"><Icon name="calendar" /></span>
          </div>
          <strong>{events.length}</strong>
          <small>Across active platforms</small>
        </div>

        <div className="card metric">
          <div className="metric-top">
            <span>Active Leads</span>
            <span className="metric-icon"><Icon name="leads" /></span>
          </div>
          <strong>{leads.filter(l => l.stage !== 'Lost').length}</strong>
          <small className="positive">Weighted: ${Math.round(weightedForecast).toLocaleString()}</small>
        </div>

        <div className="card metric">
          <div className="metric-top">
            <span>Active campaigns</span>
            <span className="metric-icon"><Icon name="campaigns" /></span>
          </div>
          <strong>{campaigns.filter(c => c.status === 'Active').length}</strong>
          <small>In market now</small>
        </div>
      </div>

      <div className="two-col">
        {/* Priority Work */}
        <section className="card">
          <div className="card-head">
            <div>
              <h2>Priority work</h2>
              <p>The tasks that deserve your attention first.</p>
            </div>
            <button className="btn small" onClick={() => setView('workboard')}>View board ↗</button>
          </div>
          {priorityTasks.length > 0 ? (
            priorityTasks.map(t => (
              <div key={t.id} className="row">
                <div className="row-left">
                  <span className="check-dot"><Icon name="check" /></span>
                  <div>
                    <div className="row-title">{t.title}</div>
                    <div className="row-meta">{t.assignee || 'You'} · {t.due === today ? 'Due today' : t.due || 'No date'}</div>
                  </div>
                </div>
                <span className="badge error">{t.priority}</span>
              </div>
            ))
          ) : (
            <div className="empty">
              <Icon name="workboard" />
              <h3>All caught up</h3>
              <p>No high-priority tasks pending. Add tasks to the Workboard.</p>
            </div>
          )}
        </section>

        {/* AI Brief */}
        <section className="card brief">
          <div className="eyebrow"><Icon name="studio" /> Your daily advantage</div>
          <h2>AI Daily Brief</h2>
          <p>A focused start to a productive team day.</p>
          <ul>
            <li>Follow up with qualified opportunities in the Lead CRM.</li>
            <li>Review scheduled posts for LinkedIn and Instagram.</li>
            <li>Collaborative sprint board is active in the Workflow Planner.</li>
          </ul>
          <button className="btn primary small" onClick={() => openModal('brief')}>
            Read full brief <Icon name="arrow" />
          </button>
          <p className="muted" style={{ fontSize: '9px', marginBottom: 0, marginTop: '12px' }}>
            Actionable workspace intelligence
          </p>
        </section>
      </div>

      <div className="two-col">
        {/* Upcoming Posts */}
        <section className="card">
          <div className="card-head">
            <div>
              <h2>Upcoming posts</h2>
              <p>Next scheduled brand communications.</p>
            </div>
            <button className="btn small" onClick={() => setView('calendar')}>Open calendar ↗</button>
          </div>
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map(e => (
              <div key={e.id} className="row">
                <div className="row-left">
                  <span className="metric-icon"><Icon name="calendar" /></span>
                  <div>
                    <div className="row-title">{e.title}</div>
                    <div className="row-meta">{e.platform} · {e.date} · {e.time}</div>
                  </div>
                </div>
                <span className="badge">Scheduled</span>
              </div>
            ))
          ) : (
            <div className="empty">
              <Icon name="calendar" />
              <h3>No scheduled posts</h3>
              <p>Schedule your next content post on the calendar.</p>
            </div>
          )}
        </section>

        {/* Real Lead Pipeline */}
        <section className="card">
          <div className="card-head">
            <div>
              <h2>Lead pipeline</h2>
              <p>Active deals and stage distribution.</p>
            </div>
            <button className="btn small" onClick={() => setView('leads')}>View CRM ↗</button>
          </div>
          <span className="muted small-text">Gross pipeline value</span>
          <h1 style={{ marginTop: '8px' }}>
            ${totalPipelineValue.toLocaleString()}{' '}
            <span className="positive" style={{ font: '11px Manrope', fontWeight: 700 }}>
              (Forecast: ${Math.round(weightedForecast).toLocaleString()})
            </span>
          </h1>

          <div className="pipeline">
            {stages.map((stage, idx) => {
              const opacities = [1, 0.8, 0.6, 0.4];
              return (
                <div key={stage}>
                  <div className="pipeline-bar" style={{ opacity: opacities[idx] }}></div>
                  <strong>{stageCounts[stage] || 0}</strong>
                  <small>{stage}</small>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
