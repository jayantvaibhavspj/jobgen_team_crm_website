import React from 'react';
import { AlertCircle } from 'lucide-react';
import TaskItem from './TaskItem';

export default function CarryoverSection({
  overdueTasks,
  onToggle,
  onEdit,
  onDelete,
  onRollOver,
  onRollOverAll
}) {
  if (!overdueTasks || overdueTasks.length === 0) return null;

  return (
    <div className="carry-card">
      <div className="carry-header">
        <div className="carry-title">
          <AlertCircle size={18} />
          <span>Pending From Earlier ({overdueTasks.length})</span>
        </div>
        <button
          className="btn-carry-all"
          onClick={() => onRollOverAll(overdueTasks)}
        >
          Move All to Current
        </button>
      </div>

      <div className="task-list">
        {overdueTasks.map((task, idx) => (
          <TaskItem
            key={task.id}
            task={task}
            index={idx + 1}
            isCarryover={true}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
            onRollOver={onRollOver}
          />
        ))}
      </div>
    </div>
  );
}

