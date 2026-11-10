import React from 'react';
import { Icon } from './Icons';
import { today } from '../../hooks/useMarketingState';

export default function Dashboard({ state, setView, openModal }) {
  const priorityTasks = state.tasks.filter(t => t.priority === 'High').slice(0, 3);
  const upcomingEvents = state.events
    .slice()
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
    .slice(0, 3);

  const pipelineStages = [
    { label: 'New', count: 42, opacity: 1 },
    { label: 'Contacted', count: 36, opacity: 0.8 },
    { label: 'Qualified', count: 28, opacity: 0.6 },
    { label: 'Won', count: 22, opacity: 0.35 }
  ];

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="eyebrow">Your marketing workspace</div>
          <h1>Good morning, team ☀</h1>
          <p className="subtitle">Here’s what’s moving your marketing forward today.</p>
        </div>
        <div className="actions">
          <button className="btn primary" onClick={() => setView('studio')}>
            <Icon name="plus" /> Create content
          </button>
        </div>
      </div>

      <div className="metrics">
        <div className="card metric">
          <div className="metric-top">
            <span>Tasks due today</span>
            <span className="metric-icon"><Icon name="workboard" /></span>
          </div>
          <strong>{state.tasks.filter(t => t.due === today).length || 5}</strong>
          <small>2 high-priority tasks</small>
        </div>

        <div className="card metric">
          <div className="metric-top">
            <span>Scheduled posts</span>
            <span className="metric-icon"><Icon name="calendar" /></span>
          </div>
          <strong>{state.events.length}</strong>
          <small>Across 3 platforms</small>
        </div>

        <div className="card metric">
          <div className="metric-top">
            <span>New leads</span>
            <span className="metric-icon"><Icon name="leads" /></span>
          </div>
          <strong>{state.leads.length + 20}</strong>
          <small className="positive">↑ 12% from last week</small>
        </div>

        <div className="card metric">
          <div className="metric-top">
            <span>Active campaigns</span>
            <span className="metric-icon"><Icon name="campaigns" /></span>
          </div>
          <strong>{state.campaigns.filter(c => c.status === 'Active').length}</strong>
          <small>All systems moving</small>
        </div>
      </div>

      <div className="two-col">
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
                    <div className="row-meta">{t.assignee} · {t.due === today ? 'Due today' : t.due}</div>
                  </div>
                </div>
                <span className="badge error">{t.priority}</span>
              </div>
            ))
          ) : (
            <div className="empty">
              <Icon name="assets" />
              <h3>All caught up</h3>
              <p>Add your next task to the Workboard.</p>
            </div>
          )}
        </section>

        <section className="card brief">
          <div className="eyebrow"><Icon name="studio" /> Your daily advantage</div>
          <h2>AI Daily Brief</h2>
          <p>A focused start to a productive day.</p>
          <ul>
            <li>Finish the LinkedIn carousel before today’s review.</li>
            <li>Give 3 new qualified leads a personal follow-up.</li>
            <li>Your hiring insights posts are gaining momentum.</li>
          </ul>
          <button className="btn primary small" onClick={() => openModal('brief')}>
            Read full brief <Icon name="arrow" />
          </button>
          <p className="muted" style={{ fontSize: '9px', marginBottom: 0, marginTop: '12px' }}>
            Simulated insights based on demo data
          </p>
        </section>
      </div>

      <div className="two-col">
        <section className="card">
          <div className="card-head">
            <div>
              <h2>Upcoming posts</h2>
              <p>Your next moments in the spotlight.</p>
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
              <p>Plan your next post on the calendar.</p>
            </div>
          )}
        </section>

        <section className="card">
          <div className="card-head">
            <div>
              <h2>Lead pipeline</h2>
              <p>A healthy flow of new opportunities.</p>
            </div>
            <button className="btn small" onClick={() => setView('leads')}>View CRM ↗</button>
          </div>
          <span className="muted small-text">Total opportunities</span>
          <h1 style={{ marginTop: '8px' }}>
            128 <span className="positive" style={{ font: '10px Manrope' }}>↑ 18 this week</span>
          </h1>
          <div className="pipeline">
            {pipelineStages.map(stage => (
              <div key={stage.label}>
                <div className="pipeline-bar" style={{ opacity: stage.opacity }}></div>
                <strong>{stage.count}</strong>
                <small>{stage.label}</small>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
