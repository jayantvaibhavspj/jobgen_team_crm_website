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
  const { tasks, setTasks, taskSearch, setTaskSearch, taskPriority, setTaskPriority } = state;
  const [draggingId, setDraggingId] = useState(null);

  const filtered = tasks.filter(t => {
    const matchesPriority = taskPriority === 'All' || t.priority === taskPriority;
    const matchesSearch = (t.title + ' ' + (t.description || '')).toLowerCase().includes(taskSearch.toLowerCase());
    return matchesPriority && matchesSearch;
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
          <p className="subtitle">Less scattered work. More meaningful progress.</p>
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
          <small>Your team’s shared work</small>
        </div>

        <div className="card metric">
          <div className="metric-top">
            <span>In progress</span>
            <span className="metric-icon"><Icon name="automations" /></span>
          </div>
          <strong>{tasks.filter(t => t.status === 'in_progress').length}</strong>
          <small>Moving things forward</small>
        </div>

        <div className="card metric">
          <div className="metric-top">
            <span>In review</span>
            <span className="metric-icon"><Icon name="studio" /></span>
          </div>
          <strong>{tasks.filter(t => t.status === 'review').length}</strong>
          <small>Ready for a second look</small>
        </div>

        <div className="card metric">
          <div className="metric-top">
            <span>Completed</span>
            <span className="metric-icon"><Icon name="dashboard" /></span>
          </div>
          <strong>{tasks.filter(t => t.status === 'done').length}</strong>
          <small>Small wins add up</small>
        </div>
      </div>

      <div className="toolbar">
        <div className="search">
          <Icon name="search" />
          <input
            type="search"
            placeholder="Search tasks"
            value={taskSearch}
            onChange={e => setTaskSearch(e.target.value)}
          />
        </div>

        <select
          value={taskPriority}
          onChange={e => setTaskPriority(e.target.value)}
          style={{ width: '160px' }}
        >
          <option>All</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
      </div>

      <div className="board-layout">
        <section className="card priority-panel">
          <h3>Priority Tasks</h3>
          <p className="muted small-text">Keep the important work close.</p>
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
              <p className="muted small-text">No high-priority tasks.</p>
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
                  <span>{name}</span>
                  <span className="badge">{columnTasks.length}</span>
                </div>

                {columnTasks.map(t => (
                  <article
                    key={t.id}
                    className="task"
                    draggable
                    onDragStart={e => handleDragStart(e, t.id)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className={`badge ${t.priority === 'High' ? 'error' : t.priority === 'Medium' ? 'warning' : ''}`}>
                        {t.priority}
                      </span>
                      <span className="muted" style={{ cursor: 'grab' }}>⠿</span>
                    </div>

                    <h3>{t.title}</h3>
                    {t.description && <p>{t.description}</p>}

                    <div className="task-foot">
                      <span>{t.assignee}</span>
                      <span>{t.due === today ? 'Today' : t.due}</span>
                    </div>

                    <div className="task-controls">
                      <select
                        value={t.status}
                        onChange={e => handleStatusChange(t.id, e.target.value)}
                      >
                        {statuses.map(([sid, sname]) => (
                          <option key={sid} value={sid}>{sname}</option>
                        ))}
                      </select>
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
                  </article>
                ))}

                <p className="muted" style={{ fontSize: '9px', textAlign: 'center', marginTop: '12px' }}>
                  Drop a task here
                </p>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
