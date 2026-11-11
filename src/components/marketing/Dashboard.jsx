import React from 'react';
import {
  CheckSquare,
  Calendar,
  Users,
  Sparkles,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { today } from '../../hooks/useMarketingState';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';

export default function Dashboard({ state, setView, openModal }) {
  const { tasks = [], events = [], leads = [] } = state;

  // 1. Time-of-day greeting
  const currentHour = new Date().getHours();
  let timeGreeting = 'Good morning';
  if (currentHour >= 12 && currentHour < 17) {
    timeGreeting = 'Good afternoon';
  } else if (currentHour >= 17) {
    timeGreeting = 'Good evening';
  }

  // 2. State filtering
  // Tasks: due today or overdue, not done
  const tasksDueOrOverdue = tasks.filter(t => t.status !== 'done' && (t.due === today || t.due < today));
  const tasksSorted = [...tasksDueOrOverdue].sort((a, b) => {
    if (a.due < today && b.due >= today) return -1;
    if (b.due < today && a.due >= today) return 1;
    return (a.due || '').localeCompare(b.due || '');
  });

  // Lead follow-ups: leads with follow_up_date <= today or Qualified/New needing touch
  const leadsDueOrOverdue = leads.filter(l => {
    if (l.stage === 'Won' || l.stage === 'Lost') return false;
    if (l.follow_up_date) {
      return l.follow_up_date <= today;
    }
    // If no explicit follow-up date, prioritize Qualified or New
    return l.stage === 'Qualified';
  });

  // Posts today
  const postsToday = events.filter(e => e.date === today);

  // Total actionable items today
  const totalActionCount = tasksDueOrOverdue.length + leadsDueOrOverdue.length + postsToday.length;

  // Open leads total (all active stages)
  const openLeadsCount = leads.filter(l => l.stage !== 'Won' && l.stage !== 'Lost').length;

  // 3. Upcoming posts (next 4 after today)
  const upcomingPosts = events
    .filter(e => e.date > today)
    .sort((a, b) => ((a.date || '') + (a.time || '')).localeCompare((b.date || '') + (b.time || '')))
    .slice(0, 4);

  // Friendly date formatter
  const formatFriendlyDate = (dateStr) => {
    if (!dateStr) return '';
    if (dateStr === today) return 'Today';
    
    // Check if tomorrow
    const d = new Date(dateStr + 'T00:00:00');
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    if (d.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }

    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  // 4. Lead Pipeline breakdown
  const stages = ['New', 'Contacted', 'Qualified', 'Won'];
  const stageCounts = {
    New: leads.filter(l => l.stage === 'New').length,
    Contacted: leads.filter(l => l.stage === 'Contacted').length,
    Qualified: leads.filter(l => l.stage === 'Qualified').length,
    Won: leads.filter(l => l.stage === 'Won').length
  };
  const totalLeadsInStages = Math.max(1, leads.length);

  return (
    <div className="dash-root">
      {/* 1. Header */}
      <header className="dash-header">
        <div className="dash-header-text">
          <h1 className="dash-greeting">{timeGreeting}</h1>
          <p className="dash-subheading">
            You have {totalActionCount} {totalActionCount === 1 ? 'thing' : 'things'} to do today.
          </p>
        </div>

        <div className="dash-header-actions">
          <Button
            variant="secondary"
            size="md"
            icon={<Sparkles size={16} />}
            onClick={() => setView('studio')}
          >
            Create content
          </Button>
          <Button
            variant="secondary"
            size="md"
            icon={<Users size={16} />}
            onClick={() => openModal('lead-new')}
          >
            Add lead
          </Button>
          <Button
            variant="primary"
            size="md"
            icon={<Plus size={16} />}
            onClick={() => openModal('task-new')}
          >
            Add task
          </Button>
        </div>
      </header>

      {/* 2. Stat Strip: ONE card split into 4 clickable cells */}
      <section className="dash-stat-strip-card" aria-label="Key metrics">
        <button
          type="button"
          className="dash-stat-cell-btn"
          onClick={() => setView('workboard')}
          title="Open Workboard"
        >
          <span className="dash-stat-cell-label">Tasks due</span>
          <span className="dash-stat-cell-value">{tasksDueOrOverdue.length}</span>
          <span className="dash-stat-cell-sub">
            {tasksDueOrOverdue.some(t => t.due < today) ? (
              <span className="dash-status-alert">
                <AlertTriangle size={12} /> Overdue tasks
              </span>
            ) : (
              'Due today or earlier'
            )}
          </span>
        </button>

        <button
          type="button"
          className="dash-stat-cell-btn"
          onClick={() => setView('leads')}
          title="Open Lead CRM"
        >
          <span className="dash-stat-cell-label">Follow-ups due</span>
          <span className="dash-stat-cell-value">{leadsDueOrOverdue.length}</span>
          <span className="dash-stat-cell-sub">Pipeline contacts</span>
        </button>

        <button
          type="button"
          className="dash-stat-cell-btn"
          onClick={() => setView('calendar')}
          title="Open Content Calendar"
        >
          <span className="dash-stat-cell-label">Posts today</span>
          <span className="dash-stat-cell-value">{postsToday.length}</span>
          <span className="dash-stat-cell-sub">Scheduled releases</span>
        </button>

        <button
          type="button"
          className="dash-stat-cell-btn"
          onClick={() => setView('leads')}
          title="Open Lead CRM"
        >
          <span className="dash-stat-cell-label">Open leads</span>
          <span className="dash-stat-cell-value">{openLeadsCount}</span>
          <span className="dash-stat-cell-sub">Active in pipeline</span>
        </button>
      </section>

      {/* 3. Two columns (~60 / 40) */}
      <div className="dash-columns-grid">
        {/* Left Column: Card "Today" */}
        <section className="dash-card dash-today-card" aria-label="Today items">
          <div className="dash-card-header">
            <div className="dash-card-header-left">
              <h2 className="dash-card-title">Today</h2>
              <Badge variant="primary" size="sm">{totalActionCount}</Badge>
            </div>
          </div>

          <div className="dash-card-body dash-today-body">
            {totalActionCount === 0 ? (
              <div className="dash-caught-up-state">
                <CheckCircle2 size={36} className="dash-caught-up-icon" />
                <h3 className="dash-caught-up-title">You are all caught up</h3>
                <p className="dash-caught-up-desc">
                  No overdue tasks, immediate follow-ups, or posts pending for today.
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => openModal('task-new')}
                >
                  Add a new task
                </Button>
              </div>
            ) : (
              <>
                {/* Group 1: Tasks */}
                <div className="dash-group-section">
                  <div className="dash-group-header">
                    <div className="dash-group-title-wrap">
                      <CheckSquare size={15} className="dash-group-icon" />
                      <span className="dash-group-title">Tasks</span>
                      <span className="dash-group-count">{tasksDueOrOverdue.length}</span>
                    </div>
                    <button
                      type="button"
                      className="dash-link-btn"
                      onClick={() => setView('workboard')}
                    >
                      Open board <ArrowRight size={13} />
                    </button>
                  </div>

                  <div className="dash-group-list">
                    {tasksSorted.length > 0 ? (
                      tasksSorted.slice(0, 4).map(task => {
                        const isOverdue = task.due && task.due < today;
                        return (
                          <div key={task.id} className="dash-item-row">
                            <div className="dash-item-main">
                              <span className="dash-item-title">{task.title}</span>
                              <div className="dash-item-meta">
                                <span>{task.assignee || 'Unassigned'}</span>
                                {task.priority && (
                                  <>
                                    <span>·</span>
                                    <span>{task.priority} priority</span>
                                  </>
                                )}
                              </div>
                            </div>

                            <div className="dash-item-aside">
                              {isOverdue ? (
                                <Badge variant="danger" size="sm">Overdue</Badge>
                              ) : (
                                <span className="dash-item-due">Today</span>
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="dash-empty-line">No tasks due today.</p>
                    )}
                  </div>
                </div>

                <div className="dash-divider" />

                {/* Group 2: Lead Follow-ups */}
                <div className="dash-group-section">
                  <div className="dash-group-header">
                    <div className="dash-group-title-wrap">
                      <Users size={15} className="dash-group-icon" />
                      <span className="dash-group-title">Lead follow-ups</span>
                      <span className="dash-group-count">{leadsDueOrOverdue.length}</span>
                    </div>
                    <button
                      type="button"
                      className="dash-link-btn"
                      onClick={() => setView('leads')}
                    >
                      Open CRM <ArrowRight size={13} />
                    </button>
                  </div>

                  <div className="dash-group-list">
                    {leadsDueOrOverdue.length > 0 ? (
                      leadsDueOrOverdue.slice(0, 4).map(lead => {
                        const isOverdue = lead.follow_up_date && lead.follow_up_date < today;
                        return (
                          <div key={lead.id} className="dash-item-row">
                            <div className="dash-item-lead-left">
                              <Avatar name={lead.name} size="sm" />
                              <div className="dash-item-main">
                                <span className="dash-item-title">{lead.name}</span>
                                <div className="dash-item-meta">
                                  <span>{lead.company || 'Direct'}</span>
                                  {lead.value && (
                                    <>
                                      <span>·</span>
                                      <span>${Number(lead.value).toLocaleString()}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="dash-item-aside">
                              {isOverdue ? (
                                <Badge variant="danger" size="sm">Overdue</Badge>
                              ) : (
                                <Badge variant="secondary" size="sm">{lead.stage}</Badge>
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="dash-empty-line">No follow-ups due today.</p>
                    )}
                  </div>
                </div>

                <div className="dash-divider" />

                {/* Group 3: Posts Today */}
                <div className="dash-group-section">
                  <div className="dash-group-header">
                    <div className="dash-group-title-wrap">
                      <Calendar size={15} className="dash-group-icon" />
                      <span className="dash-group-title">Posts today</span>
                      <span className="dash-group-count">{postsToday.length}</span>
                    </div>
                    <button
                      type="button"
                      className="dash-link-btn"
                      onClick={() => setView('calendar')}
                    >
                      Open calendar <ArrowRight size={13} />
                    </button>
                  </div>

                  <div className="dash-group-list">
                    {postsToday.length > 0 ? (
                      postsToday.slice(0, 4).map(post => (
                        <div key={post.id} className="dash-item-row">
                          <div className="dash-item-main">
                            <span className="dash-item-title">{post.title}</span>
                            <div className="dash-item-meta">
                              <Badge variant="primary" size="xs">{post.platform}</Badge>
                              <span>{post.time || 'Scheduled'}</span>
                            </div>
                          </div>

                          <div className="dash-item-aside">
                            <span className="dash-item-due">Ready</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="dash-empty-line">No posts scheduled for today.</p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Right Column: Two cards */}
        <div className="dash-right-col">
          {/* Card 1: Upcoming posts */}
          <section className="dash-card" aria-label="Upcoming posts">
            <div className="dash-card-header">
              <div className="dash-card-header-left">
                <h2 className="dash-card-title">Upcoming posts</h2>
                <span className="dash-card-count-sub">Next scheduled</span>
              </div>
              <button
                type="button"
                className="dash-link-btn"
                onClick={() => setView('calendar')}
              >
                Open calendar <ArrowRight size={13} />
              </button>
            </div>

            <div className="dash-card-body">
              {upcomingPosts.length > 0 ? (
                <div className="dash-upcoming-list">
                  {upcomingPosts.map(post => (
                    <div key={post.id} className="dash-upcoming-row">
                      <div className="dash-upcoming-info">
                        <span className="dash-upcoming-title">{post.title}</span>
                        <div className="dash-upcoming-meta">
                          <Badge variant="secondary" size="xs">{post.platform}</Badge>
                          <span>{post.time || ''}</span>
                        </div>
                      </div>
                      <span className="dash-upcoming-date">
                        {formatFriendlyDate(post.date)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="dash-empty-line">No upcoming posts scheduled.</p>
              )}
            </div>
          </section>

          {/* Card 2: Lead pipeline */}
          <section className="dash-card" aria-label="Lead pipeline breakdown">
            <div className="dash-card-header">
              <div className="dash-card-header-left">
                <h2 className="dash-card-title">Lead pipeline</h2>
                <span className="dash-card-count-sub">Status distribution</span>
              </div>
              <button
                type="button"
                className="dash-link-btn"
                onClick={() => setView('leads')}
              >
                Open CRM <ArrowRight size={13} />
              </button>
            </div>

            <div className="dash-card-body">
              <div className="dash-pipeline-list">
                {stages.map(stage => {
                  const count = stageCounts[stage] || 0;
                  const pct = Math.round((count / totalLeadsInStages) * 100);

                  let barColor = 'var(--primary)';
                  if (stage === 'Contacted') barColor = 'var(--color-info)';
                  if (stage === 'Qualified') barColor = 'var(--color-warning)';
                  if (stage === 'Won') barColor = 'var(--color-success)';

                  return (
                    <div key={stage} className="dash-pipeline-item">
                      <div className="dash-pipeline-label-row">
                        <span className="dash-pipeline-stage-name">{stage}</span>
                        <span className="dash-pipeline-stage-count">
                          {count} {count === 1 ? 'lead' : 'leads'}
                        </span>
                      </div>
                      <div className="dash-pipeline-bar-track">
                        <div
                          className="dash-pipeline-bar-fill"
                          style={{
                            width: `${Math.max(6, pct)}%`,
                            backgroundColor: barColor
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
