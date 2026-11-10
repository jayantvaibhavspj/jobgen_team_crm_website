import React, { useState } from 'react';
import { CheckCircle2, Clock, CheckCheck, Trash2 } from 'lucide-react';
import TaskItem from './TaskItem';
import QuickAdd from './QuickAdd';

export default function TaskBoard({
  todoTasks,
  doneTasks,
  searchQuery,
  onToggle,
  onDirectMoveToDone,
  onDirectMoveToTodo,
  onMarkAllDone,
  onClearCompleted,
  onEdit,
  onDelete,
  onReorder,
  onMoveToSection,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
  onUpdateNotes,
  onAddAttachment,
  onDeleteAttachment,
  isAddOpen,
  setIsAddOpen,
  onAdd
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

  const handleDropOnTask = (e, targetId) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedId && targetId && draggedId !== targetId && onReorder) {
      onReorder(draggedId, targetId);
    }
    setDraggedId(null);
  };

  const handleDropOnSection = (e, targetSection) => {
    e.preventDefault();
    if (draggedId && onMoveToSection) {
      onMoveToSection(draggedId, targetSection);
    }
    setDraggedId(null);
  };

  return (
    <div className="task-board-container">
      {/* SECTION 1: TO-DO */}
      <section
        className="board-section section-todo"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDropOnSection(e, 'todo')}
      >
        <div className="section-header">
          <div className="section-title-wrap">
            <span className="section-dot dot-todo" />
            <h3 className="section-title">To-do</h3>
            <span className="section-count-badge count-todo">{todoTasks.length}</span>
          </div>

          {todoTasks.length > 0 && (
            <button
              className="btn-mark-all"
              onClick={onMarkAllDone}
              title="Mark all to-do tasks as done"
            >
              <CheckCheck size={13} />
              All Done
            </button>
          )}
        </div>

        <div className="section-tasks-wrapper">
          {todoTasks.length === 0 ? (
            <div className="section-empty-state">
              <CheckCircle2 size={24} style={{ color: 'var(--color-success)', margin: '0 auto 6px' }} />
              <p>No pending tasks</p>
              <span>{searchQuery ? 'No match found.' : 'Add your next focus item below.'}</span>
            </div>
          ) : (
            <div className="task-list">
              {todoTasks.map((task, idx) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  index={idx + 1}
                  isCarryover={false}
                  onToggle={onToggle}
                  onDirectMove={onDirectMoveToDone}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDropOnTask}
                  onAddSubtask={onAddSubtask}
                  onToggleSubtask={onToggleSubtask}
                  onDeleteSubtask={onDeleteSubtask}
                  onUpdateNotes={onUpdateNotes}
                  onAddAttachment={onAddAttachment}
                  onDeleteAttachment={onDeleteAttachment}
                />
              ))}
            </div>
          )}
        </div>

        {/* Quick Add at bottom of To-do column */}
        <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
          <QuickAdd
            isOpen={isAddOpen}
            setIsOpen={setIsAddOpen}
            onAdd={onAdd}
          />
        </div>
      </section>

      {/* SECTION 2: DONE */}
      <section
        className="board-section section-done"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDropOnSection(e, 'done')}
      >
        <div className="section-header">
          <div className="section-title-wrap">
            <span className="section-dot dot-done" />
            <h3 className="section-title">Done</h3>
            <span className="section-count-badge count-done">{doneTasks.length}</span>
          </div>

          {doneTasks.length > 0 && (
            <button
              className="btn-glass"
              style={{ fontSize: '11.5px', padding: '3px 8px' }}
              onClick={onClearCompleted}
              title="Clear all completed tasks"
            >
              <Trash2 size={12} />
              Clear
            </button>
          )}
        </div>

        <div className="section-tasks-wrapper">
          {doneTasks.length === 0 ? (
            <div className="section-empty-state">
              <Clock size={24} style={{ color: 'var(--text-disabled)', margin: '0 auto 6px' }} />
              <p>No completed tasks yet</p>
              <span>Tasks you mark as done will appear here.</span>
            </div>
          ) : (
            <div className="task-list">
              {doneTasks.map((task, idx) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  index={idx + 1}
                  isCarryover={false}
                  onToggle={onToggle}
                  onDirectMove={onDirectMoveToTodo}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDropOnTask}
                  onAddSubtask={onAddSubtask}
                  onToggleSubtask={onToggleSubtask}
                  onDeleteSubtask={onDeleteSubtask}
                  onUpdateNotes={onUpdateNotes}
                  onAddAttachment={onAddAttachment}
                  onDeleteAttachment={onDeleteAttachment}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
