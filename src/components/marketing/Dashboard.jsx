import React from 'react';
import {
  CheckSquare,
  Calendar,
  Users,
  Megaphone,
  Sparkles,
  ArrowRight,
  Plus,
  Clock,
  CheckCircle2,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { today } from '../../hooks/useMarketingState';
import { PageHeader } from '../ui/PageHeader';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import { EmptyState } from '../ui/EmptyState';

export default function Dashboard({ state, setView, openModal }) {
  const { tasks = [], events = [], leads = [], campaigns = [] } = state;

  // Filter tasks due today or high priority
  const todayTasks = tasks.filter(t => (t.due === today || t.priority === 'High') && t.status !== 'done');
  const priorityTasks = tasks.filter(t => t.priority === 'High' && t.status !== 'done').slice(0, 4);

  // Filter posts scheduled today or upcoming
  const todayEvents = events.filter(e => e.date === today);
  const upcomingEvents = events
    .slice()
    .sort((a, b) => ((a.date || '') + (a.time || '')).localeCompare((b.date || '') + (b.time || '')))
    .slice(0, 4);

  // Filter leads that need follow-up (Qualified or New)
  const actionLeads = leads.filter(l => l.stage === 'Qualified' || l.stage === 'New').slice(0, 3);

  // Pipeline calculations
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

  const activeCampaigns = campaigns.filter(c => c.status === 'Active');

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="dash-container">
      {/* Page Header */}
      <PageHeader
        eyebrow="Workspace Overview"
        title="Good morning, team"
        description="Here is what needs your attention and action today."
        actions={
          <>
            <Button
              variant="secondary"
              size="md"
              icon={<Users size={15} />}
              onClick={() => setView('leads')}
            >
              View CRM
            </Button>
            <Button
              variant="secondary"
              size="md"
              icon={<Sparkles size={15} />}
              onClick={() => setView('studio')}
            >
              Create content
            </Button>
            <Button
              variant="primary"
              size="md"
              icon={<Plus size={15} />}
              onClick={() => openModal('task-new')}
            >
              Add task
            </Button>
          </>
        }
      />

      {/* Hero Section: "Today" Action Center */}
      <section className="dash-today-hero" aria-label="Today action center">
        <div className="dash-today-header">
          <div className="dash-today-title-wrap">
            <span className="dash-today-badge">
              <Clock size={12} />
              Today
            </span>
            <span className="dash-today-date">{formattedDate}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
              {todayTasks.length} urgent tasks · {todayEvents.length} posts going out
            </span>
          </div>
        </div>

        <div className="dash-today-grid">
          {/* Column 1: Tasks Due Today */}
          <div className="dash-today-col">
            <div className="dash-col-head">
              <span className="dash-col-title">
                <CheckSquare size={16} style={{ color: 'var(--primary)' }} />
                Tasks Due Today
              </span>
              <span className="dash-col-count">{todayTasks.length}</span>
            </div>

            <div className="dash-today-list">
              {todayTasks.length > 0 ? (
                todayTasks.slice(0, 3).map(task => (
                  <div key={task.id} className="dash-today-item">
                    <Avatar name={task.assignee || 'You'} size="xs" />
                    <div className="dash-today-item-content">
                      <div className="dash-today-item-title">{task.title}</div>
                      <div className="dash-today-item-meta">
                        <Badge variant={task.priority === 'High' ? 'danger' : 'warning'} dot>
                          {task.priority}
                        </Badge>
                        <span>{task.due === today ? 'Today' : task.due}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState
                  icon={<CheckCircle2 size={18} />}
                  title="All caught up"
                  description="No pending tasks due today."
                  action={
                    <Button variant="ghost" size="sm" onClick={() => openModal('task-new')}>
                      Add task
                    </Button>
                  }
                  style={{ padding: '24px 16px', margin: 0 }}
                />
              )}
            </div>

            {todayTasks.length > 3 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setView('workboard')}
                style={{ marginTop: 'var(--space-3)', width: '100%', justifyContent: 'center' }}
              >
                View all {todayTasks.length} tasks <ArrowRight size={13} />
              </Button>
            )}
          </div>

          {/* Column 2: Content Going Out */}
          <div className="dash-today-col">
            <div className="dash-col-head">
              <span className="dash-col-title">
                <Calendar size={16} style={{ color: 'var(--primary)' }} />
                Content Going Out
              </span>
              <span className="dash-col-count">{todayEvents.length || upcomingEvents.length}</span>
            </div>

            <div className="dash-today-list">
              {(todayEvents.length > 0 ? todayEvents : upcomingEvents).slice(0, 3).map(event => (
                <div key={event.id} className="dash-today-item">
                  <div className="dash-today-item-content">
                    <div className="dash-today-item-title">{event.title}</div>
                    <div className="dash-today-item-meta">
                      <Badge variant="primary">{event.platform}</Badge>
                      <span>{event.time || '09:00'} · {event.date === today ? 'Today' : event.date}</span>
                    </div>
                  </div>
                </div>
              ))}

              {events.length === 0 && (
                <EmptyState
                  icon={<Calendar size={18} />}
                  title="No scheduled posts"
                  description="Keep your brand active with scheduled content."
                  action={
                    <Button variant="ghost" size="sm" onClick={() => openModal('event-new')}>
                      Schedule post
                    </Button>
                  }
                  style={{ padding: '24px 16px', margin: 0 }}
                />
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView('calendar')}
              style={{ marginTop: 'var(--space-3)', width: '100%', justifyContent: 'center' }}
            >
              Open calendar <ArrowRight size={13} />
            </Button>
          </div>

          {/* Column 3: Leads & Deals To Action */}
          <div className="dash-today-col">
            <div className="dash-col-head">
              <span className="dash-col-title">
                <Users size={16} style={{ color: 'var(--primary)' }} />
                High-Impact Leads
              </span>
              <span className="dash-col-count">{actionLeads.length}</span>
            </div>

            <div className="dash-today-list">
              {actionLeads.length > 0 ? (
                actionLeads.map(lead => (
                  <div key={lead.id} className="dash-today-item">
                    <Avatar name={lead.name} size="xs" />
                    <div className="dash-today-item-content">
                      <div className="dash-today-item-title">{lead.name}</div>
                      <div className="dash-today-item-meta">
                        <span>{lead.company}</span>
                        <span>·</span>
                        <strong style={{ color: 'var(--text-primary)' }}>
                          ${Number(lead.value || 0).toLocaleString()}
                        </strong>
                      </div>
                    </div>
                    <Badge variant={lead.stage === 'Qualified' ? 'success' : 'info'}>
                      {lead.stage}
                    </Badge>
                  </div>
                ))
              ) : (
                <EmptyState
                  icon={<Users size={18} />}
                  title="Pipeline clean"
                  description="No urgent leads requiring follow-up."
                  action={
                    <Button variant="ghost" size="sm" onClick={() => openModal('lead-new')}>
                      Add lead
                    </Button>
                  }
                  style={{ padding: '24px 16px', margin: 0 }}
                />
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView('leads')}
              style={{ marginTop: 'var(--space-3)', width: '100%', justifyContent: 'center' }}
            >
              View full CRM <ArrowRight size={13} />
            </Button>
          </div>
        </div>
      </section>

      {/* Quieter KPI Stat Strip */}
      <section className="dash-stats-strip" aria-label="Key performance indicators">
        <div className="dash-stat-cell">
          <div className="dash-stat-top">
            <span className="dash-stat-label">Tasks Due Today</span>
            <CheckSquare size={16} className="dash-stat-icon" />
          </div>
          <div className="dash-stat-value">
            {tasks.filter(t => t.due === today && t.status !== 'done').length}
          </div>
          <div className="dash-stat-sub">
            {tasks.filter(t => t.status === 'in_progress').length} in progress · {tasks.filter(t => t.status === 'done').length} completed
          </div>
        </div>

        <div className="dash-stat-cell">
          <div className="dash-stat-top">
            <span className="dash-stat-label">Scheduled Posts</span>
            <Calendar size={16} className="dash-stat-icon" />
          </div>
          <div className="dash-stat-value">{events.length}</div>
          <div className="dash-stat-sub">Across LinkedIn, Instagram & Facebook</div>
        </div>

        <div className="dash-stat-cell">
          <div className="dash-stat-top">
            <span className="dash-stat-label">Pipeline Value</span>
            <TrendingUp size={16} className="dash-stat-icon" />
          </div>
          <div className="dash-stat-value">${totalPipelineValue.toLocaleString()}</div>
          <div className="dash-stat-sub positive">
            Forecast: ${Math.round(weightedForecast).toLocaleString()}
          </div>
        </div>

        <div className="dash-stat-cell">
          <div className="dash-stat-top">
            <span className="dash-stat-label">Active Campaigns</span>
            <Megaphone size={16} className="dash-stat-icon" />
          </div>
          <div className="dash-stat-value">{activeCampaigns.length}</div>
          <div className="dash-stat-sub">
            {campaigns.length} total marketing initiatives
          </div>
        </div>
      </section>

      {/* Secondary Main Grid */}
      <div className="dash-main-grid">
        {/* Left Column: Priority Work & AI Daily Brief */}
        <div>
          {/* Priority Work Section */}
          <section className="dash-section-card">
            <div className="dash-card-header">
              <div className="dash-card-header-left">
                <h3 className="dash-card-title">Priority Work</h3>
                <p className="dash-card-subtitle">High-priority tasks requiring team focus</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setView('workboard')}>
                View board <ArrowRight size={13} />
              </Button>
            </div>

            <div className="dash-card-body">
              {priorityTasks.length > 0 ? (
                priorityTasks.map(t => (
                  <div key={t.id} className="dash-row-item">
                    <div className="dash-row-left">
                      <Avatar name={t.assignee || 'Team'} size="sm" />
                      <div className="dash-row-info">
                        <div className="dash-row-title">{t.title}</div>
                        <div className="dash-row-meta">
                          {t.assignee || 'You'} · {t.due === today ? 'Due today' : t.due || 'No date'}
                        </div>
                      </div>
                    </div>
                    <Badge variant={t.priority === 'High' ? 'danger' : 'warning'}>
                      {t.priority}
                    </Badge>
                  </div>
                ))
              ) : (
                <EmptyState
                  icon={<CheckCircle2 size={18} />}
                  title="No high-priority tasks"
                  description="All critical tasks are currently handled."
                  action={
                    <Button variant="secondary" size="sm" onClick={() => openModal('task-new')}>
                      Create a task
                    </Button>
                  }
                />
              )}
            </div>
          </section>

          {/* AI Focus Brief */}
          <section className="dash-ai-brief-card">
            <div className="dash-ai-brief-eyebrow">
              <Sparkles size={14} />
              Strategic Intelligence
            </div>
            <h3 className="dash-ai-brief-title">AI Daily Brief</h3>
            <ul className="dash-ai-brief-list">
              <li>Follow up with qualified opportunities in the Lead CRM to maintain pipeline momentum.</li>
              <li>Review scheduled posts for LinkedIn and Instagram before afternoon distribution.</li>
              <li>Workflow sprint board has 2 pending items rolled over from yesterday.</li>
            </ul>
            <Button
              variant="secondary"
              size="sm"
              iconRight={<ArrowRight size={13} />}
              onClick={() => openModal('brief')}
            >
              Read full intelligence brief
            </Button>
          </section>
        </div>

        {/* Right Column: Lead Pipeline & Upcoming Posts */}
        <div>
          {/* Lead Pipeline */}
          <section className="dash-section-card">
            <div className="dash-card-header">
              <div className="dash-card-header-left">
                <h3 className="dash-card-title">Lead Pipeline</h3>
                <p className="dash-card-subtitle">Active opportunities across deal stages</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setView('leads')}>
                View CRM <ArrowRight size={13} />
              </Button>
            </div>

            <div className="dash-card-body">
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Gross Pipeline Value</span>
                <strong style={{ fontSize: 'var(--text-lg)', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                  ${totalPipelineValue.toLocaleString()}
                </strong>
              </div>

              {/* Pipeline bar visualization */}
              <div style={{ display: 'flex', gap: '6px', height: '10px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: 'var(--bg-subtle)', marginBottom: 'var(--space-4)' }}>
                {stages.map((stage, idx) => {
                  const count = stageCounts[stage] || 0;
                  const total = leads.length || 1;
                  const pct = Math.max(5, (count / total) * 100);
                  const colors = ['var(--primary)', 'var(--color-info)', 'var(--color-warning)', 'var(--color-success)'];
                  return (
                    <div
                      key={stage}
                      title={`${stage}: ${count} leads`}
                      style={{
                        width: `${pct}%`,
                        background: colors[idx],
                        borderRadius: '2px',
                        transition: 'width var(--transition-normal)'
                      }}
                    />
                  );
                })}
              </div>

              {/* Stage breakdown */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-2)', textAlign: 'center' }}>
                {stages.map(stage => (
                  <div key={stage} style={{ padding: '8px 4px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                      {stageCounts[stage] || 0}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {stage}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Upcoming Schedule */}
          <section className="dash-section-card">
            <div className="dash-card-header">
              <div className="dash-card-header-left">
                <h3 className="dash-card-title">Upcoming Schedule</h3>
                <p className="dash-card-subtitle">Next scheduled brand communications</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setView('calendar')}>
                Calendar <ArrowRight size={13} />
              </Button>
            </div>

            <div className="dash-card-body">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map(e => (
                  <div key={e.id} className="dash-row-item">
                    <div className="dash-row-left">
                      <div className="dash-row-info">
                        <div className="dash-row-title">{e.title}</div>
                        <div className="dash-row-meta">
                          {e.platform} · {e.date} at {e.time || '09:00'}
                        </div>
                      </div>
                    </div>
                    <Badge variant="default">Scheduled</Badge>
                  </div>
                ))
              ) : (
                <EmptyState
                  icon={<Calendar size={18} />}
                  title="No upcoming posts"
                  description="Plan your next moment in the spotlight."
                  action={
                    <Button variant="secondary" size="sm" onClick={() => openModal('event-new')}>
                      Schedule a post
                    </Button>
                  }
                />
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
