import React from 'react';
import { AlertCircle, ArrowDownRight, Check, Trash2, Edit2, Paperclip } from 'lucide-react';
import { formatPeriodLabel } from '../utils/dateUtils';

export default function YesterdayPendingSection({
  overdueTasks,
  yesterdayPeriodKey,
  yesterdayLabel,
  scope,
  onToggle,
  onEdit,
  onDelete,
  onRollOver,
  onRollOverAll
}) {
  if (!overdueTasks || overdueTasks.length === 0) return null;

  // Check if tasks are specifically from yesterday or mixed
  const isDayScope = scope === 'day';
  const yesterdayTasks = isDayScope
    ? overdueTasks.filter((t) => t.period === yesterdayPeriodKey)
    : [];
  const olderTasks = isDayScope
    ? overdueTasks.filter((t) => t.period !== yesterdayPeriodKey)
    : overdueTasks;

  // User requested exact title: "Yesterday Task Pending"
  const headerTitle = isDayScope ? 'Yesterday Task Pending' : 'Pending From Previous Periods';

  return (
    <div className="yesterday-card">
      <div className="yesterday-header">
        <div className="yesterday-title-wrap">
          <div className="yesterday-icon">
            <AlertCircle size={16} />
          </div>
          <div className="yesterday-text">
            <h3>{headerTitle}</h3>
            {isDayScope && yesterdayLabel && (
              <span className="yesterday-date-tag">From {yesterdayLabel}</span>
            )}
            <span className="yesterday-count-tag">{overdueTasks.length} pending</span>
          </div>
        </div>

        <button
          className="btn-move-all"
          onClick={() => onRollOverAll(overdueTasks)}
          title="Move all pending tasks to today's list"
        >
          <ArrowDownRight size={13} />
          Move All to Today
        </button>
      </div>

      <div className="task-list">
        {overdueTasks.map((task, idx) => (
          <div key={task.id} className="task-row yesterday-task-row">
            {/* Direct checkmark */}
            <label className="custom-checkbox">
              <input
                type="checkbox"
                checked={Boolean(task.done)}
                onChange={() => onToggle(task.id)}
              />
              <div className="checkbox-mark">
                {task.done && <Check size={12} strokeWidth={2.5} stroke="#ffffff" />}
              </div>
            </label>

            <span className="task-index">{idx + 1}.</span>

            <div className="task-content">
              <div className="task-title">{task.title}</div>
              <div className="task-meta">
                {task.priority && (
                  <span className={`tag-badge tag-priority-${task.priority === 'high' ? 'high' : task.priority === 'low' ? 'low' : 'med'}`}>
                    {task.priority.toUpperCase()}
                  </span>
                )}
                {task.category && (
                  <span className="tag-badge tag-category">{task.category}</span>
                )}
                {task.attachments && task.attachments.length > 0 && (
                  <span className="tag-badge tag-category" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                    <Paperclip size={10} /> {task.attachments.length} {task.attachments.length === 1 ? 'file' : 'files'}
                  </span>
                )}
                <span className="tag-badge tag-carry">
                  {task.period === yesterdayPeriodKey
                    ? 'Yesterday'
                    : formatPeriodLabel(task.scope, task.period)}
                </span>
              </div>
            </div>

            <div className="task-actions">
              <button
                className="btn-action btn-move"
                title="Move to Today"
                onClick={() => onRollOver(task.id)}
              >
                <ArrowDownRight size={14} />
              </button>

              <button
                className="btn-action"
                title="Edit description"
                onClick={() => {
                  const newTitle = prompt('Edit task:', task.title);
                  if (newTitle && newTitle.trim()) {
                    onEdit(task.id, newTitle.trim());
                  }
                }}
              >
                <Edit2 size={13} />
              </button>

              <button
                className="btn-action btn-del"
                title="Delete task"
                onClick={() => {
                  if (confirm('Delete this task?')) {
                    onDelete(task.id);
                  }
                }}
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

