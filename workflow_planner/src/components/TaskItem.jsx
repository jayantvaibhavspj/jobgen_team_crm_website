import React, { useState, useRef } from 'react';
import {
  Check,
  Edit2,
  Trash2,
  ArrowRight,
  GripVertical,
  Clock,
  ChevronRight,
  ChevronDown,
  Plus,
  FileText,
  RotateCcw,
  Paperclip,
  Download,
  Image as ImageIcon,
  File
} from 'lucide-react';
import { formatPeriodLabel } from '../utils/dateUtils';
import { readFileAsDataUrl, formatFileSize, downloadAttachment } from '../utils/fileUtils';

export default function TaskItem({
  task,
  index,
  isCarryover = false,
  onToggle,
  onDirectMove,
  onEdit,
  onDelete,
  onRollOver,
  onDragStart,
  onDragOver,
  onDrop,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
  onUpdateNotes,
  onAddAttachment,
  onDeleteAttachment
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [isExpanded, setIsExpanded] = useState(false);
  const [newSubtaskText, setNewSubtaskText] = useState('');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesText, setNotesText] = useState(task.notes || '');
  const [previewImage, setPreviewImage] = useState(null);
  const attachmentInputRef = useRef(null);

  const subtasks = task.subtasks || [];
  const completedSubtasks = subtasks.filter((st) => st.done).length;
  const attachments = task.attachments || [];

  const handleEditSubmit = () => {
    if (editTitle.trim()) {
      onEdit(task.id, editTitle.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleEditSubmit();
    if (e.key === 'Escape') {
      setEditTitle(task.title);
      setIsEditing(false);
    }
  };

  const handleAddSubtaskSubmit = (e) => {
    if (e) e.preventDefault();
    if (newSubtaskText.trim() && onAddSubtask) {
      onAddSubtask(task.id, newSubtaskText.trim());
      setNewSubtaskText('');
    }
  };

  const handleNotesBlur = () => {
    if (onUpdateNotes) {
      onUpdateNotes(task.id, notesText);
    }
    setIsEditingNotes(false);
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    try {
      for (const file of files) {
        const att = await readFileAsDataUrl(file);
        if (onAddAttachment) {
          onAddAttachment(task.id, att);
        }
      }
    } catch (err) {
      alert(err.message || 'Failed to upload attachment.');
    } finally {
      if (attachmentInputRef.current) attachmentInputRef.current.value = '';
    }
  };

  return (
    <div
      className={`task-row-container ${isExpanded ? 'expanded' : ''}`}
      draggable={!isEditing && !isCarryover}
      onDragStart={(e) => onDragStart && onDragStart(e, task.id)}
      onDragOver={(e) => onDragOver && onDragOver(e)}
      onDrop={(e) => onDrop && onDrop(e, task.id)}
    >
      <div className={`task-row ${task.done ? 'done' : ''}`}>
        {/* Drag handle */}
        {!isCarryover && (
          <span className="task-drag-handle" title="Drag to reorder or move between To-do & Done">
            <GripVertical size={13} />
          </span>
        )}

        {/* Checkbox */}
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

        {/* Index */}
        <span className="task-index">{index}.</span>

        {/* Content */}
        <div className="task-content">
          {isEditing ? (
            <input
              type="text"
              className="edit-inline-input"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleEditSubmit}
              onKeyDown={handleKeyDown}
              autoFocus
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--accent-primary)',
                borderRadius: '4px',
                padding: '4px 8px',
                color: 'var(--text-primary)',
                font: 'inherit'
              }}
            />
          ) : (
            <div
              className="task-title"
              onDoubleClick={() => setIsEditing(true)}
              title="Double click to edit"
            >
              {task.title}
            </div>
          )}

          <div className="task-meta">
            {task.priority && (
              <span
                className={`tag-badge tag-priority-${
                  task.priority === 'high'
                    ? 'high'
                    : task.priority === 'low'
                    ? 'low'
                    : 'med'
                }`}
              >
                {task.priority.toUpperCase()}
              </span>
            )}

            {task.category && (
              <span className="tag-badge tag-category">{task.category}</span>
            )}

            {task.dueTime && (
              <span
                className="tag-badge tag-category"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}
              >
                <Clock size={10} /> {task.dueTime}
              </span>
            )}

            {/* Attachments pill */}
            {attachments.length > 0 && (
              <button
                type="button"
                className="tag-badge tag-category"
                onClick={() => setIsExpanded(true)}
                style={{ cursor: 'pointer', border: '1px solid var(--border-medium)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                title="View attached files"
              >
                <Paperclip size={10} /> {attachments.length} {attachments.length === 1 ? 'file' : 'files'}
              </button>
            )}

            {/* Subtasks counter badge if any exist */}
            {subtasks.length > 0 && (
              <button
                type="button"
                className="tag-badge tag-category"
                onClick={() => setIsExpanded(!isExpanded)}
                style={{ cursor: 'pointer', border: '1px solid var(--border-medium)' }}
                title="Toggle subtasks checklist"
              >
                ✓ {completedSubtasks}/{subtasks.length}
              </button>
            )}

            {/* Note indicator if exists */}
            {task.notes && task.notes.trim() && (
              <button
                type="button"
                className="tag-badge tag-category"
                onClick={() => setIsExpanded(true)}
                style={{ cursor: 'pointer' }}
                title="View note"
              >
                <FileText size={10} /> Note
              </button>
            )}

            {isCarryover && (
              <span className="tag-badge tag-carry">
                From {formatPeriodLabel(task.scope, task.period)}
              </span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="task-actions">
          {/* DIRECT MOVE BUTTON (To-do -> Done or Done -> To-do) */}
          {!isCarryover && (
            <button
              className={`btn-direct-move ${task.done ? 'btn-direct-undo' : 'btn-direct-done'}`}
              title={task.done ? 'Move back to To-do' : 'Direct move to Done'}
              onClick={() => (onDirectMove ? onDirectMove(task.id) : onToggle(task.id))}
            >
              {task.done ? (
                <>
                  <RotateCcw size={11} /> Undo
                </>
              ) : (
                <>
                  <Check size={12} strokeWidth={2.5} /> Done
                </>
              )}
            </button>
          )}

          {/* Expand/Collapse details button */}
          {!isCarryover && (
            <button
              className="btn-action"
              title={isExpanded ? 'Collapse details' : 'Expand details, subtasks & files'}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          )}

          {isCarryover && onRollOver && (
            <button
              className="btn-action btn-move"
              title="Move to Today"
              onClick={() => onRollOver(task.id)}
            >
              <ArrowRight size={14} />
            </button>
          )}

          <button
            className="btn-action"
            title="Edit description"
            onClick={() => setIsEditing(true)}
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

      {/* Collapsible Subtasks, Notes & Attachments Drawer */}
      {isExpanded && !isCarryover && (
        <div className="task-subtasks-drawer">
          {/* Attachments Section */}
          <div className="task-attachments-section">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="subtasks-heading">Attached Files ({attachments.length}):</span>
              <div>
                <input
                  type="file"
                  ref={attachmentInputRef}
                  onChange={handleFileUpload}
                  multiple
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  className="btn-glass"
                  style={{ fontSize: '11px', padding: '2px 7px', gap: '3px' }}
                  onClick={() => attachmentInputRef.current?.click()}
                  title="Upload attachment (images, PDFs, docs up to 2.5MB)"
                >
                  <Paperclip size={11} /> + Attach File
                </button>
              </div>
            </div>

            {attachments.length > 0 && (
              <div className="attachments-list">
                {attachments.map((att) => (
                  <div key={att.id} className="attachment-item-card">
                    {att.type.startsWith('image/') ? (
                      <img
                        src={att.dataUrl}
                        alt={att.name}
                        className="att-thumb"
                        onClick={() => setPreviewImage(att.dataUrl)}
                        title="Click to preview image"
                      />
                    ) : (
                      <div className="att-file-icon">
                        <File size={16} />
                      </div>
                    )}

                    <div className="att-info">
                      <span className="att-name" title={att.name}>
                        {att.name}
                      </span>
                      <span className="att-size">{formatFileSize(att.size)}</span>
                    </div>

                    <div className="att-actions">
                      <button
                        type="button"
                        className="btn-action"
                        onClick={() => downloadAttachment(att)}
                        title="Download file"
                      >
                        <Download size={12} />
                      </button>
                      <button
                        type="button"
                        className="btn-action btn-subtask-del"
                        onClick={() => onDeleteAttachment && onDeleteAttachment(task.id, att.id)}
                        title="Delete file"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Subtasks List */}
          <div className="subtasks-container">
            <span className="subtasks-heading">Checklist:</span>

            {subtasks.map((st) => (
              <div key={st.id} className="subtask-row">
                <label className="custom-checkbox subtask-checkbox">
                  <input
                    type="checkbox"
                    checked={Boolean(st.done)}
                    onChange={() => onToggleSubtask && onToggleSubtask(task.id, st.id)}
                  />
                  <div className="checkbox-mark" style={{ width: '15px', height: '15px' }}>
                    {st.done && <Check size={10} strokeWidth={2.5} stroke="#ffffff" />}
                  </div>
                </label>
                <span className={`subtask-text ${st.done ? 'done' : ''}`}>{st.text}</span>
                <button
                  className="btn-action btn-subtask-del"
                  onClick={() => onDeleteSubtask && onDeleteSubtask(task.id, st.id)}
                  title="Remove subtask"
                >
                  ✕
                </button>
              </div>
            ))}

            {/* Add subtask input */}
            <form onSubmit={handleAddSubtaskSubmit} className="subtask-add-row">
              <input
                type="text"
                placeholder="Add a step and press Enter..."
                value={newSubtaskText}
                onChange={(e) => setNewSubtaskText(e.target.value)}
              />
              <button type="submit" className="btn-glass" style={{ padding: '3px 8px', fontSize: '11px' }}>
                <Plus size={11} /> Add
              </button>
            </form>
          </div>

          {/* Quick Notes Field */}
          <div className="task-notes-container">
            <span className="subtasks-heading">Notes / Links:</span>
            {isEditingNotes ? (
              <textarea
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
                onBlur={handleNotesBlur}
                placeholder="Add context, meeting link, or details..."
                autoFocus
                className="task-notes-textarea"
              />
            ) : (
              <div
                className="task-notes-display"
                onClick={() => setIsEditingNotes(true)}
                title="Click to edit notes"
              >
                {task.notes && task.notes.trim() ? (
                  task.notes
                ) : (
                  <span style={{ color: 'var(--text-disabled)', fontStyle: 'italic' }}>
                    Click to add notes or links...
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="modal-overlay" onClick={() => setPreviewImage(null)}>
          <div className="modal-card" style={{ maxWidth: '600px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
            <img src={previewImage} alt="Attachment Preview" style={{ maxWidth: '100%', maxHeight: '70vh', borderRadius: '8px' }} />
            <div style={{ marginTop: '12px' }}>
              <button className="btn-glass" onClick={() => setPreviewImage(null)}>
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
