import React, { useState } from 'react';
import { Icon } from './Icons';
import { today } from '../../hooks/useMarketingState';

const statuses = [
  ['backlog', 'Backlog'],
  ['todo', 'To Do'],
  ['in_progress', 'In Progress'],
  ['review', 'Review'],
  ['done', 'Done']
];

export default function Workboard({ state, openModal, showToast }) {
  const { tasks, setTasks, taskSearch, setTaskSearch, taskPriority, setTaskPriority, teamMembers = [] } = state;
  const [draggingId, setDraggingId] = useState(null);
  const [assigneeFilter, setAssigneeFilter] = useState('All');

  const filtered = tasks.filter(t => {
    const matchesPriority = taskPriority === 'All' || t.priority === taskPriority;
    const matchesSearch = (t.title + ' ' + (t.description || '')).toLowerCase().includes(taskSearch.toLowerCase());
    const matchesAssignee = assigneeFilter === 'All' || t.assignee === assigneeFilter;
    return matchesPriority && matchesSearch && matchesAssignee;
  });

  const handleStatusChange = (id, newStatus) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    const statusLabel = statuses.find(s => s[0] === newStatus)?.[1] || newStatus;
    showToast(`Task moved to ${statusLabel}.`);
  };

  const handleDeleteTask = (id) => {
    if (window.confirm('Delete this task?')) {
      setTasks(prev => prev.filter(t => t.id !== id));
      showToast('Task deleted.');
    }
  };

  const handleDragStart = (e, id) => {
    setDraggingId(id);
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, statusId) => {
    e.preventDefault();
    const id = draggingId || e.dataTransfer.getData('text/plain');
    if (id) {
      handleStatusChange(id, statusId);
    }
    setDraggingId(null);
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="eyebrow">Task Execution</div>
          <h1>Workboard</h1>
          <p className="subtitle">Collaborative team task board with assignee filters and priorities.</p>
        </div>
        <div className="actions">
          <button className="btn primary" onClick={() => openModal('task-new')}>
            <Icon name="plus" /> New task
          </button>
        </div>
      </div>

      <div className="metrics">
        <div className="card metric">
          <div className="metric-top">
            <span>Total tasks</span>
            <span className="metric-icon"><Icon name="workboard" /></span>
          </div>
          <strong>{tasks.length}</strong>
          <small>Shared workspace tasks</small>
        </div>

        <div className="card metric">
          <div className="metric-top">
            <span>In progress</span>
            <span className="metric-icon"><Icon name="automations" /></span>
          </div>
          <strong>{tasks.filter(t => t.status === 'in_progress').length}</strong>
          <small>Active sprint tasks</small>
        </div>

        <div className="card metric">
          <div className="metric-top">
            <span>In review</span>
            <span className="metric-icon"><Icon name="studio" /></span>
          </div>
          <strong>{tasks.filter(t => t.status === 'review').length}</strong>
          <small>Pending review</small>
        </div>

        <div className="card metric">
          <div className="metric-top">
            <span>Completed</span>
            <span className="metric-icon"><Icon name="dashboard" /></span>
          </div>
          <strong>{tasks.filter(t => t.status === 'done').length}</strong>
          <small>Closed tasks</small>
        </div>
      </div>

      <div className="toolbar">
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="search">
            <Icon name="search" />
            <input
              type="search"
              placeholder="Search tasks, descriptions..."
              value={taskSearch}
              onChange={e => setTaskSearch(e.target.value)}
            />
          </div>

          <select
            value={taskPriority}
            onChange={e => setTaskPriority(e.target.value)}
            style={{ width: '150px' }}
          >
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={assigneeFilter}
            onChange={e => setAssigneeFilter(e.target.value)}
            style={{ width: '160px' }}
          >
            <option value="All">All Assignees</option>
            <option value="You">You</option>
            {teamMembers.map(m => (
              <option key={m.id} value={m.full_name}>{m.full_name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="board-layout">
        <section className="card priority-panel">
          <h3>Priority Tasks</h3>
          <p className="muted small-text">Keep high-impact deliverables front and center.</p>
          <div className="priority-list">
            {tasks.filter(t => t.priority === 'High' && t.status !== 'done').map(t => (
              <div key={t.id} className="row">
                <div>
                  <div className="row-title">{t.title}</div>
                  <div className="row-meta">{t.assignee} · {t.due}</div>
                  <div style={{ marginTop: '9px' }}>
                    <button className="btn small" onClick={() => openModal('task-edit', t)}>Edit task</button>
                  </div>
                </div>
              </div>
            ))}
            {tasks.filter(t => t.priority === 'High' && t.status !== 'done').length === 0 && (
              <p className="muted small-text">No pending high-priority tasks.</p>
            )}
          </div>
        </section>

        <div className="board" aria-label="Task board">
          {statuses.map(([id, name]) => {
            const columnTasks = filtered.filter(t => t.status === id);
            return (
              <section
                key={id}
                className="column"
                onDragOver={handleDragOver}
                onDrop={e => handleDrop(e, id)}
              >
                <div className="column-head">
                  <span style={{ fontWeight: 800 }}>{name}</span>
                  <span className="badge">{columnTasks.length}</span>
                </div>

                {columnTasks.map(t => (
                  <article
                    key={t.id}
                    className="card task"
                    draggable
                    onDragStart={e => handleDragStart(e, t.id)}
                    style={{ cursor: 'grab' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className={`badge ${t.priority === 'High' ? 'error' : t.priority === 'Medium' ? 'warning' : ''}`}>
                        {t.priority}
                      </span>
                      <span className="badge" style={{ fontSize: '9px' }}>{t.assignee || 'You'}</span>
                    </div>

                    <h3 style={{ margin: '8px 0 4px', fontSize: '13px' }}>{t.title}</h3>
                    {t.description && <p style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>{t.description}</p>}

                    <div className="task-foot">
                      <span className="muted" style={{ fontSize: '10px' }}>Due: {t.due === today ? 'Today' : t.due || 'No date'}</span>
                      <div className="actions">
                        <button
                          className="icon-btn"
                          onClick={() => openModal('task-edit', t)}
                          title="Edit task"
                        >
                          <Icon name="edit" />
                        </button>
                        <button
                          className="icon-btn"
                          onClick={() => handleDeleteTask(t.id)}
                          title="Delete task"
                        >
                          <Icon name="trash" />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}

                {columnTasks.length === 0 && (
                  <p className="muted small-text" style={{ textAlign: 'center', marginTop: '24px' }}>
                    Drop tasks here
                  </p>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
