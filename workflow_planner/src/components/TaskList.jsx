import React, { useState } from 'react';
import { CalendarX } from 'lucide-react';
import TaskItem from './TaskItem';

export default function TaskList({
  tasks,
  searchQuery,
  onToggle,
  onEdit,
  onDelete,
  onReorder,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
  onUpdateNotes
}) {
  const [draggedId, setDraggedId] = useState(null);

  const handleDragStart = (e, id) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault();
    if (draggedId && targetId && draggedId !== targetId && onReorder) {
      onReorder(draggedId, targetId);
    }
    setDraggedId(null);
  };

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <CalendarX size={24} />
        </div>
        <h3>No tasks found</h3>
        <p>
          {searchQuery
            ? 'Try clearing your search query to see all tasks.'
            : 'Plan your focus items by adding one below.'}
        </p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task, idx) => (
        <TaskItem
          key={task.id}
          task={task}
          index={idx + 1}
          isCarryover={false}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onAddSubtask={onAddSubtask}
          onToggleSubtask={onToggleSubtask}
          onDeleteSubtask={onDeleteSubtask}
          onUpdateNotes={onUpdateNotes}
        />
      ))}
    </div>
  );
}
